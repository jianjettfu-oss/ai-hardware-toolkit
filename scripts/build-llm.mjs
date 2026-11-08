#!/usr/bin/env node
// Builds every LLM-facing copy of the toolkit from the topic folders, which are the single source.
//
//   node scripts/build-llm.mjs           write the generated files
//   node scripts/build-llm.mjs --check   exit 1 if any generated file is missing or stale (CI)
//
// Generated (never edit by hand):
//   plugins/ai-hardware-toolkit/skills/<name>/reference/*   copies of the topic files each skill needs
//   cursor-rules/<name>.mdc              SKILL.md instructions + references, inlined for Cursor
//   llm-toolkit/custom-gpt/knowledge.md  all topic files, concatenated
//
// Hand-written: plugins/ai-hardware-toolkit/skills/<name>/SKILL.md (instructions only, no data) and the topic files.
// Still hand-kept, checked by scripts/check-drift.mjs: llm-toolkit/mcp-server/src/index.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");
const REPO = "https://github.com/jianjettfu-oss/ai-hardware-toolkit";
const SKILL_DIR = "plugins/ai-hardware-toolkit/skills";

// skill name -> topic files it carries as references
export const SKILLS = {
  "hardware-dfm-review": ["dfm-checklist/ai-hardware-dfm-checklist.md"],
  "hardware-certification-plan": ["certification-guide/certification-decision-tree.md"],
  "hardware-validation-gates": ["evt-dvt-pvt-checklist/validation-stages.md"],
  "hardware-cost-estimate": [
    "bom-cost-reference/shenzhen-component-pricing.csv",
    "bom-cost-reference/README.md",
    "nre-cost-guide/nre-estimation-framework.md",
  ],
  "shenzhen-supplier-vetting": ["supplier-qualification/supplier-red-flags.md"],
  "ai-design-factory-handoff": ["ai-design-handoff/README.md"],
};

// order of topics in the Custom GPT knowledge file
const KNOWLEDGE = [
  "bom-cost-reference/README.md",
  "bom-cost-reference/shenzhen-component-pricing.csv",
  "dfm-checklist/ai-hardware-dfm-checklist.md",
  "nre-cost-guide/nre-estimation-framework.md",
  "certification-guide/certification-decision-tree.md",
  "evt-dvt-pvt-checklist/validation-stages.md",
  "supplier-qualification/supplier-red-flags.md",
  "ai-design-handoff/README.md",
];

const read = (rel) => readFileSync(join(ROOT, rel), "utf8");
const banner = (src) =>
  `<!-- GENERATED from ${src} by scripts/build-llm.mjs. Edit the source file, then rebuild. -->\n\n`;

// a reference file keeps the source's name, except README.md, which is named after its folder
const refName = (src) => (basename(src) === "README.md" ? `${dirname(src)}.md` : basename(src));

// relative links in a topic file point at sibling folders; in a copy they must be absolute
function absolutize(src, text) {
  const dir = dirname(src);
  return text
    .replace(/\]\(\.\.\/([^)]*)\)/g, `](${REPO}/tree/main/$1)`)
    .replace(/\]\(\.\/([^)]*)\)/g, `](${REPO}/blob/main/${dir}/$1)`);
}

// the file as a skill reference: CSV stays a valid CSV, Markdown gets a banner
function refFile(src) {
  const body = read(src);
  if (src.endsWith(".csv")) return body;
  return banner(src) + absolutize(src, body).trimEnd() + "\n";
}

// the file inlined into a bigger Markdown document
function refBody(src) {
  const body = read(src);
  if (src.endsWith(".csv")) return banner(src) + "```csv\n" + body.trimEnd() + "\n```\n";
  return banner(src) + absolutize(src, body).trimEnd() + "\n";
}

function splitFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("SKILL.md has no frontmatter");
  const fm = Object.fromEntries(
    m[1].split("\n").filter(Boolean).map((l) => {
      const i = l.indexOf(":");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
  );
  return { fm, body: m[2] };
}

const outputs = new Map(); // rel path -> content

for (const [name, sources] of Object.entries(SKILLS)) {
  const skillPath = `${SKILL_DIR}/${name}/SKILL.md`;
  if (!existsSync(join(ROOT, skillPath))) throw new Error(`missing ${skillPath}`);
  const { fm, body } = splitFrontmatter(read(skillPath));
  if (fm.name !== name) throw new Error(`${skillPath}: name "${fm.name}" must equal folder "${name}"`);
  if (!fm.description) throw new Error(`${skillPath}: description is required`);

  for (const src of sources) outputs.set(`${SKILL_DIR}/${name}/reference/${refName(src)}`, refFile(src));

  const inlined = sources
    .map((src) => `\n---\n\n## Reference: ${refName(src)}\n\n${refBody(src)}`)
    .join("");
  const mdcBody = body.replace(/\[reference\/([^\]]+)\]\(reference\/[^)]+\)/g, "the \"Reference: $1\" section below");
  outputs.set(
    `cursor-rules/${name}.mdc`,
    `---\ndescription: ${JSON.stringify(fm.description)}\nglobs:\nalwaysApply: false\n---\n` +
      banner(`${SKILL_DIR}/${name}/SKILL.md + its references`) +
      mdcBody.trimEnd() +
      "\n" +
      inlined,
  );
}

outputs.set(
  "llm-toolkit/custom-gpt/knowledge.md",
  `# AI Hardware Manufacturing Toolkit — knowledge file\n\n` +
    banner(KNOWLEDGE.join(", ")) +
    `Source and updates: ${REPO}\n` +
    KNOWLEDGE.map((src) => `\n---\n\n## Source: ${src}\n\n${refBody(src)}`).join(""),
);

let stale = 0;
for (const [rel, content] of outputs) {
  const abs = join(ROOT, rel);
  const current = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  if (current === content) continue;
  if (CHECK) {
    console.error(`STALE ${rel}`);
    stale++;
    continue;
  }
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, content);
  console.log(`wrote ${rel}`);
}
if (CHECK && stale) {
  console.error(`\n${stale} generated file(s) out of date. Run: node scripts/build-llm.mjs`);
  process.exit(1);
}
console.log(`${outputs.size} generated files ${CHECK ? "up to date" : "in sync"}`);
