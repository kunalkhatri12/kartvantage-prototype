# G0 task — C1 architecture and scaffold plan

## Assignment

- Model: `qwen3-coder:30b`
- Mode: plan-only
- Output budget: 2,500 tokens

## Objective

Design the smallest clean C1 repository/scaffold plan that creates a current Shopify engineering baseline without implementing any KartVantage business behavior.

## Authority

Read `control/AUTHORITY.md` and `control/C1_BOUNDARY.md`. C1 is limited to current scaffold, TypeScript/config baseline, embedded Admin shell, local workflow, environment-name boundary, dependency policy, lint/typecheck/build/test/CI, secrets, Git workflow, and architecture skeleton.

## Required decisions to propose

1. Recommended repository layout and why each C1 file/folder exists.
2. Scaffold provenance and current-Shopify verification checkpoints.
3. Runtime/package-manager/TypeScript policy without freezing details that current Shopify tooling must select.
4. Environment names and placeholder-only variable contract.
5. Minimum checks and CI stages.
6. Dependency admission rule and lockfile policy.
7. C1 acceptance checklist and rollback/reset path.
8. Items intentionally deferred to C2+.

## Prohibited

No code generation, package installation, business schema, rules, publishing, Shopify resource mutation, theme extension, billing, support plane, deployment, or legacy-code reuse.

## Return

Verdict; locked inputs; proposed C1 structure; ordered scaffold steps; checks; risks/unknowns; Shopify items requiring official verification; explicit non-scope; and `G0 ARCHITECTURE PLAN STOPPED FOR CODEX REVIEW`.

