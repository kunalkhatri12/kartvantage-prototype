# C1 provenance

Recorded: 2026-09-12

## Shopify scaffold

- Source: https://github.com/Shopify/shopify-app-template-react-router
- Exact source commit: `e548c959eb00460f7141d42bd694cd50769c5e3e`
- Commit timestamp: `2026-09-08T13:20:44-04:00`
- Commit subject: `Merge pull request #280 from Shopify/fix/pin-react-router-7.18.2-and-qs-cve`
- Local Shopify CLI used for verification: `4.7.1`
- Selected Admin API/webhook version: `2026-07`
- Lockfile SHA-256: `3882B7BA807CF7095ED63E045808A879525EEC12192C52A9674F88D4A632831E`

The scaffold was imported from the official template, then reduced to the C1 boundary: sample product mutations, sample additional page, webhook subscriptions/routes, GraphQL codegen tooling, and all Shopify data scopes were removed. No legacy application code or configuration was imported.

## Owner-supplied brand assets

- Transparent logo SHA-256: `6479D4DCD73791EB61B4A8C103D566B302D61EAB51253F44513F923C5C583B53`
- Solid logo SHA-256: `F96C277D50B3BBCB7FF3BBF1242002193505828A0CA799C52E0D004596A524E3`
- Brand tokens sampled and locked in `control/BRAND_SYSTEM.md`: navy `#061529`, lime `#95BF47`, mint `#E7F4EA`, ink `#0F172A`.

Production copies live under `public/brand/`; UI reference images live under `docs/brand-reference/`.
