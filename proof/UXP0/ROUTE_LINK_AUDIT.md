# UXP0 route and stakeholder-link audit

Verified: 2026-09-14 13:34 Asia/Kolkata

## Verdict

PASS after correcting misleading invalid-route fallbacks.

## Browser evidence

`approval-browser-validation.json` now records:

- 32 valid role-aligned routes with the expected single page heading and the prototype safety boundary.
- Unknown merchant base route → `#/app/overview`.
- Unknown operations base route → `#/app/ops/overview`.
- Unknown rule ID → `#/app/rules`.
- Unknown merchant record ID → `#/app/ops/merchants`.
- Unknown support case ID → `#/app/ops/support`.
- Existing deep-link, URL persistence, focus, reduced-motion, reflow, uncertain-publication, and console checks.
- 13/13 browser checks passed with zero captured console warnings or errors.

## Repository evidence

- Lint: PASS.
- Typecheck: PASS.
- Tests: PASS, 27/27.
- Production build: PASS.
- Browser approval audit: PASS, 13/13.

The route matrix covers primary and contextual Merchant pages plus Support/Operations destinations. It does not claim that unbuilt production services or Shopify surfaces exist.

## Stakeholder entry points

- Public prototype: `https://kunalkhatri12.github.io/kartvantage-prototype/`
- Public repository: `https://github.com/kunalkhatri12/kartvantage-prototype`
- Private Google control dashboard: retained only in the private project control record.
- Local approval packet: `control/UXP0_APPROVAL_PACKET.md`
- Approval-hardening evidence: `proof/UXP0/APPROVAL_HARDENING.md`

Public URLs and GitHub workflow links must be rechecked after the sanitized prototype update is published. Shopify and Render links are references only until their separate authorization gates are opened.
