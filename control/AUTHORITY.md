# KartVantage greenfield authority

## Authoritative sources

1. Explicit current owner instruction.
2. `KartVantage Greenfield Control System Frozen 2026-09-10` (`1Sqooo4ljsmKUBOOxxjr5mgQpszRteuiCrGfiLKuONPQ`).
3. Dated authority in `Copy of KartVantage_Master_Repository_2026-09-09_FINAL` (`1HfKQu0ckpJdxRikEjO7BtzWlYXOmAx7PixQbuFeQD1U`), especially sheets 76, 77, 82, 83, 84, 85, 87, and 93.
4. Current official Shopify documentation and package-selected generated schema for Shopify mechanics.
5. Actual greenfield repository evidence after C1.
6. Backend-aligned master (`1ktdgLmHlq-9s0wtfp5hpe-3OcsTkNFh2tdUNfMIwgQ8`).
7. Previous repository and older documents as read-only legacy evidence only.

## Greenfield reset

- A clean production rebuild is justified.
- Do not repair or copy the legacy application by default.
- Legacy fixtures or concepts may be re-derived only when an authorized package names them, provenance is recorded, and the new contract is independently verified.
- C1 creates engineering foundations only. It must not create business tables, rules, publication, storefront features, billing, Master Admin, support operations, or compatibility behavior.

## Locked product invariants

- KartVantage is Shopify-native purchasing-rule software: Create → Test → Guide → Enforce → Understand.
- Shopify Cart and Checkout Validation Function is the enforcement authority where supported. Admin/theme experiences never authorize checkout.
- Rule Kind is different from Rule Instance. Applicable same-kind hard constraints may coexist.
- Effective minimum is the highest applicable minimum. Effective maximum is the lowest applicable maximum. Impossible intersections are rejected before effective publication.
- Priority chooses explanation order after truth is computed; it never changes enforcement truth.
- Local state is not checkout truth. Effective Active requires Shopify read-back equality evidence.
- Missing, malformed, unsupported, oversized, checksum-invalid, or untrusted KartVantage configuration SAFE PASS and is operationally unhealthy.
- Function runtime failure is a separate class. `blockOnFailure=false` is approved direction, subject to package-time official verification.
- Canonical money, quantity, applicability, audience, conflict, and explanation logic must have compiler/runtime/Test Lab/Function parity.
- Theme app extensions are the storefront baseline. No new ScriptTag architecture and no normal direct theme mutation.
- Storefront guidance is theme-aware configuration, never merchant-specific DOM code generation. Use an app embed for broad compatibility and an app block for merchant-controlled placement on JSON-template themes.
- Prefer published-theme extension activation status from the embedded App API during normal onboarding. Request `read_themes` only when a later authorized package has a justified need to query published-theme identity or theme files.
- Merchant storefront behavior is stored as typed data. Arbitrary stored JavaScript, CSS, or selector execution is prohibited.
- All KartVantage styling and DOM access must remain beneath a KartVantage-owned wrapper. Theme guidance may prepare shoppers, but cannot authorize or enforce checkout.
- Compatibility claims require dated evidence and one of: supported, supported with fallback, needs merchant placement, or unsupported guidance.
- Billing remains dormant until separate commercial authorization.
- AI is optional and replaceable; it never becomes checkout truth or a Core dependency.

## Frozen package order

C1 scaffold → C2 merchant auth/Store lifecycle → C3 staff authorization → C4 webhooks/jobs → C5 rule domain → C6 Minimum Spend Function slice → C7 confirmed publication/reconciliation → C8 remaining approved Core → C9 merchant admin/Test Lab/health → later support, theme compatibility, security/DR, privacy, commercial, billing, and App Store packages.

Each package stops for Codex audit and owner approval.

## Package-label reconciliation

The owner described the future theme implementation as a later `C10` package. The frozen 2026-09-10 build register assigns C10 to Master Admin/support and begins theme work at C11. The architecture in `STOREFRONT_ARCHITECTURE.md` is binding; its final package number remains an explicit roadmap decision and must not be silently renumbered by an agent.
