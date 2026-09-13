# UXP0 task — Shopify-native UX and safety review

## Assignment

- Model: `shopify-deep:latest`
- Mode: plan-only
- Output budget: 2,500 tokens

## Objective

Review the UXP0 boundary and return an implementation checklist for a believable Shopify-embedded prototype that never crosses into real business actions.

## Review areas

- Embedded Admin navigation and interaction conventions.
- Clear visual distinction between real store connection and simulated feature data/actions.
- Rule creation, Test Lab, conflicts, lifecycle, publish/reconciliation, storefront activation/compatibility, health, plans, settings, support, and internal operations.
- Theme-aware configuration: app embed plus merchant-placed block, typed settings, KartVantage-owned wrapper, compatibility evidence/fallback, no checkout rendering claim.
- Accessibility, responsive behavior, destructive-action confirmations, truthful status copy, and error recovery.
- Test/evidence checklist for every prototype route.

## Supplied current evidence

- Official Shopify React Router scaffold and embedded authentication already pass in the installed development store.
- API target recorded for the foundation is 2026-07.
- Current app configuration requests zero merchant-data scopes and has no webhook subscriptions.
- UXP0 is simulation-only and may not add scopes, deploy extensions, publish Functions, create charges, or mutate Shopify resources.

## Required output

1. Shopify-native UX guardrails.
2. Screen and action checklist with simulation labels.
3. Accessibility/responsive/state requirements.
4. High-risk misleading interactions to prevent.
5. Verification matrix and stop conditions.

## Return

Verdict; guardrails; checklist; verification matrix; risks; and `UXP0 SHOPIFY UX REVIEW STOPPED FOR CODEX REVIEW`.
