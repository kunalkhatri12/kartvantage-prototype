import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, resolve } from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const base = "http://127.0.0.1:4175/";
const port = 9225;
const output = new URL("./approval-browser-validation.json", import.meta.url);
const docsRoot = resolve(new URL("../../docs/", import.meta.url).pathname.replace(/^\/(?:([A-Za-z]):)/, "$1:"));
const profile = await mkdtemp(join(tmpdir(), "kartvantage-approval-qa-"));
const mime = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".png": "image/png" };
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, base).pathname);
    const candidate = resolve(docsRoot, pathname === "/" ? "index.html" : `.${pathname}`);
    if (!candidate.startsWith(docsRoot)) throw new Error("Path outside prototype root.");
    response.writeHead(200, { "content-type": mime[extname(candidate)] || "application/octet-stream", "cache-control": "no-store" });
    response.end(await readFile(candidate));
  } catch { response.writeHead(404); response.end("Not found"); }
});
await new Promise((done) => server.listen(4175, "127.0.0.1", done));

const child = spawn(chrome, ["--headless=old", "--disable-gpu", "--no-sandbox", "--remote-allow-origins=*", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const wait = (ms) => new Promise((done) => setTimeout(done, ms));

try {
  let target;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(base)}`, { method: "PUT" });
      if (response.ok) { target = await response.json(); break; }
    } catch {}
    await wait(100);
  }
  if (!target?.webSocketDebuggerUrl) throw new Error("Chrome target unavailable.");
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((done, reject) => { socket.addEventListener("open", done, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let id = 0;
  const pending = new Map();
  const consoleProblems = [];
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.method === "Runtime.exceptionThrown") consoleProblems.push(message.params.exceptionDetails?.text || "Runtime exception");
    if (message.method === "Log.entryAdded" && ["warning", "error"].includes(message.params.entry?.level)) consoleProblems.push(message.params.entry.text);
    if (!message.id || !pending.has(message.id)) return;
    const handlers = pending.get(message.id); pending.delete(message.id);
    message.error ? handlers.reject(new Error(message.error.message)) : handlers.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolveSend, reject) => { const callId = ++id; pending.set(callId, { resolve: resolveSend, reject }); socket.send(JSON.stringify({ id: callId, method, params })); });
  const value = async (expression) => {
    const result = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text || "Evaluation failed.");
    return result.result.value;
  };
  const navigate = async (path, width = 1280, height = 900) => {
    await send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600, screenWidth: width, screenHeight: height });
    await send("Page.navigate", { url: `${base}${path}` });
    await wait(600);
  };
  await send("Page.enable"); await send("Runtime.enable"); await send("Log.enable");
  const checks = [];
  const record = (name, facts, pass) => { if (!pass) throw new Error(`${name} failed: ${JSON.stringify(facts)}`); checks.push({ name, status: "PASS", facts }); };

  await navigate("?role=merchant&scenario=healthy#/app/rules/r02/test");
  const deepLink = await value(`({heading:document.querySelector('h1')?.textContent,role:new URL(location.href).searchParams.get('role'),scenario:new URL(location.href).searchParams.get('scenario')})`);
  record("deep-link", deepLink, deepLink.heading === "Test saved draft" && deepLink.role === "merchant" && deepLink.scenario === "healthy");

  const persistence = await value(`(async()=>{const role=document.querySelector('[data-control="role"]');role.value='Operations';role.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,100));const scenario=document.querySelector('[data-control="scenario"]');scenario.value='Incident';scenario.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,100));return {url:location.href,heading:document.querySelector('h1')?.textContent}})()`);
  record("role-scenario-url-sync", persistence, /role=operations/.test(persistence.url) && /scenario=incident/.test(persistence.url) && persistence.heading === "Operations overview");
  await send("Page.reload", { ignoreCache: true }); await wait(500);
  const refreshed = await value(`({role:document.querySelector('[data-control="role"]')?.value,scenario:document.querySelector('[data-control="scenario"]')?.value,heading:document.querySelector('h1')?.textContent})`);
  record("refresh-persistence", refreshed, refreshed.role === "Operations" && refreshed.scenario === "Incident" && refreshed.heading === "Operations overview");

  await navigate("?role=merchant&scenario=healthy#/app/overview");
  const focus = await value(`(()=>{const trigger=document.querySelector('[data-action="reset-demo"]');trigger.focus();trigger.click();const opened={dialogFocused:document.activeElement?.matches('[role="dialog"]'),labelled:Boolean(document.querySelector('[role="dialog"][aria-modal="true"][aria-labelledby="kv-modal-title"]'))};document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return {...opened,restored:document.activeElement===trigger,closed:!document.querySelector('[role="dialog"]')}})()`);
  record("modal-focus-restoration", focus, focus.dialogFocused && focus.labelled && focus.restored && focus.closed);
  const trap = await value(`(()=>{document.querySelector('[data-action="reset-demo"]').click();const buttons=[...document.querySelectorAll('#kv-modal button')];buttons.at(-1).focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));const forward=document.activeElement===buttons[0];buttons[0].focus();document.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));const backward=document.activeElement===buttons.at(-1);document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));return {forward,backward}})()`);
  record("modal-focus-trap", trap, trap.forward && trap.backward);

  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  const motion = await value(`(()=>{const el=document.querySelector('.kv-button');const s=getComputedStyle(el);return {matches:matchMedia('(prefers-reduced-motion: reduce)').matches,transition:s.transitionDuration,animation:s.animationDuration}})()`);
  record("reduced-motion", motion, motion.matches && ["0.00001s", "0.01ms", "1e-05s"].includes(motion.transition));
  await send("Emulation.setEmulatedMedia", { features: [] });

  await navigate("?role=merchant&scenario=theme-fallback#/app/storefront", 640, 450);
  const reflow = await value(`(()=>{const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'};const controls=[...document.querySelectorAll('button,input,select,textarea')].filter(visible);return {overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,heading:document.querySelector('h1')?.textContent,small:controls.filter(e=>e.getBoundingClientRect().height<32).length}})()`);
  record("two-hundred-percent-reflow-proxy", reflow, !reflow.overflow && reflow.heading === "Storefront guidance" && reflow.small === 0);

  await navigate("?role=merchant&scenario=uncertain#/app/rules/new/configure?type=minimum-order");
  await value(`(()=>{sessionStorage.removeItem('kv-prototype-state');location.reload();return true})()`); await wait(500);
  await value(`(()=>{const f=document.querySelector('[data-form="rule"]');f.elements.name.value='Approval uncertainty';f.elements.value.value='75';f.requestSubmit();return true})()`); await wait(250);
  const ruleId = await value(`JSON.parse(sessionStorage.getItem('kv-prototype-state')).rules.find(x=>x.name==='Approval uncertainty').id`);
  await value(`document.querySelector('[data-action="run-rule-suite:${ruleId}"]').click()`); await wait(150);
  await value(`document.querySelector('[data-action="review-rule:${ruleId}"]').click()`); await wait(150);
  await value(`document.querySelector('[data-action="review-publish:${ruleId}"]').click()`); await wait(150);
  await value(`document.querySelector('[data-action="publish:${ruleId}"]').click()`); await wait(150);
  const selectedOutcome = await value(`(()=>{const option=document.querySelector('input[name="publish-result"][value="uncertain"]');option.checked=true;const modal=document.querySelector('#kv-modal');modal.dataset.publishResult=option.value;return {checked:option.checked,selected:document.querySelector('input[name="publish-result"]:checked')?.value,stored:modal.dataset.publishResult,dialog:Boolean(document.querySelector('[role="dialog"]'))}})()`);
  record("uncertain-outcome-selection", selectedOutcome, selectedOutcome.checked && selectedOutcome.selected === "uncertain" && selectedOutcome.stored === "uncertain" && selectedOutcome.dialog);
  await value(`document.querySelector('[data-action="confirm-publish:${ruleId}"]').click()`); await wait(100);
  const publishStarted = await value(`(()=>{const s=JSON.parse(sessionStorage.getItem('kv-prototype-state'));return {publishState:s.publishState,dialog:Boolean(document.querySelector('[role="dialog"]')),activity:s.activity?.[0]?.text}})()`);
  record("uncertain-publication-started", publishStarted, ["validating", "compiled"].includes(publishStarted.publishState) && !publishStarted.dialog);
  await wait(1800);
  const uncertain = await value(`(()=>{const s=JSON.parse(sessionStorage.getItem('kv-prototype-state'));const r=s.rules.find(x=>x.id==='${ruleId}');return {ruleStatus:r.status,publishState:s.publishState,heading:document.querySelector('[role="dialog"] h2')?.textContent,copy:document.querySelector('[role="dialog"]')?.textContent}})()`);
  record("uncertain-publication", { selectedOutcome, publishStarted, ...uncertain }, uncertain.ruleStatus === "draft" && uncertain.publishState === "uncertain" && uncertain.heading === "Confirmation delayed" && /not active yet/i.test(uncertain.copy));

  record("console", { problems: consoleProblems }, consoleProblems.length === 0);
  const result = { checkedAt: new Date().toISOString(), base, checks, consoleProblems };
  await writeFile(output, `${JSON.stringify(result, null, 2)}\n`);
  socket.close();
  console.log(JSON.stringify({ status: "PASS", checks: checks.length, consoleProblems: 0 }, null, 2));
} finally {
  await new Promise((done) => server.close(done));
  child.kill();
  if (child.exitCode === null) await once(child, "exit");
  await rm(profile, { recursive: true, force: true });
}
