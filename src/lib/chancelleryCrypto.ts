/**
 * Sovereign Enclave cryptography. Native Web Crypto only (window.crypto.subtle):
 * no libraries, no network. Mission data is sealed with AES-256-GCM under a key
 * derived from the operator's passphrase by PBKDF2-SHA-256 (100,000 iterations).
 *
 * Key lifecycle: the passphrase is imported once as non-extractable PBKDF2 key
 * material and held only in this module's memory. It is never written to storage,
 * and it is gone the moment the tab closes, reloads or the enclave is sealed.
 * Every record gets its own random 16-byte salt and random 12-byte IV, so the
 * AES key and nonce differ for each write.
 */

export const PBKDF2_ITERATIONS = 100_000;
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

export function randomBytes(n: number): Uint8Array<ArrayBuffer> {
  return globalThis.crypto.getRandomValues(new Uint8Array(n));
}

/** Import a passphrase as non-extractable PBKDF2 base material (the in-memory "enclave key"). */
export async function importPassphrase(passphrase: string): Promise<CryptoKey> {
  return subtle().importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
}

async function deriveFromMaterial(material: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
  return subtle().deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** PBKDF2 (SHA-256, 100,000 iterations) to a non-extractable AES-GCM 256-bit key. */
export async function deriveEnclaveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  return deriveFromMaterial(await importPassphrase(passphrase), salt);
}

/** AES-GCM with a fresh random 12-byte IV. Returns hex-encoded ciphertext (tag appended) and IV. */
export async function encryptEnclavePayload(plaintext: string, key: CryptoKey): Promise<{ ciphertextHex: string; ivHex: string }> {
  const iv = randomBytes(IV_BYTES);
  const ct = await subtle().encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));
  return { ciphertextHex: bytesToHex(new Uint8Array(ct)), ivHex: bytesToHex(iv) };
}

/** AES-GCM decrypt. Any authentication failure (wrong key or altered bytes) raises TAG_MISMATCH. */
export async function decryptEnclavePayload(ciphertextHex: string, ivHex: string, key: CryptoKey): Promise<string> {
  try {
    const pt = await subtle().decrypt({ name: "AES-GCM", iv: hexToBytes(ivHex) }, key, hexToBytes(ciphertextHex));
    return new TextDecoder().decode(pt);
  } catch {
    throw new Error(TAG_MISMATCH);
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
export type SealedPayload = { alg: "AES-256-GCM"; kdf: "PBKDF2-SHA-256-100000"; saltHex: string; ivHex: string; ciphertextHex: string };

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
  return { alg: "AES-256-GCM", kdf: "PBKDF2-SHA-256-100000", saltHex: bytesToHex(salt), ivHex, ciphertextHex };
}

/** Open a sealed record with the in-memory passphrase (or the material given). */
export async function openWith(rec: Pick<SealedPayload, "saltHex" | "ivHex" | "ciphertextHex">, mat: CryptoKey | null = material): Promise<string> {
  if (!mat) throw new Error("The enclave is sealed. Enter the passphrase first.");
  let key: CryptoKey;
  try {
    key = await deriveFromMaterial(mat, hexToBytes(rec.saltHex));
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
