/**
 * Sovereign Enclave cryptography. Native Web Crypto only (window.crypto.subtle):
 * no libraries, no network. Mission data is sealed with AES-256-GCM under a key
 * derived from the operator's passphrase by PBKDF2-SHA-256. New seals use
 * 310,000 iterations; records sealed before that (100,000 iterations) carry their
 * KDF label and still open, and are re-sealed at the current count on unseal.
 *
 * Key lifecycle: the passphrase is imported once as non-extractable PBKDF2 key
 * material and held only in this module's memory. It is never written to storage,
 * and it is gone the moment the tab closes, reloads or the enclave is sealed.
 * Every record gets its own random 16-byte salt and random 12-byte IV, so the
 * AES key and nonce differ for each write.
 */

/** Iterations for every new seal (OWASP 2023 guidance for PBKDF2-HMAC-SHA-256). */
export const PBKDF2_ITERATIONS = 310_000;
/** Iterations of records and markers sealed before the 310,000 upgrade. */
export const LEGACY_PBKDF2_ITERATIONS = 100_000;
export const KDF_CURRENT = "PBKDF2-SHA-256-310000" as const;
export const KDF_LEGACY = "PBKDF2-SHA-256-100000" as const;
export type KdfLabel = typeof KDF_CURRENT | typeof KDF_LEGACY;
/** AES-GCM authentication tag length in bytes (128 bits). */
export const TAG_BYTES = 16;
export const SALT_BYTES = 16;
export const IV_BYTES = 12;
export const TAG_MISMATCH = "Authentication tag mismatch. Invalid passphrase or corrupted enclave payload.";

const subtle = () => {
  const s = globalThis.crypto?.subtle;
  if (!s) throw new Error("Web Crypto is unavailable in this browser context.");
  return s;
};

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function hexToBytes(hex: string): Uint8Array<ArrayBuffer> {
  if (!/^(?:[0-9a-f]{2})*$/i.test(hex)) throw new Error("Malformed hex payload.");
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

/**
 * SHA-256 of a UTF-8 string through the browser's native SubtleCrypto, as lowercase hex.
 * Used by the Tamper-Evident Handover Seal and the evidentiary export manifest.
 */
export async function sha256HexText(text: string): Promise<string> {
  const buf = await subtle().digest("SHA-256", new TextEncoder().encode(text));
  return bytesToHex(new Uint8Array(buf));
}

export function randomBytes(n: number): Uint8Array<ArrayBuffer> {
  return globalThis.crypto.getRandomValues(new Uint8Array(n));
}

/**
 * Import a passphrase as non-extractable PBKDF2 base material (the in-memory
 * "enclave key"). The encoded passphrase bytes are zeroized once imported.
 */
export async function importPassphrase(passphrase: string): Promise<CryptoKey> {
  const raw = new TextEncoder().encode(passphrase);
  try {
    return await subtle().importKey("raw", raw, "PBKDF2", false, ["deriveKey"]);
  } finally {
    zeroizeBuffer(raw);
  }
}

/**
 * The iteration count a sealed record names. A record without a label predates
 * the label and was sealed at 100,000. An unknown label is refused rather than
 * guessed, so a hand-edited record cannot ask for a weak count.
 */
export function iterationsFor(kdf: unknown): number {
  if (kdf === undefined || kdf === KDF_LEGACY) return LEGACY_PBKDF2_ITERATIONS;
  if (kdf === KDF_CURRENT) return PBKDF2_ITERATIONS;
  throw new Error(TAG_MISMATCH);
}

async function deriveFromMaterial(material: CryptoKey, salt: Uint8Array, iterations: number = PBKDF2_ITERATIONS): Promise<CryptoKey> {
  return subtle().deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** PBKDF2-SHA-256 (310,000 iterations unless given) to a non-extractable AES-GCM 256-bit key. */
export async function deriveEnclaveKey(passphrase: string, salt: Uint8Array, iterations: number = PBKDF2_ITERATIONS): Promise<CryptoKey> {
  return deriveFromMaterial(await importPassphrase(passphrase), salt, iterations);
}

/* ------------------------------------------------------------------ */
/* Constant-time comparison and zeroization                            */
/* ------------------------------------------------------------------ */

/**
 * Constant-time byte comparison: the loop runs over every byte whatever the
 * first difference, so the time taken does not reveal where two digests part.
 * Lengths are not secret here (digests have fixed lengths).
 */
export function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

/** timingSafeEqual over two strings (hex digests, seals, markers), compared as UTF-8 bytes. */
export function timingSafeEqualText(a: string, b: string): boolean {
  const enc = new TextEncoder();
  return timingSafeEqual(enc.encode(a), enc.encode(b));
}

/**
 * Overwrite a buffer in place: random bytes, then zeros. JavaScript gives no
 * guarantee that no other copy exists, so this narrows the window in which a
 * passphrase or plaintext sits in memory; it is not a proof of erasure.
 */
export function zeroizeBuffer(buf: Uint8Array | ArrayBuffer): void {
  const view = (buf instanceof Uint8Array ? buf : new Uint8Array(buf)) as Uint8Array<ArrayBuffer>;
  // getRandomValues accepts at most 65,536 bytes per call.
  for (let i = 0; i < view.length; i += 65_536) globalThis.crypto.getRandomValues(view.subarray(i, Math.min(view.length, i + 65_536)));
  view.fill(0);
}

/* ------------------------------------------------------------------ */
/* Portable passphrase envelope (vinculum-cipher-v1)                   */
/* ------------------------------------------------------------------ */

/**
 * A self-contained sealed value: everything needed to open it except the
 * passphrase. The 128-bit GCM tag is carried separately from the ciphertext.
 * `kdf` names the iteration count; an envelope without it is read at 310,000,
 * the count the format was introduced with.
 */
export interface EncryptedPayload {
  format: "vinculum-cipher-v1";
  kdf?: KdfLabel;
  saltHex: string;
  ivHex: string;
  ciphertextHex: string;
  tagHex: string;
  savedAt: string;
}

/** Seal any JSON-serialisable value under a passphrase: AES-256-GCM, PBKDF2 310,000, fresh salt and IV. */
export async function sealEnvelope(data: unknown, passphrase: string): Promise<EncryptedPayload> {
  const plaintext = new TextEncoder().encode(JSON.stringify(data));
  const salt = randomBytes(SALT_BYTES);
  const iv = randomBytes(IV_BYTES);
  let sealed: Uint8Array | null = null;
  try {
    const key = await deriveEnclaveKey(passphrase, salt, PBKDF2_ITERATIONS);
    sealed = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv, tagLength: TAG_BYTES * 8 }, key, plaintext));
    // Web Crypto appends the 16-byte tag to the ciphertext; carry it on its own.
    return {
      format: "vinculum-cipher-v1",
      kdf: KDF_CURRENT,
      saltHex: bytesToHex(salt),
      ivHex: bytesToHex(iv),
      ciphertextHex: bytesToHex(sealed.subarray(0, sealed.length - TAG_BYTES)),
      tagHex: bytesToHex(sealed.subarray(sealed.length - TAG_BYTES)),
      savedAt: new Date().toISOString(),
    };
  } finally {
    // Plaintext, the working ciphertext buffer, salt and IV are overwritten once encoded.
    zeroizeBuffer(plaintext);
    if (sealed) zeroizeBuffer(sealed);
    zeroizeBuffer(salt);
    zeroizeBuffer(iv);
  }
}

