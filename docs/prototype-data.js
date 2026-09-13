/* KartVantage UXP0 fixtures: fictional, deterministic, and browser-local. */
(function (global) {
  "use strict";

  const data = {
    meta: {
      version: "UXP0.1",
      generatedOn: "2026-09-13",
      modeLabel: "Prototype mode — No Shopify or customer data is changed",
      fictionalData: true,
      locale: "en-IN",
      currency: "INR",
      storeTimeZone: "Asia/Kolkata",
      simulationNotice:
        "Every action is a demonstration. Shopify, themes, billing, and customer data remain unchanged.",
    },

    roles: [
      { id: "merchant", label: "Merchant", home: "/app" },
      { id: "support", label: "Support", home: "/app/ops/support" },
      { id: "operations", label: "Operations", home: "/app/ops" },
    ],

    navigation: {
      merchant: [
        { id: "overview", label: "Overview", path: "/app", icon: "home" },
        { id: "rules", label: "Rules", path: "/app/rules", icon: "rules" },
        { id: "test-lab", label: "Test Lab", path: "/app/test-lab", icon: "test" },
        { id: "storefront", label: "Storefront", path: "/app/storefront", icon: "storefront" },
        { id: "health", label: "Health", path: "/app/health", icon: "health" },
        { id: "activity", label: "Activity", path: "/app/activity", icon: "activity" },
        { id: "help", label: "Help", path: "/app/help", icon: "help" },
        { id: "plans", label: "Plans", path: "/app/plans", icon: "plans" },
        { id: "settings", label: "Settings", path: "/app/settings", icon: "settings" },
      ],
      merchantContextual: [
        { id: "onboarding", label: "Get started", path: "/app/onboarding" },
        { id: "rule-templates", label: "Choose a rule", path: "/app/rules/new" },
        { id: "rule-builder", label: "Configure rule", path: "/app/rules/new/configure" },
        { id: "rule-detail", label: "Rule details", path: "/app/rules/:ruleId" },
        { id: "conflict", label: "Resolve conflict", path: "/app/rules/:ruleId/conflict" },
        { id: "publish", label: "Publish", path: "/app/rules/:ruleId/publish" },
        { id: "shopper-preview", label: "Shopper preview", path: "/app/storefront/preview" },
        { id: "privacy", label: "Privacy and data", path: "/app/settings/privacy" },
      ],
      ops: [
        { id: "ops-overview", label: "Operations", path: "/app/ops", icon: "overview" },
        { id: "merchants", label: "Merchants", path: "/app/ops/merchants", icon: "merchants" },
        { id: "support", label: "Support cases", path: "/app/ops/support", icon: "support" },
        { id: "publishes", label: "Publish operations", path: "/app/ops/publishes", icon: "publish" },
        { id: "jobs", label: "Jobs & webhooks", path: "/app/ops/jobs", icon: "jobs" },
        { id: "incidents", label: "Incidents", path: "/app/ops/incidents", icon: "incident" },
        { id: "releases", label: "Releases", path: "/app/ops/releases", icon: "release" },
        { id: "flags", label: "Feature flags", path: "/app/ops/flags", icon: "flag" },
        { id: "audit", label: "Audit & evidence", path: "/app/ops/audit", icon: "audit" },
        { id: "privacy-ops", label: "Privacy operations", path: "/app/ops/privacy", icon: "privacy" },
        { id: "billing-ops", label: "Billing inspection", path: "/app/ops/billing", icon: "billing" },
      ],
    },

    scenarios: [
      {
        id: "new",
        label: "New store",
        merchantId: "m-new",
        headline: "Set up your first checkout guardrail",
        story: "Empty states, onboarding, first rule, first test, and storefront setup.",
        defaultRoute: "/app",
        states: { rules: "empty", test: "idle", publish: "idle", storefront: "not-configured", health: "setup" },
      },
      {
        id: "healthy",
        label: "Healthy",
        merchantId: "m-healthy",
        headline: "Your store is protected",
        story: "Published rules are confirmed, storefront guidance is active, and checks pass.",
        defaultRoute: "/app",
        states: { rules: "populated", test: "pass", publish: "confirmed", storefront: "supported", health: "healthy" },
      },
      {
        id: "conflict",
        label: "Conflict",
        merchantId: "m-conflict",
        headline: "Two rules cannot work together",
        story: "A minimum exceeds a maximum; simulated publication stays blocked until resolved.",
        defaultRoute: "/app/rules/r02/conflict",
        states: { rules: "conflict", test: "multiple-failures", publish: "blocked", storefront: "supported", health: "attention" },
      },
      {
        id: "publishing",
        label: "Publishing",
        merchantId: "m-publishing",
        headline: "Publishing your tested setup",
        story: "Requested, validating, compiled, Shopify write pending, then confirmed.",
        defaultRoute: "/app/rules/r03/publish",
        states: { rules: "populated", test: "pass", publish: "publishing", storefront: "active", health: "checking" },
      },
      {
        id: "uncertain",
        label: "Uncertain",
        merchantId: "m-uncertain",
        headline: "We’re confirming what Shopify received",
        story: "Publication is reconciling and never claims Active or Enforcing; the previous setup remains active.",
        defaultRoute: "/app/health",
        states: { rules: "populated", test: "pass", publish: "uncertain", storefront: "active", health: "attention" },
      },
      {
        id: "theme-fallback",
        label: "Theme fallback",
        merchantId: "m-theme",
        headline: "Place the cart-page block to finish setup",
        story: "The drawer is unverified, so a documented merchant-placed cart-page block is recommended.",
        defaultRoute: "/app/storefront",
        states: { rules: "populated", test: "pass", publish: "confirmed", storefront: "fallback", health: "attention" },
      },
      {
        id: "needs-attention",
        label: "Needs attention",
        merchantId: "m-attention",
        headline: "Checkout protection needs attention",
        story: "A trust check cannot prove the current function state, so SAFE PASS is never labelled healthy.",
        defaultRoute: "/app/health",
        states: { rules: "partial", test: "pass", publish: "authentication-failure", storefront: "theme-changed", health: "attention" },
      },
      {
        id: "incident",
        label: "Incident",
        merchantId: "m-incident",
        headline: "A service incident is being monitored",
        story: "Partial data, delayed jobs, evidence-first investigation, recovery, and merchant-safe communication.",
        defaultRoute: "/app/ops/incidents/inc-042",
        states: { rules: "stale", test: "input-error", publish: "rate-limited", storefront: "active", health: "degraded" },
      },
    ],

    ruleTypes: [
      { id: "minimum-order", code: "R01", label: "Minimum order amount", unit: "money", availability: "core", description: "Require the cart subtotal to reach a minimum." },
      { id: "maximum-order", code: "R02", label: "Maximum order amount", unit: "money", availability: "core", description: "Keep the cart subtotal below a maximum." },
      { id: "minimum-product-quantity", code: "R03", label: "Minimum product quantity", unit: "items", availability: "core", description: "Require enough of selected products." },
      { id: "product-purchase-limit", code: "R04", label: "Product purchase limit", unit: "items", availability: "core", description: "Limit how many selected products can be purchased." },
      { id: "minimum-items", code: "R05", label: "Minimum number of items", unit: "items", availability: "core", description: "Require a minimum total item count." },
      { id: "maximum-items", code: "R06", label: "Maximum number of items", unit: "items", availability: "core", description: "Limit the total number of items." },
      { id: "customer-specific", code: "F01", label: "Customer-specific rules", availability: "controlled", description: "Controlled preview pending entitlement and evidence." },
      { id: "b2b-policy", code: "F02", label: "B2B company policies", availability: "unavailable", description: "Future preview; not available in Core." },
      { id: "draft-order-policy", code: "F03", label: "Draft-order policies", availability: "unavailable", description: "Future preview; Shopify behavior must be validated first." },
      { id: "billing-address-policy", code: "F04", label: "Billing-address policies", availability: "unavailable", description: "Future preview; evidence and scope are not approved." },
    ],

    rules: [
      { id: "r01", code: "R01", name: "Wholesale basket minimum", type: "minimum-order", status: "published", value: 5000, currency: "INR", scope: "All products", priority: 20, messageOrder: 2, message: "Add {{remainingAmount}} more to continue to checkout.", updatedAt: "2026-09-13T09:45:00+05:30", version: 4 },
      { id: "r02", code: "R02", name: "Order value cap", type: "maximum-order", status: "draft", value: 4000, currency: "INR", scope: "All products", priority: 10, messageOrder: 1, message: "Reduce your cart by {{excessAmount}} to continue.", updatedAt: "2026-09-13T10:02:00+05:30", version: 2, conflictWith: ["r01"] },
      { id: "r03", code: "R03", name: "Coffee bundle minimum", type: "minimum-product-quantity", status: "publishing", value: 3, scope: "Products tagged coffee", priority: 30, messageOrder: 3, message: "Add {{remainingQuantity}} more coffee item(s).", updatedAt: "2026-09-13T10:12:00+05:30", version: 3 },
      { id: "r04", code: "R04", name: "Limited-edition purchase cap", type: "product-purchase-limit", status: "published", value: 2, scope: "Midnight Roast 1 kg", priority: 40, messageOrder: 4, message: "Choose no more than {{maximumQuantity}} of this item.", updatedAt: "2026-09-12T16:30:00+05:30", version: 6 },
      { id: "r05", code: "R05", name: "Case-pack minimum", type: "minimum-items", status: "paused", value: 6, scope: "All products", priority: 50, messageOrder: 5, message: "Add {{remainingItems}} more item(s) to continue.", updatedAt: "2026-09-11T14:05:00+05:30", version: 2 },
      { id: "r06", code: "R06", name: "Cart item ceiling", type: "maximum-items", status: "published", value: 20, scope: "All products", priority: 60, messageOrder: 6, message: "Remove {{excessItems}} item(s) to continue.", updatedAt: "2026-09-10T11:20:00+05:30", version: 5 },
      { id: "r07", code: "F01", name: "VIP early access", type: "customer-specific", status: "gated", scope: "Customer segment: VIP", priority: 70, messageOrder: 7, gate: "Controlled preview", message: "Available only when this controlled policy is approved." },
      { id: "r08", code: "F02", name: "Company order minimum", type: "b2b-policy", status: "unavailable", scope: "B2B companies", gate: "Not available" },
      { id: "r09", code: "F03", name: "Draft order cap", type: "draft-order-policy", status: "unavailable", scope: "Draft orders", gate: "Not available" },
      { id: "r10", code: "F04", name: "Country billing policy", type: "billing-address-policy", status: "unavailable", scope: "Billing address", gate: "Not available" },
    ],

    conflicts: [
      {
        id: "conf-001",
        ruleIds: ["r01", "r02"],
        severity: "blocking",
        title: "The minimum is higher than the maximum",
        explanation: "For the same cart, the effective minimum is ₹5,000 and the effective maximum is ₹4,000. No cart can satisfy both.",
        formula: "max(minimums) ≤ min(maximums)",
        resolutionChoices: [
          { id: "raise-max", label: "Raise the maximum", suggestedValue: 7500 },
          { id: "lower-min", label: "Lower the minimum", suggestedValue: 3500 },
          { id: "change-scope", label: "Change which products a rule applies to" },
          { id: "pause-rule", label: "Pause one rule" },
        ],
        publishBlocked: true,
      },
    ],

    cartFixtures: [
      { id: "cart-empty", label: "Empty cart", subtotal: 0, itemCount: 0, customer: "Guest", lines: [], expected: { status: "fail", ruleIds: ["r01", "r03"] } },
      { id: "cart-pass", label: "Typical passing cart", subtotal: 6200, itemCount: 8, customer: "Guest", lines: [{ id: "line-1", title: "House Blend 500 g", quantity: 4, unitPrice: 900 }, { id: "line-2", title: "Coffee Filters", quantity: 4, unitPrice: 650 }], expected: { status: "pass", ruleIds: [] } },
      { id: "cart-single-fail", label: "Below order minimum", subtotal: 4200, itemCount: 6, customer: "Guest", lines: [{ id: "line-3", title: "House Blend 500 g", quantity: 2, unitPrice: 900 }, { id: "line-4", title: "Coffee Filters", quantity: 4, unitPrice: 600 }], expected: { status: "fail", ruleIds: ["r01"] } },
      { id: "cart-multi-fail", label: "Multiple explanations", subtotal: 2800, itemCount: 2, customer: "Guest", lines: [{ id: "line-5", title: "Midnight Roast 1 kg", quantity: 2, unitPrice: 1400 }], expected: { status: "fail", ruleIds: ["r01", "r03", "r05"] } },
      { id: "cart-product-cap", label: "Limited item over cap", subtotal: 5600, itemCount: 4, customer: "Guest", lines: [{ id: "line-6", title: "Midnight Roast 1 kg", quantity: 4, unitPrice: 1400 }], expected: { status: "fail", ruleIds: ["r04"] } },
      { id: "cart-input-error", label: "Invalid test input", subtotal: -100, itemCount: -1, customer: "Guest", lines: [], expected: { status: "input-error", message: "Enter a subtotal and item count of zero or more." } },
    ],

    testRuns: [
      { id: "test-101", cartFixtureId: "cart-pass", state: "pass", startedAt: "2026-09-13T10:14:04+05:30", finishedAt: "2026-09-13T10:14:05+05:30", evaluatedRuleIds: ["r01", "r03", "r04", "r06"], failedRuleIds: [] },
      { id: "test-102", cartFixtureId: "cart-single-fail", state: "single-failure", startedAt: "2026-09-13T10:15:10+05:30", finishedAt: "2026-09-13T10:15:11+05:30", evaluatedRuleIds: ["r01", "r03", "r04", "r06"], failedRuleIds: ["r01"] },
      { id: "test-103", cartFixtureId: "cart-multi-fail", state: "multiple-failures", startedAt: "2026-09-13T10:16:20+05:30", finishedAt: "2026-09-13T10:16:21+05:30", evaluatedRuleIds: ["r01", "r03", "r04", "r05", "r06"], failedRuleIds: ["r01", "r03", "r05"] },
      { id: "test-104", cartFixtureId: "cart-input-error", state: "input-error", startedAt: "2026-09-13T10:17:00+05:30", finishedAt: "2026-09-13T10:17:00+05:30", evaluatedRuleIds: [], failedRuleIds: [], message: "Enter a subtotal and item count of zero or more." },
    ],

    publishOperations: [
      {
        id: "pub-201", merchantId: "m-publishing", ruleIds: ["r03"], state: "publishing", requestedAt: "2026-09-13T10:18:00+05:30", correlationId: "DEMO-PUB-201",
        steps: [
          { id: "requested", label: "Publish requested", status: "complete", at: "2026-09-13T10:18:00+05:30" },
          { id: "validating", label: "Validating rules", status: "complete", at: "2026-09-13T10:18:01+05:30" },
          { id: "compiled", label: "Prepared for Shopify", status: "complete", at: "2026-09-13T10:18:02+05:30" },
          { id: "pending", label: "Waiting for Shopify confirmation", status: "current", at: "2026-09-13T10:18:03+05:30" },
          { id: "confirmed", label: "Confirmed", status: "pending" },
        ],
        previousSetup: { status: "active", version: 7, note: "The previous working setup stays active until confirmation." },
      },
      { id: "pub-202", merchantId: "m-uncertain", ruleIds: ["r01", "r04", "r06"], state: "uncertain", requestedAt: "2026-09-13T09:02:00+05:30", correlationId: "DEMO-PUB-202", message: "Shopify’s final response was not received. Reconciliation is in progress.", previousSetup: { status: "active", version: 11 }, nextCheckAt: "2026-09-13T09:07:00+05:30" },
      { id: "pub-203", merchantId: "m-attention", ruleIds: ["r01"], state: "authentication-failure", requestedAt: "2026-09-13T08:10:00+05:30", correlationId: "DEMO-PUB-203", message: "KartVantage could not verify permission to update the setup.", remedy: "Reconnect the test store, then run verification.", previousSetup: { status: "unknown", version: 3 } },
      { id: "pub-204", merchantId: "m-incident", ruleIds: ["r03"], state: "rate-limited", requestedAt: "2026-09-13T07:41:00+05:30", correlationId: "DEMO-PUB-204", message: "Shopify asked us to slow down. A safe retry is scheduled.", retryAt: "2026-09-13T07:46:00+05:30", previousSetup: { status: "active", version: 9 } },
      { id: "pub-205", merchantId: "m-healthy", ruleIds: ["r01", "r04", "r06"], state: "confirmed", requestedAt: "2026-09-12T15:00:00+05:30", confirmedAt: "2026-09-12T15:00:07+05:30", correlationId: "DEMO-PUB-205", activeVersion: 12 },
      { id: "pub-206", merchantId: "m-conflict", ruleIds: ["r01", "r02"], state: "terminal-failure", requestedAt: "2026-09-13T10:03:00+05:30", correlationId: "DEMO-PUB-206", message: "Publication stopped because the rule limits cannot be satisfied together.", previousSetup: { status: "active", version: 5 } },
      { id: "pub-207", merchantId: "m-incident", ruleIds: ["r03"], state: "recovered", requestedAt: "2026-09-13T07:41:00+05:30", confirmedAt: "2026-09-13T07:46:08+05:30", correlationId: "DEMO-PUB-207", message: "The scheduled retry was confirmed without changing the previous working setup early." },
    ],

    storefront: {
      profiles: [
        { id: "sf-new", merchantId: "m-new", status: "not-configured", guideMode: "progress", pages: ["cart"], layout: "inline", colors: { accent: "#98C63F", ink: "#071A35", surface: "#EFF8F1" }, merchantApproved: false },
        { id: "sf-healthy", merchantId: "m-healthy", status: "active", guideMode: "progress-and-summary", pages: ["cart", "product"], layout: "card", colors: { accent: "#98C63F", ink: "#071A35", surface: "#EFF8F1" }, merchantApproved: true },
        { id: "sf-theme", merchantId: "m-theme", status: "needs-merchant-placement", guideMode: "progress", pages: ["cart"], layout: "inline", colors: { accent: "#98C63F", ink: "#071A35", surface: "#FFFFFF" }, merchantApproved: true },
      ],
      compatibility: [
        { id: "comp-healthy", merchantId: "m-healthy", themeName: "Dawn demo", themeId: "fictional-theme-101", surface: "cart page", result: "supported", checkedAt: "2026-09-12T15:04:00+05:30", evidence: "App block rendered in the cart template preview." },
        { id: "comp-fallback", merchantId: "m-theme", themeName: "Atelier demo", themeId: "fictional-theme-202", surface: "cart drawer", result: "supported-with-fallback", checkedAt: "2026-09-13T08:30:00+05:30", evidence: "Drawer behavior is unverified; use the merchant-placed cart-page app block." },
        { id: "comp-placement", merchantId: "m-theme", themeName: "Atelier demo", themeId: "fictional-theme-202", surface: "cart page", result: "needs-merchant-placement", checkedAt: "2026-09-13T08:31:00+05:30", evidence: "The app block is available but has not been placed in the cart template." },
        { id: "comp-unsupported", merchantId: "m-incident", themeName: "Vintage demo", themeId: "fictional-theme-303", surface: "quick cart", result: "unsupported-guidance", checkedAt: "2026-09-13T07:20:00+05:30", evidence: "This custom quick-cart surface cannot host documented guidance; checkout validation remains authoritative." },
        { id: "comp-changed", merchantId: "m-attention", themeName: "Studio demo", themeId: "fictional-theme-404", previousThemeId: "fictional-theme-401", surface: "published theme", result: "published-theme-changed", checkedAt: "2026-09-13T08:00:00+05:30", evidence: "A different theme is now published; guidance activation needs a new check." },
      ],
      controls: {
        allowedPages: ["product", "cart"],
        layouts: ["inline", "card", "compact"],
        guideModes: ["progress", "summary", "progress-and-summary"],
        cartOffer: { status: "planned-disabled", label: "Cart offer", reason: "Not a Core upsell feature." },
        prohibitedInputs: ["JavaScript", "CSS", "DOM selectors"],
        authorityNote: "Storefront guidance prepares shoppers; the Shopify Validation Function has final say at checkout.",
      },
    },

    shopperPreviews: [
      { id: "preview-progress", title: "Free shipping goal", variant: "progress", cartFixtureId: "cart-single-fail", eyebrow: "Almost there", message: "Add ₹800 more to continue.", progress: 84, checkoutOutcome: "blocked", merchantVoiceOnly: true },
      { id: "preview-summary", title: "Review your cart", variant: "summary", cartFixtureId: "cart-pass", message: "Your cart meets the current requirements.", checkoutOutcome: "pass", merchantVoiceOnly: true },
      { id: "preview-multiple", title: "A few changes are needed", variant: "explanations", cartFixtureId: "cart-multi-fail", messages: ["Add ₹2,200 more to continue.", "Add 1 more coffee item.", "Add 4 more items to continue."], checkoutOutcome: "blocked", merchantVoiceOnly: true },
      { id: "preview-fallback", title: "Cart guidance preview", variant: "fallback", cartFixtureId: "cart-single-fail", message: "This message appears in the cart-page block. Checkout validation remains active independently.", checkoutOutcome: "blocked", merchantVoiceOnly: true },
    ],

    healthChecks: [
      { id: "hc-function", label: "Checkout validation", status: "healthy", detail: "Published setup version 12 is confirmed.", checkedAt: "2026-09-13T10:20:00+05:30", evidenceId: "ev-001" },
      { id: "hc-rules", label: "Rule consistency", status: "healthy", detail: "No impossible intersections found.", checkedAt: "2026-09-13T10:20:01+05:30", evidenceId: "ev-002" },
      { id: "hc-storefront", label: "Storefront guidance", status: "healthy", detail: "Cart-page block is active on the published demo theme.", checkedAt: "2026-09-13T10:20:02+05:30", evidenceId: "ev-003" },
      { id: "hc-auth", label: "Store connection", status: "needs-attention", detail: "Permission could not be verified. Protection status is unknown, not healthy.", checkedAt: "2026-09-13T08:10:01+05:30", evidenceId: "ev-004", remedy: "Reconnect the store and verify again." },
      { id: "hc-theme-change", label: "Published theme", status: "needs-attention", detail: "The published theme changed after the last compatibility check.", checkedAt: "2026-09-13T08:00:00+05:30", evidenceId: "ev-005" },
      { id: "hc-jobs", label: "Background processing", status: "degraded", detail: "Webhook processing is delayed during the simulated incident.", checkedAt: "2026-09-13T07:45:00+05:30", evidenceId: "ev-006" },
    ],

    activities: [
      { id: "act-001", type: "rule.created", title: "Coffee bundle minimum created", actor: "Store owner", at: "2026-09-13T09:40:00+05:30", ruleId: "r03" },
      { id: "act-002", type: "test.passed", title: "Test passed with 4 rules", actor: "Store owner", at: "2026-09-13T10:14:05+05:30", testRunId: "test-101" },
      { id: "act-003", type: "publish.requested", title: "Simulated publication requested", actor: "Store owner", at: "2026-09-13T10:18:00+05:30", publishId: "pub-201" },
      { id: "act-004", type: "publish.uncertain", title: "Confirmation is taking longer than expected", actor: "System demonstration", at: "2026-09-13T09:02:08+05:30", publishId: "pub-202" },
      { id: "act-005", type: "storefront.checked", title: "Cart-page guidance compatibility confirmed", actor: "System demonstration", at: "2026-09-12T15:04:00+05:30", evidenceId: "ev-003" },
      { id: "act-006", type: "rule.paused", title: "Case-pack minimum paused", actor: "Store owner", at: "2026-09-11T14:05:00+05:30", ruleId: "r05" },
      { id: "act-007", type: "rule.restored", title: "Previous rule version restored in simulation", actor: "Support agent", at: "2026-09-13T07:47:00+05:30", ruleId: "r03" },
    ],

    merchants: [
      { id: "m-new", name: "Northstar Pantry Demo", domain: "northstar-pantry.example", plan: "Core Free", lifecycle: "onboarding", health: "setup", publishedRules: 0, openCases: 0, installedAt: "2026-09-13T08:00:00+05:30" },
      { id: "m-healthy", name: "Greenline Goods Demo", domain: "greenline-goods.example", plan: "Core Free", lifecycle: "active", health: "healthy", publishedRules: 3, openCases: 0, installedAt: "2026-08-14T10:00:00+05:30" },
      { id: "m-conflict", name: "Copper Cup Demo", domain: "copper-cup.example", plan: "Core Free", lifecycle: "active", health: "needs-attention", publishedRules: 1, openCases: 1, installedAt: "2026-08-20T11:30:00+05:30" },
      { id: "m-publishing", name: "Monsoon Market Demo", domain: "monsoon-market.example", plan: "Core Free", lifecycle: "active", health: "checking", publishedRules: 2, openCases: 0, installedAt: "2026-08-22T09:15:00+05:30" },
      { id: "m-uncertain", name: "Paper Kite Demo", domain: "paper-kite.example", plan: "Core Free", lifecycle: "active", health: "needs-attention", publishedRules: 3, openCases: 1, installedAt: "2026-07-03T13:20:00+05:30" },
      { id: "m-theme", name: "Orchid Cart Demo", domain: "orchid-cart.example", plan: "Core Free", lifecycle: "active", health: "needs-attention", publishedRules: 2, openCases: 0, installedAt: "2026-08-01T16:45:00+05:30" },
      { id: "m-attention", name: "Harbour Supply Demo", domain: "harbour-supply.example", plan: "Core Free", lifecycle: "connection-required", health: "needs-attention", publishedRules: 1, openCases: 1, installedAt: "2026-06-15T12:00:00+05:30" },
      { id: "m-incident", name: "Juniper Lane Demo", domain: "juniper-lane.example", plan: "Core Free", lifecycle: "active", health: "degraded", publishedRules: 4, openCases: 1, installedAt: "2026-05-11T08:40:00+05:30" },
    ],

    supportCases: [
      { id: "case-301", merchantId: "m-conflict", subject: "Why can’t I publish these two limits?", status: "waiting-on-merchant", severity: "normal", openedAt: "2026-09-13T10:05:00+05:30", owner: "Asha (demo)", summary: "Effective minimum ₹5,000 exceeds effective maximum ₹4,000.", evidenceIds: ["ev-002", "ev-007"], recommendedAction: "Ask the merchant to adjust a limit or scope; do not bypass validation." },
      { id: "case-302", merchantId: "m-uncertain", subject: "Publish still says confirming", status: "investigating", severity: "high", openedAt: "2026-09-13T09:05:00+05:30", owner: "Ravi (demo)", summary: "The write outcome is uncertain; the previous confirmed version remains active.", evidenceIds: ["ev-008", "ev-009"], recommendedAction: "Reconcile using evidence before offering the confirmation-gated retry simulation." },
      { id: "case-303", merchantId: "m-attention", subject: "Protection status unavailable", status: "merchant-action-needed", severity: "high", openedAt: "2026-09-13T08:12:00+05:30", owner: "Mina (demo)", summary: "Store permission cannot be verified.", evidenceIds: ["ev-004"], recommendedAction: "Guide the merchant through reconnection; never mark this healthy." },
      { id: "case-304", merchantId: "m-incident", subject: "Updates are delayed", status: "monitoring", severity: "high", openedAt: "2026-09-13T07:44:00+05:30", owner: "Incident team (demo)", summary: "Rate-limited jobs are queued for controlled retry.", evidenceIds: ["ev-006", "ev-010"], recommendedAction: "Monitor recovery and verify before resolution." },
      { id: "case-305", merchantId: "m-healthy", subject: "Resolved: cart guidance placement", status: "resolved", severity: "normal", openedAt: "2026-09-12T14:10:00+05:30", resolvedAt: "2026-09-12T15:05:00+05:30", owner: "Asha (demo)", summary: "Merchant placed the app block and preview evidence passed.", evidenceIds: ["ev-003"], resolution: "Verified on the fictional published theme context." },
    ],

    jobs: [
      { id: "job-401", type: "publish.reconcile", merchantId: "m-uncertain", status: "running", attempts: 2, maxAttempts: 5, queuedAt: "2026-09-13T09:02:08+05:30", nextRunAt: "2026-09-13T09:07:00+05:30", correlationId: "DEMO-PUB-202" },
      { id: "job-402", type: "webhook.process", merchantId: "m-incident", status: "delayed", attempts: 1, maxAttempts: 8, queuedAt: "2026-09-13T07:42:00+05:30", nextRunAt: "2026-09-13T07:46:00+05:30", correlationId: "DEMO-WEB-402" },
      { id: "job-403", type: "theme.compatibility.check", merchantId: "m-attention", status: "waiting-for-permission", attempts: 1, maxAttempts: 3, queuedAt: "2026-09-13T08:00:00+05:30", correlationId: "DEMO-THEME-403" },
      { id: "job-404", type: "publish.retry", merchantId: "m-incident", status: "complete", attempts: 2, maxAttempts: 5, queuedAt: "2026-09-13T07:41:00+05:30", completedAt: "2026-09-13T07:46:08+05:30", correlationId: "DEMO-PUB-207" },
    ],

    webhooks: [
      { id: "wh-501", topic: "app/uninstalled", merchantId: "m-new", status: "simulated-received", receivedAt: "2026-09-12T12:00:00+05:30", attempts: 1, payload: "Redacted fictional event" },
      { id: "wh-502", topic: "shop/update", merchantId: "m-attention", status: "processed", receivedAt: "2026-09-13T07:59:58+05:30", attempts: 1, payload: "Redacted fictional event" },
      { id: "wh-503", topic: "customers/data_request", merchantId: "m-healthy", status: "processed", receivedAt: "2026-09-11T11:00:00+05:30", attempts: 1, payload: "Redacted fictional event" },
      { id: "wh-504", topic: "customers/redact", merchantId: "m-incident", status: "delayed", receivedAt: "2026-09-13T07:42:00+05:30", attempts: 2, payload: "Redacted fictional event" },
    ],

    incidents: [
      { id: "inc-042", title: "Delayed background processing", status: "monitoring", severity: "major", startedAt: "2026-09-13T07:38:00+05:30", updatedAt: "2026-09-13T08:05:00+05:30", affected: "Simulated publish confirmations and privacy jobs", customerMessage: "Some updates are taking longer than expected. Existing confirmed setups remain unchanged while we verify recovery.", timeline: [{ at: "2026-09-13T07:38:00+05:30", status: "investigating", message: "Elevated rate limiting detected in fictional fixtures." }, { at: "2026-09-13T07:46:08+05:30", status: "recovering", message: "Controlled retry completed for a demonstration merchant." }, { at: "2026-09-13T08:05:00+05:30", status: "monitoring", message: "Queues are draining; verification continues." }], evidenceIds: ["ev-006", "ev-010"] },
      { id: "inc-041", title: "Storefront preview latency", status: "resolved", severity: "minor", startedAt: "2026-09-02T12:10:00+05:30", resolvedAt: "2026-09-02T12:42:00+05:30", affected: "Prototype previews only", customerMessage: "Preview loading returned to normal.", evidenceIds: ["ev-011"] },
    ],

    releases: [
      { id: "rel-001", version: "UXP0.1", status: "prototype", releasedAt: "2026-09-13T11:00:00+05:30", summary: "Complete-product clickable prototype fixtures and behavior demonstrations.", changes: ["Merchant journey", "Shopper preview", "Operations investigation", "Exceptional states"], productionImpact: "None" },
      { id: "rel-000", version: "C1", status: "verified-local", releasedAt: "2026-09-12T19:45:00+05:30", summary: "Greenfield branded shell verified in the test store.", changes: ["Brand shell", "Authentication preview"], productionImpact: "None" },
    ],

    featureFlags: [
      { id: "flag-customer-rules", key: "customer_specific_rules", label: "Customer-specific rules", status: "controlled", default: false, audience: "Internal demo cohort", reason: "Requires entitlement and evidence." },
      { id: "flag-cart-offer", key: "cart_offer", label: "Cart offer", status: "disabled", default: false, audience: "None", reason: "Planned; not a Core upsell feature." },
      { id: "flag-b2b", key: "b2b_policies", label: "B2B policies", status: "unavailable", default: false, audience: "None", reason: "Future hypothesis is not approved." },
      { id: "flag-draft-orders", key: "draft_order_policies", label: "Draft-order policies", status: "unavailable", default: false, audience: "None", reason: "Shopify behavior evidence is pending." },
      { id: "flag-billing-address", key: "billing_address_policies", label: "Billing-address policies", status: "unavailable", default: false, audience: "None", reason: "Scope and evidence are not approved." },
    ],

    auditEvidence: [
      { id: "ev-001", category: "publish", title: "Confirmed function setup", merchantId: "m-healthy", result: "pass", observedAt: "2026-09-13T10:20:00+05:30", source: "Deterministic simulation", summary: "Fixture version 12 matches the confirmed publish operation.", redacted: true },
      { id: "ev-002", category: "rules", title: "Rule intersection check", merchantId: "m-healthy", result: "pass", observedAt: "2026-09-13T10:20:01+05:30", source: "Deterministic evaluator fixture", summary: "Highest minimum does not exceed lowest maximum.", redacted: true },
      { id: "ev-003", category: "storefront", title: "Cart-page app block preview", merchantId: "m-healthy", result: "pass", observedAt: "2026-09-12T15:04:00+05:30", source: "Prototype theme evidence", summary: "Typed app-block settings rendered in the fictional theme context.", redacted: true },
      { id: "ev-004", category: "permission", title: "Store connection unavailable", merchantId: "m-attention", result: "unknown", observedAt: "2026-09-13T08:10:01+05:30", source: "Deterministic authentication failure", summary: "No protection claim can be made until reconnection succeeds.", redacted: true },
      { id: "ev-005", category: "theme", title: "Published theme changed", merchantId: "m-attention", result: "needs-review", observedAt: "2026-09-13T08:00:00+05:30", source: "Fictional theme installation state", summary: "The current fictional theme differs from the last checked theme.", redacted: true },
      { id: "ev-006", category: "jobs", title: "Processing delay detected", merchantId: "m-incident", result: "degraded", observedAt: "2026-09-13T07:45:00+05:30", source: "Deterministic queue fixture", summary: "Two fictional jobs exceed their normal processing window.", redacted: true },
      { id: "ev-007", category: "rules", title: "Impossible limit intersection", merchantId: "m-conflict", result: "blocked", observedAt: "2026-09-13T10:03:00+05:30", source: "Deterministic evaluator fixture", summary: "₹5,000 minimum exceeds ₹4,000 maximum.", redacted: true },
      { id: "ev-008", category: "publish", title: "Write outcome unavailable", merchantId: "m-uncertain", result: "uncertain", observedAt: "2026-09-13T09:02:08+05:30", source: "Deterministic timeout fixture", summary: "No final confirmation was received.", redacted: true },
      { id: "ev-009", category: "publish", title: "Previous setup retained", merchantId: "m-uncertain", result: "pass", observedAt: "2026-09-13T09:02:09+05:30", source: "Deterministic version fixture", summary: "Previously confirmed version 11 remains the last known working setup.", redacted: true },
      { id: "ev-010", category: "recovery", title: "Controlled retry verified", merchantId: "m-incident", result: "pass", observedAt: "2026-09-13T07:46:08+05:30", source: "Deterministic recovery fixture", summary: "The retry reached a confirmed state after rate limiting cleared.", redacted: true },
      { id: "ev-011", category: "incident", title: "Preview latency recovered", merchantId: null, result: "pass", observedAt: "2026-09-02T12:42:00+05:30", source: "Deterministic incident fixture", summary: "The fictional preview response time returned to normal.", redacted: true },
    ],

    privacy: {
      merchantView: {
        summary: "KartVantage stores only the information needed to operate and support the app.",
        shopperDataStored: "No shopper profile is included in this prototype.",
        controls: ["View data categories", "Request an export demonstration", "Start deletion demonstration"],
      },
      requests: [
        { id: "pr-601", type: "customer-data-request", merchantId: "m-healthy", status: "completed", requestedAt: "2026-09-11T11:00:00+05:30", completedAt: "2026-09-11T11:03:00+05:30", subject: "Redacted fictional customer", result: "No matching stored shopper profile" },
        { id: "pr-602", type: "customer-redact", merchantId: "m-incident", status: "delayed", requestedAt: "2026-09-13T07:42:00+05:30", subject: "Redacted fictional customer", reason: "Simulated incident queue delay", dueBy: "2026-09-13T19:42:00+05:30" },
        { id: "pr-603", type: "shop-redact", merchantId: "m-new", status: "scheduled", requestedAt: "2026-09-12T12:00:00+05:30", subject: "Fictional uninstalled shop", dueBy: "2026-09-14T12:00:00+05:30" },
      ],
      retention: [
        { category: "Rule configuration", purpose: "Operate checkout guardrails", retention: "Until deletion or uninstall retention completes" },
        { category: "Operational evidence", purpose: "Troubleshoot and demonstrate state transitions", retention: "Time-limited; exact production policy pending approval" },
        { category: "Prototype fixtures", purpose: "UX testing", retention: "Checked into the prototype only; entirely fictional" },
      ],
    },

    billing: {
      currentPlan: { id: "core-free", name: "KartVantage Core Free", price: 0, currency: "INR", interval: "month", status: "active", statement: "Core is currently free." },
      inspectionOnly: true,
      paidPlansApproved: false,
      paidPlanMessage: "Paid prices and entitlements are unapproved hypotheses and cannot be purchased in this prototype.",
      events: [
        { id: "bill-701", merchantId: "m-healthy", type: "plan-inspected", status: "no-charge", at: "2026-09-13T09:00:00+05:30", amount: 0 },
        { id: "bill-702", merchantId: "m-new", type: "core-activated", status: "no-charge", at: "2026-09-13T08:00:00+05:30", amount: 0 },
      ],
    },

    uiStates: {
      collections: ["loading", "empty", "populated", "no-results", "partial", "offline-stale", "unexpected-error"],
      editing: ["clean", "dirty", "saving", "saved", "save-failed", "stale-edit"],
      testing: ["idle", "running", "pass", "single-failure", "multiple-failures", "input-error"],
      publishing: ["requested", "validating", "compiled", "shopify-write-pending", "confirmed", "uncertain", "reconciling", "terminal-failure", "authentication-failure", "rate-limited", "recovered"],
      storefront: ["not-configured", "active", "supported", "supported-with-fallback", "needs-merchant-placement", "unsupported-guidance", "published-theme-changed"],
      feedback: ["confirmation", "toast-success", "toast-error", "permission-unavailable"],
    },

    demoStories: [
      { id: "merchant-happy-path", title: "Merchant: first rule to confidence", steps: ["/app/onboarding", "/app/rules/new", "/app/rules/new/configure", "/app/test-lab?fixture=cart-pass", "/app/rules/r03/publish", "/app/storefront", "/app/storefront/preview", "/app/health", "/app/help"] },
      { id: "merchant-conflict", title: "Merchant: understand and resolve a conflict", steps: ["/app/rules", "/app/rules/r02/conflict", "/app/test-lab?fixture=cart-multi-fail", "/app/rules/r02/publish"] },
      { id: "merchant-uncertain", title: "Merchant: safe uncertain publication", steps: ["/app/rules/r01/publish?state=uncertain", "/app/health", "/app/activity", "/app/help?case=case-302"] },
      { id: "ops-investigation", title: "Operations: evidence-backed resolution", steps: ["/app/ops", "/app/ops/merchants", "/app/ops/merchants/m-uncertain", "/app/ops/publishes/pub-202", "/app/ops/jobs?merchant=m-uncertain", "/app/ops/support/case-302", "/app/ops/audit?merchant=m-uncertain"] },
      { id: "incident-recovery", title: "Operations: incident to verified recovery", steps: ["/app/ops/incidents/inc-042", "/app/ops/jobs", "/app/ops/publishes/pub-207", "/app/ops/audit?evidence=ev-010"] },
    ],

    dangerousSimulations: [
      { id: "retry-publish", label: "Demonstrate controlled retry", confirmation: "This only changes local prototype state. It will not contact Shopify.", allowedRoles: ["support", "operations"], evidenceRequired: true },
      { id: "restore-version", label: "Demonstrate restoring the last confirmed version", confirmation: "This is a read-first simulation and does not publish a Function.", allowedRoles: ["operations"], evidenceRequired: true },
      { id: "resolve-case", label: "Mark demonstration case resolved", confirmation: "Confirm verification evidence before resolving this fictional case.", allowedRoles: ["support", "operations"], evidenceRequired: true },
      { id: "toggle-flag", label: "Demonstrate feature flag change", confirmation: "This affects the current prototype view only.", allowedRoles: ["operations"], evidenceRequired: false },
    ],
  };

  global.KV_DATA = data;
})(window);
