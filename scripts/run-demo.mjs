#!/usr/bin/env node
/**
 * Loads .env from repo root, then runs gitclaw against this agent with a fixed PR-review prompt.
 * Usage: node scripts/run-demo.mjs
 */
import { readFileSync, existsSync } from "fs";
import { spawn } from "child_process";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const envPath = join(root, ".env");

if (existsSync(envPath)) {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split(/\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    let v = t.slice(eq + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("Missing ANTHROPIC_API_KEY. Copy .env.example to .env and set your key.");
  process.exit(1);
}

const prompt = [
  "You are the pr-review-agent defined in this repository (SOUL.md, RULES.md, skills/).",
  "Read the unified diff in fixtures/sample.patch using your read tool if needed.",
  "Produce a pull request review with these sections:",
  "1) Summary of what changed",
  "2) Security findings (cite rule_id or RULES.md where possible)",
  "3) Test coverage / risk notes",
  "4) Verdict: REQUEST_CHANGES or COMMENT with justification",
  "Follow RULES.md: never approve with unresolved critical security issues.",
].join(" ");

const gitclaw = join(root, "node_modules", "gitclaw", "dist", "index.js");
const child = spawn(process.execPath, [gitclaw, "-d", root, "-p", prompt], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

child.on("exit", (code) => process.exit(code ?? 0));
