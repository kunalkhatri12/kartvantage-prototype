# Local-agent communication protocol

## Purpose

Use local Ollama models for high-volume bounded reasoning. Use Codex for authority reconciliation, current-source verification, high-risk review, integration decisions, and owner reporting.

## Message contract

Every task contains:

1. Package ID and one measurable objective.
2. Exact authority IDs.
3. Authorized and prohibited scope.
4. Inputs/evidence available.
5. Required output sections.
6. Acceptance checks and stop conditions.
7. Context and output budgets.

Every return contains:

1. `PASS`, `PARTIAL`, `FAIL`, `DECISION REQUIRED`, or `BLOCKED`.
2. Evidence and assumptions separated.
3. Files changed and exact checks.
4. Shopify-current evidence or `OFFICIAL VERIFICATION REQUIRED`.
5. Security/privacy/tenant and merchant-language impact.
6. Remaining risks and decisions.
7. Exact package stop statement.

## Usage controls

- One model per task; no multi-agent conversation loops.
- Models work from compact authority excerpts and task-relevant evidence, never whole workbooks or repository dumps.
- Default context: 32,768 tokens. Increase only for a named need.
- Default generated output: 2,500 tokens for plans and 1,500 tokens for reports.
- Raw local transcripts stay in `.agent/runs/` and are ignored by Git.
- Codex receives only the task checksum, model digest, final report, diff summary, and check results.
- Failed local claims are not retried conversationally; Codex records the correction in the next task brief.

## Model routing

| Capability | Model |
| --- | --- |
| Architecture and data planning | `qwen3-coder:30b` |
| Shopify mechanics and compliance planning | `shopify-deep:latest` |
| Routine Shopify implementation | `shopify-fast:latest` |
| Small mechanical changes | `qwen2.5-coder:7b` |
| Report/test-output compression | `llama3.1:8b` |
| Retrieval embeddings only | `nomic-embed-text:latest` |
| Final architecture/security/release review | Codex |

## External-action boundary

Local models cannot deploy, change Shopify, write production data, send messages, manage accounts, install dependencies, mutate Git history, or read secrets. Those actions require explicit owner authority and separate execution evidence.

