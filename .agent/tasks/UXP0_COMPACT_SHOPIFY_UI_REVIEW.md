# UXP0 task — compact Shopify Admin UI redesign review

## Assignment

- Model: `shopify-deep:latest`
- Mode: plan-only and read-only
- Output budget: 2,500 tokens

## Owner feedback

The current prototype feels visually heavy and poorly spaced. The owner wants a lightweight, compact, simple, innovative, interactive interface that stays recognizably consistent with Shopify Admin. Bold fonts must be reserved for hierarchy and primary actions.

Observed desktop problems at 2560 × 1229:

- A 52px navy prototype bar, 66px internal topbar, and 244px app sidebar compete with the page.
- The page content starts below a redundant workspace topbar and consumes excessive vertical space.
- Dashboard metric cards are 142px high, the four setup cards are tall, and nearly all labels/actions are bold.
- Heavy navy fills, lime rules, strong shadows, oversized radii, and large page widths make the page feel like a custom dashboard rather than an embedded Shopify Admin app.
- The app must remain visibly simulated without turning the simulation notice into the strongest visual element.

## Proposed direction for review

- Shopify-like neutral canvas (`#f1f1f1`), white surfaces, 12px radii, subtle 1px borders, minimal shadows.
- 14px base type; 24px page title; 16px section titles; normal-weight body text.
- Compact 36px controls and 32px secondary controls.
- App navigation in a light 208px sidebar, with pale-gray selected state rather than navy blocks.
- Merge workspace context into a compact app header; reduce the prototype toolbar to 44px.
- Maximum page width near 1200px with 20–24px gutters.
- Summary metrics presented as a compact grouped surface instead of four oversized accent-bottom cards.
- Guided setup presented as four compact rows or restrained tiles with smaller icons and text.
- Preserve the brand’s navy/lime as accents, not large structural fills.
- Preserve keyboard focus, responsive behavior, truthful simulation labels, and all routes/interactions.

## Required output

1. Verdict on the proposed direction.
2. Specific Shopify-Admin-aligned visual tokens and component rules.
3. Exact hierarchy/spacing/typography corrections for the dashboard and app shell.
4. Accessibility or usability risks.
5. A short acceptance checklist.
6. End with `UXP0 COMPACT SHOPIFY UI REVIEW STOPPED FOR CODEX REVIEW`.
