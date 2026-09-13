# UXP0 task — Shopify scope and merchant-trust audit

## Assignment

- Model: `shopify-fast:latest`
- Mode: plan-only review
- Output budget: 1,500 tokens

## Objective

Audit the static prototype against the authorized Shopify product boundaries and merchant language. Identify misleading enforcement, theme, billing, privacy, compatibility, or publication claims and missing high-value merchant states.

## Evidence to inspect

- `docs/index.html`
- `docs/prototype-data.js`
- `docs/prototype-app.js`
- `control/UXP0_AUTHORIZATION.md`
- `control/UXP0_BLUEPRINT.md`
- `control/STOREFRONT_ARCHITECTURE.md`

## Required output

1. Verdict.
2. Findings ranked critical/high/medium with exact evidence.
3. Merchant-language corrections.
4. Theme-extension and Shopify Validation boundary assessment.
5. Billing/privacy/support safety assessment.
6. Missing approval-gate or evidence messaging.
7. Exact stop statement: `UXP0 SHOPIFY SCOPE AUDIT STOPPED FOR CODEX REVIEW`.

## Prohibited

Do not edit files, browse, deploy, invoke Shopify, use secrets, or claim current platform verification.
