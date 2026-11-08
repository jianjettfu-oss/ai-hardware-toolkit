---
name: hardware-dfm-review
description: Review a hardware design for design-for-manufacturing problems before molds, a pilot run or a factory quote, using a 29-item checklist for AI devices (thermal under sustained inference, antenna and RF, power, mechanical tolerances, PCB layout, firmware updates, certification readiness). Use when someone asks for a DFM review, asks "is this ready for manufacturing" or "what will the factory flag", shares enclosure CAD, a schematic, a PCB layout or a BOM for review, or is about to order tooling.
license: MIT
---

# Hardware DFM review

The checklist is in [reference/ai-hardware-dfm-checklist.md](reference/ai-hardware-dfm-checklist.md): 29 items tagged CRITICAL, MAJOR or MINOR, each with why it matters and what to do.

## How to run the review

1. **Inventory what you have**: enclosure CAD (STEP, not a mesh), schematic, PCB layout, BOM, power budget, target markets. For every checklist item that needs a missing file, mark it CANNOT ASSESS and name the file. Do not guess.
2. **Go through all 29 items.** For each, record PASS, FAIL or CANNOT ASSESS, plus the evidence: the file, the part, the net, the dimension you looked at.
3. **Report CRITICAL failures first**, then MAJOR, then MINOR. For each failure, adapt the checklist's "what to do" to this design: name the component, the location, the change.
4. **Separate what a review cannot settle.** Thermal under real load, RF in the final enclosure and fit on molded parts need a prototype. List them as tests for the EVT build (see the `hardware-validation-gates` skill), not as passes.
5. **If the files were drawn with AI tools**, also run the layer-1 checks in the `ai-design-factory-handoff` skill.

## Output format

A table: item, severity, PASS / FAIL / CANNOT ASSESS, evidence, fix. Then a short list of the CRITICAL fixes in the order you would do them, and the prototype tests that remain.

Source and updates: https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/dfm-checklist (maintained by Breeze, breezehw.com).
