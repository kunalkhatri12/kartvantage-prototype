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

  const cases = [
    { name: "merchant-overview-desktop", width: 1440, height: 1100, path: "?role=merchant&scenario=healthy#/app/overview", heading: "Overview" },
    { name: "merchant-rules-mobile", width: 390, height: 844, path: "?role=merchant&scenario=conflict#/app/rules", heading: "Rules" },
    { name: "storefront-fallback-desktop", width: 1440, height: 1100, path: "?role=merchant&scenario=theme-fallback#/app/storefront", heading: "Storefront guidance" },
    { name: "operations-incident-desktop", width: 1440, height: 1100, path: "?role=operations&scenario=incident#/app/ops/overview", heading: "Operations overview" },
  ];
  const results = [];
  for (const item of cases) {
    await send("Emulation.setDeviceMetricsOverride", { width: item.width, height: item.height, deviceScaleFactor: 1, mobile: item.width < 600, screenWidth: item.width, screenHeight: item.height });
    await send("Page.navigate", { url: `${base}${item.path}` });
    await wait(900);
    const evaluation = await send("Runtime.evaluate", { expression: `JSON.stringify({title:document.title,heading:document.querySelector('h1')?.textContent,prototype:document.body.innerText.includes('Prototype mode')&&document.body.innerText.includes('No Shopify or customer data is changed'),external:[...performance.getEntriesByType('resource')].map(x=>x.name).filter(x=>!x.startsWith(location.origin)),horizontalOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth+1,logoLoaded:Boolean(document.querySelector('.kv-brand__logo')?.complete&&document.querySelector('.kv-brand__logo')?.naturalWidth)})`, returnByValue: true });
    const facts = JSON.parse(evaluation.result.value);
    if (facts.heading !== item.heading || !facts.prototype || facts.external.length || facts.horizontalOverflow || !facts.logoLoaded) throw new Error(`${item.name} failed: ${JSON.stringify(facts)}`);
    const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: true });
    await writeFile(new URL(`./${item.name}.png`, import.meta.url), Buffer.from(screenshot.data, "base64"));
    results.push({ ...item, ...facts, status: "PASS" });
  }
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
