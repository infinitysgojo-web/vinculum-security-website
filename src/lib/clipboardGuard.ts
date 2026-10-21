/**
 * Clipboard writes made by this app go through here, so a lock or panic can overwrite
 * a value the app itself placed on the clipboard. Only a marker that the app wrote
 * something is kept in memory, never the copied text. Browsers allow the overwrite only
 * while the page has focus; where they refuse, nothing more can be done from a page.
 */
let wroteByApp = false;

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
  wroteByApp = true;
}

/** Overwrite the clipboard if this app last wrote to it. Resolves whether it was cleared. */
export async function clearAppClipboard(): Promise<boolean> {
  if (!wroteByApp) return false;
  try {
    if (!navigator.clipboard?.writeText || (typeof document !== "undefined" && !document.hasFocus())) return false;
    await navigator.clipboard.writeText("");
    wroteByApp = false;
    return true;
  } catch {
    return false;
  }
}
