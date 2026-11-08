---
name: ai-design-factory-handoff
description: Check hardware files drawn with AI tools (CAD from text or images, schematics, PCB layouts, firmware) before they go to a factory, in three layers (machine-checkable now, needs a physical prototype test, needs an experienced engineer's sign-off), and assemble the handoff package a factory asks for. Use when someone used AI to design a device, enclosure, PCB or firmware and asks whether it is ready to manufacture, what to check before requesting quotes, or what files a factory needs.
license: MIT
---

# AI-made design → factory handoff

The checklist is in [reference/ai-design-handoff.md](reference/ai-design-handoff.md): three layers of checks, the handoff package, and a dated table of where AI design tools work and where they break, with sources.

## How to run it

1. **Layer 1, machine-checkable**: run every check you can on the files you have. Typical: mesh versus STEP, dimensions against the spec, ERC/DRC including every ERC warning, a pin-by-pin netlist comparison on power, sense, enable and reset nets, footprints against datasheets, BOM completeness, a clean firmware build. Report PASS / FAIL with the file and line, net or dimension. Never pass an item on the strength of the design tool's own summary of what it built.
2. **Layer 2, needs a physical test**: list the prototype tests this design needs (thermal, RF, first power-on, fit, molding defects, body fit), with the build stage for each. Do not mark them passed.
3. **Layer 3, needs a human sign-off**: list the decisions that need an engineer who has shipped this kind of part (mold design, high-speed or RF layout, certification plan, safety-critical parts, factory DFM sign-off), and who should own each.
4. **Handoff package**: list what is present and what is missing from the package table.
5. **Date the numbers**: the "where AI is" table is a snapshot. Say its date when you quote from it.

## Output format

Three sections (layer 1 results, layer 2 test plan, layer 3 sign-offs), then the handoff package with present / missing, then the three fixes to do first.

Source and updates: https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/ai-design-handoff, web version https://breezehw.com/ai-design-to-factory (maintained by Breeze).
