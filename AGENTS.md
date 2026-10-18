# Project Architecture

- PDF exports reserve body space for bounded running headers and footers; statutory notices belong in full-width notice blocks, not compact mastheads. Why: long legal text must never collide with branding or page numbering.

- Keep scholarly working tools embedded in their relevant existing page, with browser-local state only, to preserve a focused reading architecture without new routes or data storage.
- Dashboard desks share readings only through the MissionEngine signal bus (src/components/desk/engine.ts: usePublish/useEngine, SyncPanel override); why: one deterministic, browser-local chain from assessment to handover.
- Enforce framing restrictions through response-header CSP with self and trusted Lovable ancestors, never parent-navigation scripts or hide-on-error fallbacks; why: sandboxed editor previews must render while unrelated framing remains blocked.
- The Chancellery Sentinel (src/components/desk/ChancellerySentinel.tsx) owns the dashboard's only inactivity timer, the panic keys and the DOM canary, and never navigates; Dashboard.tsx decides what idle and panic do. Why: two idle timers race, and only Dashboard.tsx and Login.tsx may reference /dashboard or /login.
- Free text is sanitized on paste and on blur (src/lib/sanitizeFields.ts), never per keystroke, with NFC rather than NFKC; verifiers report hidden characters but hash the record as received. Why: typing and caret must not break, legal text must not change meaning, and a verifier must not mask tampering.
