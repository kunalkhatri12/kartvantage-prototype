import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("brand tokens match the owner-supplied logo", () => {
  const css = read("app/styles/brand.css").toLowerCase();
  for (const token of ["#061529", "#95bf47", "#e7f4ea", "#0f172a"]) assert.ok(css.includes(token), `missing brand token ${token}`);
});

test("C1 requests no Shopify data scopes", () => {
  const config = read("shopify.app.toml");
  assert.match(config, /scopes\s*=\s*""/);
  assert.doesNotMatch(config, /write_products|read_themes|write_themes/);
  assert.doesNotMatch(config, /\[\[webhooks\.subscriptions\]\]/);
});

test("sample product mutations were removed", () => {
  const home = read("app/routes/app._index.tsx");
  assert.doesNotMatch(home, /productCreate|productVariantsBulkUpdate|admin\.graphql/);
});

test("checkout authority is stated in the shell", () => {
  assert.match(read("app/routes/app._index.tsx"), /Validation Function authoritative at checkout/);
});
