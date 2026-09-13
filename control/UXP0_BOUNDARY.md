# UXP0 complete-product prototype boundary

## Objective

Create a behavior-complete, merchant-testable KartVantage prototype before production implementation continues. The prototype must make the intended experience, navigation, language, feature relationships, and recovery behavior visible and clickable using deterministic simulated data.

## Authorized scope

- Merchant Admin: onboarding, overview, rule discovery, rule creation/editing, Test Lab, conflict resolution, publish-state simulation, rule lifecycle, storefront guidance setup, health, activity, help/support, plans, settings, and privacy views.
- Shopper preview: cart guidance variants and pass/block explanations while preserving Shopify checkout authority.
- Internal operations prototype: Master Admin, merchant directory/360, support cases, publish operations, jobs/webhooks, incidents, releases, feature flags, audit/evidence, privacy, and billing-state inspection.
- Realistic seeded scenarios, interactive state changes, filters, search, drawers, dialogs, toasts, empty/loading/error/success/uncertain states, responsive layouts, keyboard access, and plain merchant language.
- Reusable branded UI components and a clearly visible prototype/demo mode.
- Automated UI/behavior tests and rendered evidence for each major surface.
- Planning and preparation for a new Render web service with PostgreSQL after prototype acceptance.

## Simulation contract

- All prototype data is fictional and local to the UI session or checked-in fixtures.
- No prototype action may call Shopify Admin APIs, publish a Function, mutate a theme, create billing charges, send webhooks/messages, or write production business data.
- Simulated publish can demonstrate `draft → validating → publishing → confirmed`, `uncertain`, and `failed` states, but must label them as demonstrations.
- Theme setup must follow `control/STOREFRONT_ARCHITECTURE.md`: theme app extension, typed configuration, documented fallbacks, no arbitrary JS/CSS/selectors, and Validation Function authority.
- Internal dangerous actions are read-only or confirmation-gated simulations and must never resemble a raw database editor.

## Product sources

1. Current owner instructions.
2. Frozen control workbook and dated authority tabs named in `control/AUTHORITY.md`.
3. `control/STOREFRONT_ARCHITECTURE.md` and `control/BRAND_SYSTEM.md`.
4. Current official Shopify mechanics where the prototype describes a Shopify-controlled surface.
5. Legacy screenshots only as visual evidence; do not copy legacy behavior blindly.

## Exit evidence

- Traceable screen and state inventory covering the complete planned experience.
- Clickable end-to-end merchant journey: understand → create → test → resolve → simulated publish → guide → monitor → support.
- Clickable internal investigation journey from merchant lookup to evidence-backed resolution.
- Desktop and mobile visual proof; keyboard and automated behavior checks.
- No network mutation paths beyond embedded-app authentication required to render the prototype.
- CMO Umesh walkthrough and explicit approval, followed by owner acceptance.

## Stop

UXP0 does not authorize production domain models, real rule publication, live theme extensions, billing, permanent deployment, or the next frozen production package. Render creation begins only after CMO Umesh approval and owner acceptance unless the owner explicitly changes that order.
