#!/usr/bin/env node
// Checks the hand-kept data copies against the topic files (the single source).
//
//   node scripts/check-drift.mjs                    MCP server data
//   node scripts/check-drift.mjs --site ../breeze   also the breezehw.com tool data
//
// Compares: component prices (CSV), DFM item count, certification cost and timeline,
// supplier red-flag count, and (site only) the NRE simulator tiers and category weeks
// against nre-estimation-framework.md, the EVT/DVT/PVT guide data: per-stage units,
// weeks, deliverable, goal, assembly and stop line, every check shown (by code), and the
// timeline note; and every figure in the AI-design guide's "where AI is" table (numbers
// only, since the site words it differently). Exit 1 on any mismatch, one line per mismatch.

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

// validation stages: per-stage facts + every check row, keyed by stage name / check code
const stageMd = read(join(ROOT, "evt-dvt-pvt-checklist/validation-stages.md"));
const stages = {};
for (const m of stageMd.matchAll(/^## (EVT|DVT|PVT) -- [^\n]*\n([\s\S]*?)(?=^## )/gm)) {
  const body = m[2];
  stages[m[1]] = {
    goal: body.match(/^\*\*Goal:\*\*\s*(.+?)\s*$/m)?.[1],
    assembly: body.match(/^\*\*Assembly:\*\*\s*(.+?)\s*$/m)?.[1],
    stopIf: body.match(/^\*\*Do NOT [^:]+:\*\*\s*(.+?)\s*$/m)?.[1],
  };
}
for (const m of stageMd.matchAll(/^\|\s*(EVT|DVT|PVT)\s*\|\s*([\d-]+) weeks\s*\|\s*([\d-]+)\s*\|\s*(.+?)\s*\|\s*$/gm)) {
  Object.assign((stages[m[1]] ??= {}), { weeks: m[2], units: m[3], deliverable: m[4] });
}
// NRE framework: per category, each tier row's low/mid/high and the category timeline in weeks
const nreMd = read(join(ROOT, "nre-cost-guide/nre-estimation-framework.md"));
const nre = {};
for (const m of nreMd.matchAll(/^### \d+\. (.+?)\s*\n([\s\S]*?)(?=^### |^## )/gm)) {
  const rows = [];
  for (const r of m[2].matchAll(/^\|\s*([^|]+?)\s*\|.*?\$([\d,]+)\s*\|\s*\$([\d,]+)\s*\|\s*\$([\d,]+)\s*\|\s*$/gm)) {
    const n = (s) => +s.replace(/,/g, "");
    rows.push({ name: r[1], low: n(r[2]), mid: n(r[3]), high: n(r[4]) });
  }
  nre[m[1]] = { rows, weeks: +(m[2].match(/^\*\*Timeline:\*\*\s*~?(\d+)/m)?.[1] ?? NaN) };
}
const timelineNote = stageMd.match(/^(Each stage can run longer[^\n]*?)\s*$/m)?.[1];
const checks = {};
for (const m of stageMd.matchAll(/^\|\s*([A-Z]{1,2}\d+)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/gm)) {
  checks[m[1]] = { check: m[2], criteria: m[3] };
}

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
    const nreSite = read(join(tools, "nre-simulator/data.ts"));
    for (const c of nreSite.matchAll(/^ {4}id: "([^"]+)",\s*\n\s*label: "([^"]+)",([\s\S]*?)(?=^ {2}\},?\s*$)/gm)) {
      const src = nre[c[2]];
      if (!src) { say(`site: NRE category "${c[2]}" not in nre-estimation-framework.md`); continue; }
      let hits = 0;
      for (const o of c[3].matchAll(/label: "([^"]+)",[\s\S]*?low: (\d+),\s*mid: (\d+),\s*high: (\d+)/g)) {
        const row = src.rows.find((r) => norm(o[1]).startsWith(norm(r.name)));
        if (!row) continue;
        hits++; compared++;
        if (row.low !== +o[2] || row.mid !== +o[3] || row.high !== +o[4])
          say(`site: NRE ${c[2]} / ${o[1]} ${o[2]}/${o[3]}/${o[4]} ≠ source ${row.low}/${row.mid}/${row.high}`);
      }
      if (!hits) say(`site: NRE ${c[2]} matched no source rows (parser out of date?)`);
      const tl = nreSite.match(new RegExp(`\\b${c[1]}:\\s*\\{\\s*label:\\s*"[^"]*",\\s*weeks:\\s*(\\d+)`))?.[1];
      compared++;
      if (+tl !== src.weeks) say(`site: NRE ${c[2]} timeline ${tl} weeks ≠ source ${src.weeks}`);
    }
    const dfm = read(join(tools, "dfm-checklist/data.ts"));
    const siteDfm = (dfm.match(/^\s{8,}id:\s*"/gm) || []).length;
    if (siteDfm !== dfmCount) say(`site: DFM items ${siteDfm} ≠ source ${dfmCount}`);
  }

  const stagePath = join(site, "src/app/evt-dvt-pvt/data.ts");
  if (existsSync(stagePath)) {
    const sd = read(stagePath);
    const str = (block, key) => block.match(new RegExp(`\\b${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`))?.[1];
    const siteStages = [...sd.matchAll(/name:\s*"(EVT|DVT|PVT)",([\s\S]*?)stopIf:\s*"([^"]*)"/g)];
    if (siteStages.length !== 3) say(`site: evt-dvt-pvt found ${siteStages.length} stages, expected 3`);
    for (const [, name, block, stopIf] of siteStages) {
      const src = stages[name] ?? {};
      for (const [key, val] of [
        ["units", str(block, "units")],
        ["weeks", str(block, "weeks")],
        ["deliverable", str(block, "deliverable")],
        ["goal", str(block, "goal")],
        ["assembly", str(block, "assembly")],
        ["stopIf", stopIf],
      ]) {
        compared++;
        if (val !== src[key]) say(`site: ${name} ${key} "${val}" ≠ source "${src[key]}"`);
      }
    }
    for (const m of sd.matchAll(/\{\s*code:\s*"([^"]+)",\s*check:\s*"([^"]*)",\s*criteria:\s*"([^"]*)"\s*\}/g)) {
      compared++;
      const src = checks[m[1]];
      if (!src) say(`site: check ${m[1]} not in source`);
      else if (src.check !== m[2] || src.criteria !== m[3])
        say(`site: check ${m[1]} "${m[2]}: ${m[3]}" ≠ source "${src.check}: ${src.criteria}"`);
    }
    const note = sd.match(/TIMELINE_NOTE\s*=\s*"([^"]*)"/)?.[1];
    compared++;
    if (note !== timelineNote) say(`site: TIMELINE_NOTE ≠ source "${timelineNote}"`);
  }

  // AI-design guide: the site words its table differently, so compare the numbers only.
  // Every figure in the site's WHERE_AI_IS block must appear in the README's "Where AI is" section.
  const guidePath = join(site, "src/app/ai-design-to-factory/data.ts");
  if (existsSync(guidePath)) {
    const block = read(guidePath).split("WHERE_AI_IS")[1]?.split("export const HANDOFF")[0] ?? "";
    const where = read(join(ROOT, "ai-design-handoff/README.md")).split(/^## Where AI is/m)[1] ?? "";
    const figures = new Set(block.match(/\b\d+(?:\.\d+)?%|pass@1 [\d.]+|\b\d+-tooth|\b\d+ (?:tasks|results)/g) ?? []);
    if (!figures.size) say("site: ai-design-to-factory WHERE_AI_IS has no figures (parser out of date?)");
    for (const f of figures) {
      compared++;
      if (!where.includes(f)) say(`site: ai-design-to-factory figure "${f}" not in README "Where AI is"`);
    }
  }
}

console.log(`compared ${compared} values; source: ${prices.length} prices, ${dfmCount} DFM items, ${Object.keys(certs).length} certifications, ${flagCount} red flags`);
if (problems.length) {
  for (const p of problems) console.error(`DRIFT ${p}`);
  process.exit(1);
}
console.log("no drift");
