import type { HeadersFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";

import { authenticate } from "../shopify.server";
import styles from "../styles/app-home.module.css";

export const meta: MetaFunction = () => [
  { title: "KartVantage | Clear carts. Confident checkouts." },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

const pillars = [
  { number: "01", title: "Create", description: "Shape clear purchasing rules with merchant-friendly guidance." },
  { number: "02", title: "Test", description: "Preview shopper outcomes before anything becomes active." },
  { number: "03", title: "Guide", description: "Help shoppers understand what their cart needs next." },
  { number: "04", title: "Enforce", description: "Keep Shopify's Validation Function authoritative at checkout." },
] as const;

export default function Index() {
  return (
    <s-page heading="KartVantage">
      <div className={styles.shell}>
        <section className={styles.hero} aria-labelledby="kv-hero-title">
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>FOUNDATION READY</span>
            <h1 id="kv-hero-title">Clear carts. Confident checkouts.</h1>
            <p>
              A calm, Shopify-native workspace for creating, testing, guiding,
              and enforcing purchasing rules.
            </p>
            <div className={styles.statusRow} aria-label="Current build status">
              <span className={styles.statusDot} aria-hidden="true" />
              <span>C1 engineering foundation in progress</span>
            </div>
          </div>
          <div className={styles.mark} aria-hidden="true">
            <img src="/brand/kartvantage-logo-transparent.png" alt="" />
          </div>
        </section>

        <section aria-labelledby="kv-system-title">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.eyebrow}>THE KARTVANTAGE SYSTEM</span>
              <h2 id="kv-system-title">Simple at every step</h2>
            </div>
            <span className={styles.phaseBadge}>C1 · No live rules yet</span>
          </div>
          <div className={styles.pillarGrid}>
            {pillars.map((pillar) => (
              <article className={styles.pillar} key={pillar.number}>
                <span className={styles.pillarNumber}>{pillar.number}</span>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.readiness} aria-labelledby="kv-ready-title">
          <div>
            <span className={styles.eyebrow}>QUALITY GATE</span>
            <h2 id="kv-ready-title">Built on proof, not assumptions</h2>
            <p>
              Every package is source-verified, tested, audited, and stopped for
              approval before the next one begins.
            </p>
          </div>
          <ul>
            <li><span aria-hidden="true">✓</span> Official Shopify scaffold pinned</li>
            <li><span aria-hidden="true">✓</span> Brand system recorded</li>
            <li><span aria-hidden="true">✓</span> Automated quality checks required</li>
          </ul>
        </section>
      </div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) =>
  boundary.headers(headersArgs);
