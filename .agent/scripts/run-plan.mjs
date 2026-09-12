import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import process from "node:process";

const scriptDir = dirname(new URL(import.meta.url).pathname.replace(/^\/(?:([A-Za-z]):)/, "$1:"));
const agentDir = resolve(scriptDir, "..");
const config = JSON.parse(readFileSync(resolve(agentDir, "config.json"), "utf8"));
const root = resolve(config.repositoryRoot);
const taskArg = process.argv[2];
const model = process.argv[3];
if (!taskArg || !model) throw new Error("Usage: node .agent/scripts/run-plan.mjs <task-path> <model>");

const taskPath = resolve(root, taskArg);
if (!taskPath.startsWith(resolve(root, ".agent", "tasks"))) throw new Error("Task must be inside .agent/tasks.");
const system = readFileSync(resolve(agentDir, "SYSTEM_PROMPT.md"), "utf8");
const authorityParts = config.authorityFiles.map((relativePath) => {
  const absolutePath = resolve(root, relativePath);
  if (!absolutePath.startsWith(root)) throw new Error(`Authority file escapes repository: ${relativePath}`);
  return `\n\n--- AUTHORITY FILE: ${relativePath} ---\n\n${readFileSync(absolutePath, "utf8")}`;
});
const authority = authorityParts.join("");
const task = readFileSync(taskPath, "utf8");
const tagsResponse = await fetch(`${config.ollamaEndpoint}/api/tags`);
if (!tagsResponse.ok) throw new Error(`Ollama unavailable: ${tagsResponse.status}`);
const tags = await tagsResponse.json();
const installed = tags.models?.find((item) => item.name === model);
if (!installed) throw new Error(`Model is not installed: ${model}`);

const startedAt = new Date();
const runId = startedAt.toISOString().replace(/[:.]/g, "-");
const taskId = taskArg.split(/[\\/]/).pop().replace(/\.md$/i, "");
const runDir = resolve(agentDir, "runs", taskId, runId);
mkdirSync(runDir, { recursive: true });
const manifest = {
  task: taskArg,
  taskSha256: createHash("sha256").update(task).digest("hex"),
  authorityFiles: config.authorityFiles,
  authoritySha256: createHash("sha256").update(authority).digest("hex"),
  model,
  modelDigest: installed.digest,
  mode: "plan-only",
  startedAt: startedAt.toISOString()
};
writeFileSync(resolve(runDir, "manifest.json"), JSON.stringify(manifest, null, 2));

const response = await fetch(`${config.ollamaEndpoint}/api/chat`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({
    model,
    stream: false,
    messages: [
      { role: "system", content: system },
      { role: "user", content: `${authority}\n\n--- ACTIVE TASK ---\n\n${task}` }
    ],
    options: {
      temperature: config.temperature,
      num_ctx: config.defaultContext,
      num_predict: config.defaultOutputTokens
    }
  })
});
if (!response.ok) throw new Error(`Ollama returned ${response.status}: ${await response.text()}`);
const result = await response.json();
const report = result.message?.content || "BLOCKED: model returned no report.";
writeFileSync(resolve(runDir, "report.md"), report);
writeFileSync(resolve(runDir, "summary.json"), JSON.stringify({
  ...manifest,
  completedAt: new Date().toISOString(),
  totalDurationNs: result.total_duration,
  promptTokens: result.prompt_eval_count,
  outputTokens: result.eval_count,
  report: resolve(runDir, "report.md")
}, null, 2));
console.log(JSON.stringify({ status: report.startsWith("BLOCKED:") ? "BLOCKED" : "COMPLETE", task: taskId, model, runDir, promptTokens: result.prompt_eval_count, outputTokens: result.eval_count }, null, 2));
