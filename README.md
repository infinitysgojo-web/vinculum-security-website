# Vinculum Security

A doctrine of relational security, and the working tools built on it.

Vinculum Security holds that security is the presence and integrity of the relational bonds that make protection, dignity and peace possible. This repository is the doctrine's canonical home: a public reading site, a browser-local operations dashboard, and the Chancellery Academy, a course in the mathematics and practice behind it.

Official site: https://www.vinculumsecurity.kidnexus.or.ke
That is the only official domain. A copy served anywhere else is unauthorised.

---

## What's inside

Public site
• Doctrine and Foundations: the canonical definition, the four bonds and the Vinculum Continuum
• Cases: the doctrine tested against Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya, South Africa and Tuvalu–Kiribati
• Methodology and Practice: how bonds are scored, read and acted on
• Glossary and Commentary: canonical terms with source sections
• Dispatches: essays and field notes

Dashboard (signed-in)
• 18 desks across divisions, sharing one deterministic signal chain (the MissionEngine bus)
• Two mandates: Preset Proving Ground and Custom Operational Mission
• Core readings: the four-bond radar, Rupture Index, decay horizon, asymmetry, escrow waterfall, forum fitness and the Dominum Index, each with a formula proof
• Handover seal: SHA-256 over canonical JSON
• The Chancellery Sentinel: idle lock, panic keys and clipboard clearing

Chancellery Academy
• Five modules and 20 chapters, each with a full lecture, live instruments and a knowledge check
• A six-gate capstone that ends in a sealed, verifiable record

---

## Principles

• Browser-local by design. Mission data never leaves the device. No server, database, analytics or telemetry for mission data.
• One source of truth. Every number comes from the desks' own engine functions (src/components/desk/engine.ts). Views never re-implement a formula.
• Evidence over appearance. Hidden-character text is rejected, imports are validated and quarantined rather than erased, and integrity is checked by digest.

The full threat model is in SECURITY.md. Architecture rules are in AGENTS.md, and planned work is in roadmap.md.

---

## Tech stack

• React 18, TypeScript, Vite
• Tailwind CSS with shadcn/ui and Radix
• React Router, TanStack Query, Recharts, Framer Motion
• @react-pdf/renderer for dossiers, wall charts and exports
• Web Crypto (SubtleCrypto) for seals; AES-256-GCM with PBKDF2 for encrypted exports
• Supabase for sign-in and the Dispatches feed only
• Hosted on Vercel, with security headers and CSP in vercel.json

---

## Getting started

You need Bun (recommended) or Node.js 20+.

git clone https://github.com/JamesKuwa/vinculum-security-website.git
cd vinculum-security-website
bun install
bun run dev

The dev server starts at http://localhost:8080 (or the port Vite prints).

---

## Scripts

• bun run dev: start the dev server
• bun run build: production build
• bun run preview: serve the build locally
• bun run lint: ESLint
• bun test: run the test suite in qa/ and src/

Type checks (the root tsconfig checks nothing on its own):

bun x --package @typescript/native-preview tsgo -p tsconfig.app.json
bun x --package @typescript/native-preview tsgo -p tsconfig.node.json

---

## Project layout

src/
  pages/              public pages and the dashboard
  components/
    desk/             the 18 desks, the engine, proofs and the Sentinel
    mode/             mission modes, workspace store and the Chancellery Academy
    pdf/              PDF documents
    ui/               shared UI components
  content/            doctrine, cases, glossary, commentary
  lib/                crypto, enclave, sanitising, offline auth, SEO
qa/                   regression and invariant tests
supabase/functions/   the Dispatches feed function
public/               static assets and .well-known/security.txt

---

## Contributing

• Branch from the latest main and open pull requests as drafts.
• Before a PR: both tsgo checks at 0 errors, bun test, bun run build, bun run lint and git diff --check, plus a browser check on desktop and mobile.
• Use semantic Tailwind tokens only: no raw hex or rgba values, and no emojis.
• Never change a formula, threshold or weight in engine.ts as part of a UI change.
• Public pages never link to the dashboard or sign-in routes.

---

## Security

Report vulnerabilities through the contact in /.well-known/security.txt, or email vinculumsecurity@gmail.com.

---

## Copyright

The Vinculum Security doctrine, its texts, terms and methods are the original work of James Wesley Ndua. All rights reserved. No part may be reproduced or redistributed without written permission.
