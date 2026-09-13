# KartVantage greenfield

## Complete-product prototype

The owner-review prototype is a static, simulation-only application in `docs/`. It demonstrates the intended merchant, shopper-guidance, and internal operations experiences without calling Shopify business APIs or changing store data.

- Run locally: `npm run prototype:dev`
- Verify the static contract: `npm run prototype:check`
- Product boundary: `control/UXP0_BOUNDARY.md`
- Screen/state blueprint: `control/UXP0_BLUEPRINT.md`

GitHub Pages deploys only the `docs/` directory. The production React Router application remains separate and continues to follow the frozen C-package build order.

This is the clean production rebuild of KartVantage. It begins with governance and evidence only; application scaffolding starts in package C1 after explicit owner authorization and current Shopify verification.

The previous repository at `D:\Projects\KartVantage\kart-vantage` is legacy evidence only. Do not copy code, schema, migrations, lockfiles, configuration, or dependencies from it by default.

## Production application state

- Active overlay: UXP0 complete-product prototype
- Production application: branded C1 shell linked and verified in the installed Shopify test app
- Real rule behavior, billing, theme mutation, and Shopify business writes remain outside UXP0
- New Render hosting with PostgreSQL is approved only after prototype acceptance

See `control/SESSION_RESUME.md`, `control/PROGRESS_DASHBOARD.md`, `control/G0_CODEX_SYNTHESIS.md`, `control/AUTHORITY.md`, `control/STOREFRONT_ARCHITECTURE.md`, `control/COMMUNICATION_PROTOCOL.md`, and `.agent/STATUS.md`.
