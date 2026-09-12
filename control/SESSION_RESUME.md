# KartVantage session resume state

Last updated: 2026-09-12

## Durable control room

- Continue this same Codex task; do not require the owner to restate the project.
- Canonical repository: `D:\Projects\KartVantage\kartvantage-greenfield`
- Canonical progress workbook: https://docs.google.com/spreadsheets/d/1p006TOrCOWBybxH4bbR_37MC44qYM-hQrPQCiuCHgSA/edit
- Legacy repository: read-only evidence; do not copy by default.

## Active package

- Package: C1 — scaffold and engineering baseline.
- State: locally validated, not complete.
- Authorization: C1 only. C2+, production deployment, billing, and destructive Shopify changes are not authorized.

## Verified checkpoint

- Official Shopify React Router template provenance is recorded in `proof/C1/PROVENANCE.md`.
- The brand kit is implemented in the public landing and embedded Admin shell.
- Local checks, security audit, migration, responsive screenshots, and known warnings are recorded in `proof/C1/VALIDATION.md`.
- The authenticated installed-app preview passed in Shopify Admin; evidence is recorded in `proof/C1/SHOPIFY_PREVIEW.md`.
- No business rules, theme extension, webhook behavior, billing, or deployment was added.

## Current boundary requiring the owner

The owner chose the existing non-live KartVantage app identity. The greenfield repository is linked to that app, configuration validation passes, and the authenticated development preview renders correctly in `kartvantage.myshopify.com`. A permanent greenfield hosting destination must be selected before the released app version can replace the legacy Render-hosted build.

## Next safe action

Choose and configure permanent greenfield hosting, repeat the relevant production-like checks, replace the Dev Dashboard URLs, and then request C1 owner acceptance. Do not release an app version or start C2 without the applicable authorization.
