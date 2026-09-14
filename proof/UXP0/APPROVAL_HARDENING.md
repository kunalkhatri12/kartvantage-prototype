# UXP0 approval hardening evidence

Verified: 2026-09-14 12:52 Asia/Kolkata

## Verdict

PASS after correcting one publish-dialog interaction defect. UXP0 now has a stakeholder walkthrough, objective decision rubric, privacy-safe feedback template, local-agent reconciliation, 26 passing repository tests, 11 additional browser checks, and a visible trusted-input verification of the uncertain publication path.

This work changes prototype behavior only. It creates no production model, Shopify write, theme mutation, billing action, Render resource, or C2 authorization.

## Local-agent inputs

| Task | Model | Started UTC | Duration | Prompt tokens | Output tokens | Codex result |
| --- | --- | --- | ---: | ---: | ---: | --- |
| Stakeholder approval review | `shopify-deep:latest` | 2026-09-14 06:44:08 | 53.2s | 4,970 | 844 | Accepted selectively |
| Copy/accessibility audit | `shopify-fast:latest` | 2026-09-14 06:45:09 | 24.0s | 4,956 | 750 | Accepted selectively; inaccurate terminology rejected |
| Prototype test-gap review | `qwen3-coder:30b` | 2026-09-14 06:45:37 | 57.0s | 4,916 | 1,019 | Accepted selectively; production-only claims deferred |

Codex independently reconciled every report. Raw reports and manifests remain local and are not published.

## Defect and correction

The original modal click delegation allowed a radio click to inherit the backdrop's `close-modal` action through `closest("[data-action]")`. This could close the simulated publish dialog before the merchant confirmed an Uncertain or Failed result.

Correction:

- Backdrop close now runs only when the backdrop itself is the click target.
- Modal actions are limited to explicit button or link controls.
- Publish outcome selection is recorded explicitly inside the modal before confirmation.
- A repository regression test prevents the broad backdrop delegation from returning.

## Automated browser evidence

`approval-browser-validation.json` records 11 passing checks:

1. Direct rule-test deep link.
2. Role/scenario synchronization into the URL.
3. Role/scenario survival after refresh.
4. Dialog labelling, initial focus, Escape close, and focus restoration.
5. Forward and reverse focus trapping.
6. Reduced-motion media behavior.
7. A 640 CSS-pixel reflow proxy for a 1280-wide display at 200% zoom, with no horizontal overflow or undersized visible controls.
8. Deterministic uncertain-outcome selection state.
9. Uncertain publication enters validation.
10. Final uncertain state leaves the rule as draft and says it is not active yet.
11. Zero captured browser console warnings or errors.

The reflow check is a CSS-viewport proxy and is not presented as real-device or assistive-technology certification.

## Visible trusted-input verification

At 2026-09-14 12:50 Asia/Kolkata, Codex opened the local prototype in the visible in-app browser and completed:

`Configure ₹75 minimum order → save draft → below/exact/above test → review → publish → choose Uncertain / reconciling → run simulation`

Observed final dialog:

- Heading: `Confirmation delayed`
- Message: `Reconciling evidence. The rule is not active yet.`
- The rule did not become published.

## Repository gate

- Lint: PASS.
- Typecheck: PASS.
- Tests: PASS, 26/26.
- Production build: PASS.
- Browser approval audit: PASS, 11/11 with zero console problems.
- Known React Router v8 future-flag notices remain non-blocking.

## Remaining gate

CMO Umesh and the owner must still approve UXP0. This evidence does not authorize C2 or external infrastructure changes.

