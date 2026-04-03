/**
 * Structural checks for gitagent layout (works when `gitagent validate` CLI fails to load).
 */
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
let failed = false;

function need(p, label) {
  const ok = existsSync(join(root, p));
  if (!ok) {
    console.error(`Missing ${label}: ${p}`);
    failed = true;
  }
  return ok;
}

["agent.yaml", "SOUL.md", "RULES.md", "README.md", "LICENSE"].forEach((f) => need(f, "required file"));

const agentYaml = readFileSync(join(root, "agent.yaml"), "utf8");
const skillNames = [];
const skillsSection = agentYaml.match(/skills:\s*\n([\s\S]*?)(?=\ntools:|\nruntime:|\n[a-z_]+:)/);
const block = skillsSection ? skillsSection[1] : "";
for (const line of block.split("\n")) {
  const m = /^\s*-\s+([a-z0-9-]+)\s*$/.exec(line);
  if (m) skillNames.push(m[1]);
}

if (skillNames.length === 0) {
  console.error("Could not parse skills: from agent.yaml (or list empty)");
  failed = true;
} else {
  for (const s of skillNames) {
    const p = join("skills", s, "SKILL.md");
    need(p, `skill "${s}"`);
  }
}

const toolNames = [];
const toolsBlock = agentYaml.match(/tools:\s*\n([\s\S]*?)(?=\nruntime:|\n[a-z_]+:|\n*$)/);
if (toolsBlock) {
  for (const line of toolsBlock[1].split("\n")) {
    const m = /^\s*-\s+([a-z0-9-]+)\s*$/.exec(line);
    if (m) toolNames.push(m[1]);
  }
}
for (const t of toolNames) {
  need(join("tools", `${t}.yaml`), `tool "${t}"`);
}

if (failed) {
  console.error("\nvalidate-structure: FAILED");
  process.exit(1);
}
console.log("validate-structure: OK");
console.log("  skills:", skillNames.join(", "));
console.log("  tools:", toolNames.join(", "));
