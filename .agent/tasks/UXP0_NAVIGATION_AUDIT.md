# UXP0 task — Shopify Admin navigation necessity audit

## Assignment

- Model: `qwen3-coder:30b`
- Mode: plan-only and read-only
- Output budget: 1,500 tokens

## Objective

Reduce KartVantage prototype navigation to only necessary top-level destinations while keeping every approved prototype surface reachable contextually.

Current merchant menu: Overview, Rules, Test Lab, Storefront, Health, Activity, Help, Plans, Settings.

Current internal Operations menu: Operations, Merchants, Support, Publishing, Jobs & webhooks, Incidents, Releases, Feature flags, Audit & evidence, Privacy, Billing.

Product journey: Create → Test → Guide → Enforce → Understand. Shopify Validation is enforcement authority. Theme guidance, health evidence, activity, Core Free plan state, settings/privacy, support, and internal operational evidence are approved prototype surfaces.

## Constraints

- Shopify Admin-style task-oriented navigation.
- Do not delete approved routes or make them unreachable.
- Frequent work may remain top-level; infrequent governance/support/billing/privacy screens should be contextual or grouped.
- Avoid a generic “More” dumping ground when a clear parent destination exists.
- Mobile navigation must remain compact and horizontally usable.

## Required output

1. Recommended merchant top-level menu and where removed destinations remain reachable.
2. Recommended Operations top-level menu and where removed destinations remain reachable.
3. Exact labels, order, and rationale.
4. Acceptance checklist.
5. End with `UXP0 NAVIGATION AUDIT STOPPED FOR CODEX REVIEW`.
