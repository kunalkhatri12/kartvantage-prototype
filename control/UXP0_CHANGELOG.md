# UXP0 dated event and decision log

Timezone: Asia/Calcutta (`UTC+05:30`)

| Date and time | Type | Event or decision | Evidence / result | Next gate |
| --- | --- | --- | --- | --- |
| 2026-09-13 21:51:40 | Build checkpoint | Complete simulation-only product prototype committed. | Git commit `96e09e9`; merchant, shopper-preview, support, and operations routes present. | Visual owner review. |
| 2026-09-13 21:59:55 | Local-agent review | `shopify-deep:latest` reviewed the compact Shopify Admin visual direction. | Provenance retained in `.agent/runs/UXP0_COMPACT_SHOPIFY_UI_REVIEW/2026-09-13T16-29-55-072Z`; recommendations accepted only after Codex verification. | Implement and re-test. |
| 2026-09-13 22:06:28 | UI decision | Replaced the heavy prototype shell with a compact, neutral, Shopify Admin-aligned system. | Git commit `8d617ee`; regenerated desktop/mobile proof captures; 12/12 repository tests passed. | Navigation necessity audit. |
| 2026-09-13 22:07:56 | Local-agent review | `qwen3-coder:30b` audited top-level menu necessity by role. | Provenance retained in `.agent/runs/UXP0_NAVIGATION_AUDIT/2026-09-13T16-37-56-160Z`; merchant recommendation accepted after Codex review. | Implement contextual sub-pages. |
| 2026-09-13 22:10:27 | Navigation decision | Merchant top-level navigation reduced to Overview, Rules, Test Lab, Storefront, Health, and Help. Activity, Plan, Settings, and Privacy remain contextual. Operations Billing moved under Privacy. | Regression test added to ensure secondary destinations remain reachable without returning to the primary menu. | Full QA and public GitHub Pages publication. |
| 2026-09-13 22:10:27 | Responsive QA decision | Expanded browser coverage to representative small/large phones, tablets, laptops, desktops, wide screens, and ultrawide screens. | 13 browser contexts from 320×568 through 2560×1440; no overflow, clipping, undersized visible controls, external resources, or console problems. | Rerun after navigation change, then publish. |
| 2026-09-13 22:13:16 | Verification | Compact visual system and role-based contextual navigation passed the complete verification gate. | 13/13 repository tests; lint, typecheck, production build, diff integrity, and 13-context browser matrix passed. Nine dated viewport screenshots retained in `proof/UXP0/`. | Commit verified state and publish GitHub Pages. |

Append-only rule: add a new row for every material owner instruction, scope decision, accepted/rejected local-agent recommendation, defect, verification result, deployment, approval, or blocker. Do not rewrite prior outcomes to make later work appear retroactive.
