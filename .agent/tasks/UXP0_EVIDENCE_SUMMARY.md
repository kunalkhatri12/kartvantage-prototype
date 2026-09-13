# UXP0 task — owner evidence summary

## Assignment

- Model: `llama3.1:8b`
- Mode: report compression only
- Output budget: 900 tokens

## Objective

Turn the verified facts below into a concise owner/CMO review summary. Do not add claims.

## Verified facts supplied by Codex

- Static prototype in `docs/`; all data fictional and session-local.
- Persistent banner: Prototype mode — No Shopify or customer data is changed.
- Merchant navigation: Overview, Rules, Test Lab, Storefront, Health, Activity, Help, Plans, Settings.
- Context routes: onboarding, R01–R06 templates, builder/detail/conflict/publish, shopper preview, privacy.
- Operations navigation: overview, merchants/Merchant 360, support cases, publishes, jobs/webhooks, incidents, releases, flags, audit/evidence, privacy, billing inspection.
- Scenarios: new, healthy, conflict, publishing, uncertain, theme fallback, needs attention, incident.
- Theme app extension guidance only; no arbitrary JavaScript/CSS/selectors; Shopify Validation remains checkout authority; Cart Offer planned and disabled; Core is free.
- Interactive test passed create/configure/save, conflict blocker/resolution, storefront fallback/shopper preview, needs-attention health, Operations/Merchant 360.
- One wrong Merchant 360 target was found, fixed, regression-tested, and retested.
- Automated results: prototype 8/8, total 12/12, lint pass, typecheck pass, build pass, diff pass.
- Browser results: four desktop/mobile contexts passed; zero console problems; no external resources or horizontal overflow; supplied logo loaded.
- Render and production remain stopped until GitHub Pages is live and Umesh plus owner approve.

## Required output

Verdict; what to review; verified safety boundary; approval gate; exact stop statement `UXP0 EVIDENCE SUMMARY STOPPED FOR CODEX REVIEW`.

## Prohibited

No invented links, test results, Shopify claims, or recommendations outside the facts above.
