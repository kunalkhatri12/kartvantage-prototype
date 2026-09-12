# C1 validation evidence

Executed: 2026-09-12

## Passed local gates

- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: four of four boundary tests passed.
- `npm run build`: passed; Vite transformed 311 client modules and 15 server modules.
- `npm audit --json`: zero known vulnerabilities at all severities across 595 dependencies.
- `npm exec prisma generate`: generated Prisma Client 6.19.3.
- `npm exec prisma migrate deploy`: applied only `20240530213853_create_session_table` to the local SQLite database.
- `git diff --check`: passed.
- Focused credential/private-key pattern scan: no match.

The build reports only React Router v8 future-flag notices and an empty authentication chunk. These are non-failing upgrade notices, not C1 correctness failures.

## Visual QA

- Desktop capture: `ui-desktop.png`, 1440×1200, SHA-256 `11F42C4E58F60FD95F1944193626AC298E531F144BA7949E9DB682C5FE106EF1`.
- Mobile capture: `ui-mobile.png`, true emulated 390×844 viewport, SHA-256 `B7C00344B4D1DB9A695751577329817B96A6621F7FD6C89C4A4B85D86BCA7BA8`.
- Capture procedure: `node proof/C1/capture-ui-proof.mjs` while the local React Router preview is available at port 3001.

The first narrow capture exposed horizontal overflow caused by intrinsic content width. The panel, typography, form, and compact breakpoints were corrected; the evidence files are the post-fix captures.

## Open Shopify gate

`shopify app config validate --json` stopped before validation because the intentionally blank `client_id` requires `shopify app config link --client-id ...` in a non-interactive terminal or an interactive `shopify app config link` selection.

No Dev Dashboard app, development store, or production resource has been changed. C1 must remain in progress until the owner chooses the correct greenfield app linkage, configuration validation passes, and store/app verification links are captured.
