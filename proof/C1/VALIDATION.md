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

## Shopify linkage and open gate

- The owner selected the existing, non-live KartVantage app identity used only by test stores.
- `shopify app config link` linked the greenfield repository to `Kartvantage` in `eWebster Infotech`.
- The linked development store is `kartvantage.myshopify.com`; Shopify reports the app is installed.
- The replacement C1 configuration requests zero merchant-data scopes, contains no webhook subscriptions, targets API version `2026-07`, and passes `shopify app config validate --json` with zero issues.
- `shopify app dev --store kartvantage.myshopify.com` reached `Ready, watching for changes` and supplied this Admin preview URL: `https://admin.shopify.com/store/kartvantage/apps/5ca440f2f13e539ffbd1418df67dc373?dev-console=show`.

Authenticated Shopify Admin verification subsequently passed. The installed app rendered the branded greenfield C1 shell through the Shopify CLI development tunnel, the server authenticated the development store, and browser inspection found no application errors. Detailed evidence is in `SHOPIFY_PREVIEW.md`.

No app version has been released. The active app home still points to the old Render URL, so a permanent greenfield hosting destination must be established before replacing the released Dev Dashboard version.
