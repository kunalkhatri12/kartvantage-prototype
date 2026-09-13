(function () {
  "use strict";

  const DATA = window.KV_DATA || {};
  const root = document.getElementById("kv-app");
  const toastRoot = document.getElementById("kv-toast");
  const modalRoot = document.getElementById("kv-modal");
  if (!root || !toastRoot || !modalRoot) return;
  document.body.classList.add("kv-prototype");

  const merchantNav = [
    ["overview", "Overview", "app"], ["rules", "Rules", "app/rules"], ["test-lab", "Test Lab", "app/test-lab"],
    ["storefront", "Storefront", "app/storefront"], ["health", "Health", "app/health"], ["activity", "Activity", "app/activity"],
    ["help", "Help", "app/help"], ["plans", "Plans", "app/plans"], ["settings", "Settings", "app/settings"]
  ];
  const opsNav = [
    ["ops-overview", "Operations", "app/ops"], ["ops-merchants", "Merchants", "app/ops/merchants"], ["ops-support", "Support", "app/ops/support"],
    ["ops-publishing", "Publishing", "app/ops/publishes"], ["ops-jobs", "Jobs & webhooks", "app/ops/jobs"], ["ops-incidents", "Incidents", "app/ops/incidents"],
    ["ops-releases", "Releases", "app/ops/releases"], ["ops-flags", "Feature flags", "app/ops/flags"], ["ops-audit", "Audit & evidence", "app/ops/audit"],
    ["ops-privacy", "Privacy", "app/ops/privacy"], ["ops-billing", "Billing", "app/ops/billing"]
  ];
  const scenarios = ["New store", "Healthy", "Conflict", "Publishing", "Uncertain", "Theme fallback", "Needs attention", "Incident"];
  const roles = ["Merchant", "Support", "Operations"];
  function parameterId(label) { return String(label).toLowerCase().replace(/\s+/g, "-"); }
  function fromParameter(value, choices) { return choices.find(x => parameterId(x) === String(value || "").toLowerCase()) || choices.find(x => x === value); }
  const baseRules = (DATA.rules || [
    { id: "rule-min-order", name: "Minimum checkout", type: "minAmount", value: 50, status: "published", scope: "All carts", priority: 10 },
    { id: "rule-max-items", name: "Keep orders manageable", type: "maxItems", value: 12, status: "draft", scope: "All carts", priority: 20 },
    { id: "rule-min-items", name: "Starter bundle", type: "minItems", value: 3, status: "draft", scope: "Selected products", priority: 30 }
  ]).map(normalizeRule);

  const defaults = {
    role: "Merchant", scenario: "Healthy", rules: baseRules, activity: [],
    publishState: "idle", dirty: false, storefrontActive: true, search: "", uiState: "ready",
    ruleFilter: "all", selectedMerchant: null, supportCase: null
  };
  let state = restore();
  let lastFocus = null;

  function normalizeRule(r, i) {
    const typeMap = {
      "minimum-order": "minAmount", "maximum-order": "maxAmount",
      "minimum-product-quantity": "minProduct", "product-purchase-limit": "maxProduct",
      "minimum-items": "minItems", "maximum-items": "maxItems", "customer-specific": "customer"
    };
    const normalized = Object.assign({ id: `rule-${i || 0}`, name: "Untitled rule", type: "minAmount", value: 0, status: "draft", scope: "All carts", priority: 0, message: "Update your cart to continue." }, r);
    normalized.type = typeMap[normalized.type] || normalized.type;
    return normalized;
  }
  function restore() {
    try {
      const saved = JSON.parse(sessionStorage.getItem("kv-prototype-state") || "null");
      return Object.assign({}, defaults, saved || {}, { rules: (saved && saved.rules || baseRules).map(normalizeRule) });
    } catch (_) { return Object.assign({}, defaults); }
  }
  function persist() { sessionStorage.setItem("kv-prototype-state", JSON.stringify(state)); }
  function esc(value) { return String(value == null ? "" : value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
  function money(value) { return new Intl.NumberFormat(DATA.meta?.locale || undefined, { style: "currency", currency: DATA.meta?.currency || "USD", maximumFractionDigits: 0 }).format(Number(value) || 0); }
  function route() {
    const raw = location.hash.replace(/^#\/?/, "") || "app/overview";
    const parts = raw.split("?")[0].split("/").filter(Boolean);
    const ops = parts[0] === "app" && parts[1] === "ops";
    if (ops) {
      const section=parts[2]||"";
      if(section==="merchant") return {ops:true,page:"merchant-360",id:parts[3]};
      if(section==="support"&&parts[3]) return {ops:true,page:"support-case",id:parts[3]};
      return {ops:true,page:({"":"ops-overview",merchants:"ops-merchants",support:"ops-support",publishes:"ops-publishing",publishing:"ops-publishing",jobs:"ops-jobs",incidents:"ops-incidents",releases:"ops-releases",flags:"ops-flags",audit:"ops-audit",privacy:"ops-privacy",billing:"ops-billing"})[section]||"ops-overview",id:parts[3]};
    }
    const section=parts[1]||"";
    if(section==="onboarding") return {ops:false,page:"onboarding"};
    if(section==="rules"&&parts[2]==="new") return {ops:false,page:"rule-new",id:parts[3]};
    if(section==="rules"&&parts[3]==="conflict") return {ops:false,page:"conflicts",id:parts[2]};
    if(section==="rules"&&parts[3]==="publish") return {ops:false,page:"publish",id:parts[2]};
    if(section==="rules"&&parts[2]) return {ops:false,page:"rule-detail",id:parts[2]};
    if(section==="storefront"&&parts[2]==="preview") return {ops:false,page:"shopper-preview"};
    if(section==="settings"&&parts[2]==="privacy") return {ops:false,page:"privacy"};
    return {ops:false,page:section||"overview"};
  }
  function go(path) { location.hash = path.startsWith("/") ? path : `/${path}`; }
  function badge(label, tone) { return `<span class="kv-badge kv-badge--${tone || String(label).toLowerCase().replace(/\s+/g, "-")}">${esc(label)}</span>`; }
  function button(label, action, kind, attrs) { const type = /type=["']submit/.test(attrs || "") ? "submit" : "button"; const clean = (attrs || "").replace(/type=["']submit["']/g, ""); return `<button type="${type}" class="kv-button ${kind ? `kv-button--${kind}` : ""}" data-action="${esc(action)}" ${clean}>${esc(label)}</button>`; }
  function metric(label, value, note) { return `<article class="kv-card kv-metric"><p class="kv-eyebrow">${esc(label)}</p><strong>${esc(value)}</strong><p>${esc(note || "")}</p></article>`; }
  function header(title, description, actions) { return `<header class="kv-page-header"><div><h1>${esc(title)}</h1><p>${esc(description)}</p></div>${actions ? `<div class="kv-actions">${actions}</div>` : ""}</header>`; }
  function notice(title, body, tone) { return `<section class="kv-notice kv-notice--${tone || "info"}" role="status"><strong>${esc(title)}</strong><p>${esc(body)}</p></section>`; }
  function empty(title, body, action) { return `<section class="kv-empty"><div class="kv-empty__icon" aria-hidden="true">◇</div><h2>${esc(title)}</h2><p>${esc(body)}</p>${action || ""}</section>`; }
  function row(label, value) { return `<div class="kv-definition"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`; }
  function table(headers, rows) { return `<div class="kv-table-wrap"><table class="kv-table"><thead><tr>${headers.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead><tbody>${rows.join("")}</tbody></table></div>`; }
  function activity(text, status) { state.activity.unshift({ time: new Date().toISOString(), text, status: status || "Info" }); persist(); }
  function toast(message, tone) {
    const el = document.createElement("div"); el.className = `kv-toast kv-toast--${tone || "success"}`; el.setAttribute("role", tone === "error" ? "alert" : "status"); el.textContent = message;
    toastRoot.appendChild(el); setTimeout(() => el.remove(), 3600);
  }
  function modal(title, body, confirmAction, confirmLabel) {
    lastFocus = document.activeElement;
    modalRoot.innerHTML = `<div class="kv-modal-backdrop" data-action="close-modal"><section class="kv-modal" role="dialog" aria-modal="true" aria-labelledby="kv-modal-title" tabindex="-1" data-modal-panel><h2 id="kv-modal-title">${esc(title)}</h2><div>${body}</div><div class="kv-actions">${button("Cancel", "close-modal", "secondary")}${confirmAction ? button(confirmLabel || "Confirm simulation", confirmAction, "primary") : ""}</div></section></div>`;
    modalRoot.querySelector(".kv-modal").focus();
  }
  function closeModal() { modalRoot.innerHTML = ""; if(lastFocus?.focus)lastFocus.focus(); lastFocus=null; }

  function render() {
    const r = route();
    const forcedOps = state.role !== "Merchant";
    if (forcedOps && !r.ops) { go("app/ops/overview"); return; }
    if (!forcedOps && r.ops) { go("app/overview"); return; }
    const nav = r.ops ? opsNav : merchantNav;
    root.className = "kv-prototype";
    root.innerHTML = `
      <a class="kv-skip" href="#kv-main">Skip to content</a>
      <div class="kv-prototype-bar" role="status"><div class="kv-prototype-bar__notice"><strong>Prototype mode</strong><span>No Shopify or customer data is changed</span></div>
        <div class="kv-prototype-controls"><label>Role <select data-control="role" aria-label="Prototype role">${roles.map(x => `<option${x === state.role ? " selected" : ""}>${x}</option>`).join("")}</select></label>
        <label>Scenario <select data-control="scenario" aria-label="Prototype scenario">${scenarios.map(x => `<option${x === state.scenario ? " selected" : ""}>${x}</option>`).join("")}</select></label>
        ${button("Reset demo", "reset-demo", "quiet")}</div>
      </div>
      <div class="kv-app-shell" data-menu-open="false">
        <aside id="kv-sidebar" class="kv-sidebar" aria-label="${r.ops ? "Operations" : "Merchant"} navigation">
          <a class="kv-brand" href="#/${r.ops ? "app/ops/overview" : "app/overview"}" aria-label="KartVantage home"><img class="kv-brand__logo" src="assets/kartvantage-logo.png" alt=""><span class="kv-brand__name">KartVantage</span></a>
          <p class="kv-nav__label">${r.ops ? "Internal operations" : "Merchant workspace"}</p>
          <nav class="kv-nav">${nav.map(([id, label, path]) => `<a href="#/${path}" ${r.page === id ? 'aria-current="page"' : ""}>${esc(label)}</a>`).join("")}</nav>
          <div class="kv-sidebar__footer">${badge("SIMULATED", "demo")}<small>Fictional local data</small></div>
        </aside>
        <main id="kv-main" class="kv-main" tabindex="-1"><div class="kv-topbar"><button type="button" class="kv-mobile-menu" data-action="toggle-menu" aria-controls="kv-sidebar" aria-expanded="false">Menu</button><div class="kv-topbar__context"><strong>${r.ops ? "KartVantage operations" : "KartVantage"}</strong><span>${esc(state.scenario)} preview · fictional data</span></div><div class="kv-topbar__actions">${badge("Preview", "neutral")}</div></div><div class="kv-page">${r.ops ? renderOps(r) : renderMerchant(r)}</div></main>
      </div>`;
    document.title = `${pageTitle(r)} · KartVantage Prototype`;
    persistUrl();
  }
  function pageTitle(r) { if (r.page === "rule-new" && r.id === "configure") return "Configure rule"; return (r.ops ? opsNav : merchantNav).find(x => x[0] === r.page)?.[1] || ({onboarding:"Get started","rule-new":"Choose a rule","rule-detail":"Rule details",conflicts:"Resolve conflict",publish:"Publish","shopper-preview":"Shopper preview",privacy:"Privacy and data","merchant-360":"Merchant 360","support-case":"Support case"})[r.page] || "KartVantage"; }
  function persistUrl() {
    const u = new URL(location.href); u.searchParams.set("role", parameterId(state.role)); u.searchParams.set("scenario", parameterId(state.scenario));
    history.replaceState(null, "", `${u.pathname}${u.search}${location.hash}`);
  }

  function scenarioNotice() {
    const copy = {
      "New store": ["Welcome to a fresh workspace", "Start with one rule, test it, then add optional storefront guidance."],
      "Healthy": ["Your store is protected — simulated", "All demonstrated checks are passing and the last simulated publication is confirmed."],
      "Conflict": ["One conflict needs a decision", "The current minimum and maximum create an impossible cart range."],
      "Publishing": ["Publication in progress — simulated", "The previous working setup remains active while validation completes."],
      "Uncertain": ["Confirmation is delayed — simulated", "KartVantage is reconciling Shopify evidence. The rule is not shown as active."],
      "Theme fallback": ["Theme placement needs attention", "Use the supported cart-page app block fallback for this theme."],
      "Needs attention": ["Safe pass requires attention", "Trust evidence is incomplete. Checkout remains under Shopify Validation authority."],
      "Incident": ["Active demonstration incident", "Operations is investigating delayed publish confirmations; existing protection remains active."]
    }[state.scenario];
    return notice(copy[0], copy[1], ["Conflict", "Needs attention", "Incident"].includes(state.scenario) ? "warning" : "info");
  }
  function scenarioRules() { return state.scenario==="New store"?state.rules.filter(r=>String(r.id).startsWith("rule-")):state.rules; }

  function renderMerchant(r) {
    if (r.page === "rule-detail") return ruleBuilder(r.id);
    if (r.page === "rule-new") return r.id === "configure" ? ruleBuilder(null, new URLSearchParams(location.hash.split("?")[1]||"").get("type")) : ruleGallery();
    if (r.page === "conflicts") return conflictsView(r.id);
    if (r.page === "publish") { const rule=state.rules.find(x=>x.id===r.id)||state.rules[0]; return `${header("Publish rule", "Review the safe state transition before running a demonstration.",button("Back to rules","go-rules","secondary"))}<section class="kv-card">${publishPanel(rule)}<div class="kv-actions">${button("Run publish simulation",`publish:${rule.id}`,"primary")}</div></section>`; }
    const views = { overview, onboarding, rules: rulesView, "test-lab": testLab, storefront, "shopper-preview": shopperPreviewView, health, activity: activityView, help, plans, settings, privacy };
    return (views[r.page] || overview)();
  }
  function overview() {
    const visibleRules=scenarioRules(), published = visibleRules.filter(x => x.status === "published").length;
    return `${header("Overview", "Create, test, and monitor cart rules from one place.", state.scenario==="New store"?button("Start setup","go-onboarding","primary"):button("Create rule", "new-rule", "primary"))}${scenarioNotice()}
      <section class="kv-summary" aria-label="Workspace summary">${metric("Published", published, "Rules active")}${metric("Drafts", visibleRules.filter(x => x.status === "draft").length, "Not enforced")}${metric("Attention", state.scenario === "Healthy" ? "0" : "1", "Items to review")}${metric("Storefront", state.scenario==="New store"?"Setup":state.storefrontActive ? "Active" : "Setup", "Guidance status")}</section>
      <section class="kv-card kv-setup"><div class="kv-section-heading"><div><h2>Finish setting up KartVantage</h2><p>Complete these steps before launch.</p></div>${badge("3 of 4", "info")}</div><div class="kv-setup-list">${["Create a rule", "Test with sample carts", "Add storefront guidance", "Confirm store health"].map((x, i) => `<article class="kv-setup-item ${i < 3 ? "is-complete" : ""}"><span class="kv-setup-item__mark">${i < 3 ? "✓" : "4"}</span><div><h3>${x}</h3><p>${["Choose a ready-made template.", "Confirm the shopper outcome.", "Add the theme app extension.", "Review launch evidence."][i]}</p></div>${i === 0 ? button("Open", "go-rules", "link") : i === 1 ? button("Open", "go-test", "link") : i === 2 ? button("Configure", "go-storefront", "link") : button("Review", "go-health", "link")}</article>`).join("")}</div></section>
      <section class="kv-grid kv-grid--2 kv-overview-lower"><article class="kv-card"><h2>How it works</h2><ol class="kv-flow"><li><b>Create</b><span>Plain-language cart guardrails</span></li><li><b>Test</b><span>Predictable sample carts</span></li><li><b>Guide</b><span>Theme-safe shopper messaging</span></li><li><b>Enforce</b><span>Shopify Validation has final say</span></li></ol></article><article class="kv-card"><div class="kv-section-heading"><h2>Recent activity</h2>${button("View all", "go-activity", "link")}</div>${renderTimeline(4)}</article></section>`;
  }
  function onboarding() { return `${header("Get started", "A guided first run from intent to verified demonstration.",button("Choose a rule","new-rule","primary"))}${notice("Nothing changes until you choose a simulated action", "This tour uses fictional carts and local browser state.", "info")}<section class="kv-card"><ol class="kv-timeline"><li><span></span><div><strong>1. Choose a guardrail</strong><small>Start from a plain-language template.</small></div></li><li><span></span><div><strong>2. Test sample carts</strong><small>See pass and block explanations before publishing.</small></div></li><li><span></span><div><strong>3. Simulate publication</strong><small>Explore confirmed, uncertain, and failed outcomes safely.</small></div></li><li><span></span><div><strong>4. Add optional guidance</strong><small>Use a theme extension without editing theme code.</small></div></li></ol></section>`; }

  function ruleGallery() {
    const types=DATA.ruleTypes||[];
    const core=types.filter(x=>x.availability==="core"), future=types.filter(x=>x.availability!=="core");
    return `${header("Choose a rule", "Start with the outcome you want. You can review every detail before the simulated publish.",button("Back to rules","go-rules","secondary"))}<section><p class="kv-eyebrow">Core rules · R01–R06</p><div class="kv-grid kv-grid--3">${core.map(t=>`<article class="kv-card"><div class="kv-section-heading"><h2>${esc(t.label)}</h2>${badge(t.code,"success")}</div><p>${esc(t.description)}</p>${button("Configure",`configure-template:${t.id}`,"primary")}</article>`).join("")}</div></section><section class="kv-section"><p class="kv-eyebrow">Controlled and future previews</p><div class="kv-grid kv-grid--2">${future.map(t=>`<article class="kv-card is-muted"><div class="kv-section-heading"><h2>${esc(t.label)}</h2>${badge(t.availability==="controlled"?"Controlled preview":"Unavailable","neutral")}</div><p>${esc(t.description)}</p>${button("Not available in Core","noop","secondary","disabled")}</article>`).join("")}</div></section>`;
  }
  function rulesView() {
    let list = scenarioRules().filter(r => state.ruleFilter === "all" || r.status === state.ruleFilter);
    if (state.search) list = list.filter(r => `${r.name} ${ruleType(r.type)}`.toLowerCase().includes(state.search.toLowerCase()));
    return `${header("Rules", "Create, test, and publish checkout guardrails for your store.", button("New rule", "new-rule", "primary"))}${state.scenario === "Conflict" ? notice("Impossible range detected", "Resolve the effective minimum and maximum before simulated publication.", "warning") : ""}
      <section class="kv-card"><div class="kv-filter"><label class="kv-search">Search rules<input type="search" data-control="rule-search" value="${esc(state.search)}" placeholder="Name or rule type"></label><label>Status<select data-control="rule-filter"><option value="all">All</option>${["published", "draft", "paused", "archived"].map(x => `<option${state.ruleFilter === x ? " selected" : ""}>${x}</option>`).join("")}</select></label>${button("Demo loading", "demo-loading", "quiet")}${button("Demo error", "demo-error", "quiet")}</div>
      ${state.uiState==="loading"?`<div class="kv-empty" role="status"><h2>Loading rules…</h2><p>Demonstrated loading state. No network request is made.</p></div>`:state.uiState==="error"?notice("Rules could not be displayed — demonstration","Your last confirmed setup remains unchanged. Reset the view and try again.","warning"):list.length ? `<div class="kv-rule-list">${list.map(ruleCard).join("")}</div>` : empty(state.scenario==="New store"?"Create your first rule":"No matching rules", state.scenario==="New store"?"Choose a Core template, then test it with a fictional cart.":"Try a different search or create a new rule.", state.scenario==="New store"?button("Choose a rule","new-rule","primary"):button("Clear filters", "clear-rule-filters", "secondary"))}</section>`;
  }
  function ruleCard(r) { const gated=["gated","unavailable"].includes(r.status); return `<article class="kv-rule-card"><div><div class="kv-section-heading"><h2>${esc(r.name)}</h2>${badge(r.status)}</div><p>${esc(ruleType(r.type))} · ${esc(formatRuleValue(r))} · ${esc(r.scope)}</p></div><div class="kv-actions">${gated ? button(r.status === "gated" ? "Controlled preview" : "Not available", "noop", "secondary", "disabled") : `${r.status === "draft" ? button("Publish", `review-publish:${r.id}`, "primary") : button(r.status === "paused" ? "Restore" : "Pause", `toggle-rule:${r.id}`, "secondary")}${button("Edit", `edit-rule:${r.id}`, "dark")}${button("Test", `test-rule:${r.id}`, "secondary")}${button("Archive", `archive-rule:${r.id}`, "danger")}`}</div></article>`; }
  function ruleType(type) { return ({ minAmount: "Minimum order amount", maxAmount: "Maximum order amount", minItems: "Minimum number of items", maxItems: "Maximum number of items", minProduct: "Minimum product quantity", maxProduct: "Product purchase limit", customer: "Customer-specific rule" })[type] || type; }
  function formatRuleValue(r) { return /Amount/.test(r.type) ? money(r.value) : `${r.value} ${Number(r.value) === 1 ? "item" : "items"}`; }

  function ruleBuilder(id, templateType) {
    const existing = state.rules.find(x => x.id === id);
    const templateMap={"minimum-order":"minAmount","maximum-order":"maxAmount","minimum-product-quantity":"minProduct","product-purchase-limit":"maxProduct","minimum-items":"minItems","maximum-items":"maxItems"};
    const r = existing || { id: "", name: "", type: templateMap[templateType]||"minAmount", value: 50, scope: "All carts", message: "Update your cart to continue.", status: "draft" };
    const candidateRules=state.rules.map(x=>x.id===existing?.id?Object.assign({},x,{status:"publishing"}):x);
    if(!existing) candidateRules.push(Object.assign({},normalizeRule(r),{status:"publishing"}));
    const conflicts = findConflicts(candidateRules);
    return `${header(existing ? "Edit rule" : "Create a rule", "Configure, test, and review before anything can be simulated as published.", button("Back to rules", "go-rules", "secondary"))}
      <div class="kv-stepper" aria-label="Rule builder progress"><span class="is-active">1 Configure</span><span>2 Test</span><span>3 Review</span><span>4 Publish</span></div>
      <form class="kv-card kv-form" data-form="rule" data-rule-id="${esc(r.id)}"><p class="kv-simulation-label">SIMULATED RULE — local prototype state only</p>
        <label>Rule name<input name="name" required value="${esc(r.name)}" placeholder="For example, Wholesale minimum"></label>
        <label>Rule type<select name="type">${["minAmount", "maxAmount", "minItems", "maxItems", "minProduct", "maxProduct", "customer"].map(x => `<option value="${x}"${r.type === x ? " selected" : ""}>${esc(ruleType(x))}${x === "customer" ? " — gated preview" : ""}</option>`).join("")}</select></label>
        <label>Amount or quantity<input name="value" required type="number" min="0" step="1" value="${esc(r.value)}"></label>
        <label>Applies to<select name="scope"><option${r.scope === "All carts" ? " selected" : ""}>All carts</option><option${r.scope === "Selected products" ? " selected" : ""}>Selected products</option></select></label>
        <label class="kv-span-2">Shopper message<textarea name="message" rows="3">${esc(r.message)}</textarea><small>Represent your store. KartVantage is not mentioned to shoppers.</small></label>
        ${conflicts.length ? notice("Potential conflict", conflicts[0].message, "warning") : ""}
        <div class="kv-actions kv-span-2">${button("Save draft", "submit-rule", "primary", 'type="submit"')}${button("Test this rule", `builder-test:${r.id || "new"}`, "secondary")}</div>
      </form>`;
  }

  function evaluate(cart, rules) {
    if (![cart.amount,cart.items].every(Number.isFinite) || cart.amount<0 || cart.items<0) return {pass:false,inputError:"Enter a subtotal and item count of zero or more.",errors:[]};
    const errors = [];
    (rules || state.rules.filter(r => r.status !== "archived" && r.status !== "paused")).forEach(r => {
      const value = Number(r.value);
      if (r.type === "minAmount" && cart.amount < value) errors.push(`${r.name}: add ${money(value - cart.amount)} to continue.`);
      if (r.type === "maxAmount" && cart.amount > value) errors.push(`${r.name}: remove ${money(cart.amount - value)} to continue.`);
      if (["minItems", "minProduct"].includes(r.type) && cart.items < value) errors.push(`${r.name}: add ${value - cart.items} more ${value - cart.items === 1 ? "item" : "items"}.`);
      if (["maxItems", "maxProduct"].includes(r.type) && cart.items > value) errors.push(`${r.name}: remove ${cart.items - value} ${cart.items - value === 1 ? "item" : "items"}.`);
    });
    return { pass: errors.length === 0, errors };
  }
  function findConflicts(rules) {
    const active = rules.filter(r => ["published","publishing"].includes(r.status));
    const pairs = [["minAmount", "maxAmount", "order amount"], ["minItems", "maxItems", "item count"]];
    return pairs.flatMap(([minType, maxType, label]) => {
      const mins = active.filter(r => r.type === minType), maxes = active.filter(r => r.type === maxType);
      if (!mins.length || !maxes.length) return [];
      const min = Math.max(...mins.map(r => Number(r.value))), max = Math.min(...maxes.map(r => Number(r.value)));
      return min > max ? [{ label, min, max, message: `Effective ${label} minimum (${min}) is above the effective maximum (${max}).` }] : [];
    });
  }
  function testLab() {
    const amount = Number(state.testAmount ?? 42), items = Number(state.testItems ?? 2);
    const result = evaluate({ amount, items });
    return `${header("Test Lab", "Try fictional carts against the same deterministic evaluator used in rule review.", button("Use passing cart", "passing-cart", "secondary"))}
      <div class="kv-grid kv-grid--2"><form class="kv-card kv-form" data-form="test"><p class="kv-simulation-label">SIMULATED CART</p><h2>Cart fixture</h2><label>Cart subtotal<input name="amount" type="number" min="0" step="1" value="${esc(amount)}" required></label><label>Item count<input name="items" type="number" min="0" step="1" value="${esc(items)}" required></label><div class="kv-actions kv-span-2">${button("Run test", "run-test", "primary", 'type="submit"')}${button("Multiple failures", "failing-cart", "secondary")}</div></form>
      <section class="kv-card kv-outcome" aria-live="polite"><p class="kv-eyebrow">Latest simulated outcome</p><h2>${result.inputError?"Check the cart fixture":result.pass ? "✓ Cart can continue" : `Cart needs ${result.errors.length} ${result.errors.length === 1 ? "change" : "changes"}`}</h2>${result.inputError?`<p class="kv-inline-error" role="alert">${esc(result.inputError)}</p>`:result.pass ? `<p>This fixture meets every applicable rule.</p>` : `<ol>${result.errors.map(e => `<li>${esc(e)}</li>`).join("")}</ol>`}<p><strong>Authority:</strong> Shopify Validation makes the final checkout decision.</p></section></div>`;
  }
  function conflictsView() {
    let found = findConflicts(state.rules);
    if (!found.length && state.scenario === "Conflict") found = [{ label: "order amount", min: 120, max: 90, message: "Effective order amount minimum (120) is above the effective maximum (90)." }];
    return `${header("Resolve conflicts", "Understand the combined effective range; message order changes explanations only.", button("Back to rules", "go-rules", "secondary"))}${found.length ? found.map(c => `<section class="kv-card"><p class="kv-eyebrow">Publication blocker</p><h2>Impossible ${esc(c.label)} range</h2><div class="kv-range"><span>Effective minimum <b>${esc(c.min)}</b></span><span>Effective maximum <b>${esc(c.max)}</b></span></div><p>${esc(c.message)}</p><p>Change or pause one rule. The previous working setup remains active.</p><div class="kv-actions">${button("Review minimum rules", "go-rules", "primary")}${button("Simulate pause", "resolve-conflict", "secondary")}</div></section>`).join("") : empty("No blocking conflicts", "Applicable minimums and maximums have a valid intersection.", button("Return to rules", "go-rules", "primary"))}`;
  }

  function publishPanel(rule) {
    const p = state.publishState;
    const stages = ["requested", "validating", "compiled", "pending", "confirmed"];
    const current = Math.max(0, stages.indexOf(p));
    return `<p class="kv-simulation-label">SIMULATED PUBLISH — no Shopify write occurs</p><p>Publishing <strong>${esc(rule.name)}</strong></p><ol class="kv-publish-steps">${stages.map((x, i) => `<li class="${i <= current ? "is-done" : ""}">${i < current ? "✓" : i + 1} ${esc(x === "pending" ? "Shopify write pending" : x)}</li>`).join("")}</ol><fieldset><legend>Choose deterministic demonstration result</legend><label><input type="radio" name="publish-result" value="confirmed" checked> Confirmed</label><label><input type="radio" name="publish-result" value="uncertain"> Uncertain / reconciling</label><label><input type="radio" name="publish-result" value="failed"> Terminal failure</label></fieldset>${notice("Safety promise", "The previous working setup remains active after an uncertain or failed result.", "info")}`;
  }
  function storefront() {
    const status = state.scenario === "Theme fallback" ? "Supported with fallback" : state.storefrontActive ? "Active" : "Not configured";
    return `${header("Storefront guidance", "Theme-aware, merchant-controlled help before checkout.", button("Preview shopper view", "shopper-preview", "primary"))}${notice("Shopify checkout remains authoritative", "Storefront guidance prepares shoppers; the Shopify Validation Function has final say.", "warning")}
      <div class="kv-grid kv-grid--3"><article class="kv-card"><p class="kv-eyebrow">Compatibility</p><h2>${esc(status)}</h2><p>${state.scenario === "Theme fallback" ? "Use the cart-page app block. This theme drawer is not a stable integration surface." : "Theme app extension is available on the simulated published theme."}</p>${badge("Evidence dated today", "info")}</article><article class="kv-card"><p class="kv-eyebrow">App embed</p><h2>Broad compatibility</h2><p>Loads shared CDN assets only on approved pages.</p>${button(state.storefrontActive ? "Disable simulation" : "Enable simulation", "toggle-storefront", "secondary")}</article><article class="kv-card"><p class="kv-eyebrow">App block</p><h2>Merchant placement</h2><p>Place on JSON cart templates. Cart Offer remains planned and disabled.</p>${badge("No DOM hacks", "success")}</article></div>
      <section class="kv-card"><h2>Appearance and page targeting</h2><div class="kv-form kv-form--inline"><label>Layout<select><option>Calm card</option><option>Compact notice</option></select></label><label>Accent colour<input type="color" value="#96c93d"></label><label><input type="checkbox" checked> Cart page</label><label><input type="checkbox"> Product page</label></div><p class="kv-help">Typed settings only. No custom JavaScript, CSS, or selector input.</p></section>${shopperFrame()}`;
  }
  function shopperPreviewView() { return `${header("Shopper preview", "Review merchant-voice guidance on fictional carts before any theme setup.",button("Back to storefront","go-storefront","secondary"))}${notice("Guidance, not checkout authority", "App blocks and embeds do not render on checkout. Shopify Validation makes the final decision.", "info")}${shopperFrame()}`; }
  function shopperFrame() { const outcome = evaluate({ amount: 42, items: 2 }); return `<section class="kv-card"><div class="kv-section-heading"><div><p class="kv-eyebrow">Shopper preview · simulated</p><h2>Your cart</h2></div><div class="kv-segment"><button data-action="preview-cart">Cart page</button><button data-action="preview-drawer">Cart drawer</button></div></div><div class="kv-store-preview"><div><p>Cart subtotal</p><strong>${money(42)}</strong></div><div class="kv-guide"><strong>${outcome.pass ? "Ready for checkout" : "A quick cart update is needed"}</strong><p>${outcome.errors[0] || "Your cart meets this store’s requirements."}</p><div class="kv-progress"><span class="kv-progress--84"></span></div></div><button type="button" disabled>Checkout preview</button></div><p class="kv-help">Demonstration only. This preview does not render at checkout and cannot authorize checkout.</p></section>`; }
  function health() { const attention = state.scenario !== "Healthy"; return `${header("Store health", "Plain-language checks with traceable simulated evidence.", button("Run checks", "run-health", "primary"))}${attention ? notice("Needs attention", "At least one trust signal is incomplete. This is not labelled healthy.", "warning") : notice("Your store is protected — simulated", "Every demonstrated check has current confirmation evidence.", "success")}<section class="kv-card"><h2>Checks</h2>${[["Shopify Function", attention ? "Needs review" : "Confirmed"], ["Rule synchronization", state.scenario === "Uncertain" ? "Reconciling" : "Current"], ["Storefront guidance", state.scenario === "Theme fallback" ? "Fallback required" : "Active"], ["Authentication", "Valid"]].map(([a,b]) => `<div class="kv-health-row"><span><b>${esc(a)}</b><small>Checked just now · fictional evidence</small></span>${badge(b, /Confirmed|Current|Active|Valid/.test(b) ? "success" : "warning")}</div>`).join("")}</section>`; }
  function renderTimeline(limit) { const entries = state.activity.length ? state.activity : (DATA.activities || [{ time: new Date().toISOString(), text: "Prototype workspace opened", status: "Info" }, { time: new Date(Date.now()-3600000).toISOString(), text: "Rule test passed", status: "Passed" }]); return `<ol class="kv-timeline">${entries.slice(0, limit || 50).map(x => { const stamp=x.time||x.at||new Date().toISOString(); return `<li><span></span><div><strong>${esc(x.text||x.title||"Prototype event")}</strong><small>${new Intl.DateTimeFormat(undefined,{dateStyle:"medium",timeStyle:"short"}).format(new Date(stamp))} · ${esc(x.status||x.actor||"Info")}</small></div></li>`; }).join("")}</ol>`; }
  function activityView() { return `${header("Activity", "A traceable, merchant-readable history of simulated actions.", button("Export evidence", "export-sim", "secondary"))}<section class="kv-card">${renderTimeline()}</section>`; }
  function help() { return `${header("Help & support", "Answers first, with evidence attached when you need a person.")}<div class="kv-grid kv-grid--3">${[["Understand a blocked cart", "See the exact applicable rules and shopper explanation."], ["Storefront setup", "Choose an app embed or merchant-placed app block."], ["Publish status", "Understand confirmed, uncertain, and failed outcomes."]].map(([a,b]) => `<article class="kv-card"><h2>${a}</h2><p>${b}</p>${button("Read guide", "demo-guide", "link")}</article>`).join("")}</div><section class="kv-card"><h2>Contact support</h2><p>A privacy-safe support ID and recent evidence will be included. Customer details and secrets are never exposed.</p>${button("Create simulated case", "create-case", "primary")}</section>`; }
  function plans() { return `${header("Plans", "KartVantage Core is free while future packaging remains unapproved.")}<section class="kv-grid kv-grid--2"><article class="kv-card kv-plan"><p class="kv-eyebrow">Current</p><h2>Core Free</h2><strong>${money(0)}</strong><ul><li>Cart validation rules</li><li>Test Lab</li><li>Theme-safe guidance</li><li>Health evidence</li></ul>${badge("Active simulation", "success")}</article><article class="kv-card kv-plan is-muted"><p class="kv-eyebrow">Hypothesis only</p><h2>Future capabilities</h2><p>Paid prices, limits, and entitlements are not approved and cannot be selected here.</p>${button("Unavailable in prototype", "noop", "secondary", "disabled")}</article></section>`; }
  function settings() { return `${header("Settings", "Store preferences, access, privacy, and controlled data lifecycle.", button("Save preferences", "save-settings", "primary"))}<div class="kv-grid kv-grid--2"><section class="kv-card"><h2>Store preferences</h2><div class="kv-form"><label>Locale<select><option>English (United States)</option><option>English (India)</option></select></label><label>Timezone<select><option>Store timezone</option></select></label><label><input type="checkbox" checked> Email me when a publish needs attention</label></div></section><section class="kv-card"><h2>Privacy & data</h2><p>Prototype records are fictional and kept in this browser session. No Shopify or customer data is stored.</p>${row("Data requests", "Simulation only")}${row("Support identifiers", "Redacted")}${button("Review privacy details", "privacy-details", "secondary")}</section></div><section class="kv-card kv-danger"><h2>Reset prototype data</h2><p>Clears only local session demo changes.</p>${button("Reset demo", "reset-demo", "danger")}</section>`; }
  function privacy() { return `${header("Privacy and data", "Understand what the product would store and how controlled requests are handled.",button("Back to settings","go-settings","secondary"))}${notice("Prototype privacy boundary", "Only fictional demo state is kept in sessionStorage. Closing or resetting the session removes it.", "success")}<div class="kv-grid kv-grid--2"><section class="kv-card"><h2>Merchant controls</h2>${row("Customer data","Not present in prototype")}${row("Shopify tokens","Never exposed")}${row("Support evidence","Redacted identifiers")}${row("Stored custom code","Never allowed")}</section><section class="kv-card"><h2>Lifecycle demonstrations</h2><p>Data access, customer redaction, and shop erasure are visible only as safe workflow previews.</p>${button("View a redacted request","privacy-details","secondary")}</section></div>`; }

  function renderOps(r) {
    const views = { "ops-overview": opsOverview, "ops-merchants": merchants, "ops-support": supportOps, "ops-publishing": publishingOps, "ops-jobs": jobsOps, "ops-incidents": incidentsOps, "ops-releases": releasesOps, "ops-flags": flagsOps, "ops-audit": auditOps, "ops-privacy": privacyOps, "ops-billing": billingOps };
    if (r.page === "merchant-360") return merchant360(r.id);
    if (r.page === "support-case") return supportCase(r.id);
    return (views[r.page] || opsOverview)();
  }
  const merchantsData = () => (DATA.merchants || [{ id:"northstar", name:"Northstar Supply", domain:"northstar-demo.myshopify.com", health:"Healthy", plan:"Core Free", publish:"Confirmed" }, { id:"lumen", name:"Lumen Home", domain:"lumen-demo.myshopify.com", health:"Needs attention", plan:"Core Free", publish:"Uncertain" }, { id:"field", name:"Field & Found", domain:"field-demo.myshopify.com", health:"Theme fallback", plan:"Core Free", publish:"Confirmed" }]).map(m=>Object.assign({},m,{health:String(m.health||"Needs attention").replace(/(^|-)(\w)/g,(_,a,b)=>(a?" ":"")+b.toUpperCase()),publish:m.publish||"Confirmed"}));
  function opsOverview() { return `${header("Operations overview", "Read-first signals for safe, evidence-backed investigation.")}${notice("Internal prototype", "Fictional, redacted data only. No merchant session reuse or direct state mutation.", "info")}<section class="kv-summary">${metric("Merchants", merchantsData().length, "Demo records")}${metric("Needs attention", "1", "Evidence review")}${metric("Publish queue", state.scenario === "Publishing" ? "3" : "0", "Simulated")}${metric("Incidents", state.scenario === "Incident" ? "1" : "0", "Open simulation")}</section><section class="kv-grid kv-grid--2"><article class="kv-card"><h2>Attention queue</h2>${table(["Signal","State","Action"], [["Paper Kite Demo publish","Reconciling",button("Investigate", "merchant:m-uncertain", "link")],["Orchid Cart Demo theme","Fallback",button("Review", "merchant:m-theme", "link")]].map(x=>`<tr>${x.map(v=>`<td>${v}</td>`).join("")}</tr>`))}</article><article class="kv-card"><h2>Safe operating principles</h2><ul><li>Evidence before remedies</li><li>Secrets and customer data stay redacted</li><li>No blind retry or raw database editing</li><li>Every simulated remedy requires confirmation</li></ul></article></section>`; }
  function merchants() { return `${header("Merchants", "Search fictional stores and open a redacted Merchant 360 view.")}<section class="kv-card"><label class="kv-search">Search merchants<input type="search" placeholder="Name or myshopify domain"></label>${table(["Merchant","Health","Publish","Plan",""], merchantsData().map(m=>`<tr><td><strong>${esc(m.name)}</strong><small>${esc(m.domain)}</small></td><td>${badge(m.health, m.health === "Healthy" ? "success":"warning")}</td><td>${esc(m.publish)}</td><td>${esc(m.plan)}</td><td>${button("Open 360",`merchant:${m.id}`,"link")}</td></tr>`))}</section>`; }
  function merchant360(id) { const m=merchantsData().find(x=>x.id===id)||merchantsData()[0]; return `${header(m.name, "Merchant 360 · fictional and redacted", button("Back to merchants","ops-merchants","secondary"))}${notice("No session impersonation", "This evidence view cannot enter the merchant’s authenticated session.", "info")}<section class="kv-summary kv-summary--3">${metric("Health",m.health,"Last checked today")}${metric("Publish",m.publish,"Evidence available")}${metric("Plan",m.plan,"Inspection only")}</section><div class="kv-grid kv-grid--2"><section class="kv-card"><h2>Configuration</h2>${row("Store",m.domain)}${row("Active rules","3")}${row("Theme compatibility",m.health==="Theme fallback"?"Supported with fallback":"Supported")}${row("Support ID",`SUP-${m.id.toUpperCase()}-••41`)}</section><section class="kv-card"><h2>Investigation trail</h2>${renderTimeline(4)}${button("Open publish evidence","ops-publishing","primary")}</section></div><section class="kv-card kv-danger"><h2>Safe remedy simulation</h2><p>No blind retry. Review idempotency and Shopify evidence first.</p>${button("Simulate reconcile","safe-remedy","danger")}</section>`; }
  function supportOps() { const cases=DATA.supportCases||[]; return `${header("Support cases", "Privacy-safe context and evidence-backed resolution.", button("New simulated case","create-case","primary"))}<section class="kv-card">${table(["Case","Subject","State","Owner",""], cases.map(c=>`<tr><td>${esc(c.id)}</td><td>${esc(c.subject)}</td><td>${badge(c.status,"info")}</td><td>${esc(c.owner)}</td><td>${button("Open",`support-case:${c.id}`,"link")}</td></tr>`))}</section>`; }
  function supportCase(id) { const c=(DATA.supportCases||[]).find(x=>x.id===id)||(DATA.supportCases||[])[0]||{id:"case-demo",subject:"Demonstration case",status:"investigating",summary:"Fictional support evidence.",recommendedAction:"Review evidence first."}; const merchant=merchantsData().find(x=>x.id===c.merchantId); return `${header(c.subject,`${c.id} · support case`,button("Back to cases","ops-support","secondary"))}${notice("Redacted investigation", "No customer details, secrets, or merchant-session access are available here.", "info")}<div class="kv-grid kv-grid--2"><section class="kv-card"><h2>Case context</h2>${row("Merchant",merchant?.name||"Demo merchant")}${row("State",c.status)}${row("Owner",c.owner||"Unassigned")}<p>${esc(c.summary)}</p></section><section class="kv-card"><h2>Recommended safe action</h2><p>${esc(c.recommendedAction||"Review evidence before a controlled remedy.")}</p>${button("Review publish evidence","ops-publishing","primary")}</section></div><section class="kv-card"><h2>Resolution evidence</h2><p>Evidence IDs: ${esc((c.evidenceIds||[]).join(", ")||"Not yet attached")}</p>${button("Simulate verified resolution","safe-remedy","secondary")}</section>`; }
  function publishingOps() { return `${header("Publish operations", "Trace requested state to confirmed Shopify evidence without blind retries.")}<section class="kv-card">${table(["Operation","Merchant","Stage","Evidence",""], [["PUB-204","Lumen Home",state.scenario==="Uncertain"?"Reconciling":"Confirmed","Redacted receipt"],["PUB-203","Northstar Supply","Confirmed","Function digest matched"]].map(x=>`<tr><td>${esc(x[0])}</td><td>${esc(x[1])}</td><td>${badge(x[2],x[2]==="Confirmed"?"success":"warning")}</td><td>${esc(x[3])}</td><td>${button("View evidence","evidence","link")}</td></tr>`))}</section>${notice("Previous working setup remains active", "Uncertain or failed operations never display as enforcing.", "warning")}`; }
  function jobsOps() { return `${header("Jobs & webhooks", "Inspect deliveries, idempotency and recovery evidence.")}<section class="kv-card">${table(["Job","Kind","Attempt","State","Next action"], [["JOB-811","Publish reconcile","2 of 5","Scheduled","Wait for evidence"],["JOB-810","Webhook ingest","1 of 5","Completed","None"],["JOB-809","Health check","1 of 5","Rate limited","Controlled backoff"]].map(x=>`<tr>${x.map((v,i)=>`<td>${i===3?badge(v,v==="Completed"?"success":"warning"):esc(v)}</td>`).join("")}</tr>`))}</section>${button("Simulate safe retry review","safe-remedy","secondary")}`; }
  function incidentsOps() { const active=state.scenario==="Incident"; return `${header("Incidents", "Coordinate impact, evidence, mitigations and merchant-safe updates.", active?button("Open incident","open-incident","primary"):"")}${active?`<section class="kv-card"><div class="kv-section-heading"><h2>INC-07 · Delayed publish confirmations</h2>${badge("Investigating","warning")}</div><p>Impact: some simulated operations remain uncertain. Existing confirmed configurations remain active.</p><h3>Timeline</h3>${renderTimeline(5)}</section>`:empty("No open incidents","All demonstrated services are operating normally.")}`; }
  function releasesOps() { return `${header("Releases", "Deployment evidence and controlled rollout history.")}<section class="kv-card">${table(["Release","Environment","State","Evidence"], [["UXP0 prototype","GitHub Pages","Preview","Static, no API calls"],["C1 scaffold","Local test store","Verified","Proof package C1"],["Production","—","Not released","Prototype acceptance required"]].map(x=>`<tr>${x.map((v,i)=>`<td>${i===2?badge(v,"info"):esc(v)}</td>`).join("")}</tr>`))}</section>`; }
  function flagsOps() { return `${header("Feature flags", "Controlled demonstrations; changes affect this browser session only.")}<section class="kv-card"><div class="kv-health-row"><span><b>Theme compatibility evidence</b><small>Merchant-facing readiness</small></span><label class="kv-switch"><input type="checkbox" checked data-action="flag-toggle"> Simulated on</label></div><div class="kv-health-row"><span><b>Cart Offer</b><small>Planned, not a Core upsell feature</small></span>${badge("Locked off","neutral")}</div><div class="kv-health-row"><span><b>Customer-specific rules</b><small>Controlled/gated preview</small></span>${badge("Preview only","info")}</div></section>`; }
  function auditOps() { return `${header("Audit & evidence", "Immutable-style records of fictional prototype actions.", button("Export simulation","export-sim","secondary"))}<section class="kv-card">${renderTimeline()}<p class="kv-help">No secrets, tokens, customer data, or raw request bodies appear in evidence.</p></section>`; }
  function privacyOps() { return `${header("Privacy operations", "Request tracking and controlled lifecycle inspection.")}${notice("Redacted by design", "Prototype records contain no real Shopify or customer data.", "success")}<section class="kv-card">${table(["Request","Merchant","Type","State"], [["PRV-18","Demo merchant","Erase shop","Verified simulation"],["PRV-17","Demo customer","Customer data","Completed simulation"]].map(x=>`<tr>${x.map((v,i)=>`<td>${i===3?badge(v,"success"):esc(v)}</td>`).join("")}</tr>`))}</section>`; }
  function billingOps() { return `${header("Billing inspection", "Read-only plan state. No charges can be created here.")}${notice("Core is currently free", "Prices and paid entitlements remain unapproved hypotheses.", "info")}<section class="kv-card">${table(["Merchant","Plan","Charge state","Action"], merchantsData().map(m=>`<tr><td>${esc(m.name)}</td><td>Core Free</td><td>${badge("No charge","success")}</td><td>Inspection only</td></tr>`))}</section>`; }

  function handleAction(action, target) {
    if (!action || target.disabled) return;
    const [name, id] = action.split(":");
    const routes = { "new-rule":"app/rules/new", "go-onboarding":"app/onboarding", "go-rules":"app/rules", "go-test":"app/test-lab", "go-storefront":"app/storefront", "go-health":"app/health", "go-activity":"app/activity", "go-settings":"app/settings", "ops-merchants":"app/ops/merchants", "ops-support":"app/ops/support", "ops-publishing":"app/ops/publishes" };
    if (routes[name]) return go(routes[name]);
    if (name === "merchant") return go(`app/ops/merchant/${id}`);
    if (name === "toggle-menu") { const shell=root.querySelector(".kv-app-shell"), button=target; const open=shell.dataset.menuOpen!=="true"; shell.dataset.menuOpen=String(open); button.setAttribute("aria-expanded",String(open)); return; }
    if (name === "support-case") return go(`app/ops/support/${id}`);
    if (name === "edit-rule") return go(`app/rules/${id}`);
    if (name === "review-publish") return go(`app/rules/${id}/publish`);
    if (name === "configure-template") return go(`app/rules/new/configure?type=${encodeURIComponent(id)}`);
    if (name === "test-rule" || name === "builder-test") return go("app/test-lab");
    if (name === "close-modal") return closeModal();
    if (name === "clear-rule-filters") { state.search=""; state.ruleFilter="all"; render(); return; }
    if (name === "reset-demo") return modal("Reset prototype?", "<p>This clears only fictional, session-local changes. Shopify and customer data are never touched.</p>", "confirm-reset", "Reset demo");
    if (name === "confirm-reset") { sessionStorage.removeItem("kv-prototype-state"); state=Object.assign({},defaults,{rules:baseRules.map(x=>Object.assign({},x)),activity:[]}); closeModal(); go("app/overview"); render(); toast("Prototype reset. No external data changed."); return; }
    if (name === "publish") { const rule=state.rules.find(x=>x.id===id); const candidate=state.rules.map(x=>x.id===id?Object.assign({},x,{status:"publishing"}):x); if (findConflicts(candidate).length || state.scenario==="Conflict") return go(`app/rules/${id}/conflict`); state.publishState="requested"; modal("Simulate publication",publishPanel(rule),`confirm-publish:${id}`,"Run simulation"); return; }
    if (name === "confirm-publish") { const choice=modalRoot.querySelector('input[name="publish-result"]:checked')?.value||"confirmed"; closeModal(); simulatePublish(id,choice); return; }
    if (name === "toggle-rule") { const r=state.rules.find(x=>x.id===id); r.status=r.status==="paused"?"published":"paused"; activity(`${r.name} ${r.status} — simulated`,"Changed"); render(); toast(`Rule ${r.status} in the demo.`); return; }
    if (name === "archive-rule") return modal("Archive this rule?", "<p>Archived rules stop participating in prototype tests. This cannot affect Shopify.</p>", `confirm-archive:${id}`, "Archive simulation");
    if (name === "confirm-archive") { const r=state.rules.find(x=>x.id===id); r.status="archived"; activity(`${r.name} archived — simulated`); closeModal(); render(); toast("Rule archived in the demo."); return; }
    if (name === "resolve-conflict") { const r=state.rules.find(x=>x.type.startsWith("max")&&x.status!=="archived"); if(r)r.status="paused"; activity("Conflicting maximum paused — simulated","Resolved"); render(); toast("Conflict resolved in the demo."); return; }
    if (name === "toggle-storefront") { state.storefrontActive=!state.storefrontActive; activity(`Storefront guidance ${state.storefrontActive?"enabled":"disabled"} — simulated`); render(); toast("Storefront state changed locally."); return; }
    if (name === "shopper-preview") return go("app/storefront/preview");
    if (name === "passing-cart") { state.testAmount=80; state.testItems=4; render(); return; }
    if (name === "failing-cart") { state.testAmount=10; state.testItems=20; render(); return; }
    if (name === "run-health") { toast("Simulated checks completed. No Shopify call was made."); activity("Health checks completed — simulated","Checked"); render(); return; }
    if (name === "safe-remedy") return modal("Simulate controlled reconciliation?", "<p>This read-first demonstration checks idempotency and evidence. It does not retry a Shopify write or directly change state.</p>", "confirm-remedy", "Run safe simulation");
    if (name === "confirm-remedy") { closeModal(); activity("Controlled reconciliation verified — simulated","Resolved"); toast("Reconciliation evidence verified in the demo."); render(); return; }
    if (name === "privacy-details" && !route().ops) return go("app/settings/privacy");
    if (["evidence","open-case","open-incident","privacy-details"].includes(name)) return modal("Simulation evidence", `<p><strong>Evidence ID:</strong> KV-DEMO-${Date.now().toString().slice(-6)}</p><p>Fictional, redacted and local to this prototype. No secrets or customer data.</p>`, null);
    if (name === "demo-loading") { state.uiState="loading"; render(); setTimeout(()=>{state.uiState="ready";render();toast("Demonstrated rules loaded.","info");},650); return; }
    if (name === "demo-error") { state.uiState=state.uiState==="error"?"ready":"error"; render(); return; }
    if (name === "create-case") { activity("Support case created — simulated","Open"); toast("Simulated support case created."); return; }
    if (name === "save-settings") { activity("Preferences saved — simulated","Saved"); toast("Preferences saved in this browser session."); return; }
    if (name === "export-sim") { toast("Evidence export is demonstrated only; no file was created.","info"); return; }
    if (["demo-guide","preview-cart","preview-drawer","flag-toggle","noop"].includes(name)) toast("This control is intentionally simulated.","info");
  }
  function simulatePublish(id,result) {
    const rule=state.rules.find(x=>x.id===id); if(!rule)return;
    const sequence=["validating","compiled","pending",result]; let i=0;
    state.publishState="requested"; activity(`${rule.name} publish requested — simulated`,"Requested"); render();
    const tick=()=>{ state.publishState=sequence[i++]; persist(); toast(`Simulated publish: ${state.publishState}.`, state.publishState==="failed"?"error":"info"); if(i<sequence.length)setTimeout(tick,420); else { if(result==="confirmed")rule.status="published"; activity(`${rule.name}: ${result} — simulated`, result); render(); if(result!=="confirmed")modal(result==="uncertain"?"Confirmation delayed":"Publication failed",`<p>${result==="uncertain"?"Reconciling evidence. The rule is not active yet.":"The previous working setup remains active."}</p>`,null); }}; tick();
  }

  root.addEventListener("click", e => { const t=e.target.closest("[data-action]"); if(t) handleAction(t.dataset.action,t); });
  modalRoot.addEventListener("click", e => { if(e.target.matches(".kv-modal-backdrop")) closeModal(); const t=e.target.closest("[data-action]"); if(t) handleAction(t.dataset.action,t); });
  document.addEventListener("keydown", e => { if(e.key==="Escape"&&modalRoot.innerHTML)closeModal(); if(e.key==="Tab"&&modalRoot.innerHTML){const focusable=[...modalRoot.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[href],[tabindex]:not([tabindex="-1"])')];if(!focusable.length)return;const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}} });
  root.addEventListener("change", e => {
    const c=e.target.dataset.control;
    if(c==="role"){ state.role=e.target.value; persist(); go(state.role==="Merchant"?"app/overview":"app/ops/overview"); }
    if(c==="scenario"){ state.scenario=e.target.value; persist(); render(); toast(`Scenario changed to ${state.scenario}.`,"info"); }
    if(c==="rule-filter"){ state.ruleFilter=e.target.value; render(); }
  });
  root.addEventListener("input", e => { if(e.target.dataset.control==="rule-search"){ state.search=e.target.value; persist(); clearTimeout(window.__kvSearch); window.__kvSearch=setTimeout(render,120); } });
  root.addEventListener("submit", e => {
    e.preventDefault(); const form=e.target;
    if(form.dataset.form==="test"){ const fd=new FormData(form); state.testAmount=Number(fd.get("amount"));state.testItems=Number(fd.get("items"));activity("Cart fixture tested — simulated","Tested");render();return; }
    if(form.dataset.form==="rule"){ const fd=new FormData(form), id=form.dataset.ruleId||`rule-${Date.now()}`; let r=state.rules.find(x=>x.id===id); if(!r){r={id,status:"draft",priority:state.rules.length*10};state.rules.push(r);} Object.assign(r,{name:String(fd.get("name")).trim()||"Untitled rule",type:fd.get("type"),value:Number(fd.get("value")),scope:fd.get("scope"),message:fd.get("message")});activity(`${r.name} saved as draft — simulated`,"Saved");persist();go("app/rules");toast("Draft saved in this browser session."); }
  });
  window.addEventListener("hashchange", render);
  const params=new URLSearchParams(location.search); state.role=fromParameter(params.get("role"),roles)||state.role; state.scenario=fromParameter(params.get("scenario"),scenarios)||state.scenario;
  if(!location.hash) location.hash=state.role==="Merchant"?"/app/overview":"/app/ops/overview"; else render();
})();
