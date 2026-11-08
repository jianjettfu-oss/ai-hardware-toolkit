#!/usr/bin/env node
// Checks the hand-kept data copies against the topic files (the single source).
//
//   node scripts/check-drift.mjs                    MCP server data
//   node scripts/check-drift.mjs --site ../breeze   also the breezehw.com tool data
//
// Compares: component prices (CSV), DFM item count, certification cost and timeline,
// supplier red-flag count. Exit 1 on any mismatch, with one line per mismatch.

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(p, "utf8");
const problems = [];
let compared = 0;
const say = (msg) => problems.push(msg);

// ---- single source -------------------------------------------------------
function parseCsv(text) {
  const rows = [];
  for (const line of text.trim().split("\n").slice(1)) {
    const cells = [];
    let cur = "", q = false;
    for (const ch of line) {
      if (ch === '"') q = !q;
      else if (ch === "," && !q) { cells.push(cur); cur = ""; }
      else cur += ch;
    }
    cells.push(cur);
    rows.push({ category: cells[0], component: cells[1], low: +cells[3], mid: +cells[4], high: +cells[5] });
  }
  return rows;
}
const prices = parseCsv(read(join(ROOT, "bom-cost-reference/shenzhen-component-pricing.csv")));
const dfmCount = (read(join(ROOT, "dfm-checklist/ai-hardware-dfm-checklist.md")).match(/^### \[/gm) || []).length;
const certMd = read(join(ROOT, "certification-guide/certification-decision-tree.md"));
const certs = {};
for (const m of certMd.matchAll(/^### (.+?) \(([^)]*)\)\n([\s\S]*?)(?=^### |^## )/gm)) {
  const timeline = m[3].match(/\*\*Timeline:\*\*\s*([^\n]+?)\s*$/m)?.[1];
  const cost = m[3].match(/\*\*Cost:\*\*\s*\$([\d,]+)\s*-\s*\$?([\d,]+)/);
  certs[m[1].trim()] = {
    timeline,
    low: cost ? +cost[1].replace(/,/g, "") : undefined,
    high: cost ? +cost[2].replace(/,/g, "") : undefined,
  };
}
const flagMd = read(join(ROOT, "supplier-qualification/supplier-red-flags.md"));
const flagCount = (flagMd.split(/^## Green Flags/m)[0].match(/^\|\s*\d+\s*\|\s*\*\*/gm) || []).length;

const near = (a, b) => Math.abs(a - b) < 1e-9;
// names differ only in typography between copies: 0.96" vs 0.96in, en dash vs hyphen, × vs x, ² vs 2
const norm = (s) =>
  s.toLowerCase().replace(/"/g, "in").replace(/\u2013/g, "-").replace(/\u00d7/g, "x").replace(/\u00b2/g, "2").replace(/,/g, "").trim();
function comparePrices(label, items) {
  for (const row of prices) {
    const hit = items.find((it) => norm(it.name).startsWith(norm(row.component)));
    if (!hit) continue; // a copy may carry a subset
    compared++;
    if (!near(hit.low, row.low) || !near(hit.mid, row.mid) || !near(hit.high, row.high))
      say(`${label}: ${row.component} ${hit.low}/${hit.mid}/${hit.high} ≠ CSV ${row.low}/${row.mid}/${row.high}`);
  }
}

// ---- MCP server ----------------------------------------------------------
const mcp = read(join(ROOT, "llm-toolkit/mcp-server/src/index.ts"));
comparePrices(
  "mcp",
  [...mcp.matchAll(/description:\s*"([^"]+)",\s*low:\s*([\d.]+),\s*mid:\s*([\d.]+),\s*high:\s*([\d.]+)/g)].map((m) => ({
    name: m[1], low: +m[2], mid: +m[3], high: +m[4],
  })),
);
const mcpDfm = mcp.split("const DFM_CHECKLIST")[1]?.split("];")[0] ?? "";
const mcpDfmCount = (mcpDfm.match(/\{\s*id:\s*\d+/g) || []).length;
if (mcpDfmCount !== dfmCount) say(`mcp: DFM items ${mcpDfmCount} ≠ source ${dfmCount}`);
const mcpFlags = mcp.split("const SUPPLIER_RED_FLAGS")[1]?.split("];")[0] ?? "";
const mcpFlagCount = (mcpFlags.match(/\{\s*id:\s*\d+/g) || []).length;
if (flagCount && mcpFlagCount !== flagCount) say(`mcp: supplier red flags ${mcpFlagCount} ≠ source ${flagCount}`);
for (const m of mcp.matchAll(/^\s{2}"?([A-Za-z0-9 /.]+?)"?:\s*\{\s*\n\s*fullName:[^\n]*\n\s*region:[^\n]*\n\s*timeline:\s*"([^"]+)",\s*\n\s*costLow:\s*(\d+),\s*costMid:\s*\d+,\s*costHigh:\s*(\d+)/gm)) {
  const key = Object.keys(certs).find((k) => k.split(/[ /]/)[0] === m[1].split(/[ /]/)[0]);
  if (!key) continue;
  const src = certs[key];
  compared++;
  if (src.timeline && src.timeline !== m[2]) say(`mcp: ${m[1]} timeline "${m[2]}" ≠ source "${src.timeline}"`);
  if (src.low !== undefined && (+m[3] !== src.low || +m[4] !== src.high))
    say(`mcp: ${m[1]} cost ${m[3]}-${m[4]} ≠ source ${src.low}-${src.high}`);
}

// ---- breezehw.com (optional) ---------------------------------------------
const siteArg = process.argv.indexOf("--site");
if (siteArg > -1) {
  const site = process.argv[siteArg + 1];
  const tools = join(site, "src/app/tools");
  if (!existsSync(tools)) say(`site: ${tools} not found`);
  else {
    const bom = read(join(tools, "bom-estimator/data.ts"));
    comparePrices(
      "site",
      [...bom.matchAll(/(?:id:\s*"[^"]+",\s*)?label:\s*(["'])(.*?)\1,\s*(?:description:\s*(["'])(?:.*?)\3,\s*)?cost:\s*\{\s*low:\s*([\d.]+),\s*mid:\s*([\d.]+),\s*high:\s*([\d.]+)/g)].map((m) => ({
        name: m[2], low: +m[4], mid: +m[5], high: +m[6],
      })),
    );
    const cert = read(join(tools, "cert-navigator/data.ts"));
    for (const m of cert.matchAll(/name:\s*"([^"]+)",[\s\S]*?timeline:\s*"([^"]+)",\s*\n\s*cost:\s*\{\s*low:\s*(\d+),\s*mid:\s*\d+,\s*high:\s*(\d+)/g)) {
      const key = Object.keys(certs).find((k) => k.split(/[ /]/)[0] === m[1].split(/[ /]/)[0]);
      if (!key) continue;
      const src = certs[key];
      compared++;
      const tl = m[2].replace(/\u2013/g, "-");
      if (src.timeline && src.timeline !== tl) say(`site: ${m[1]} timeline "${m[2]}" ≠ source "${src.timeline}"`);
      if (src.low !== undefined && (+m[3] !== src.low || +m[4] !== src.high))
        say(`site: ${m[1]} cost ${m[3]}-${m[4]} ≠ source ${src.low}-${src.high}`);
    }
    const dfm = read(join(tools, "dfm-checklist/data.ts"));
    const siteDfm = (dfm.match(/^\s{8,}id:\s*"/gm) || []).length;
    if (siteDfm !== dfmCount) say(`site: DFM items ${siteDfm} ≠ source ${dfmCount}`);
  }
}

console.log(`compared ${compared} values; source: ${prices.length} prices, ${dfmCount} DFM items, ${Object.keys(certs).length} certifications, ${flagCount} red flags`);
if (problems.length) {
  for (const p of problems) console.error(`DRIFT ${p}`);
  process.exit(1);
}
console.log("no drift");
