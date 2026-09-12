# C1 authenticated Shopify preview evidence

Verified: 2026-09-12 19:40 IST

## Environment

- Shopify organization: `eWebster Infotech`
- App: `Kartvantage` / handle `kartvantage`
- Development store: `kartvantage.myshopify.com`
- Admin preview: `https://admin.shopify.com/store/kartvantage/apps/5ca440f2f13e539ffbd1418df67dc373?dev-console=show`
- Preview transport: Shopify CLI development tunnel; no app version released.

## Passed checks

- Shopify Admin showed the app as an installed development app and the Dev Console reported `Connected`.
- The embedded iframe loaded from the CLI-generated development tunnel, not the legacy `kartvantage.onrender.com` deployment.
- The visible page title was `KartVantage | Clear carts. Confident checkouts.`.
- The branded C1 hero, KartVantage logo, four-step Create/Test/Guide/Enforce system, C1 status, and quality-gate copy rendered inside Shopify Admin.
- The UI explicitly stated that Shopify's Validation Function remains authoritative at checkout.
- The app server authenticated `kartvantage.myshopify.com`, created an offline development session, and remained `Ready, watching for changes`.
- Browser inspection found no application error messages. Two Shopify Admin-origin warnings were present: Direct API Access was not declared, and Shopify's own initialization code used deprecated parameters. Neither warning originated from KartVantage application code or blocked rendering.

## Boundary

This proves the greenfield C1 shell can replace the old app during a Shopify development preview. It does not prove permanent hosting or a released app version. The released app home remains on the legacy Render URL until a permanent greenfield hosting destination is approved and configured.
