import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, resolve } from "node:path";

const scriptDir = dirname(new URL(import.meta.url).pathname.replace(/^\/(?:([A-Za-z]):)/, "$1:"));
const runsRoot = resolve(scriptDir, "..", "runs");
if (!existsSync(runsRoot)) {
  console.log(JSON.stringify({ state: "IDLE", runs: [] }, null, 2));
  process.exit(0);
}
const runs = [];
for (const task of readdirSync(runsRoot)) {
  const taskDir = resolve(runsRoot, task);
  if (!statSync(taskDir).isDirectory()) continue;
  const latest = readdirSync(taskDir).map((name) => resolve(taskDir, name)).filter((path) => statSync(path).isDirectory()).sort().at(-1);
  const summary = latest && resolve(latest, "summary.json");
  const manifest = latest && resolve(latest, "manifest.json");
  runs.push(existsSync(summary) ? JSON.parse(readFileSync(summary, "utf8")) : { task, state: "RUNNING", runDir: latest, manifest: existsSync(manifest) ? JSON.parse(readFileSync(manifest, "utf8")) : null });
}
console.log(JSON.stringify({ state: runs.some((run) => run.state === "RUNNING") ? "RUNNING" : "IDLE", runs }, null, 2));

