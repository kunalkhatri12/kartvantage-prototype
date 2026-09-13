import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = "http://127.0.0.1:4174/";
const debuggingPort = 9224;
const outputDir = new URL("./", import.meta.url);
const docsRoot = resolve(new URL("../../docs/", import.meta.url).pathname.replace(/^\/(?:([A-Za-z]):)/, "$1:"));
const profile = await mkdtemp(join(tmpdir(), "kartvantage-uxp0-chrome-"));
await mkdir(outputDir, { recursive: true });
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png" };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, base).pathname);
    const candidate = resolve(docsRoot, pathname === "/" ? "index.html" : `.${pathname}`);
    if (!candidate.startsWith(docsRoot)) throw new Error("Path outside prototype root.");
    response.writeHead(200, { "content-type": mime[extname(candidate)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(await readFile(candidate));
  } catch {
    response.writeHead(404); response.end("Not found");
  }
});
await new Promise((resolveListen) => server.listen(4174, "127.0.0.1", resolveListen));

const child = spawn(chrome, [
  "--headless=old", "--disable-gpu", "--disable-software-rasterizer", "--no-sandbox", "--hide-scrollbars",
  "--remote-allow-origins=*",
  `--remote-debugging-port=${debuggingPort}`, `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

try {
  let target;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/new?${encodeURIComponent(base)}`, { method: "PUT" });
      if (response.ok) { target = await response.json(); break; }
    } catch {}
    await wait(100);
  }
  if (!target?.webSocketDebuggerUrl) throw new Error("Chrome DevTools target did not become available.");

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  let nextId = 0;
  const pending = new Map();
  const consoleProblems = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") consoleProblems.push(message.params.exceptionDetails?.text || "Runtime exception");
    if (message.method === "Log.entryAdded" && ["error", "warning"].includes(message.params.entry?.level)) consoleProblems.push(message.params.entry.text);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }));
  });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");
  const evaluateValue = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Browser evaluation failed.");
    return result.result.value;
  };

  const cases = [
    { name: "merchant-overview-phone-small", width: 320, height: 568, path: "?role=merchant&scenario=healthy#/app/overview", heading: "Overview", screenshot: true },
    { name: "merchant-rules-phone", width: 360, height: 800, path: "?role=merchant&scenario=conflict#/app/rules", heading: "Rules" },
    { name: "merchant-rules-mobile", width: 390, height: 844, path: "?role=merchant&scenario=conflict#/app/rules", heading: "Rules", screenshot: true },
    { name: "rule-configure-mobile", width: 390, height: 844, path: "?role=merchant&scenario=healthy#/app/rules/new/configure?type=minimum-product-quantity", heading: "Configure rule", screenshot: true },
    { name: "storefront-phone-large", width: 430, height: 932, path: "?role=merchant&scenario=theme-fallback#/app/storefront", heading: "Storefront guidance" },
    { name: "merchant-overview-tablet-portrait", width: 768, height: 1024, path: "?role=merchant&scenario=healthy#/app/overview", heading: "Overview", screenshot: true },
    { name: "storefront-tablet-modern", width: 820, height: 1180, path: "?role=merchant&scenario=theme-fallback#/app/storefront", heading: "Storefront guidance" },
    { name: "operations-tablet-landscape", width: 1024, height: 768, path: "?role=operations&scenario=incident#/app/ops/overview", heading: "Operations overview", screenshot: true },
    { name: "merchant-rules-laptop", width: 1280, height: 800, path: "?role=merchant&scenario=conflict#/app/rules", heading: "Rules" },
    { name: "rule-test-desktop", width: 1280, height: 900, path: "?role=merchant&scenario=healthy#/app/rules/r02/test", heading: "Test saved draft", screenshot: true },
    { name: "rule-review-desktop", width: 1280, height: 900, path: "?role=merchant&scenario=healthy#/app/rules/r02/review", heading: "Review rule", screenshot: true },
    { name: "merchant-overview-desktop", width: 1440, height: 1100, path: "?role=merchant&scenario=healthy#/app/overview", heading: "Overview", screenshot: true },
    { name: "storefront-fallback-desktop", width: 1440, height: 1100, path: "?role=merchant&scenario=theme-fallback#/app/storefront", heading: "Storefront guidance", screenshot: true },
    { name: "merchant-overview-wide", width: 1920, height: 1080, path: "?role=merchant&scenario=healthy#/app/overview", heading: "Overview", screenshot: true },
    { name: "operations-incident-desktop", width: 1440, height: 1100, path: "?role=operations&scenario=incident#/app/ops/overview", heading: "Operations overview", screenshot: true },
    { name: "operations-ultrawide", width: 2560, height: 1440, path: "?role=operations&scenario=incident#/app/ops/overview", heading: "Operations overview", screenshot: true },
  ];
  const results = [];
  for (const item of cases) {
    await send("Emulation.setDeviceMetricsOverride", { width: item.width, height: item.height, deviceScaleFactor: 1, mobile: item.width < 600, screenWidth: item.width, screenHeight: item.height });
    await send("Page.navigate", { url: `${base}${item.path}` });
    await wait(900);
    const evaluation = await send("Runtime.evaluate", { expression: `JSON.stringify((()=>{const visible=e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};const controls=[...document.querySelectorAll('button,input,select,textarea')].filter(visible);const targetHeight=e=>['checkbox','radio'].includes(e.type)?Math.max(e.getBoundingClientRect().height,e.closest('label')?.getBoundingClientRect().height||0):e.getBoundingClientRect().height;const main=document.querySelector('#kv-main'),heading=document.querySelector('h1');return {title:document.title,heading:heading?.textContent,prototype:document.body.innerText.includes('Prototype mode')&&document.body.innerText.includes('No Shopify or customer data is changed'),external:[...performance.getEntriesByType('resource')].map(x=>x.name).filter(x=>!x.startsWith(location.origin)),horizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,logoLoaded:Boolean(document.querySelector('.kv-brand__logo')?.complete&&document.querySelector('.kv-brand__logo')?.naturalWidth),mainWithinViewport:Boolean(main&&main.getBoundingClientRect().right<=innerWidth+1),headingVisible:Boolean(heading&&visible(heading)),undersizedControls:controls.filter(e=>targetHeight(e)<32).map(e=>e.textContent||e.getAttribute('aria-label')||e.tagName).slice(0,5)}})())`, returnByValue: true });
    const facts = JSON.parse(evaluation.result.value);
    if (facts.heading !== item.heading || !facts.prototype || facts.external.length || facts.horizontalOverflow || !facts.logoLoaded || !facts.mainWithinViewport || !facts.headingVisible || facts.undersizedControls.length) throw new Error(`${item.name} failed: ${JSON.stringify(facts)}`);
    if (item.screenshot) {
      const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: true });
      await writeFile(new URL(`./${item.name}.png`, import.meta.url), Buffer.from(screenshot.data, "base64"));
    }
    results.push({ ...item, ...facts, status: "PASS" });
  }

  await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false, screenWidth: 1280, screenHeight: 900 });
  await send("Page.navigate", { url: `${base}?role=merchant&scenario=healthy#/app/rules/new/configure?type=minimum-order` });
  await wait(700);
  await evaluateValue(`(()=>{sessionStorage.removeItem('kv-prototype-state');location.reload();return true})()`);
  await wait(700);
  const createdRule = await evaluateValue(`(()=>{const form=document.querySelector('[data-form="rule"]');form.elements.name.value='QA minimum order';form.elements.value.value='75';form.requestSubmit();return true})()`);
  if (!createdRule) throw new Error("Could not submit the configured rule.");
  await wait(500);
  const savedDraft = await evaluateValue(`(()=>{const saved=JSON.parse(sessionStorage.getItem('kv-prototype-state'));const rule=saved.rules.find(x=>x.name==='QA minimum order');return {hash:location.hash,heading:document.querySelector('h1')?.textContent,id:rule?.id,status:rule?.status,scope:rule?.scope}})()`);
  if (!savedDraft.id || savedDraft.heading !== "Test saved draft" || !savedDraft.hash.endsWith(`/${savedDraft.id}/test`) || savedDraft.status !== "draft" || savedDraft.scope !== "All eligible products") throw new Error(`Saved-draft continuity failed: ${JSON.stringify(savedDraft)}`);
  await evaluateValue(`document.querySelector('[data-action="run-rule-suite:${savedDraft.id}"]').click()`);
  await wait(300);
  const testEvidence = await evaluateValue(`(()=>{const saved=JSON.parse(sessionStorage.getItem('kv-prototype-state'));const rule=saved.rules.find(x=>x.id==='${savedDraft.id}');return {passed:rule.testEvidence?.passed,cases:rule.testEvidence?.cases?.length,continueVisible:Boolean(document.querySelector('[data-action="review-rule:${savedDraft.id}"]'))}})()`);
  if (!testEvidence.passed || testEvidence.cases !== 3 || !testEvidence.continueVisible) throw new Error(`Three-case evidence failed: ${JSON.stringify(testEvidence)}`);
  await evaluateValue(`document.querySelector('[data-action="review-rule:${savedDraft.id}"]').click()`);
  await wait(300);
  const reviewed = await evaluateValue(`({heading:document.querySelector('h1')?.textContent,summary:document.body.innerText.includes('QA minimum order')&&document.body.innerText.includes('Test suite passed'),publishVisible:Boolean(document.querySelector('[data-action="review-publish:${savedDraft.id}"]'))})`);
  if (reviewed.heading !== "Review rule" || !reviewed.summary || !reviewed.publishVisible) throw new Error(`Review continuity failed: ${JSON.stringify(reviewed)}`);
  await evaluateValue(`document.querySelector('[data-action="review-publish:${savedDraft.id}"]').click()`);
  await wait(300);
  const publishReady = await evaluateValue(`({heading:document.querySelector('h1')?.textContent,enabled:!document.querySelector('[data-action="publish:${savedDraft.id}"]')?.disabled})`);
  if (publishReady.heading !== "Publish rule" || !publishReady.enabled) throw new Error(`Publish gate failed: ${JSON.stringify(publishReady)}`);
  await evaluateValue(`document.querySelector('[data-action="publish:${savedDraft.id}"]').click()`);
  await wait(200);
  await evaluateValue(`document.querySelector('[data-action="confirm-publish:${savedDraft.id}"]').click()`);
  await wait(1900);
  const published = await evaluateValue(`(()=>{const saved=JSON.parse(sessionStorage.getItem('kv-prototype-state'));const rule=saved.rules.find(x=>x.id==='${savedDraft.id}');return {status:rule.status,publishState:saved.publishState,activity:saved.activity.some(x=>x.text.includes('QA minimum order: confirmed'))}})()`);
  if (published.status !== "published" || published.publishState !== "confirmed" || !published.activity) throw new Error(`Publication simulation failed: ${JSON.stringify(published)}`);
  results.push({ name: "rule-journey-interaction", status: "PASS", stages: ["configure", "saved-draft-test", "review", "publish"], evidenceCases: 3 });

  await send("Page.navigate", { url: `${base}?role=merchant&scenario=healthy#/app/rules/new/configure?type=minimum-product-quantity` });
  await wait(500);
  await evaluateValue(`(()=>{const form=document.querySelector('[data-form="rule"]');form.elements.name.value='QA product minimum';form.elements.value.value='3';form.requestSubmit();return true})()`);
  await wait(200);
  const resourceRequired = await evaluateValue(`({heading:document.querySelector('h1')?.textContent,blocked:location.hash.includes('/new/configure'),error:document.querySelector('#kv-toast')?.textContent.includes('Select at least one product or collection')})`);
  if (resourceRequired.heading !== "Configure rule" || !resourceRequired.blocked || !resourceRequired.error) throw new Error(`Product-resource validation failed: ${JSON.stringify(resourceRequired)}`);
  results.push({ name: "product-resource-required", status: "PASS" });
  if (consoleProblems.length) throw new Error(`Console problems: ${consoleProblems.join(" | ")}`);
  await writeFile(new URL("./browser-validation.json", import.meta.url), `${JSON.stringify({ checkedAt: new Date().toISOString(), base, cases: results, consoleProblems }, null, 2)}\n`);
  socket.close();
  console.log(JSON.stringify({ status: "PASS", cases: results.length, consoleProblems: 0 }, null, 2));
} finally {
  await new Promise((resolveClose) => server.close(resolveClose));
  child.kill();
  if (child.exitCode === null) await once(child, "exit");
  await rm(profile, { recursive: true, force: true });
}