/** Open a vinculum-cipher-v1 envelope. A wrong passphrase or any altered byte raises TAG_MISMATCH. */
export async function openEnvelope<T>(payload: EncryptedPayload, passphrase: string): Promise<T> {
  if (!payload || payload.format !== "vinculum-cipher-v1") throw new Error("Unsupported cipher format.");
  let combined: Uint8Array<ArrayBuffer> | null = null;
  let plain: Uint8Array | null = null;
  let iv: Uint8Array<ArrayBuffer> | null = null;
  let salt: Uint8Array<ArrayBuffer> | null = null;
  try {
    let key: CryptoKey;
    try {
      const ciphertext = hexToBytes(payload.ciphertextHex);
      const tag = hexToBytes(payload.tagHex);
      iv = hexToBytes(payload.ivHex);
      if (tag.length !== TAG_BYTES || iv.length !== IV_BYTES) throw new Error(TAG_MISMATCH);
      combined = new Uint8Array(ciphertext.length + tag.length);
      combined.set(ciphertext);
      combined.set(tag, ciphertext.length);
      zeroizeBuffer(ciphertext);
      zeroizeBuffer(tag);
      salt = hexToBytes(payload.saltHex);
      key = await deriveEnclaveKey(passphrase, salt, payload.kdf === undefined ? PBKDF2_ITERATIONS : iterationsFor(payload.kdf));
    } catch {
      throw new Error(TAG_MISMATCH);
    }
    try {
      plain = new Uint8Array(await subtle().decrypt({ name: "AES-GCM", iv, tagLength: TAG_BYTES * 8 }, key, combined));
    } catch {
      throw new Error(TAG_MISMATCH);
    }
    return JSON.parse(new TextDecoder().decode(plain)) as T;
  } finally {
    // Plaintext and the joined ciphertext+tag are overwritten whatever the outcome.
    if (plain) zeroizeBuffer(plain);
    if (combined) zeroizeBuffer(combined);
    if (iv) zeroizeBuffer(iv);
    if (salt) zeroizeBuffer(salt);
  }
}

/** AES-GCM with a fresh random 12-byte IV. Returns hex-encoded ciphertext (tag appended) and IV. */
export async function encryptEnclavePayload(plaintext: string, key: CryptoKey): Promise<{ ciphertextHex: string; ivHex: string }> {
  const iv = randomBytes(IV_BYTES);
  const bytes = new TextEncoder().encode(plaintext);
  let ct: ArrayBuffer | null = null;
  try {
    ct = await subtle().encrypt({ name: "AES-GCM", iv }, key, bytes);
    return { ciphertextHex: bytesToHex(new Uint8Array(ct)), ivHex: bytesToHex(iv) };
  } finally {
    // The encoded plaintext is wiped as soon as the cipher has consumed it; the working
    // ciphertext buffer and the IV once they are hex-encoded.
    zeroizeBuffer(bytes);
    if (ct) zeroizeBuffer(ct);
    zeroizeBuffer(iv);
  }
}

