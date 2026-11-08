---
name: hardware-cost-estimate
description: Estimate per-unit BOM cost and one-time NRE (industrial design, mechanical, electronics, firmware, tooling and molds, prototypes, certification) for an AI hardware product, from Shenzhen component pricing at 1,000 units with low/mid/high ranges and volume multipliers. Use when someone asks what a device will cost to build, what its BOM or unit cost is, how much the development or tooling will cost, how cost changes with volume, or wants a budget before raising money or talking to a factory.
license: MIT
---

# Hardware cost estimate (BOM + NRE)

References:

- [reference/shenzhen-component-pricing.csv](reference/shenzhen-component-pricing.csv): low / mid / high USD per component at 1,000 units.
- [reference/bom-cost-reference.md](reference/bom-cost-reference.md): volume multipliers and a worked example.
- [reference/nre-estimation-framework.md](reference/nre-estimation-framework.md): NRE categories with low / mid / high ranges, two budgeted examples and a timeline.

## How to estimate

1. **Pin down the product**: SoC class, memory, display, battery, radios, sensors, enclosure complexity, target volume, target markets. Ask for any that are missing, or state the assumption you made.
2. **BOM**: pick one row per component from the CSV. Use the mid value by default and show the low–high range. Add the fixed per-unit costs (PCB, assembly, enclosure, packaging) from the same file. Apply the volume multiplier for the target volume.
3. **NRE**: pick a tier for each category in the framework. Certification depends on markets, so use the `hardware-certification-plan` skill for that line if it matters.
4. **Show the total as a range**, and name the two or three line items that drive most of the uncertainty.
5. **Say what the numbers are**: planning ranges from a public reference, FOB Shenzhen, before freight, duties and tariffs. Component prices move, memory especially. Quotes from real suppliers replace them.

## Output format

A BOM table (component, choice, low / mid / high), the per-unit total at the target volume, an NRE table by category, and a short list of cost drivers and assumptions.

Source and updates: https://github.com/jianjettfu-oss/ai-hardware-toolkit (bom-cost-reference and nre-cost-guide; maintained by Breeze, breezehw.com).
