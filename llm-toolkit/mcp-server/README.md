# AI Hardware Toolkit — MCP Server

An MCP (Model Context Protocol) server that exposes the AI Hardware Manufacturing Toolkit as tools for LLM-powered assistants. Built on the official MCP SDK.

## Tools

| Tool | Description |
|------|-------------|
| `estimate_bom` | Estimate per-unit BOM cost from component selections (Shenzhen 1K-unit pricing) |
| `check_dfm` | Run DFM checks from the 29-item AI hardware checklist, filterable by category/severity |
| `estimate_nre` | Estimate one-time NRE costs across 7 categories with tiered options |
| `plan_certification` | Plan certifications based on target markets and device features |
| `evaluate_supplier` | Evaluate a manufacturer against 28 red flags for AI hardware |
| `get_validation_checklist` | Get EVT/DVT/PVT stage checklist with pass/fail criteria |

## Install

```bash
npm install
npm run build
```

## Usage with Claude Code

Add to your Claude Code MCP config (`~/.claude/settings.json` or project `.mcp.json`):

```json
{
  "mcpServers": {
    "ai-hardware-toolkit": {
      "command": "node",
      "args": ["/path/to/ai-hardware-toolkit/llm-toolkit/mcp-server/dist/index.js"]
    }
  }
}
```

## Usage with other MCP clients

The server uses stdio transport. Start it with:

```bash
node dist/index.js
```

Any MCP-compatible client can connect via stdio.

## Data

All toolkit data (BOM pricing, DFM checklist, NRE framework, certification decision tree, validation stages, supplier red flags) is embedded directly in the server code. No external files or databases are needed.

The data represents real Shenzhen manufacturing prices at 1K-unit volume. Prices have Low/Mid/High tiers — Mid is the typical first-order price.
