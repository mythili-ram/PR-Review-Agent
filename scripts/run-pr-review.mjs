#!/usr/bin/env node
/**
 * Runs PR review using gitclaw in non-interactive mode.
 * Reads heuristic results and generates AI-powered review.
 * Usage: node scripts/run-pr-review.mjs [pr.patch] [heuristic-results.json]
 */
import { readFileSync, existsSync, writeFileSync } from "fs";
import { spawn } from "child_process";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const patchFile = process.argv[2] || "pr.patch";
const heuristicFile = process.argv[3] || "heuristic-results.json";

// Load environment variables from .env
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
  console.error("Missing ANTHROPIC_API_KEY. Set via .env or environment variable.");
  process.exit(1);
}

// Read the PR patch and heuristic results
let patchContent = "";
let heuristicResults = {};

if (existsSync(patchFile)) {
  patchContent = readFileSync(patchFile, "utf8");
}

if (existsSync(heuristicFile)) {
  try {
    heuristicResults = JSON.parse(readFileSync(heuristicFile, "utf8"));
  } catch (e) {
    console.error("Failed to parse heuristic results:", e.message);
  }
}

// Construct the prompt
const prompt = [
  "You are the pr-review-agent defined in this repository (SOUL.md, RULES.md, skills/).",
  "",
  "## PR Diff",
  "```",
  patchContent.slice(0, 2000), // First 2000 chars of diff
  patchContent.length > 2000 ? "... (truncated)" : "",
  "```",
  "",
  "## Heuristic Scan Results",
  "```json",
  JSON.stringify(heuristicResults, null, 2).slice(0, 1000),
  "```",
  "",
  "Produce a pull request review with these sections:",
  "1) **Summary of changes** - What was changed and why",
  "2) **Security findings** - List all findings from heuristic scan + any additional insights",
  "3) **Test coverage / risk assessment** - Are there tests? Where are the gaps?",
  "4) **Verdict** - REQUEST_CHANGES or COMMENT or APPROVE with clear justification",
  "",
  "Follow RULES.md: Never approve if there are unresolved critical security issues.",
  "Format as clean Markdown suitable for GitHub PR comments.",
].join("\n");

console.log("[PR Review] Starting AI analysis...");
console.log("[PR Review] Sending prompt to gitclaw...");

// Spawn gitclaw and pipe commands to it
const gitclaw = spawn("npx", ["gitclaw", "-d", root], {
  cwd: root,
  stdio: ["pipe", "pipe", "pipe"],
  env: process.env,
});

let output = "";
let errorOutput = "";

gitclaw.stdout.on("data", (data) => {
  output += data.toString();
});

gitclaw.stderr.on("data", (data) => {
  errorOutput += data.toString();
});

gitclaw.on("close", (code) => {
  // Extract review from output (remove ANSI codes)
  let review = output.replace(/\x1b\[[0-9;]*m/g, "").replace(/\033\[[0-9;]*m/g, "");
  
  // Remove startup messages and get the actual review
  const lines = review.split("\n");
  const reviewStart = lines.findIndex(l => 
    l.includes("Summary") || l.includes("##") || l.includes("Security") || 
    l.includes("Verdict") || l.includes("changes")
  );
  
  if (reviewStart > 0) {
    review = lines.slice(reviewStart).join("\n");
  }
  
  // Handle case where output is mostly startup messages
  if (review.includes("Type /skills") || review.includes("exit")) {
    // gitclaw didn't process the prompt properly
    console.error("[PR Review] Error: gitclaw did not generate proper analysis");
    console.error("[PR Review] Output:", output.slice(0, 500));
    process.exit(1);
  }
  
  // Write review to file
  writeFileSync("REVIEW.md", review);
  console.log("[PR Review] Review written to REVIEW.md");
  process.exit(0);
});

// Send the prompt to gitclaw via stdin
gitclaw.stdin.write(prompt + "\n/quit\n");
gitclaw.stdin.end();

// Timeout after 30 seconds
setTimeout(() => {
  console.error("[PR Review] Timeout: gitclaw did not complete within 30 seconds");
  gitclaw.kill();
  process.exit(1);
}, 30000);
