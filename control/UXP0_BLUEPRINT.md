# UXP0 implementation blueprint

Status: Codex-audited synthesis, 2026-09-13

## Experience goal

The owner must be able to understand and test KartVantage's complete intended experience before production implementation resumes. Every state uses fictional deterministic fixtures and says clearly that no Shopify or customer data is changed.

## Navigation

### Merchant workspace

1. Overview
2. Rules
3. Test Lab
4. Storefront
5. Health
6. Activity
7. Help
8. Plans
9. Settings

Contextual flows: onboarding, rule template gallery, rule builder, rule detail/history, conflict resolution, publish progress, shopper preview, privacy and data.

### Internal operations workspace

Kept separate at `/app/ops` and accessible only through the prototype role switcher: operations overview, merchant directory, Merchant 360, support cases, publish operations, jobs/webhooks, incidents, releases, feature flags, audit/evidence, privacy operations and billing inspection.

## Persistent prototype controls

- Banner: `Prototype mode — No Shopify or customer data is changed`.
- Role: Merchant, Support, Operations.
- Scenario: New store, Healthy, Conflict, Publishing, Uncertain, Theme fallback, Needs attention, Incident.
- Reset action.
- Scenario and view remain reproducible through URL parameters or session-local state.

## Core merchant walkthrough

`Overview → Create rule → Configure → Test → Resolve conflict if present → Review → Simulated publish → Confirmed/uncertain/failed → Storefront guidance → Shopper preview → Health → Support → Pause/restore`

### Rule types shown in merchant language

- Minimum order amount
- Maximum order amount
- Minimum product quantity
- Product purchase limit
- Minimum number of items
- Maximum number of items
- Customer-specific rules as controlled/gated
- B2B, draft-order and billing-address policies as unavailable previews until evidence permits them

Same-kind rules may coexist. Effective minimum is the highest applicable minimum and effective maximum is the lowest applicable maximum. An impossible intersection blocks simulated publication. `Message order` affects explanation order only.

## Required simulated states

- Empty, loading, populated and no search results.
- Dirty, saving, saved, save failed and stale edit.
- Test idle, running, pass, single failure, multiple failures and input error.
- Publish requested, validating, compiled, Shopify write pending, confirmed, uncertain/reconciling, terminal failure, authentication failure, rate limited and recovered.
- Previous working setup remains active after failure.
- SAFE PASS trust failure is `Needs attention`, never healthy.
- Storefront: not configured, active, supported, supported with fallback, needs merchant placement, unsupported guidance and published theme changed.
- Permission unavailable, offline/stale, partial data, confirmation, toast and unexpected error.

## Storefront contract

- Theme app extension framing only: app embed plus merchant-placed app block.
- Typed appearance/page targeting controls; no JavaScript, CSS or selector input.
- Cart page/drawer previews remain demonstrations and never claim checkout authority.
- Cart Offer is disabled/planned, not a Core upsell feature.
- Shopper copy represents the merchant and does not mention KartVantage.

## Internal investigation walkthrough

`Operations overview → Merchant search → Merchant 360 → Publish/job evidence → Support case → Simulated safe remedy → Verification → Resolution evidence`

Internal surfaces are read-first, redacted and evidence-oriented. They never expose secrets, reuse merchant sessions, provide a raw database editor, or permit blind retry/direct state mutation. Billing is inspection-only and clearly says Core is currently free.

## Reusable UI

`PrototypeBar`, `AppShell`, `PageHeader`, `MetricCard`, `StatusBadge`, `AttentionBanner`, `ProgressChecklist`, `FilterBar`, `DataTable`, `RuleSummary`, `RuleBuilderStepper`, `CartFixtureEditor`, `OutcomePanel`, `ConflictExplainer`, `StorefrontPreviewFrame`, `CompatibilityCard`, `HealthCheck`, `EvidenceDrawer`, `ActivityTimeline`, `ConfirmationDialog`, `ToastRegion`, `Skeleton`, `InlineError`, `PermissionNotice` and `DangerSimulationPanel`.

## Quality gates

- One heading hierarchy per view; full keyboard operation and visible focus.
- Status never depends on colour alone; live regions for simulated progress.
- Long translated strings wrap; money, plurals and times use locale-aware formatting.
- No unintended horizontal overflow at 320px.
- Test Lab and rule review use the same deterministic fixture evaluator.
- Uncertain publication never says Active or Enforcing.
- No route performs a Shopify business mutation or adds a scope.
- Desktop/mobile evidence for every major surface and exceptional state.

## Authority reconciliation

- Use `Message order`, not the misleading phrase `which rule wins`.
- Cart Offer remains disabled/planned under D-008.
- Plans show Core free; prices and paid entitlements remain unapproved hypotheses.
- `Your store is protected` appears only in a clearly labelled healthy simulated scenario.
- Theme package numbering remains unresolved for production but does not change UXP0.

## Local-agent audit

- `qwen3-coder:30b`: product blueprint; accepted for screen/state coverage, with its simplified navigation superseded by this synthesis.
- `shopify-deep:latest`: Shopify-native/simulation guardrails; accepted. Its claimed verification checkmarks are planning recommendations, not executed evidence.
- Raw reports remain in ignored `.agent/runs/`; token counts are retained in their manifests.
