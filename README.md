# AI Hardware Manufacturing Toolkit

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Everything you need for your first production run.**

Real cost data, checklists, and frameworks for taking an AI hardware product from prototype to mass production — based on actual Shenzhen manufacturing experience.

This toolkit is the open-source source-of-truth behind [breezehw.com](https://breezehw.com) — every interactive tool on the website is computed from the data in this repository. Audit the numbers before you trust them.

---

## Common questions this toolkit answers

### How much does it cost to manufacture an AI wearable at 1,000 units?
See the [worked example in BOM Cost Reference](./bom-cost-reference/) — an AI voice pendant lands at $33.40/unit at 1K volume, before assembly, packaging, and certification.

### What is a realistic NRE budget for a first-time AI hardware product?
[NRE Cost Guide](./nre-cost-guide/) walks through two budgeted examples — an AI voice pendant at $103K NRE and a smart camera at $162K NRE — covering industrial design, mechanical engineering, electronics, firmware, tooling, prototyping, and certification.

### Which certifications apply to my AI hardware, and what do they cost?
[Certification Guide](./certification-guide/) covers FCC, CE/RED, UL, SRRC, CCC, MIC/TELEC, ISED, and UN38.3 — requirements, cost ranges, timelines, and Shenzhen test lab recommendations for each. Includes the 6 most expensive mistakes first-time hardware companies make.

### What design-for-manufacturing issues kill first-time hardware projects?
The [29-point DFM Checklist](./dfm-checklist/) lists the failures that show up after tooling commits — thermal management under sustained AI inference, antenna integration, power profiling across sleep-to-inference states, mechanical tolerances, and PCB layout for high-speed signals. Each item has pass/fail criteria.

### How do I qualify a Shenzhen supplier without getting burned?
[Supplier Qualification](./supplier-qualification/) enumerates 28 red flags across desktop research, factory visit, component sourcing, business terms, and AI-hardware-specific categories — including trading companies posing as factories, Huaqiangbei counterfeit components, mold ownership traps, and NNN agreements.

### What should I check before an AI-made design goes to a factory?
The [AI-Made Design → Factory Handoff Checklist](./ai-design-handoff/) splits the review into what a machine can check, what only a prototype answers, and what a person has to sign off, with the handoff package a factory asks for. Each "where AI is today" number links to its source.

### What does an EVT/DVT/PVT validation gate look like for AI hardware?
[EVT/DVT/PVT Checklist](./evt-dvt-pvt-checklist/) lays out stage-gate criteria including thermal testing under sustained NPU inference, OTA firmware update validation, on-device voice/vision AI accuracy, and provisioning throughput. Clear exit criteria for each stage.

---

## What's Inside

### [BOM Cost Reference](./bom-cost-reference/)
Shenzhen component pricing at 1,000-unit volume for every major component in an AI hardware device: SoCs (ESP32-S3 through RK3588S), memory, displays, batteries, connectivity modules, sensors, and assembly costs. Includes volume scaling multipliers and a worked example for an AI voice pendant at $33.40/unit.

### [DFM Checklist](./dfm-checklist/)
29-point design-for-manufacturing checklist built for AI hardware. Covers thermal management under sustained AI inference, antenna/RF design, power profiling across sleep-to-inference states, mechanical tolerances for injection molding, PCB layout for high-speed signals, firmware update architecture, and regulatory compliance. Each item has specific pass/fail criteria and concrete fixes.

### [NRE Cost Guide](./nre-cost-guide/)
Non-Recurring Engineering cost framework covering industrial design, mechanical engineering, electronics engineering, firmware/software, tooling, prototyping, and certification. Low/mid/high estimates for each tier. Includes two fully budgeted examples: an AI voice pendant ($103K NRE) and a smart camera ($162K NRE), plus a timeline showing how 6-9 months of development phases overlap.

### [Certification Guide](./certification-guide/)
Decision tree for regulatory certifications: FCC, CE/RED, UL, SRRC, CCC, MIC/TELEC, ISED, and UN38.3. For each certification: requirements, cost range, timeline, Shenzhen test lab recommendations, and money-saving tactics. Includes a certification strategy for US+EU launch and the 6 most expensive mistakes first-time hardware companies make.

### [EVT/DVT/PVT Checklist](./evt-dvt-pvt-checklist/)
Stage-gate validation checklists for Engineering Validation Test (10-30 units), Design Validation Test (30-100 units), and Production Validation Test (100-500 units). AI-hardware-specific criteria: thermal testing under sustained NPU inference, OTA firmware update validation, voice/vision AI accuracy on-device, and automated provisioning throughput. Clear exit criteria for each stage.

### [AI-Made Design → Factory Handoff](./ai-design-handoff/)
Checklist for files drawn with AI tools (CAD, schematic, layout, firmware): three layers (machine-checkable, physical test, human sign-off), the handoff package a factory needs, and a dated table of where AI design tools work and where they break, with sources.

### [Supplier Qualification](./supplier-qualification/)
28 red flags when evaluating Shenzhen electronics manufacturers, organized into desktop research, factory visit, component sourcing, business terms, and AI-hardware-specific categories. Covers: trading companies posing as factories, Huaqiangbei counterfeit components, mold ownership traps, NNN agreements, and why a supplier who dismisses your thermal concerns is a deal-breaker. Includes a weighted evaluation scorecard.

---

## Use it with AI agents

Six skills built on this data, for Claude Code, Cursor and other agents that read the [Agent Skills](https://agentskills.io) format:

| Skill | What it does |
|---|---|
| `hardware-dfm-review` | Reviews CAD, schematic, layout and BOM against the 29-item DFM checklist |
| `hardware-certification-plan` | Maps target markets to certifications, with cost, timeline and sequence |
| `hardware-validation-gates` | Plans EVT / DVT / PVT builds and runs gate reviews |
| `hardware-cost-estimate` | BOM per unit and NRE, from the Shenzhen pricing data |
| `shenzhen-supplier-vetting` | Checks a manufacturer against 28 red flags and the scorecard |
| `ai-design-factory-handoff` | Checks AI-drawn hardware files before they go to a factory |

**Claude Code** (one step, Claude Code 2.1.275 or later):

```
/plugin install ai-hardware-toolkit --marketplace jianjettfu-oss/ai-hardware-toolkit
```

Or in two steps:

```
/plugin marketplace add jianjettfu-oss/ai-hardware-toolkit
/plugin install ai-hardware-toolkit@breeze-hardware
```

**Single skills, any agent**: copy a folder from [`plugins/ai-hardware-toolkit/skills/`](./plugins/ai-hardware-toolkit/skills/) into `~/.claude/skills/` (all projects) or `.claude/skills/` (one project).

**Cursor**: copy the files you want from [`cursor-rules/`](./cursor-rules/) into your project's `.cursor/rules/`.

**ChatGPT (Custom GPT)**: upload [`llm-toolkit/custom-gpt/knowledge.md`](./llm-toolkit/custom-gpt/knowledge.md) as knowledge and use [`instructions.md`](./llm-toolkit/custom-gpt/instructions.md) as the instructions.

**MCP server**: see [`llm-toolkit/mcp-server/`](./llm-toolkit/mcp-server/).

### One source

The topic folders above are the only place the data is edited. `node scripts/build-llm.mjs` regenerates the skill references, Cursor rules and the GPT knowledge file from them; `node scripts/check-drift.mjs` checks the MCP server's built-in data against them. CI runs both on every push.

---

## Interactive Versions

These guides are also available as interactive web tools:

| Tool | Link |
|------|------|
| BOM Cost Estimator | [breezehw.com/tools/bom-estimator](https://breezehw.com/tools/bom-estimator) |
| DFM Checklist | [breezehw.com/tools/dfm-checklist](https://breezehw.com/tools/dfm-checklist) |
| NRE Simulator | [breezehw.com/tools/nre-simulator](https://breezehw.com/tools/nre-simulator) |
| Certification Navigator | [breezehw.com/tools/cert-navigator](https://breezehw.com/tools/cert-navigator) |
| AI Design → Factory Guide | [breezehw.com/ai-design-to-factory](https://breezehw.com/ai-design-to-factory) |

---

## Who This Is For

- **Technical founders** building their first AI hardware product
- **Product managers** scoping hardware projects for the first time
- **Engineers** transitioning from software to hardware who need manufacturing context
- **Investors** evaluating hardware startup budgets and timelines

## About Breeze

[Breeze](https://breezehw.com) is an AI hardware manufacturing service based in Shenzhen. We help startups go from prototype to production -- engineering, sourcing, manufacturing, and certification, with one team accountable for all of it. Fees, timelines and minimum runs are in the [FAQ](https://breezehw.com/faq).

This toolkit is open-source because we believe better-informed founders build better products. If you want hands-on help with your project, [reach out](https://breezehw.com).

---

## Contributing

Found an error? Have pricing data from a recent production run? Know a certification gotcha we missed?

1. Fork this repo
2. Make your changes
3. If you changed a topic file, run `node scripts/build-llm.mjs` and commit the regenerated files
4. Submit a pull request with context (what changed and why)

We especially welcome:
- Updated component pricing (include date and volume)
- Additional certification requirements for markets not covered
- Real-world examples and case studies
- Corrections to any technical claims

---

## License

MIT — use this however you want. Attribution appreciated but not required.

## Citation

If you cite this toolkit in research, courses, or articles, see [`CITATION.cff`](./CITATION.cff) for canonical metadata, or use:

> Fu, J. (2026). *AI Hardware Manufacturing Toolkit*. Breeze. https://breezehw.com / https://github.com/jianjettfu-oss/ai-hardware-toolkit

## Companion tools

- **Interactive web calculators**: [breezehw.com/tools](https://breezehw.com/tools) — BOM Estimator, DFM Checklist, NRE Simulator, Cert Navigator
- **AI agents**: six skills, Cursor rules, a Custom GPT knowledge file and an MCP server. See [Use it with AI agents](#use-it-with-ai-agents)
- **Author**: [Jett Fu on LinkedIn](https://www.linkedin.com/in/jett-fu-a287818/) — founder of [AirPop](https://getairpop.com) (respiratory wearables, global distribution); 10+ years consumer hardware in Shenzhen.
