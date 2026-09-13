# UXP0 validation evidence

Validated: 2026-09-13

## Result

The complete-product prototype is verified locally and ready for owner/CMO review. It is a static, fictional, session-local demonstration: it does not call Shopify business APIs, mutate a theme, create billing charges, or change customer/store data.

## Compact Shopify Admin visual revision

After owner review of the initial desktop prototype, the visual system was rebuilt around a lighter Shopify Admin-style hierarchy: 14px body type, 24px page titles, a 208px light navigation rail, 36px controls, a 1200px content measure, restrained brand accents, grouped metrics, compact setup tasks, subtle borders, and minimal shadows. The redundant heavy navigation treatment, oversized metric cards, excessive bold type, and dark secondary actions were removed. Role and scenario controls remain available on mobile.

`shopify-deep:latest` reviewed the proposed visual direction locally. Codex accepted its token and accessibility recommendations as design guidance, implemented the revision, and independently reran all evidence checks.

The role navigation was then audited with `qwen3-coder:30b`. Merchant navigation was reduced to six primary destinations: Overview, Rules, Test Lab, Storefront, Health, and Help. Activity, Plan, Settings, and Privacy remain available as contextual sub-pages from Health/Help/Settings. Internal Billing inspection moved under Privacy; the specialized Operations responsibilities remain visible because each is an independently required control-room surface. Automated coverage prevents the removed secondary destinations from returning to the primary merchant menu or becoming unreachable.

## Automated evidence

- `npm run prototype:check`: 8/8 prototype contract tests passed.
- `npm test`: 13/13 repository tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `git diff --check`: passed; only the repository's Windows line-ending notices were reported.
- Static boundary checks confirm CSP `connect-src 'none'`, no network primitives, no inline styles, canonical action routes, fixture-backed Operations links, explicit Shopify Validation authority, Core Free billing language, and no arbitrary storefront code/selector inputs.

## Browser evidence

The scripted browser check used a no-cache static server and passed thirteen responsive contexts from 320×568 through 2560×1440 with zero console warnings or errors, no external resources, no horizontal overflow, no undersized visible controls, the main region contained within the viewport, the expected page heading visible, the real KartVantage brand asset loaded, and the persistent prototype boundary visible.

- `merchant-overview-desktop.png`: healthy Merchant overview, 1440×1100.
- `merchant-rules-mobile.png`: conflict Rules view, emulated 390×844.
- `storefront-fallback-desktop.png`: theme-aware fallback and shopper guidance, 1440×1100.
- `operations-incident-desktop.png`: internal Operations incident view, 1440×1100.
- `browser-validation.json`: machine-readable assertions for all four captures.

The four browser captures listed above were regenerated after the compact visual revision and are the current visual evidence set. The machine-readable matrix additionally covers 320, 360, 390, 430, 768, 820, 1024, 1280, 1440, 1920, and 2560-pixel viewport widths across merchant and operations routes.

Interactive browser checks also passed:

- Create rule → select R01 → configure → save draft → Rules.
- Draft publish review → conflict blocker → simulated conflict resolution.
- Theme fallback → standalone shopper preview.
- Needs-attention health state never claims healthy.
- Operations overview → exact fixture-backed Merchant 360 record.

One incorrect hard-coded Merchant 360 target was discovered during interactive QA, corrected to `m-uncertain`/`m-theme`, protected with an automated regression check, and retested successfully.

## Local model usage

- `qwen3-coder:30b`: product blueprint; accepted after Codex reconciliation.
- `shopify-deep:latest`: Shopify UX and boundary review; accepted as planning guidance after Codex verification.
- `qwen2.5-coder:7b` and `shopify-fast:latest`: extra audit attempts. Their reports contained invented or contradictory file claims because source contents were not supplied by the plan-only runner; these claims were rejected and were not used as completion evidence.

## Remaining gate

Public GitHub Pages deployment and CMO Umesh approval remain required. Render creation and production implementation remain stopped.
