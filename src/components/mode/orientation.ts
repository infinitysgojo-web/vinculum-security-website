/** Non-sensitive invitation preference only; no mission or tour content is stored. */
export const ORIENTATION_KEY = "vs:desk-orientation:v1";
type PreferenceStorage = Pick<Storage, "getItem" | "setItem">;
export function orientationInvited(storage: PreferenceStorage): boolean {
  try { return storage.getItem(ORIENTATION_KEY) === "dismissed"; } catch { return false; }
}
export function dismissOrientation(storage: PreferenceStorage): void {
  try { storage.setItem(ORIENTATION_KEY, "dismissed"); } catch { /* Still available without storage. */ }
}