# Security model: browser-local two-mode dashboard

Vinculum's dashboard is a browser-local, offline-first application. Mission data lives in the browser on the device it was created on. There is no application server, database, remote storage, analytics, telemetry or third-party API for mission data. GitHub delivers code only and is never a mission-data store. Report vulnerabilities through `/.well-known/security.txt`.

## What it protects against

| Threat | Control |
| --- | --- |
| Accidental loss | Transactional local saves: the full collection is written to a pending key, read back and validated, then promoted. The previous copy is kept as last known-good. A truncated or altered current copy falls back to last known-good, and the bad text is quarantined. A refused write (storage full) leaves the saved copy untouched. Exports provide off-device backups. |
| Malformed or hostile import files | Imports are parsed as data only, never executed, fetched, rendered or followed. Limits apply to file size (20 MB), nesting depth (32), list length (10,000), text length (200,000), fields per object (400), total values and reserved keys (`__proto__`, `constructor`, `prototype`). Future package or workspace versions, and unknown `critical` envelope fields, are refused. Each workspace is schema-validated, and failures are quarantined with a reason. |
| Tampering with saved or exported files | The SHA-256 digest of a documented canonical form (`canonicalJson({ purpose, workspaceSchema, workspaces })`, keys sorted) is recomputed on import and shown as an integrity comparison. Sealed snapshots are rechecked against their recorded digest. This detects change; it does not prove who made a file. |
| Duplicate or overwriting imports | Duplicates are detected by id and by content. The choices are open existing, import as a separate copy (with import lineage) or skip. No import overwrites a local workspace. |
| Hidden-character and Trojan Source text | On paste, text with bidirectional controls, zero-width marks, BOM or control bytes is rejected, and nothing is inserted. Joiners that are spelling in joining scripts are allowed. Fields are NFC-normalised on blur. Imported and restored records with prohibited characters are quarantined rather than rewritten, and the user may restore a cleaned copy explicitly. |
| Invalid cross-desk signals | Every MissionEngine publication passes `guardSignalPatch`: unknown publishers are refused, and non-finite numbers, wrong types and unknown keys are dropped. Bond scores are clamped to 1.0 to 5.0. Restored workspace signals pass the same validation. |
| Rendering attacks | Mission and imported text renders as plain text through React. Dashboard, desk and mode code never renders raw HTML. |
| Clickjacking | Response-header CSP: `frame-ancestors` lists only `self` and Lovable origins, with `object-src 'none'`, `base-uri 'self'` and `form-action 'self'`. There are no parent-navigation scripts. |
| Casual unauthorised access at an unattended device | The Chancellery Sentinel is the single inactivity timer, panic-key owner and DOM canary. On lock the desks unmount and the lock screen replaces them. App-copied clipboard content is overwritten on lock, idle and panic where the browser allows. Re-entry uses the existing enclave or sign-in. |
| Unsafe sharing of exports | Exports state that they are plain JSON unless encrypted. Optional passphrase encryption uses the app's existing AES-256-GCM envelope with PBKDF2-SHA-256 at 310,000 iterations and non-extractable `CryptoKey`s. The passphrase is never stored, sent or logged, and cannot be recovered. File names carry no theatre or mission title by default. |
| Storage exhaustion | The dialog shows storage use and warns at 80%. Replay history keeps the most recent 1,000 events per workspace. Active work is never evicted automatically. |

## What it cannot protect against

A browser-only application cannot defend against:

- a compromised device or operating system;
- a malicious browser extension;
- a compromised local account;
- screenshots or screen recording;
- keyloggers;
- anyone who receives an exported file. A plain export is readable by its holder, and an encrypted export is only as strong as its passphrase.

Clearing browser storage, panic purge included, removes the app's records from the browser. It is not guaranteed physical deletion from the disk. Nothing here is military-grade security, remote verification, legal certification or non-repudiation.

## Data locations

- Workspaces live in `localStorage` under `vinculum-workspaces:<account>`, with `:pending` and `:last-good` beside it. With the Sovereign Enclave configured they are sealed into IndexedDB instead, and no plaintext copy is kept.
- Passphrases, decrypted secrets and key material are never written to `localStorage`, `sessionStorage`, URLs, logs or exports.
- Backups are the user's responsibility: export a package to keep a copy off this device.
