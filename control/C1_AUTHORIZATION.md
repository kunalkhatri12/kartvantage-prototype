# C1 owner authorization

Recorded: 2026-09-12

## Owner direction

The owner directed Codex to continue work until owner action is required, to retain proof, use the supplied KartVantage brand kit, test before marking work complete, and provide relevant verification links for the KartVantage Shopify store and app.

## Authorized scope

This instruction authorizes package C1 under `control/C1_BOUNDARY.md`:

- current official Shopify React Router scaffold
- TypeScript and configuration baseline
- embedded Admin UI shell
- local workflow and non-secret environment-name contract
- dependency policy
- lint, typecheck, build, unit test, and CI baseline
- secret boundary, Git workflow, architecture skeleton, brand-token baseline

## Still prohibited

- C2+ domain behavior
- business database tables or rule models
- theme extension implementation
- billing or entitlement behavior
- production deployment or App Store submission
- destructive Shopify changes

If Shopify CLI requires choosing or creating a Dev Dashboard app/organization, installing into a store, or authenticating an account, Codex must stop at that exact user-action boundary.
