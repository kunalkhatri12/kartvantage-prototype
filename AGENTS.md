# KartVantage greenfield agent instructions

This directory is the only writable repository for the new KartVantage production rebuild. The previous `kart-vantage` repository is read-only legacy evidence.

## Authority

Read `control/AUTHORITY.md` and the active task before doing any work. Explicit owner instructions, locked dated authority, current official Shopify mechanics, and actual greenfield repository evidence apply in that order. Stop with `DECISION REQUIRED` on a material conflict.

The canonical human-readable progress workbook is registered in `control/PROGRESS_DASHBOARD.md`. Only Codex-audited outcomes may be promoted to it.

## Package boundary

- Work on one explicitly authorized package only.
- Passing checks does not authorize the next package.
- Do not widen scope, add speculative infrastructure, or copy legacy code by default.
- Do not deploy, push, merge, install dependencies, run migrations, change Shopify resources, enable billing, or access production without explicit authorization.

## Secrets and privacy

Never read, print, copy, commit, or send `.env` values, tokens, credentials, recovery codes, private keys, OAuth secrets, customer data, or production identifiers to a model. Environment variable names and placeholder examples are allowed only when the task needs them.

## Shopify

For every Shopify-dependent package, verify current official Shopify documentation, select and record the supported stable API version for that package, generate/validate against its schema, and stop on platform drift. Product authorities define intended behavior; Shopify sources define platform mechanics.

## Completion return

Return: verdict, objective, authority checked, evidence, files changed, checks and exact results, Shopify verification, merchant-language impact, security/privacy/tenant impact, rollback, risks, decisions required, and the package stop statement.
