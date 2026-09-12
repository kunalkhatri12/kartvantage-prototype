# G0 task — Shopify C1 verification plan

## Assignment

- Model: `shopify-deep:latest`
- Mode: plan-only
- Output budget: 2,500 tokens

## Objective

Produce an evidence checklist for verifying the current Shopify-supported C1 scaffold before any code is generated. Do not answer current facts from memory.

## Authority

- SV-C1-01: verify the current app scaffold, CLI, embedded Admin UI/App Bridge approach, and selected supported stable API version.
- Package-time policy: record official sources, selected version, generated artifacts, schema, tests, changelog/deprecations, and stop on material drift.
- C1 scope is defined in `control/C1_BOUNDARY.md`.

## Required output

1. Official Shopify pages/categories Codex must open and date-check.
2. Facts to extract before selecting the scaffold command/template.
3. Version/provenance record fields.
4. Safe local validation commands to discover from the installed/current CLI.
5. Evidence needed for embedded Admin, auth shell, app configuration, TypeScript, checks, and CI.
6. Stop conditions and questions that must not be guessed.
7. Explicit list of C2+ behavior that must not leak into C1.
8. Confirm that `control/STOREFRONT_ARCHITECTURE.md` is future-package non-scope and identify any scaffold choice that could accidentally prevent a later theme app extension or Validation Function.

## Prohibited

No browsing claim, invented current version, code, install, scaffold execution, auth, Shopify writes, deployment, business models, rules, theme implementation, or billing. It may flag future compatibility constraints without designing the future package.

## Return

Verdict; verification matrix; provenance schema; stop conditions; C1 non-scope; and `G0 SHOPIFY VERIFICATION PLAN STOPPED FOR CODEX REVIEW`.
