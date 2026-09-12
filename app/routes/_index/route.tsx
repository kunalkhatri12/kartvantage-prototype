import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Form, redirect, useLoaderData } from "react-router";
import { login } from "../../shopify.server";
import styles from "./styles.module.css";

export const meta: MetaFunction = () => [
  { title: "KartVantage | Clear carts. Confident checkouts." },
  { name: "description", content: "Shopify-native purchasing rules with clear shopper guidance." },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  if (url.searchParams.get("shop")) throw redirect(`/app?${url.searchParams.toString()}`);
  return { showForm: Boolean(login) };
};

export default function Index() {
  const { showForm } = useLoaderData<typeof loader>();
  return (
    <main className={styles.page}>
      <section className={styles.panel} aria-labelledby="landing-title">
        <img className={styles.logo} src="/brand/kartvantage-logo-transparent.png" alt="KartVantage" />
        <span className={styles.eyebrow}>SHOPIFY-NATIVE CART RULES</span>
        <h1 id="landing-title">Clear carts.<br />Confident checkouts.</h1>
        <p className={styles.intro}>Create, test, guide, and enforce purchasing rules through one calm, merchant-friendly workspace.</p>
        {showForm && (
          <Form className={styles.form} method="post" action="/auth/login">
            <label htmlFor="shop">Shop domain</label>
            <div className={styles.fieldRow}>
              <input id="shop" type="text" name="shop" placeholder="your-store.myshopify.com" autoComplete="url" />
              <button type="submit">Continue securely</button>
            </div>
            <small>Authentication is handled by Shopify.</small>
          </Form>
        )}
        <ul className={styles.pillars} aria-label="KartVantage workflow"><li>Create</li><li>Test</li><li>Guide</li><li>Enforce</li></ul>
      </section>
    </main>
  );
}
