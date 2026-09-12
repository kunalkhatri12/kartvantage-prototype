# Shopify source register

Verified against official Shopify documentation on 2026-09-12. Re-verify at the package that implements each behavior.

| Topic | Recorded fact | Official source |
| --- | --- | --- |
| Published theme query | `themes` supports `roles: [MAIN]`, returns `nodes`, and requires `read_themes`. | https://shopify.dev/docs/api/admin-graphql/latest/queries/themes |
| Theme extension configuration | Theme extension assets are Shopify-CDN hosted; app embeds can target pages; activation and configuration constraints are documented here. | https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration |
| Activation status | `app.extensions()` reports theme extension activation for the published theme without additional access scopes. | https://shopify.dev/docs/api/app-home/latest/apis/authentication-and-data/app-api |
| ScriptTag retirement | Creation/update ends 2026-10-01 and storefront injection ends 2027-03-01. Theme app extensions are the migration path. | https://shopify.dev/docs/apps/build/online-store/script-tag-deprecation/storefront |
| API version policy | Shopify releases stable API versions quarterly; versions are supported for at least 12 months. Select and record a stable version at package time. | https://shopify.dev/docs/api/usage/versioning |

The docs currently label Admin API `2026-07` as latest stable. This is evidence for 2026-09-12, not a permanent pin and not authorization to scaffold C1.
