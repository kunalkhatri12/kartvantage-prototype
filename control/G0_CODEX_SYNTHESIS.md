# G0 Codex synthesis

Date: 2026-09-12

## Verdict

The greenfield control system is ready. Application implementation remains stopped; C1 has not been authorized.

## Local-agent runs audited

| Task | Model | Prompt tokens | Output tokens | Audit |
| --- | --- | ---: | ---: | --- |
| Architecture plan | `qwen3-coder:30b` | 1,658 | 1,098 | Boundary accepted; guessed scaffold structure rejected |
| Shopify verification plan | `shopify-deep:latest` | 1,712 | 811 | Verification gates accepted; example versions/commands are non-evidence |

Run manifests contain task and authority hashes, exact model digests, timestamps, duration, and token counts. Raw outputs stay in ignored `.agent/runs/` and are not promoted to authority.

## Accepted conclusions

- C1 is scaffold and engineering foundation only.
- Current official Shopify sources must be checked before selecting a scaffold command, template, App Bridge approach, or API version.
- Generated artifacts and dependency choices must be treated as evidence, not anticipated from memory.
- C1 must preserve the ability to add a Validation Function and theme app extension later without implementing either.
- No legacy application code, schema, migrations, lockfile, or configuration is copied by default.

## Rejected or unresolved agent claims

- Do not assume an `@shopify/app` package or `shopify app create` command.
- Do not impose a custom Vite/project directory tree before inspecting the current official scaffold.
- Do not accept illustrative API versions from agent output.
- Do not use an agent's proposed deletion-based rollback. Git commits provide the safe baseline and rollback boundary.

## Current Shopify evidence

The official documentation reviewed on 2026-09-12 identifies Admin API `2026-07` as the latest stable version, confirms `read_themes` for the themes query, documents no-extra-scope activation status through `app.extensions()`, and confirms the ScriptTag retirement dates. This evidence is recorded in `SHOPIFY_SOURCE_REGISTER.md` and must be refreshed at implementation time.

## Stop

`G0 COMPLETE — C1 STOPPED FOR OWNER AUTHORIZATION`
