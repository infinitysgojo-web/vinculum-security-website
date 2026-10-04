/** SHA-256 hex digest computed locally with the browser's Web Crypto. Nothing leaves the device. */
export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** The integrity footer appended to every exported chancellery text. */
export const integrityFooter = (hash: string, stamp: string) =>
  `\n\nINTEGRITY STAMP\n  SHA-256 of the text above: ${hash}\n  Computed locally: ${stamp}\n  Re-hash the text above this block to confirm it is unaltered.`;

/** Short form for on-screen display. */
export const shortHash = (h: string) => (h ? `${h.slice(0, 12)}…${h.slice(-8)}` : "computing…");
