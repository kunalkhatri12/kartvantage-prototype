import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const pageUrl = "http://127.0.0.1:3001/";
const debuggingPort = 9223;
const profile = await mkdtemp(join(tmpdir(), "kartvantage-c1-chrome-"));
const child = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  `--remote-debugging-port=${debuggingPort}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

try {
  let target;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/new?${encodeURIComponent(pageUrl)}`, { method: "PUT" });
      if (response.ok) {
        target = await response.json();
        break;
      }
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
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });

  await send("Page.enable");
  for (const viewport of [
    { name: "desktop", width: 1440, height: 1200, mobile: false },
    { name: "mobile", width: 390, height: 844, mobile: true },
  ]) {
    await send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
      screenWidth: viewport.width,
      screenHeight: viewport.height,
    });
    await send("Page.navigate", { url: pageUrl });
    await wait(1000);
    const { data } = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
    await writeFile(new URL(`./ui-${viewport.name}.png`, import.meta.url), Buffer.from(data, "base64"));
  }
  socket.close();
} finally {
  child.kill();
  if (child.exitCode === null) await once(child, "exit");
  await rm(profile, { recursive: true, force: true });
}
