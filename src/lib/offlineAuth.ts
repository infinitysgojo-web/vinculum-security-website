/**
 * Offline practitioner access. After a successful online sign-in, a salted
 * PBKDF2 digest of the credential is kept on this device only. With no
 * connection, the same credential unlocks a tab-scoped offline session.
 * The password itself is never stored.
 */
const CRED_KEY = "vs:offline-cred";
const SESSION_KEY = "vs:offline-session";
const ITERATIONS = 210_000;

type StoredCred = { salt: string; digest: string; userId: string; email: string };

const toHex = (b: ArrayBuffer) => Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, "0")).join("");
const fromHex = (h: string) => new Uint8Array(h.match(/.{2}/g)!.map((x) => parseInt(x, 16))) as Uint8Array<ArrayBuffer>;

async function derive(email: string, password: string, salt: Uint8Array<ArrayBuffer>) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${email.trim().toLowerCase()}\u0000${password}`),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITERATIONS }, key, 256);
  return toHex(bits);
}

export async function rememberCredential(email: string, password: string, userId: string) {
  try {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const digest = await derive(email, password, salt);
    const rec: StoredCred = { salt: toHex(salt.buffer), digest, userId, email: email.trim().toLowerCase() };
    localStorage.setItem(CRED_KEY, JSON.stringify(rec));
  } catch {
    // Storage or crypto unavailable: offline access simply stays off.
  }
}

export function hasOfflineCredential() {
  return !!localStorage.getItem(CRED_KEY);
}

/** Returns the user id on a match, otherwise null. */
export async function verifyOffline(email: string, password: string): Promise<string | null> {
  try {
    const raw = localStorage.getItem(CRED_KEY);
    if (!raw) return null;
    const rec = JSON.parse(raw) as StoredCred;
    const digest = await derive(email, password, fromHex(rec.salt));
    if (digest.length !== rec.digest.length) return null;
    let diff = 0;
    for (let i = 0; i < digest.length; i++) diff |= digest.charCodeAt(i) ^ rec.digest.charCodeAt(i);
    if (diff !== 0) return null;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ userId: rec.userId, email: rec.email }));
    return rec.userId;
  } catch {
    return null;
  }
}

export function getOfflineSession(): { userId: string; email: string } | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearOfflineSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export const isNetworkFailure = (msg?: string) =>
  !navigator.onLine || /fetch|network|load failed|timeout/i.test(msg ?? "");

/**
 * Cloud auth gets this long before callers fall back to the offline session, so a
 * hanging socket or an expired token retrying in the background never holds the screen.
 */
export const AUTH_RACE_MS = 1500;

export type AuthRace<T> = { settled: true; value: T } | { settled: false };

/** Races a cloud auth call against AUTH_RACE_MS. A rejection counts as settled with null. */
export async function raceAuth<T>(p: Promise<T>, ms = AUTH_RACE_MS): Promise<AuthRace<T | null>> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      p.then(
        (value): AuthRace<T | null> => ({ settled: true, value }),
        (): AuthRace<T | null> => ({ settled: true, value: null }),
      ),
      new Promise<AuthRace<T | null>>((resolve) => {
        timer = setTimeout(() => resolve({ settled: false }), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

/** A password sign-in gets longer than a session read: it is one real round trip. */
export const SIGN_IN_RACE_MS = 8000;
