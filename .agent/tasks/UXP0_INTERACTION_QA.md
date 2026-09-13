# UXP0 task — interaction and route QA

## Assignment

- Model: `qwen2.5-coder:7b`
- Mode: plan-only review
- Output budget: 1,500 tokens

## Objective

Audit the static prototype implementation and test plan for broken routes, dead actions, missing states, unsafe external behavior, accessibility gaps, and claims that cannot be proven. Return a compact, actionable defect list for Codex verification.

## Evidence to inspect

- `docs/index.html`
- `docs/prototype-data.js`
- `docs/prototype-app.js`
- `docs/prototype.css`
- `tests/prototype.test.mjs`
- `control/UXP0_BLUEPRINT.md`

## Required output

1. Verdict.
2. Critical/high/medium findings with exact file and searchable code phrase.
3. Route-to-view and action-to-route mismatches.
4. Missing deterministic test coverage.
5. Accessibility and responsive risks.
6. No-network/no-Shopify-mutation boundary assessment.
7. Exact stop statement: `UXP0 INTERACTION QA STOPPED FOR CODEX REVIEW`.

## Prohibited

Do not edit files, run deployments, access secrets, or treat source-code strings as executed proof.
