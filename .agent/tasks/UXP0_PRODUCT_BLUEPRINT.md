# UXP0 task — complete interactive product blueprint

## Assignment

- Model: `qwen3-coder:30b`
- Mode: plan-only
- Output budget: 2,500 tokens

## Objective

Produce an implementation-ready, simulation-only prototype blueprint covering KartVantage's complete merchant, shopper-preview, and internal operations experience. The prototype must let the owner understand and test the full intended product before production implementation resumes.

## Supplied product truth

- Product sequence: Create → Test → Guide → Enforce → Understand.
- Core merchant journey: open, understand, create, edit, test, resolve conflicts, explicitly publish, await Shopify confirmation, monitor health, and get support.
- Core rule outcomes: minimum/maximum order amount, product minimum/maximum, cart item minimum/maximum, supported customer/audience policies, plus gated B2B/draft/address contexts clearly labelled unavailable or preview-only when not proven.
- Same-kind rule instances can coexist. Hard constraints accumulate. Priority only chooses explanation order.
- Simulated publish must show confirmed, uncertain/reconciling, failed with previous setup preserved, and SAFE PASS-but-unhealthy conditions.
- Storefront uses theme app extension concepts, typed settings, compatibility evidence and fallback; checkout remains authoritative.
- Internal surfaces include Master Admin, Merchant Directory/360, rule/config explorer, publish operations, flags, jobs/webhooks, incidents, support cases/snapshots/timelines, privacy, release and billing inspection.
- Merchant copy is plain, calm, specific, actionable, truthful, and approximately Grade 7.

## Required output

1. Navigation and information architecture.
2. Page-by-page purpose, primary action, essential content, and secondary actions.
3. Complete state matrix: zero/loading/success/error/blocked/uncertain/permission/plan/compatibility states.
4. Three deterministic demo stories: healthy first-time merchant; conflicting rules; unhealthy publish/storefront/support investigation.
5. Reusable component inventory.
6. Acceptance checklist proving every major click and state is represented.
7. Explicit deferred/non-prototype items.

## Prohibited

No live Shopify/API/theme/billing writes, no production schema, no arbitrary stored JS/CSS/selectors, no legacy-code copying, no claims of current Shopify mechanics beyond supplied authority.

## Return

Verdict; blueprint; state matrix; demo stories; acceptance checks; risks/decisions; and `UXP0 PRODUCT BLUEPRINT STOPPED FOR CODEX REVIEW`.
