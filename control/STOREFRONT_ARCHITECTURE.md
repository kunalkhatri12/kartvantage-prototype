# Storefront guidance architecture

Status: owner-directed, recorded 2026-09-12. This is a future-package contract and is explicitly outside C1.

## Required flow

1. A merchant installs KartVantage.
2. The KartVantage theme app extension becomes available.
3. An app embed provides broad theme compatibility and loads shared CSS/JavaScript only on approved pages.
4. An app block provides merchant-controlled placement where the theme uses JSON templates.
5. KartVantage records activation and compatibility evidence.
6. Store-specific typed configuration controls appearance and guidance behavior.
7. The Shopify Cart and Checkout Validation Function remains the checkout enforcement authority.

## Activation and least privilege

- Normal embedded-app onboarding should first use Shopify's App API extension activation data for the published theme. This path does not require an additional Admin API scope.
- Add `read_themes` only in an authorized later package when published theme ID/name or theme-file inspection is necessary and the least-privilege review accepts it.
- When authorized, published-theme identity can be read with:

```graphql
themes(first: 1, roles: [MAIN]) {
  nodes {
    id
    name
    role
  }
}
```

- Re-check activation after the published theme changes.

## Extension rules

- Use theme app extensions. Do not use ScriptTags or routine direct theme-file edits.
- Keep shared CSS and JavaScript inside the extension so Shopify serves the assets through its CDN.
- Limit eligible templates with extension configuration such as `enabled_on` or `disabled_on`; an app embed may additionally perform narrow runtime page checks.
- App blocks and app embeds do not render on checkout pages. Storefront guidance is advisory; Validation Functions enforce checkout rules.
- Scope selectors and DOM access beneath a KartVantage-owned root such as `#kartvantage-guidance`. Do not globally restyle the merchant theme.
- Never inspect a theme and generate or persist merchant-specific source code as a normal compatibility strategy.

## Typed records

### ThemeInstallationState

- published theme ID and name, when permissioned
- extension activation state
- evidence source
- checked time

### ThemeCompatibilityEvidence

- theme context and version evidence available to KartVantage
- cart surface tested
- compatibility result
- fallback or placement requirement
- evidence date

### StorefrontGuideProfile

- merchant-approved enabled pages
- layout variant
- approved design tokens such as colors
- guidance mode
- known cart surface/type
- compatibility status

Only shopper-safe configuration may cross the storefront boundary. Tokens, credentials, support data, internal rule IDs, unpublished state, and admin-only configuration must never be exposed.

## Compatibility states and fallback

Every tested surface receives exactly one status:

- `supported`
- `supported_with_fallback`
- `needs_merchant_placement`
- `unsupported_guidance`

Cart drawers and theme DOM structures are not stable platform contracts. If a safe integration cannot be established, use a documented fallback such as a cart-page app block and tell the merchant what action is required. Never claim universal compatibility without dated evidence.

## Prohibited design

- arbitrary stored JavaScript
- arbitrary stored CSS
- executable merchant-specific selectors
- global theme restyling
- ScriptTag-based storefront delivery
- theme guidance acting as checkout authorization

## Roadmap placement

The frozen control sheet currently places Master Admin/support at C10 and theme work at C11 onward. The owner referred to this as a later C10 implementation package. Keep this contract intact and resolve only the label before authorizing that package.
