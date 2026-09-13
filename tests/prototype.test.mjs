import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";

const html = readFileSync(new URL("../docs/index.html", import.meta.url), "utf8");
const dataSource = readFileSync(new URL("../docs/prototype-data.js", import.meta.url), "utf8");
const appSource = readFileSync(new URL("../docs/prototype-app.js", import.meta.url), "utf8");

test("prototype HTML enforces a no-network mutation boundary", () => {
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /prototype-data\.js/);
  assert.match(html, /prototype-app\.js/);
});

test("prototype data exposes the required reproducible scenarios", () => {
  const context = { window: {} };
  vm.runInNewContext(dataSource, context);
  const ids = context.window.KV_DATA.scenarios.map((scenario) => scenario.id);
  assert.deepEqual(
    [...ids],
    ["new", "healthy", "conflict", "publishing", "uncertain", "theme-fallback", "needs-attention", "incident"],
  );
});

test("prototype app contains every major merchant and operations route", () => {
  const required = [
    "overview", "rules", "rule-new", "test-lab", "conflicts", "publish",
    "storefront", "shopper-preview", "health", "activity", "help", "plans",
    "settings", "privacy", "ops-overview", "ops-merchants", "merchant-360",
    "ops-support", "ops-publishing", "ops-jobs", "ops-incidents", "ops-releases",
    "ops-flags", "ops-audit", "ops-privacy", "ops-billing",
  ];
  for (const route of required) assert.match(appSource, new RegExp(`["']${route}["']`), route);
});

test("prototype application contains no network primitives", () => {
  assert.doesNotMatch(appSource, /\bfetch\s*\(/);
  assert.doesNotMatch(appSource, /XMLHttpRequest|WebSocket|sendBeacon/);
  assert.doesNotMatch(appSource, /\sstyle=/);
});

test("primary actions use canonical hash routes", () => {
  assert.match(appSource, /"new-rule":"app\/rules\/new"/);
  assert.match(appSource, /go\(`app\/rules\/\$\{id\}`\)/);
  assert.match(appSource, /go\(`app\/rules\/\$\{id\}\/conflict`\)/);
  assert.match(appSource, /go\(`app\/rules\/\$\{id\}\/publish`\)/);
  assert.match(appSource, /name === "shopper-preview"\) return go\("app\/storefront\/preview"\)/);
});

test("operations links address fixture-backed merchants and cases", () => {
  assert.match(appSource, /merchant:m-uncertain/);
  assert.match(appSource, /merchant:m-theme/);
  assert.doesNotMatch(appSource, /merchant:(?:lumen|field)/);
  assert.match(appSource, /support-case:\$\{c\.id\}/);
});

test("merchant trust boundaries remain explicit", () => {
  assert.match(appSource, /Shopify Validation (?:has|makes) the final/);
  assert.match(appSource, /No custom JavaScript, CSS, or selector input/);
  assert.match(appSource, /Cart Offer remains planned and disabled/);
  assert.match(appSource, /Core is currently free/);
});

test("prototype exposes exceptional and accessibility states", () => {
  assert.match(appSource, /Demo loading/);
  assert.match(appSource, /Demo error/);
  assert.match(appSource, /No matching rules/);
  assert.match(appSource, /aria-modal="true"/);
  assert.match(appSource, /Skip to content/);
});

test("role navigation stays minimal while approved secondary pages remain reachable", () => {
  const merchantMenu = appSource.slice(appSource.indexOf("const merchantNav"), appSource.indexOf("const opsNav"));
  for (const label of ["Overview", "Rules", "Test Lab", "Storefront", "Health", "Help"]) assert.match(merchantMenu, new RegExp(`"${label}"`));
  for (const label of ["Activity", "Plans", "Settings"]) assert.doesNotMatch(merchantMenu, new RegExp(`"${label}"`));
  assert.match(appSource, /button\("Activity", "go-activity"/);
  assert.match(appSource, /button\("Plan", "go-plans"/);
  assert.match(appSource, /button\("Settings", "go-settings"/);
  const operationsMenu = appSource.slice(appSource.indexOf("const opsNav"), appSource.indexOf("const scenarios"));
  assert.doesNotMatch(operationsMenu, /"Billing"/);
  assert.match(appSource, /button\("Billing inspection", "ops-billing"/);
});