/** AES-GCM decrypt. Any authentication failure (wrong key or altered bytes) raises TAG_MISMATCH. */
export async function decryptEnclavePayload(ciphertextHex: string, ivHex: string, key: CryptoKey): Promise<string> {
  let pt: ArrayBuffer;
  let iv: Uint8Array<ArrayBuffer> | null = null;
  let ct: Uint8Array<ArrayBuffer> | null = null;
  try {
    iv = hexToBytes(ivHex);
    ct = hexToBytes(ciphertextHex);
    pt = await subtle().decrypt({ name: "AES-GCM", iv }, key, ct);
  } catch {
    throw new Error(TAG_MISMATCH);
  } finally {
    // The decoded IV and ciphertext copies are overwritten whatever the outcome.
    if (iv) zeroizeBuffer(iv);
    if (ct) zeroizeBuffer(ct);
  }
  try {
    return new TextDecoder().decode(pt);
  } finally {
    // The decrypted bytes are overwritten once decoded; only the returned string remains.
    zeroizeBuffer(pt);
  }
}

/**
 * Tamper-evident session chain. Node_i = SHA-256(Node_{i-1} + at + kind + detail),
 * with Node_0 the empty string, exactly as the specification writes it. An empty
 * ledger returns SHA-256 of the empty string. Always 64 lower-case hex characters.
 */
export async function calculateMerkleRoot(events: ReadonlyArray<{ at: string; kind: string; detail: string }>): Promise<string> {
  const enc = new TextEncoder();
  let node = "";
  if (events.length === 0) return bytesToHex(new Uint8Array(await subtle().digest("SHA-256", enc.encode(""))));
  for (const e of events) {
    node = bytesToHex(new Uint8Array(await subtle().digest("SHA-256", enc.encode(`${node}${e.at}${e.kind}${e.detail}`))));
  }
  return node;
}

/** UTF-8 safe base64, used to carry the canonical state inside an apostille. */
export function toBase64Utf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

export function fromBase64Utf8(b64: string): string {
  const bin = atob(b64.replace(/\s+/g, ""));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
}

/* ------------------------------------------------------------------ */
/* In-memory key holder and per-record sealing                         */
/* ------------------------------------------------------------------ */

/** A sealed record as it rests in IndexedDB: ciphertext, IV and salt only. */
export type SealedPayload = { alg: "AES-256-GCM"; kdf: KdfLabel; saltHex: string; ivHex: string; ciphertextHex: string };

let material: CryptoKey | null = null;
const keyListeners = new Set<() => void>();

/** Hold (or drop, with null) the passphrase material in memory. Never persisted. */
export function setEnclaveMaterial(next: CryptoKey | null) {
  material = next;
  keyListeners.forEach((fn) => fn());
}

export function hasEnclaveKey(): boolean {
  return material !== null;
}

export function onEnclaveKeyChange(fn: () => void): () => void {
  keyListeners.add(fn);
  return () => {
    keyListeners.delete(fn);
  };
}

/** Seal text under the in-memory passphrase with a fresh salt and IV. */
export async function sealWith(plaintext: string, mat: CryptoKey | null = material): Promise<SealedPayload> {
  if (!mat) throw new Error("The enclave is sealed. Enter the passphrase first.");
  const salt = randomBytes(SALT_BYTES);
  const key = await deriveFromMaterial(mat, salt);
  const { ciphertextHex, ivHex } = await encryptEnclavePayload(plaintext, key);
  return { alg: "AES-256-GCM", kdf: KDF_CURRENT, saltHex: bytesToHex(salt), ivHex, ciphertextHex };
}

/** True when a record was sealed at the legacy 100,000 iterations (or carries no label). */
export const isLegacySeal = (rec: { kdf?: unknown }): boolean => rec.kdf !== KDF_CURRENT;

/**
 * Open a sealed record with the in-memory passphrase (or the material given).
 * The record's own `kdf` label picks the iteration count, so records sealed at
 * 100,000 before the upgrade still open.
 */
export async function openWith(rec: Pick<SealedPayload, "saltHex" | "ivHex" | "ciphertextHex"> & { kdf?: unknown }, mat: CryptoKey | null = material): Promise<string> {
  if (!mat) throw new Error("The enclave is sealed. Enter the passphrase first.");
  let key: CryptoKey;
  try {
    key = await deriveFromMaterial(mat, hexToBytes(rec.saltHex), iterationsFor(rec.kdf));
  } catch {
    throw new Error(TAG_MISMATCH);
  }
  return decryptEnclavePayload(rec.ciphertextHex, rec.ivHex, key);
}

export const isSealedPayload = (v: unknown): v is SealedPayload =>
  !!v &&
  typeof v === "object" &&
  typeof (v as SealedPayload).saltHex === "string" &&
  typeof (v as SealedPayload).ivHex === "string" &&
  typeof (v as SealedPayload).ciphertextHex === "string";
