---
name: hardware-validation-gates
description: Plan and run EVT, DVT and PVT validation builds for an AI hardware product, with pass/fail checks per stage (electronics, on-device inference, thermal, battery, RF pre-compliance, reliability, firmware and OTA, production yield) and exit criteria for each gate. Use when someone asks what EVT/DVT/PVT means, what to test at a prototype stage, whether a build is ready to move to the next stage, how many units each stage needs, or how to write a validation plan before mass production.
license: MIT
---

# Hardware validation gates (EVT / DVT / PVT)

The checklist is in [reference/validation-stages.md](reference/validation-stages.md): checks with pass criteria for each stage, exit criteria, and the conditions under which you should not proceed.

## How to use it

1. **Find the current stage**: EVT (does the design work, roughly 10–30 units), DVT (does it meet spec and survive reliability tests, roughly 30–100), PVT (can the line build it at yield, roughly 100–500).
2. **For a validation plan**: list the checks for that stage from the reference, adapted to this product (its SoC, battery, radios, enclosure, AI workload), with the unit count, the equipment and who runs each test.
3. **For a gate decision**: go through the stage's exit criteria one by one. Each is MET, NOT MET or NOT TESTED, with the data behind it. Any NOT TESTED item blocks the gate until it is tested or explicitly waived by a named person.
4. **Carry failures forward**: every NOT MET item becomes a design change with an owner, and is retested in the next build.

## Output format

For a plan: a table of check, pass criterion, units, method. For a gate review: a table of exit criterion, status, evidence, then GO / NO-GO with the blocking items named.

Source and updates: https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/evt-dvt-pvt-checklist (maintained by Breeze, breezehw.com).
