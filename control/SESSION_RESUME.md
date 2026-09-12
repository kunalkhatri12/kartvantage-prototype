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
- No business rules, theme extension, webhook behavior, billing, or deployment was added.

## Current boundary requiring the owner

The greenfield configuration has no `client_id`. Shopify configuration validation and store/app verification cannot proceed until the owner chooses whether this repository should link to the existing KartVantage Dev Dashboard app or to a newly created app. Do not infer or reuse a legacy client ID.

## Next safe action

After the owner identifies existing versus new Dev Dashboard app, link interactively or with the exact client ID, validate configuration, run a development preview against the intended KartVantage development store, capture links/evidence, and then request C1 owner acceptance. Do not start C2 automatically.
