<!-- GENERATED from ai-design-handoff/README.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# AI-Made Design → Factory: Handoff Checklist

**Last reviewed: 2026-11-08.** AI design tools change month to month; treat the numbers below as a dated snapshot.

You used AI to draw a product: a CAD model, a schematic, a board layout, firmware. The files open, and they pass the automatic checks. That is the part AI is now good at. What it still cannot tell you is what only the physical world answers: does it overheat inside the enclosure, do the parts fit, can the mold be built, does the radio work, does the board survive its first power-on.

This checklist splits the review into three layers:

1. **Machine-checkable**: you can run these yourself, before anyone quotes.
2. **Needs a physical test**: only a prototype answers these (EVT/DVT).
3. **Needs a human sign-off**: someone who has shipped this kind of part has to own the decision.

A factory prices what is in your files, so clear layer 1 before you ask for quotes.

Web version: [breezehw.com/ai-design-to-factory](https://breezehw.com/ai-design-to-factory)

---

## Layer 1: machine-checkable (before you request quotes)

### Mechanical

- [ ] **Every part is a solid STEP file, not a mesh.** Image-to-3D tools export meshes (Meshy's API lists GLB, FBX, STL and similar mesh formats, no STEP). A mesh has no dimensions, no wall thickness and no design intent, so a mold maker cannot quote from it.
- [ ] **Dimensions measured in a second CAD tool against your spec**, not against the AI's own summary of what it built. In one test of a mesh-to-CAD tool, none of 5 results for a toaster-oven knob was free of errors, although a simpler adapter ring came out right in one mode ([engineering.com](https://www.engineering.com/backflips-back-is-the-mesh-to-cad-ai-real-this-time/)).
- [ ] **Wall thickness, draft angles and undercuts** run through a DFM analysis. These are deterministic geometry checks, not AI.
- [ ] **Interference check on the full assembly.** AI-written CAD code handles single parts. Assemblies and tolerance stacks are where it stops.
- [ ] **Small features checked by eye**: gears, threads, snap fits, ribs, bosses. Text-to-CAD tools failed or simplified a 24-tooth gear in a seven-tool test ([Xometry Pro](https://xometry.pro/en/articles/text-to-cad-tools-test/)).

### Electronics

- [ ] **ERC and DRC clean, and every ERC *warning* read.** In a published KiCad + Claude Code walkthrough, two overlapping net labels shorted the ISENSE and ISET nets. ERC reported it only as a warning. It was found by comparing the netlist pin by pin ([JLCPCB](https://jlcpcb.com/blog/kicad-mcp-how-to-design-a-pcb-with-claude-code)).
- [ ] **Netlist compared pin by pin** against the intended design for power, sense, enable and reset nets.
- [ ] **Every footprint checked against the datasheet land pattern** for the exact part number in the BOM.
- [ ] **BOM lines complete**: manufacturer part number, quantity, reference designators, lifecycle status, and an approved second source for anything single-sourced.

### Firmware

- [ ] **Clean build on the exact SDK version** the factory test station will use. Treat compiler warnings as errors.
- [ ] **Ported code tested on the target framework.** In the EmbedAgent benchmark, models migrating code to ESP-IDF passed 29.4% of tasks ([arXiv 2506.11003](https://arxiv.org/abs/2506.11003)).

---

## Layer 2: needs a physical test (EVT / DVT)

- [ ] **Thermal** under sustained load, inside the real enclosure, at the highest ambient temperature you will claim.
- [ ] **RF**: antenna performance in the final enclosure (with a hand or body nearby for wearables), plus a pre-scan before you pay for certification.
- [ ] **First power-on** with a current-limited supply. Check every rail before you load firmware.
- [ ] **Fit and tolerance stack** on printed or CNC parts first, then again on the first molded samples (T1).
- [ ] **Molding defects** only visible on T1 samples: shrink, warpage, sink marks, gate marks, flash.
- [ ] **Soft materials and fit on the body** (silicone, TPE, straps, seals). We found no published evidence that generative AI predicts these. Test on people.
- [ ] **Drop, battery and charging** tests at the volumes your EVT/DVT plan calls for. See the [EVT/DVT/PVT checklist](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/evt-dvt-pvt-checklist/).

---

## Layer 3: needs a human sign-off

- [ ] **Mold design**: parting line, gate location, ejection, steel choice. Agreed between the mold maker's engineer and yours.
- [ ] **High-speed and RF layout** reviewed by an engineer who has shipped that interface before.
- [ ] **Certification plan**: target markets, required tests, lab, budget. See the [certification guide](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/certification-guide/).
- [ ] **Safety-critical parts**: battery protection, charging circuit, skin-contact materials.
- [ ] **DFM sign-off from the factory that will build it**, against a written checklist. See the [DFM checklist](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/dfm-checklist/).

---

## The handoff package a factory will ask for

| Item | What to send |
|---|---|
| Mechanical | STEP for every part; 2D drawings with tolerances, critical dimensions, material, color and surface finish |
| BOM | Part numbers, quantities, reference designators, approved alternates |
| PCB | Gerbers or ODB++, drill files, pick-and-place, assembly drawing, stack-up and impedance notes |
| Firmware | Production image, programming procedure, factory test firmware |
| Test | Test plan with pass/fail criteria per unit |
| Market | Target countries and the certifications you need |
| Commercial | Target volume and target unit cost |

---

## Where AI is today, by step (November 2026)

| Step | Works for | Breaks on | Source |
|---|---|---|---|
| Concept to 3D shape (image-to-3D) | A viewable model in minutes | Output is a mesh: no dimensions, no wall thickness | [Meshy API docs](https://docs.meshy.ai/en/api/text-to-3d) |
| Mesh or image to CAD | Simple machined parts, partly | None of 5 results for a knob was error-free; best image-input shape match (IoU) 0.412 on CadBench; noisy mesh input dropped 0.707 → 0.130 | [engineering.com](https://www.engineering.com/backflips-back-is-the-mesh-to-cad-ai-real-this-time/), [CadBench](https://arxiv.org/abs/2605.10873) |
| Text to CAD, one shot | Cylinder-level parts | 24-tooth gear failed or simplified; a manifold block came back empty or simplified | [Xometry Pro](https://xometry.pro/en/articles/text-to-cad-tools-test/) |
| LLM writes CAD code, checks in simulation | Simple brackets, mounts, enclosures | Passing designs were mostly close, not usable as-is; assemblies and tolerances not covered | [Staley, 2026-02](https://kerrickstaley.com/2026/02/22/can-frontier-llms-solve-cad-tasks) |
| Executable CAD vs correct CAD | One image-to-CAD model's programs ran 95% of the time | Their shape match (IoU) was about 0.3 | [CadBench](https://arxiv.org/abs/2605.10873) |
| Schematic, constrained embedded tasks | pass@1 0.90 with part lookup and checks built in | — | [pcbGPT](https://arxiv.org/abs/2606.01188) |
| Schematic, open board-level tasks | — | Best model passed 8.15% of 300 tasks | [HWE-Bench](https://arxiv.org/abs/2603.18102) |
| Simple board, end to end | Individual developers report small boards (ESP32 class) built and working | Hand fixes and manual routing were common; in one published build a short passed ERC as a warning | [Hacker News](https://news.ycombinator.com/item?id=49584343), [JLCPCB](https://jlcpcb.com/blog/kicad-mcp-how-to-design-a-pcb-with-claude-code) |
| Firmware | 55.6% pass@1 with the schematic; 65.1% with retrieval and compiler feedback | 29.4% when migrating to ESP-IDF (2025 models) | [EmbedAgent](https://arxiv.org/abs/2506.11003) |

The pattern across all three fields: AI does well where a machine can check the output (compiler, DRC, CAD kernel, simulator) and poorly where only a physical test can. The checklist above follows that split.

Most of these numbers come from small samples or from authors testing their own methods. None of the vendor efficiency claims we found had been reproduced independently, so none are used here.

---

*Maintained by [Breeze](https://breezehw.com). Corrections and new failure cases welcome as pull requests: include the source.*
