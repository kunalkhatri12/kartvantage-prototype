# UXP0 validation evidence

Validated: 2026-09-13

## Result

The complete-product prototype is verified locally and publicly deployed for owner/CMO review. It is a static, fictional, session-local demonstration: it does not call Shopify business APIs, mutate a theme, create billing charges, or change customer/store data.

## Compact Shopify Admin visual revision

After owner review of the initial desktop prototype, the visual system was rebuilt around a lighter Shopify Admin-style hierarchy: 14px body type, 24px page titles, a 208px light navigation rail, 36px controls, a 1200px content measure, restrained brand accents, grouped metrics, compact setup tasks, subtle borders, and minimal shadows. The redundant heavy navigation treatment, oversized metric cards, excessive bold type, and dark secondary actions were removed. Role and scenario controls remain available on mobile.

`shopify-deep:latest` reviewed the proposed visual direction locally. Codex accepted its token and accessibility recommendations as design guidance, implemented the revision, and independently reran all evidence checks.

The role navigation was then audited with `qwen3-coder:30b`. Merchant navigation was reduced to six primary destinations: Overview, Rules, Test Lab, Storefront, Health, and Help. Activity, Plan, Settings, and Privacy remain available as contextual sub-pages from Health/Help/Settings. Internal Billing inspection moved under Privacy; the specialized Operations responsibilities remain visible because each is an independently required control-room surface. Automated coverage prevents the removed secondary destinations from returning to the primary merchant menu or becoming unreachable.

## Automated evidence

- `npm run prototype:check`: 10/10 prototype contract tests passed.
- `npm test`: 14/14 repository tests passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- `git diff --check`: passed; only the repository's Windows line-ending notices were reported.
- Static boundary checks confirm CSP `connect-src 'none'`, no network primitives, no inline styles, canonical action routes, fixture-backed Operations links, explicit Shopify Validation authority, Core Free billing language, and no arbitrary storefront code/selector inputs.

## Browser evidence

The scripted browser check used a no-cache static server and passed sixteen responsive contexts from 320×568 through 2560×1440 with zero console warnings or errors, no external resources, no horizontal overflow, no undersized visible controls, the main region contained within the viewport, the expected page heading visible, the real KartVantage brand asset loaded, and the persistent prototype boundary visible.

- `merchant-overview-desktop.png`: healthy Merchant overview, 1440×1100.
- `merchant-rules-mobile.png`: conflict Rules view, emulated 390×844.
- `storefront-fallback-desktop.png`: theme-aware fallback and shopper guidance, 1440×1100.
- `operations-incident-desktop.png`: internal Operations incident view, 1440×1100.
- `rule-configure-mobile.png`: product-specific configuration and required fictional resource picker, 390×844.
- `rule-test-desktop.png`: selected-draft below/exact/above boundary evidence with precise money fixtures, 1280×900.
- `rule-review-desktop.png`: saved configuration, test gate, and conflict evidence, 1280×900.
- `browser-validation.json`: machine-readable assertions for sixteen responsive contexts plus two end-to-end interaction checks.

The browser captures were regenerated after the compact visual and rule-journey revisions. The machine-readable matrix covers 320, 360, 390, 430, 768, 820, 1024, 1280, 1440, 1920, and 2560-pixel viewport widths across merchant and operations routes.

Interactive browser checks also passed:

- Choose rule → configure rule-specific fields → save the exact draft → run below/exact/above tests → review the same configuration → explicitly simulate publish → verify published state.
- Product quantity rule submission is blocked until at least one fictional product or collection is selected.
- Draft publish review → conflict blocker → simulated conflict resolution.
- Theme fallback → standalone shopper preview.
- Needs-attention health state never claims healthy.
- Operations overview → exact fixture-backed Merchant 360 record.

One incorrect hard-coded Merchant 360 target was discovered during interactive QA, corrected to `m-uncertain`/`m-theme`, protected with an automated regression check, and retested successfully.

Rule-flow QA also found and corrected two display/logic defects before publication: new amount rules silently inherited a selected-product scope from a legacy default, and ₹0.01 boundary fixtures were visually rounded to the same whole amount. Scope normalization and two-decimal boundary evidence now have automated coverage.

## Public deployment evidence

- Public prototype: `https://kunalkhatri12.github.io/kartvantage-prototype/`.
- Public repository: `https://github.com/kunalkhatri12/kartvantage-prototype`.
- Published commit: `c2a7522`.
- Pages workflow: `https://github.com/kunalkhatri12/kartvantage-prototype/actions/runs/34771608915`.
- GitHub Pages uses GitHub Actions with HTTPS enforced; rerun attempt 2 passed after the new repository's Pages setting was enabled.
- Live QA reconfirmed the complete selected-rule configure → test → review → simulated-publish journey, contextual navigation, persistent simulation disclaimer, and zero browser console warnings/errors.
## Local model usage

- `qwen3-coder:30b`: product blueprint; accepted after Codex reconciliation.
- `shopify-deep:latest`: Shopify UX and boundary review; accepted as planning guidance after Codex verification.
- `shopify-deep:latest`: rule-journey correction review; continuity, field validation, and accessibility guidance accepted after Codex verification, while invented out-of-scope rule families were rejected.
- `qwen2.5-coder:7b` and `shopify-fast:latest`: extra audit attempts. Their reports contained invented or contradictory file claims because source contents were not supplied by the plan-only runner; these claims were rejected and were not used as completion evidence.

## Remaining gate

CMO Umesh approval and owner acceptance remain required. Render creation and production implementation remain stopped.
