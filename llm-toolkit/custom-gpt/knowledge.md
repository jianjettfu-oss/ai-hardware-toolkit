# AI Hardware Manufacturing Toolkit — knowledge file

<!-- GENERATED from bom-cost-reference/README.md, bom-cost-reference/shenzhen-component-pricing.csv, dfm-checklist/ai-hardware-dfm-checklist.md, nre-cost-guide/nre-estimation-framework.md, certification-guide/certification-decision-tree.md, evt-dvt-pvt-checklist/validation-stages.md, supplier-qualification/supplier-red-flags.md, ai-design-handoff/README.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

Source and updates: https://github.com/jianjettfu-oss/ai-hardware-toolkit

---

## Source: bom-cost-reference/README.md

<!-- GENERATED from bom-cost-reference/README.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# BOM Cost Reference -- Shenzhen Component Pricing

Real component pricing from Shenzhen suppliers at **1,000-unit volume** (2025-2026 data).

## What's Inside

**[shenzhen-component-pricing.csv](https://github.com/jianjettfu-oss/ai-hardware-toolkit/blob/main/bom-cost-reference/shenzhen-component-pricing.csv)** -- A reference BOM with low/mid/high pricing for every major component category in a typical AI hardware device:

- **Processors/SoCs** -- From ESP32-S3 ($2.10) to RK3588S ($50) with TOPS ratings
- **Memory** -- PSRAM+Flash for MCUs through 2GB+32GB for on-device LLM
- **Displays** -- No display through E-ink, OLED, AMOLED, LCD
- **Batteries** -- 100mAh pendant through 2000mAh multi-day
- **Connectivity** -- Built-in WiFi/BLE, standalone BLE, 4G LTE, GPS
- **Sensors** -- MEMS mics, IMU, cameras (2MP/5MP), environmental
- **Fixed costs** -- PCB, enclosure, SMT assembly, manual assembly, passives, power management

## How to Use This

1. Pick one option from each category that matches your product
2. Sum the "Mid" column for a realistic baseline estimate
3. The "Low" column is achievable with volume commitments and aggressive sourcing
4. The "High" column accounts for supply constraints, rush orders, or premium specs

## Volume Scaling

These prices are at 1,000 units. Apply these multipliers for other volumes:

| Volume | Multiplier | Example ($30 BOM at 1K) |
|--------|-----------|------------------------|
| 500 units | 1.30x | $39.00 |
| 1,000 units | 1.00x | $30.00 |
| 5,000 units | 0.75x | $22.50 |
| 10,000 units | 0.60x | $18.00 |
| 50,000+ units | 0.48x | $14.40 |

The jump from 500 to 1,000 units is the steepest discount. This is why most first production runs target 1K minimum.

## Example: AI Voice Pendant (Plaud NotePin class)

| Component | Selection | Mid Price |
|-----------|-----------|----------|
| SoC | Rockchip RV1103 | $5.00 |
| Memory | 512MB + 4GB eMMC | $4.00 |
| Display | None | $0.00 |
| Battery | 300-500mAh | $1.40 |
| Connectivity | BLE 5.0 module | $3.50 |
| Sensors | MEMS Mics x2 | $1.00 |
| PCB | 4-layer | $0.90 |
| Enclosure | Injection mold | $8.00 |
| Assembly | SMT + manual | $7.50 |
| Passives | USB-C, LEDs, etc. | $1.45 |
| Power | Charging IC + PMIC | $0.65 |
| **Total** | | **$33.40** |

Add NRE (mold tooling, certification) on top -- see the [NRE Cost Guide](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/nre-cost-guide/).

## Important Notes

- Prices are FOB Shenzhen (before shipping, duties, import fees)
- Component availability fluctuates -- always verify lead times before committing
- These are component costs only -- does not include NRE, certification, packaging, or margin
- Custom battery shapes cost 2-3x more than standard cells and require new UN38.3 testing

---

*Interactive version: [breezehw.com/tools/bom-estimator](https://breezehw.com/tools/bom-estimator)*

---

## Source: bom-cost-reference/shenzhen-component-pricing.csv

<!-- GENERATED from bom-cost-reference/shenzhen-component-pricing.csv by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

```csv
Category,Component,Description,Low (USD),Mid (USD),High (USD),Notes
Processor / SoC,ESP32-S3,"Basic AI (voice, gesture). WiFi + BLE built-in.",2.10,2.50,3.20,Good for voice recorders and simple sensor devices
Processor / SoC,Rockchip RV1103,"Camera + AI, 0.5 TOPS NPU. Plaud NotePin tier.",3.50,5.00,7.00,Entry-level vision AI
Processor / SoC,Rockchip RK3562,"Mid-range AI, 1 TOPS NPU, Mali G52 GPU.",7.89,10.00,13.00,Handles most on-device inference workloads
Processor / SoC,Rockchip RK3588S,"High-end, 6 TOPS NPU, octa-core. For edge servers.",25.00,35.00,50.00,Overkill for wearables -- use for edge AI boxes
Processor / SoC,MediaTek Genio 510/700,"4-10 TOPS NPU, industrial grade.",18.00,28.00,40.00,Long-term availability commitment from MTK
Memory,512MB + 4GB eMMC,"Basic: voice recorder, simple sensor device.",2.70,4.00,5.50,Pairs with RV1103
Memory,1GB + 8GB eMMC,"Standard: camera device, on-device AI inference.",4.20,6.50,9.00,Most common for AI wearables
Memory,2GB + 32GB eMMC,"High: smart display, local LLM, multi-model AI.",8.00,11.50,16.00,Required for on-device LLM
Memory,8MB PSRAM + 4MB Flash,"MCU-tier: ESP32-S3 builds, no discrete RAM.",0.85,1.40,2.20,Built into ESP32-S3 module pricing
Display,No display,Audio-only device (like Plaud NotePin).,0.00,0.00,0.00,Simplest BOM -- recommended for v1
Display,0.96in OLED (mono),"Simple status display, 128x64.",0.80,1.20,1.80,SSD1306 driver -- well-supported
Display,1.54in AMOLED (color),"Smartwatch-tier, 240x240.",3.00,5.00,8.00,Significant power draw -- plan battery accordingly
Display,2.4in TFT LCD IPS,"Full color display, 320x240.",2.50,4.00,6.00,Cheapest color option
Display,2.13in E-ink,"Ultra-low power, 212x104.",4.00,6.00,9.00,Great for always-on status displays
Battery,100-150mAh,"Ultra-slim pendant, ~4hr runtime.",0.40,0.65,0.90,Minimum viable for demo devices
Battery,300-500mAh,"Compact wearable, ~8-12hr runtime.",1.00,1.40,2.00,Sweet spot for AI pendants/badges
Battery,800-1000mAh,"Full-day device, ~16-20hr runtime.",1.50,2.20,3.20,Standard for smartwatch-class devices
Battery,1500-2000mAh,"Multi-day, larger form factor required.",2.50,3.80,5.50,Requires larger enclosure -- consider trade-offs
Connectivity,WiFi + BLE (built-in),Included in ESP32-S3. No extra cost.,0.00,0.00,0.00,Only applies to Espressif SoCs
Connectivity,BLE 5.0 module,"nRF52840-based, ultra-low power.",2.00,3.50,5.00,Best for battery-constrained devices
Connectivity,WiFi/BT module (add-on),For non-Espressif SoCs.,1.50,2.50,4.00,Required when using Rockchip/MTK SoCs
Connectivity,4G LTE Cat-1,Quectel EC21/EC25. Adds SIM slot + antenna.,7.00,10.00,15.00,Significant cost -- only if WiFi not an option
Connectivity,GPS/GNSS add-on,Location tracking.,1.50,5.00,8.00,Additional to other connectivity
Sensors,MEMS Microphones (x2),PDM/I2S. Essential for voice AI.,0.60,1.00,1.80,Use two for noise cancellation
Sensors,6-axis IMU,Accelerometer + Gyroscope.,0.40,0.80,1.50,Activity detection and gesture recognition
Sensors,Camera 2MP (OV2640),"Basic AI vision, fixed focus.",1.50,2.50,4.00,Adequate for most CV tasks
Sensors,Camera 5MP (OV5640),"Higher resolution, auto-focus.",3.00,5.00,8.00,Only if resolution is a feature differentiator
Sensors,Environmental (temp/humidity/pressure),SHT30 + BMP280 combo.,0.50,0.90,1.60,Cheap to add -- good for health wearables
Fixed Cost,PCB (4-layer rigid ~50cm2),Standard 4-layer PCB for AI device.,0.50,0.90,1.50,Per-unit at 1K volume
Fixed Cost,Enclosure (injection mold 2-part),Production injection-molded enclosure.,4.50,8.00,13.00,Per-unit -- mold cost is separate NRE
Fixed Cost,SMT Assembly (medium complexity),Pick-and-place + reflow + inspection.,3.00,5.00,8.00,150-300 component placements
Fixed Cost,Manual assembly + testing,Final assembly and functional test.,1.30,2.50,4.50,Labor cost in Shenzhen -- will decrease at volume
Fixed Cost,"Passives, connectors, USB-C, LEDs",All small passive components.,0.90,1.45,2.25,Often underestimated -- track carefully
Fixed Cost,Charging IC + power management,Battery charging and voltage regulation.,0.35,0.65,1.10,TP4056 (basic) to IP5306 (power path)
```

---

## Source: dfm-checklist/ai-hardware-dfm-checklist.md

<!-- GENERATED from dfm-checklist/ai-hardware-dfm-checklist.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# DFM Checklist for AI Hardware

A design-for-manufacturing checklist covering the issues that actually kill AI hardware projects. Organized by severity: **Critical** items will block production or certification, **Major** items will cause costly rework, and **Minor** items will reduce quality or increase cost.

---

## Thermal Management

### [CRITICAL] Thermal simulation for SoC under peak AI inference load
**Why it matters:** Edge AI chips (RK3588S, QCS6490) can hit 85C+ during sustained inference. Without thermal planning, you'll throttle or fail reliability tests.

**What to do:** Run thermal simulation early. Budget 2-5mm for heat spreader or thermal pad in your stack-up.

---

### [CRITICAL] Adequate PCB copper pour for heat dissipation under the SoC
**Why it matters:** The PCB is your primary heatsink in compact devices. Insufficient copper pour causes hot spots and solder joint fatigue.

**What to do:** Use thermal vias (array of 0.3mm vias) under the SoC pad, connected to an internal ground plane.

---

### [MAJOR] Enclosure material temperature rating
**Why it matters:** ABS softens at 80C. If your SoC runs hot, the enclosure near the chip can deform or discolor.

**What to do:** Use PC (polycarbonate) or ABS/PC blend for areas near heat sources. Add ventilation slots if >3W sustained.

---

### [CRITICAL] Battery positioned away from heat-generating components
**Why it matters:** LiPo batteries degrade rapidly above 45C and can swell or fail. Thermal runaway is a safety hazard.

**What to do:** Maintain >=3mm air gap or thermal barrier between battery and SoC. Never stack battery directly under the processor.

---

## Antenna & RF Design

### [CRITICAL] Ground clearance zone around all antennas (WiFi, BLE, cellular, GPS)
**Why it matters:** Metal near antennas kills performance. The #1 cause of failed FCC/CE tests is antenna detuning from nearby copper or enclosure metal.

**What to do:** Keep >=5mm copper-free zone around 2.4GHz antenna. 10mm for cellular. No ground plane under the antenna element.

---

### [MAJOR] Antenna placement compatible with user grip/wear positions
**Why it matters:** Human body absorbs RF. A wrist-worn device with the antenna on the skin side will lose 6-10dB signal.

**What to do:** Place antenna on the side facing away from the body. Test with phantom hand/body during development.

---

### [MAJOR] Antenna detuning from enclosure material accounted for
**Why it matters:** Plastic enclosures shift antenna resonant frequency. Metal-painted or metallized plastics can block RF entirely.

**What to do:** Avoid metallic paint near antennas. Tune the antenna with the final enclosure material, not in free space.

---

### [MAJOR] Cellular antenna volume allocation
**Why it matters:** Multi-band cellular needs ~500-1000mm3 of antenna volume. Undersized antennas cause dropped calls and failed carrier certification.

**What to do:** Allocate antenna volume early in ID design. Consider FPC (flex PCB) antenna if space is tight.

---

## Power & Battery

### [CRITICAL] Power consumption profiled across all operating modes
**Why it matters:** AI inference can draw 10-50x more current than idle. Without profiling, your battery life claims will be wrong and your regulator may be undersized.

**What to do:** Measure current in each mode. Size the regulator for peak (not average) current. Design a power state machine in firmware.

---

### [CRITICAL] USB-C charging circuit designed safely
**Why it matters:** Incorrect charging IC selection or missing protection can cause battery swelling, fire, or regulatory failure.

**What to do:** Use a certified charging IC (TP4056 minimum, IP5306 for power path). Add over-voltage, over-current, and thermal cutoff protection.

---

### [MAJOR] Voltage rails sequenced correctly
**Why it matters:** Many SoCs require specific power-up sequences (core -> I/O -> memory). Wrong sequence causes latch-up or silicon damage.

**What to do:** Read the SoC datasheet power sequencing section. Use PMIC with sequencing support or add enable-chain delays.

---

### [MINOR] Battery fuel gauge or level indicator
**Why it matters:** Without accurate battery reporting, users can't trust your device. LiPo voltage curves are non-linear.

**What to do:** Use a coulomb counter IC (MAX17048) for accuracy, or implement a voltage lookup table with load compensation.

---

## Mechanical & Enclosure

### [CRITICAL] Minimum wall thickness for injection molding (>=1.0mm)
**Why it matters:** Walls thinner than 1.0mm cause short shots (incomplete fill) and sink marks. Shenzhen tooling houses will reject or charge extra.

**What to do:** Maintain 1.2-1.5mm wall thickness for ABS/PC. Keep uniform thickness to prevent warping.

---

### [CRITICAL] Draft angles (>=1 degree) on all vertical surfaces
**Why it matters:** Without draft, parts stick in the mold, causing scratches, deformation, and slow cycle times (higher cost).

**What to do:** Add 1-3 degree draft angle on all walls. Textured surfaces need more draft (1 degree per 0.025mm texture depth).

---

### [MAJOR] Snap-fit or screw boss design validated for repeated assembly
**Why it matters:** Service, RMA, and regulatory testing require opening the device. Snap-fits that break on first open are a production nightmare.

**What to do:** Design snap-fits with 2% max strain for ABS. Add screw bosses as backup. Test with 20+ open/close cycles.

---

### [MINOR] Space reserved for FCC/CE/UL markings
**Why it matters:** Regulatory marks must be permanent and legible. If your enclosure is too small, you'll need to redesign at certification stage.

**What to do:** Reserve a 15x8mm flat area for laser-engraved or pad-printed regulatory marks. Plan this in the ID phase.

---

### [MAJOR] IP rating requirements specified with sealing design
**Why it matters:** Wearables often need IPX4 (splash) minimum. Adding waterproofing after design is extremely expensive.

**What to do:** Define IP rating early. IPX4 needs gaskets at seams. IPX7 needs O-rings, sealed connectors, and pressure-tested enclosures.

---

## PCB Layout

### [CRITICAL] High-speed signals impedance-matched (USB, MIPI, DDR)
**Why it matters:** Impedance mismatch causes signal reflections, data errors, and EMI. USB/MIPI/DDR will fail at speed without controlled impedance.

**What to do:** Use impedance-controlled stackup. 90 ohm differential for USB, 100 ohm for MIPI. Specify in PCB fab notes.

---

### [MAJOR] Decoupling capacitors within 2mm of each power pin
**Why it matters:** Long traces to decoupling caps add inductance, causing voltage droop during current spikes (especially during AI inference bursts).

**What to do:** Place 100nF caps within 2mm of every power pin. Add bulk caps (10-100uF) near the voltage regulator output.

---

### [CRITICAL] Microphone placement optimized for acoustic performance
**Why it matters:** MEMS mics are extremely sensitive to placement. Sound ports blocked by enclosure, or mics near vibration sources, kill voice AI accuracy.

**What to do:** Align mic sound port with enclosure hole (<=0.5mm offset). Add acoustic chamber (1-2mm air gap). Keep away from speaker and motor.

---

### [MAJOR] Test points accessible for production testing
**Why it matters:** Without test points, you can't verify boards in production. You'll rely on functional testing only, which is slower and catches fewer defects.

**What to do:** Add test pads for all power rails, key signals, and programming interfaces. Minimum pad size 1.0mm for flying probe.

---

### [MINOR] PCB panelized efficiently for SMT production
**Why it matters:** Poor panelization wastes PCB material and slows pick-and-place setup. Non-standard panels add NRE charges at the SMT house.

**What to do:** Design panel with 3-5mm rails, V-score or tab-routing. Keep panel size within 100x100mm to 250x330mm for standard SMT lines.

---

## Firmware & Software

### [CRITICAL] Reliable firmware update mechanism (OTA or USB)
**Why it matters:** You will ship bugs. Without OTA, every firmware fix requires physical recall or customer-side USB flashing -- both are expensive.

**What to do:** Implement dual-bank OTA with rollback. Test update failure scenarios (power loss mid-update, corrupted image).

---

### [MAJOR] Factory calibration and provisioning built into production flow
**Why it matters:** Each unit needs unique credentials (device ID, certificates, WiFi provisioning). Manual provisioning doesn't scale past 100 units.

**What to do:** Build a factory tool that programs credentials, runs self-test, and logs results -- all in <30 seconds per unit.

---

### [MAJOR] AI model optimized for target SoC
**Why it matters:** Running an unoptimized model on edge hardware will drain battery 3-5x faster and cause thermal issues.

**What to do:** Quantize to INT8. Use the SoC vendor's NPU SDK (RKNN for Rockchip, TFLite for ESP32). Profile inference time and power.

---

## Compliance & Certification

### [CRITICAL] All required certifications identified for target markets
**Why it matters:** Missing certifications = can't sell. FCC (US), CE (EU), SRRC (China), MIC (Japan) each have different requirements and timelines.

**What to do:** Map target markets to required certs at project start. Budget 8-16 weeks and $8K-40K for testing. See the [Certification Guide](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/certification-guide/).

---

### [MAJOR] EMI limits met without requiring shield can
**Why it matters:** Adding shield cans late in development adds cost ($0.50-2/unit), height, and requires PCB redesign for grounding.

**What to do:** Follow EMI best practices from the start: solid ground planes, short return paths, filtered I/O. Pre-scan with near-field probe.

---

### [CRITICAL] Battery compliant with UN38.3 transportation testing
**Why it matters:** Lithium batteries without UN38.3 certification cannot be shipped by air. Your entire supply chain depends on this.

**What to do:** Source batteries from suppliers who provide UN38.3 test reports. Budget $2K-5K if you need to test a custom cell.

---

### [MAJOR] Data privacy regulations addressed (GDPR, CCPA)
**Why it matters:** AI devices that record audio/video face strict privacy requirements. Non-compliance can result in fines and market bans.

**What to do:** Implement on-device processing where possible. Add clear privacy controls, data deletion, and consent flows.

---

## Summary Scorecard

| Category | Critical | Major | Minor |
|----------|----------|-------|-------|
| Thermal Management | 3 | 1 | 0 |
| Antenna & RF Design | 1 | 3 | 0 |
| Power & Battery | 2 | 1 | 1 |
| Mechanical & Enclosure | 2 | 2 | 1 |
| PCB Layout | 2 | 2 | 1 |
| Firmware & Software | 1 | 2 | 0 |
| Compliance & Certification | 2 | 2 | 0 |
| **Total** | **13** | **13** | **3** |

Address all 13 Critical items before committing to tooling. Major items should be resolved before DVT. Minor items can be addressed during PVT.

---

*Interactive version: [breezehw.com/tools/dfm-checklist](https://breezehw.com/tools/dfm-checklist)*

---

## Source: nre-cost-guide/nre-estimation-framework.md

<!-- GENERATED from nre-cost-guide/nre-estimation-framework.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# NRE Cost Estimation Framework

Non-Recurring Engineering (NRE) is the one-time cost to get from concept to production-ready product. For most AI hardware startups, NRE is $50K-200K -- more than the first production run itself. This framework helps you estimate yours.

---

## NRE Categories

### 1. Industrial Design

Product appearance, ergonomics, CMF (color, material, finish).

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Basic | Simple enclosure, 1 concept. Rectangular housing, minimal curves. Suitable for MVP/dev kit. | $2,000 | $4,000 | $6,000 |
| Standard | Refined design, 2-3 concepts. Organic shapes, user-tested ergonomics, CMF spec. Most wearables. | $6,000 | $12,000 | $18,000 |
| Premium | Consumer-grade, 5+ concepts. Apple-level finish. Multiple rounds of refinement, renders, mockups. | $15,000 | $30,000 | $50,000 |

**Timeline:** ~4 weeks

**Guidance:** Most AI hardware startups should start at Standard. Basic looks like a dev kit (fine for B2B, bad for consumer). Premium is rarely justified before product-market fit.

---

### 2. Mechanical Engineering

3D CAD, tolerance analysis, mold design, FEA simulation.

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Simple | 2-part enclosure, no moving parts. Snap-fit or screw assembly. Badge/pendant form factor. | $3,000 | $6,000 | $10,000 |
| Medium | 3-5 parts, buttons, sealing. Watch-like assembly, gaskets, IPX4. Most AI wearables. | $8,000 | $15,000 | $25,000 |
| Complex | Hinge, slider, or modular design. Foldable, rotatable, or multi-module. AR glasses tier. | $20,000 | $35,000 | $60,000 |

**Timeline:** ~6 weeks

**Guidance:** Complexity here is driven by IP rating and moving parts. If you need IPX7 waterproofing, you're in Medium minimum. If you have a hinge or rotating mechanism, budget for Complex.

---

### 3. Electronics Engineering

Schematic, PCB layout, power design, signal integrity.

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| MCU-based | ESP32-S3 tier. Simple SoC + sensors + BLE. 2-layer or 4-layer PCB. | $3,000 | $5,000 | $8,000 |
| Application processor | Rockchip/MTK tier. DDR routing, high-speed interfaces, 4-6 layer PCB. | $8,000 | $15,000 | $25,000 |
| Advanced | Multi-board, flex, RF custom. Rigid-flex PCB, custom antenna, multiple power domains. | $20,000 | $35,000 | $55,000 |

**Timeline:** ~6 weeks

**Guidance:** The SoC choice determines your tier. ESP32-S3 = MCU-based. Anything with DDR memory (RK3562, RK3588S, Genio) = Application processor. If you need rigid-flex or a custom antenna, you're in Advanced.

---

### 4. Firmware & Software

BSP, drivers, application logic, OTA, cloud integration.

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Basic | Sensor + BLE + app. Data collection, BLE transfer to phone app. No on-device AI. | $5,000 | $10,000 | $18,000 |
| On-device AI | Inference + cloud sync. Edge model deployment, voice/vision processing, OTA updates. | $15,000 | $30,000 | $50,000 |
| Full stack | Device + app + cloud backend. Complete product software: firmware, mobile app, API, dashboard. | $30,000 | $60,000 | $100,000 |

**Timeline:** ~10 weeks

**Guidance:** Firmware is almost always the longest pole in the tent. If you need a mobile app, that's a separate workstream. Full stack is justified only if you're building the cloud backend from scratch -- consider using existing IoT platforms (AWS IoT, Azure IoT Hub) first.

---

### 5. Tooling & Molds

Injection mold fabrication, jigs, fixtures, test equipment.

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Soft mold | Aluminum, <500 units. Quick-turn prototype mold. 2-3 week lead time. Limited shots. | $500 | $1,500 | $3,000 |
| Production mold | Steel, simple 2-part. P20 steel, 100K+ shot life. Standard for most products. | $3,000 | $6,000 | $12,000 |
| Complex mold | Multi-cavity, side actions. H13 steel, overmolding, slides. Premium finish products. | $10,000 | $20,000 | $40,000 |

**Timeline:** ~5 weeks

**Guidance:** Start with a soft mold for EVT if your design isn't finalized. Cutting a steel mold before design freeze is the most expensive mistake in hardware -- modification costs 30-50% of the original mold. A soft mold for 50-200 EVT/DVT units, followed by a steel production mold, is the standard path.

---

### 6. Prototyping

Functional prototypes for testing and investor demos.

| Item | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| 3D printed enclosure (3-5 units) | SLA/SLS prints for form factor and ergonomics testing. | $500 | $1,500 | $3,000 |
| PCBA prototypes (5-10 boards) | Fully assembled PCBs for firmware development and testing. | $1,000 | $3,000 | $6,000 |
| EVT build (10-30 units) | Engineering validation test. Near-final design, manual assembly. | $5,000 | $10,000 | $20,000 |
| DVT build (30-100 units) | Design validation test. Tooled enclosures, production-intent. | $10,000 | $20,000 | $40,000 |

**Timeline:** ~4 weeks per stage

**Guidance:** Don't skip prototyping stages. The progression is: 3D prints -> PCBA -> EVT -> DVT -> PVT -> mass production. Each stage catches problems that would be 10x more expensive to fix later. See the [EVT/DVT/PVT Checklist](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/evt-dvt-pvt-checklist/) for stage-specific pass/fail criteria.

---

### 7. Certification & Testing

Regulatory testing and compliance for target markets.

| Certification | Region | Low | Mid | High |
|--------------|--------|-----|-----|------|
| FCC | United States | $3,000 | $5,000 | $10,000 |
| CE / RED | European Union | $3,000 | $6,000 | $12,000 |
| UKCA | United Kingdom | $2,500 | $5,000 | $10,000 |
| UL / IEC 62368 | Global (Safety) | $5,000 | $10,000 | $20,000 |
| SRRC + CCC | China | $4,000 | $8,000 | $15,000 |
| MIC / TELEC | Japan | $3,000 | $5,000 | $10,000 |
| ISED | Canada | $2,000 | $4,000 | $8,000 |
| RCM | Australia & NZ | $2,000 | $4,000 | $8,000 |
| UN38.3 | Global (Battery transport) | $1,500 | $3,000 | $5,000 |

**Timeline:** ~10 weeks

**Guidance:** FCC + CE is the minimum for most startups targeting US + EU markets. Add UN38.3 if you have a lithium battery (you almost certainly do). UL is not legally required but Amazon and most major retailers require it. Budget for certification early -- it's not optional and timeline is fixed. See the [Certification Guide](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/certification-guide/) for detailed requirements per market.

---

## Example Budgets

### AI Voice Pendant (Plaud NotePin class)
| Category | Tier | Mid Estimate |
|----------|------|-------------|
| Industrial Design | Standard | $12,000 |
| Mechanical Engineering | Simple | $6,000 |
| Electronics Engineering | MCU-based | $5,000 |
| Firmware & Software | On-device AI | $30,000 |
| Tooling | Production mold | $6,000 |
| Prototyping | EVT + DVT | $30,000 |
| Certification | FCC + CE + UN38.3 | $14,000 |
| **Total NRE** | | **$103,000** |

### AI Smart Camera (edge vision device)
| Category | Tier | Mid Estimate |
|----------|------|-------------|
| Industrial Design | Standard | $12,000 |
| Mechanical Engineering | Medium | $15,000 |
| Electronics Engineering | Application processor | $15,000 |
| Firmware & Software | Full stack | $60,000 |
| Tooling | Production mold | $6,000 |
| Prototyping | EVT + DVT | $30,000 |
| Certification | FCC + CE + UL + UN38.3 | $24,000 |
| **Total NRE** | | **$162,000** |

### Key Insight

NRE is front-loaded -- you spend it before you have revenue. For a 1,000-unit first run at $30/unit BOM, your NRE ($100K+) is 3x your production cost ($30K). This ratio improves dramatically at 10K units but is painful at launch. Plan your fundraising accordingly.

---

## Timeline Overview

These phases overlap but follow this general sequence:

```
Weeks 1-4:   Industrial Design
Weeks 3-8:   Mechanical Engineering (starts after initial ID concepts)
Weeks 3-8:   Electronics Engineering (parallel with ME)
Weeks 5-14:  Firmware & Software (starts after first PCBA prototypes)
Weeks 8-12:  Tooling (after design freeze)
Weeks 6-16:  Prototyping (EVT -> DVT, overlaps with above)
Weeks 14-24: Certification (after DVT, requires final design)
```

**Total typical timeline: 6-9 months from kickoff to production-ready.**

---

*Interactive version: [breezehw.com/tools/nre-simulator](https://breezehw.com/tools/nre-simulator)*

---

## Source: certification-guide/certification-decision-tree.md

<!-- GENERATED from certification-guide/certification-decision-tree.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# Certification Decision Tree for AI Hardware

A practical guide to regulatory certifications for AI hardware devices. Covers which certifications you need, what they cost, how long they take, and how to avoid the mistakes that delay most first-time hardware companies by 2-3 months.

---

## Step 1: Identify Your Target Markets

Your target markets determine which certifications are mandatory:

| Market | Required Certs | Optional but Recommended |
|--------|---------------|------------------------|
| United States | FCC | UL / IEC 62368 |
| European Union | CE / RED | -- |
| United Kingdom | UKCA (Great Britain) — CE still valid in Northern Ireland | -- |
| China | SRRC + CCC (if applicable) | CQC for lithium cells |
| Japan | MIC / TELEC | -- |
| Canada | ISED | -- |
| Australia & New Zealand | RCM (covers EMC + radio + safety) | -- |
| Global (all major) | FCC + CE + UKCA + UL + SRRC + MIC + ISED + RCM | -- |

**If your device has a lithium battery (almost all AI hardware does), add UN38.3 to every market.** Without it, your batteries cannot be shipped by air. Your entire supply chain stops.

---

## Step 2: Understand Each Certification

### FCC (United States)

**Full name:** Federal Communications Commission  
**What it covers:** Any electronic device that emits RF energy sold in the US -- intentional radiators (WiFi, BLE, cellular) and unintentional radiators (digital devices).  
**Timeline:** 4-8 weeks  
**Cost:** $3,000-10,000

**Key requirements:**
- FCC Part 15 for WiFi/BLE (intentional radiator)
- FCC Part 15B for digital devices (unintentional radiator)
- FCC ID required -- must apply through a Grantee Code
- 5 production-representative samples needed
- Label with FCC ID must be visible or e-label for small devices

**Tips:**
- Apply for a Grantee Code early -- it takes 1-2 weeks
- Pre-scan at a local EMC lab ($500-1000) before formal testing saves rework
- Small devices (<8cm) can use e-labeling instead of physical FCC ID label
- If using a pre-certified WiFi module, you may only need unintentional radiator testing (significant cost savings)

**Test labs:** Bureau Veritas (Shenzhen), TUV SUD, SGS, Intertek

---

### CE / RED (European Union)

**Full name:** Radio Equipment Directive (2014/53/EU)  
**What it covers:** Mandatory for placing radio equipment on the EU market. Covers safety (LVD), EMC, and radio spectrum requirements.  
**Timeline:** 6-10 weeks  
**Cost:** $3,000-12,000

**Key requirements:**
- EN 301 489 -- EMC for radio equipment
- EN 300 328 -- 2.4GHz WiFi/BLE
- EN 62368-1 -- Safety (replaces EN 60950-1)
- EN 62311 -- Human exposure to electromagnetic fields (SAR for body-worn)
- Declaration of Conformity (DoC) required
- Authorized representative in the EU required since 2021

**Tips:**
- CE and FCC testing can be done in parallel at the same lab to save time
- Body-worn devices need SAR testing -- budget extra $3K-5K
- You need an EU-based Authorized Representative (can be a service for ~$500/yr)
- Keep the Technical File (design docs, test reports, risk assessment) for 10 years

**Test labs:** SGS (Shenzhen), Bureau Veritas, TUV Rheinland, CTTL

---

### UL / IEC 62368 (Global Safety)

**Full name:** UL 62368-1 / IEC 62368-1 Safety Certification  
**What it covers:** Product safety for audio/video, IT, and communication equipment. Covers fire, electric shock, and mechanical hazards.  
**Timeline:** 8-14 weeks  
**Cost:** $5,000-20,000  
**Legally required?** No -- but major retailers (Amazon, Best Buy, Target) and insurance companies often require it.

**Key requirements:**
- Battery-powered devices: battery must meet IEC 62133 or UL 2054
- Charging system evaluated for abnormal conditions
- All safety-critical components must be UL-recognized or tested
- Factory inspection required (initial + annual follow-up)

**Tips:**
- Start with a preliminary review -- UL offers "pre-submission" consultations
- Amazon often requires UL certification for lithium battery products
- CB Scheme report (IEC 62368-1) can be transferred to multiple national marks
- Annual factory inspections: budget $2K-4K/year ongoing cost

**Test labs:** UL (direct), TUV SUD, CSA Group, Intertek (ETL)

---

### SRRC (China)

**Full name:** State Radio Regulation of China  
**What it covers:** Radio type approval required for any wireless device sold in China.  
**Timeline:** 6-10 weeks  
**Cost:** $4,000-15,000

**Key requirements:**
- Type approval application to MIIT (Ministry of Industry and Information Technology)
- Testing at designated Chinese lab
- Chinese entity required as applicant (or local agent)
- 5 samples required
- SRRC certificate valid for 5 years

**Tips:**
- If you have a Shenzhen manufacturing partner, they can be the local applicant
- SRRC must be obtained BEFORE applying for CCC
- Pre-certified WiFi/BLE modules reduce scope to just the host device
- Processing time has improved -- typically 4-6 weeks after submission

**Test labs:** CTTL (Beijing), CESI, CTC (Shenzhen), MTNet

---

### CCC (China)

**Full name:** China Compulsory Certification  
**What it covers:** Compulsory for specific product categories sold in China. Not all electronics require CCC -- check the CCC catalog.  
**Timeline:** 8-16 weeks  
**Cost:** $5,000-20,000  
**Legally required?** Only if your product falls in the CCC catalog.

**Key requirements:**
- Must be in the CCC product catalog to be required
- Factory audit required (initial + annual)
- SRRC must be obtained first (if wireless)
- Testing at CNCA-designated lab
- Chinese entity required as certificate holder

**Tips:**
- Many AI wearables are CCC-exempt -- check the catalog before budgeting
- Battery-only devices (no mains power) are often exempt
- If exempt from CCC, voluntary CQC mark is available but rarely needed
- Factory audit can be done at your Shenzhen manufacturing facility

**Test labs:** CQC (direct), CESI, CTC

---

### MIC / TELEC (Japan)

**Full name:** Ministry of Internal Affairs and Communications  
**What it covers:** Technical standards conformity certification for radio equipment in Japan.  
**Timeline:** 4-8 weeks  
**Cost:** $3,000-10,000

**Key requirements:**
- TELEC certification for specified radio equipment
- Testing per ARIB standards
- Japanese entity as applicant (or registered agent)
- Technical document submission in Japanese

**Tips:**
- Many test labs in Shenzhen can do TELEC testing
- Can run in parallel with FCC/CE testing
- Pre-certified modules simplify the process significantly
- Japan has specific requirements for 5GHz WiFi DFS channels

**Test labs:** TUV Rheinland (Shenzhen), SGS, Bureau Veritas

---

### ISED (Canada)

**Full name:** Innovation, Science and Economic Development Canada  
**What it covers:** Canadian radio certification, similar to FCC.  
**Timeline:** 4-6 weeks  
**Cost:** $2,000-8,000

**Key requirements:**
- RSS-247 for WiFi/BLE devices
- RSS-102 for RF exposure (SAR for body-worn)
- ISED certification number on label
- Can often use same test data as FCC (save cost)

**Tips:**
- File FCC and ISED together -- many labs do both in one test run
- ISED accepts FCC test data for most parameters
- If selling via Amazon.ca, ISED certification is mandatory
- Processing time is typically faster than FCC

**Test labs:** Same labs as FCC -- Bureau Veritas, SGS, TUV

---

### UN38.3 (Battery Transport -- Global)

**Full name:** UN Manual of Tests and Criteria -- Section 38.3  
**What it covers:** Required for ALL lithium battery products for air/sea transport.  
**Timeline:** 3-6 weeks  
**Cost:** $1,500-5,000

**Key requirements:**
- 8 tests: altitude, thermal, vibration, shock, short circuit, impact, overcharge, forced discharge
- Test report (not certification) is the deliverable
- Must test the specific cell AND the battery pack
- MSDS (Material Safety Data Sheet) also required for shipping

**Tips:**
- Source batteries from suppliers who already have UN38.3 reports
- Custom battery shapes require new testing -- use standard cells when possible
- Keep the UN38.3 report accessible -- freight forwarders will ask for it
- Some airlines have additional requirements beyond UN38.3

**Test labs:** SGS, Bureau Veritas, TUV, UL

---

## Step 3: Plan Your Certification Strategy

### For US + EU launch (most common for AI startups):

| Certification | Cost (Mid) | Timeline | When to Start |
|--------------|-----------|----------|---------------|
| FCC | $5,000 | 4-8 weeks | After DVT build |
| CE / RED | $6,000 | 6-10 weeks | Parallel with FCC |
| UN38.3 | $3,000 | 3-6 weeks | During DVT (battery must be final) |
| UL (if Amazon) | $10,000 | 8-14 weeks | Parallel with above |
| **Total** | **$14,000-24,000** | **10-14 weeks** | |

### Money-saving tactics:

1. **Use pre-certified wireless modules.** If your WiFi/BLE module already has FCC/CE/ISED approval, you only need unintentional radiator testing for the host device. This can cut FCC cost by 40-60%.

2. **Test FCC + CE + ISED at the same lab in one run.** Most Shenzhen labs can do all three. Shared setup saves $2K-4K.

3. **Pre-scan before formal testing.** A $500-1000 pre-scan at a local EMC lab catches 80% of issues. Failing formal testing and re-submitting costs $3K-5K in wasted time and fees.

4. **Don't certify before design freeze.** Any PCB change after certification means re-testing. This is the most expensive mistake first-time hardware companies make.

---

## Common Mistakes

1. **Starting certification too early.** Certify after DVT, not EVT. EVT designs change.
2. **Forgetting UN38.3.** Your logistics partner will refuse to ship without it.
3. **Not budgeting for SAR testing.** Body-worn devices need it for CE. Budget $3K-5K extra.
4. **Changing the PCB after certification.** Any change to the RF section requires re-testing.
5. **Not having an EU Authorized Representative.** Required since 2021. Services cost ~$500/yr.
6. **Underestimating timeline.** Certification labs have queues. Book your slot 4-6 weeks before samples are ready.

---

*Interactive version: [breezehw.com/tools/cert-navigator](https://breezehw.com/tools/cert-navigator)*

---

## Source: evt-dvt-pvt-checklist/validation-stages.md

<!-- GENERATED from evt-dvt-pvt-checklist/validation-stages.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# EVT / DVT / PVT Validation Checklist for AI Hardware

Every hardware product goes through three validation stages before mass production: Engineering Validation Test (EVT), Design Validation Test (DVT), and Production Validation Test (PVT). Each stage has specific pass/fail criteria. Skipping stages or rushing through them is the most common cause of failed product launches.

This checklist is written for AI hardware -- wearables, edge AI devices, voice recorders, smart cameras -- where thermal management, RF performance, battery life, and OTA firmware updates are critical and often underestimated.

---

## EVT -- Engineering Validation Test

**Goal:** Prove the core technology works. Does the electronics function? Can the AI model run? Is the form factor viable?  
**Typical volume:** 10-30 units  
**Assembly:** Hand-soldered or semi-automated. 3D printed enclosures.  
**Who's involved:** Hardware engineer, firmware engineer, ID designer

### Electronics

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| E1 | All voltage rails within spec | Measured within +/-5% of target under load | Use oscilloscope, not just multimeter |
| E2 | SoC boots and runs basic firmware | Linux/RTOS boots, serial console accessible | Don't proceed without this |
| E3 | All peripherals functional | Each sensor, radio, display, mic responds to test commands | Test individually before integration |
| E4 | Power consumption measured in each mode | Sleep, idle, active, peak AI inference -- all recorded | This is your battery life budget baseline |
| E5 | USB-C charging functional | Charges from 0-100% without overheating | Monitor battery temperature during charge |
| E6 | No magic smoke | 48-hour burn-in with no component failures | Run at room temp, not in ideal lab conditions |

### AI / Inference

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| A1 | AI model runs on target SoC | Inference completes without crash or timeout | Use production model, not desktop version |
| A2 | Inference latency measured | Within acceptable range for user experience | Voice: <500ms. Vision: <200ms per frame |
| A3 | Model accuracy on device | Accuracy within 5% of desktop/cloud version | Quantization should not destroy performance |
| A4 | Thermal during sustained inference | SoC junction temp <85C after 30 min continuous inference | Use thermocouple on SoC package |
| A5 | Power during inference measured | Current draw recorded at AI inference peak | This determines your real battery life |

### Mechanical / Form Factor

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| M1 | PCB fits in enclosure | All connectors, buttons, ports align with openings | 3D print tolerance is looser than injection mold |
| M2 | User can interact with all controls | Buttons, touch surfaces, mic holes accessible | Test with actual humans, not CAD models |
| M3 | Battery fits with clearance | No pressure on battery. >=1mm clearance on all sides | LiPo swelling is normal -- leave room |
| M4 | Weight within target | Total assembly weight measured | Users notice 10g differences in wearables |

### RF / Connectivity

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| R1 | WiFi connects and transfers data | RSSI >-70dBm at 5m, stable file transfer | Test with enclosure on, not bare PCB |
| R2 | BLE connects to phone app | Pairs and maintains connection at 10m | Test with both iOS and Android |
| R3 | Antenna performance with enclosure | No more than 3dB degradation vs. bare board | Enclosure material detunes antennas |

### EVT Exit Criteria

- [ ] All E1-E6 checks pass
- [ ] At least A1-A3 pass (A4-A5 can be marginal if thermal fix is identified)
- [ ] M1-M3 pass (M4 can be within 20% of target)
- [ ] R1-R2 pass
- [ ] Bug list created with severity ratings
- [ ] Design changes for DVT documented

**Do NOT proceed to DVT if:** SoC doesn't boot reliably, AI model can't run on device, or power consumption is >2x budget.

---

## DVT -- Design Validation Test

**Goal:** Prove the product design works for users and can survive real-world conditions. This is where you test reliability, usability, and regulatory pre-compliance.  
**Typical volume:** 30-100 units  
**Assembly:** Production-intent. Injection-molded enclosures (soft mold OK). SMT assembly line.  
**Who's involved:** Full team + beta testers + test lab

### Reliability

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| D1 | Drop test | Survives 1.2m drop onto concrete on all 6 faces + edges | IEC 60068-2-31. 2 drops per orientation |
| D2 | Temperature cycling | Functions at -10C to +50C (or product spec) | 10 cycles, 30 min dwell at each extreme |
| D3 | Humidity exposure | Functions after 48hr at 85% RH, 35C | Condensation on PCB = design issue |
| D4 | Button/switch endurance | 10,000 press cycles without failure | Use automated test rig |
| D5 | Connector durability | USB-C: 5,000 insert/remove cycles | Check for intermittent connections |
| D6 | Battery cycle life | >300 charge cycles to 80% original capacity | Accelerated testing protocol |

### Thermal (Full Characterization)

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| T1 | Skin temperature (wearable) | <42C on any user-facing surface | IEC 62368-1 burn threshold for continuous contact |
| T2 | SoC junction temp under sustained load | <90C (absolute max), <80C recommended | Measure at worst case: max inference + charging |
| T3 | Battery temperature during charging | <45C during fast charge, <40C during normal | Above 45C = accelerated degradation |
| T4 | Thermal throttling behavior | Graceful degradation, not hard crash | Device should reduce performance, not shut off |

### Battery & Power

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| B1 | Battery life matches claims | Actual runtime within 10% of spec (per mode) | Test all modes: standby, active, inference |
| B2 | Charge time | 0-100% within spec | Measure at 5V/1A and 5V/2A if applicable |
| B3 | Low battery behavior | Warning at 10%, safe shutdown at 5% | No data corruption on low-battery shutdown |
| B4 | Charge protection | Stops at 4.2V, no overcharge after 24hr on charger | Leave on charger for 72hr stress test |

### RF Pre-Compliance

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| P1 | Conducted emissions pre-scan | Within FCC Part 15 limits (with margin) | Use a pre-compliance EMC lab ($500-1000) |
| P2 | Radiated emissions pre-scan | Within limits at 3m distance | Catches most show-stoppers before formal test |
| P3 | Receiver sensitivity | WiFi/BLE sensitivity within module datasheet spec | Degraded sensitivity = antenna or layout issue |
| P4 | SAR pre-assessment (body-worn) | Estimated SAR within limits for target markets | Required for CE on wearables |

### Firmware / OTA

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| F1 | OTA update succeeds | 100% success rate over 20 consecutive updates | Test over WiFi and BLE |
| F2 | OTA failure recovery | Device recovers from: power loss mid-update, corrupted image, network drop | Must not brick the device |
| F3 | Factory reset | Clears all user data, returns to out-of-box state | Verify with flash dump |
| F4 | Firmware rollback | Can revert to previous version if update causes issues | Dual-bank architecture |
| F5 | Production provisioning | Unique ID, certs, and calibration in <30sec/unit | Test the factory tool, not just the device |

### Usability

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| U1 | Setup time | New user completes setup in <5 minutes | Test with 5+ people who haven't seen the device |
| U2 | Voice recognition accuracy (if applicable) | >90% word accuracy at 0.5m in quiet room | Test with multiple accents |
| U3 | Physical comfort (wearable) | 4+ hours continuous wear without complaint | Test with 10+ diverse body types |
| U4 | LED/status indicators | Users correctly identify device state >80% of the time | Don't assume blinking patterns are intuitive |

### DVT Exit Criteria

- [ ] All D1-D6 reliability tests pass
- [ ] All T1-T4 thermal tests pass
- [ ] B1-B4 battery tests pass
- [ ] P1-P3 pre-compliance pass (P4 if body-worn)
- [ ] F1-F5 firmware tests pass
- [ ] U1-U4 usability tests pass (or issues have identified fixes)
- [ ] Design freeze declared -- no more PCB or mechanical changes
- [ ] Formal certification testing booked (FCC, CE, etc.)
- [ ] Production mold (steel) ordered

**Do NOT proceed to PVT if:** Any reliability test fails, pre-compliance shows issues, or OTA doesn't work reliably. These problems get worse at scale, not better.

---

## PVT -- Production Validation Test

**Goal:** Prove the factory can build the product consistently at quality and speed targets. This is not a design validation -- it's a manufacturing process validation.  
**Typical volume:** 100-500 units (first production run)  
**Assembly:** Full production line. Production tooling. Production test fixtures.  
**Who's involved:** Manufacturing engineer, QA, factory team

### Production Line

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| L1 | SMT yield | >98% first-pass yield | Measure before and after reflow |
| L2 | Assembly cycle time | Within target takt time | Bottlenecks here set your max throughput |
| L3 | ICT/flying probe pass rate | >99% | Low yield = PCB or component issue |
| L4 | Functional test pass rate | >95% first pass | Below 95% = design or fixture issue, not operator |
| L5 | Cosmetic inspection | <2% rejection rate | Define accept/reject criteria with photos |

### Quality

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| Q1 | Golden sample match | PVT units match DVT golden sample in all specs | Side-by-side comparison |
| Q2 | Unit-to-unit consistency | Key specs within +/-10% across 20 random units | Power consumption, WiFi RSSI, mic sensitivity |
| Q3 | Packaging drop test | Retail packaging survives ISTA 2A (or equivalent) | Product inside packaging, not bare product |
| Q4 | Outgoing QC sampling | AQL 2.5 for critical, AQL 4.0 for major | Define defect classification before production |

### Firmware & Provisioning

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| FP1 | Provisioning throughput | <30 seconds per unit including test | Time the full sequence end-to-end |
| FP2 | Unique credentials verified | Each unit has unique device ID, certificates | Spot-check 10 random units |
| FP3 | Firmware version locked | All units ship with approved firmware version | No "latest build" -- use a tagged release |
| FP4 | OTA server ready | Production OTA endpoint live and tested | Deploy to 10 PVT units before shipping any |

### Certification & Compliance

| # | Check | Pass Criteria | Notes |
|---|-------|--------------|-------|
| C1 | All certifications received | FCC, CE, UL, UN38.3 (as applicable) certs in hand | Do not ship without certs |
| C2 | Regulatory markings correct | FCC ID, CE mark, model number, voltage/current correct on device and packaging | Check every character |
| C3 | Safety documentation complete | User manual with safety warnings, warranty card | Regulatory requirement in most markets |
| C4 | RoHS/REACH compliance | All materials declaration forms collected from suppliers | EU market requirement |

### PVT Exit Criteria

- [ ] L1-L5 production line checks pass
- [ ] Q1-Q4 quality checks pass
- [ ] FP1-FP4 provisioning checks pass
- [ ] C1-C4 certification and compliance checks pass
- [ ] Packing and shipping process validated
- [ ] Customer support documentation ready (setup guide, FAQ, RMA process)
- [ ] Mass production authorized

**Do NOT ship if:** First-pass yield is below 95%, unit-to-unit variation exceeds spec, or any certification is missing. Fix the process before scaling.

---

## Timeline Summary

| Stage | Typical Duration | Units | Key Deliverable |
|-------|-----------------|-------|-----------------|
| EVT | 4-6 weeks | 10-30 | Proof of concept. Core tech works. |
| DVT | 6-10 weeks | 30-100 | Validated design. Ready for certification. |
| PVT | 4-6 weeks | 100-500 | Production process validated. Ready to ship. |
| **Total** | **14-22 weeks** | | |

Each stage can run longer if problems are found. Budget 6 months from EVT start to first shipment -- 9 months is more realistic for a first product.

---

## Common Mistakes

1. **Skipping EVT and going straight to "prototype."** Without structured testing, you'll discover fundamental issues during certification (the most expensive time to find them).
2. **Not doing reliability testing during DVT.** Drop tests and temperature cycling reveal design weaknesses that show up as field returns.
3. **Treating PVT as a design stage.** If you're still making PCB changes during PVT, you're not in PVT -- you're still in DVT. Go back.
4. **Not testing OTA before shipping.** Your first OTA update to real customers will reveal every edge case you missed. Test with PVT units first.
5. **Skipping pre-compliance.** A $500-1000 pre-scan catches 80% of EMC issues. Failing formal FCC testing costs $5K+ and 6-8 weeks.

---

## Source: supplier-qualification/supplier-red-flags.md

<!-- GENERATED from supplier-qualification/supplier-red-flags.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# Supplier Red Flags -- Evaluating Shenzhen Electronics Manufacturers

A checklist for evaluating electronics manufacturing suppliers in Shenzhen and the Pearl River Delta. Written for technical founders evaluating suppliers for their first production run -- not for procurement professionals doing routine factory audits.

This guide focuses on electronics-specific red flags. Generic factory audits (ISO certification, worker conditions, fire exits) are important but well-covered elsewhere. These are the things that specifically kill AI hardware projects.

---

## Before You Visit: Desktop Research

### Red Flags You Can Find Online

| # | Red Flag | What It Means | How to Check |
|---|----------|---------------|-------------|
| 1 | **No own factory -- "trading company" pretending to be manufacturer** | They'll subcontract your order, can't control quality, and will mark up 15-30%. You lose visibility into who's actually building your product. | Ask for factory photos with their name visible. Check business license (营业执照) -- "贸易" (trade) vs "制造" (manufacturing). Search 天眼查 (Tianyancha) or 企查查 (Qichacha) for company type. |
| 2 | **Brand new company (< 2 years)** | Startups fail. If your supplier folds mid-production, your molds, your components, and your deposit go with them. | Check registration date on Tianyancha. Ask for references from 2+ years ago. |
| 3 | **Claims to do everything** | "We do PCB, SMT, injection mold, CNC, packaging, certification, and software." No factory does all of these well. They're subcontracting most of it. | Insist on visiting the specific production lines for your product. If they can't show you their own SMT line, they don't have one. |
| 4 | **Won't share BOM cost breakdown** | If a supplier won't show you component-level pricing, they're hiding margins (30-50% vs. the 10-15% that's normal). | Request an open BOM with component costs. Verify key components against LCSC/DigiKey pricing. |
| 5 | **No experience with your SoC platform** | If they've never built a Rockchip or ESP32 product, they'll learn on your project. Your timeline will slip 2-4 months. | Ask for 3 previous projects using the same SoC family. Ask to speak with those customers. |

---

## During the Factory Visit

### Production Capability

| # | Red Flag | What It Means | What to Look For |
|---|----------|---------------|-----------------|
| 6 | **SMT line is idle or running someone else's boards** | They don't have enough business to keep the line running. Your order may not get priority, or the line operators are inexperienced. | Visit unannounced if possible. A healthy SMT line runs 2 shifts (16hr/day). Ask what's currently on the line. |
| 7 | **No solder paste inspection (SPI) machine** | SPI catches 70% of defects before they become expensive rework. Without it, expect 2-5% defect rate on fine-pitch components (QFN, BGA). | Look for an SPI machine between the stencil printer and pick-and-place. If they only have AOI (after reflow), that's a yellow flag. |
| 8 | **No reflow oven temperature profiling** | Each PCB design needs a specific temperature profile. Without profiling, you get cold solder joints (intermittent failures) or component damage. | Ask to see the reflow profile for a current product. They should have a thermocouple setup and profile data. |
| 9 | **Manual soldering for production (not just rework)** | If they're hand-soldering components that should be machine-placed, their SMT line can't handle your design complexity. | Look at the boards on the line. Any hand-soldering of 0402 passives or fine-pitch ICs = problem. |
| 10 | **No functional test station** | Every board should be tested after assembly. "We test 10% by sampling" is not acceptable for electronics. | Ask to see the test station. There should be a test jig, a test script, and a log of test results per board. |

### Component Sourcing

| # | Red Flag | What It Means | What to Look For |
|---|----------|---------------|-----------------|
| 11 | **Sources components from Huaqiangbei (华强北) street markets** | Huaqiangbei components are often counterfeit, pulls (used), or off-spec. A counterfeit MCU or PMIC will cause random field failures. | Ask where they source ICs. Acceptable: LCSC, Mouser, DigiKey, authorized distributors, direct from manufacturer. Not acceptable: "the market." |
| 12 | **Won't let you specify component sources in the BOM** | They want to substitute cheaper (possibly fake) parts. This is the #1 cause of "it worked in prototyping but fails in production." | Your BOM should specify approved manufacturers and part numbers. The supplier should agree in the contract. |
| 13 | **No incoming quality inspection (IQC)** | They're not checking components before they go onto the line. Bad components become bad products. | Look for an IQC area near the warehouse. They should have: LCR meter (for passives), microscope (for IC markings), and moisture-sensitive component (MSL) storage. |
| 14 | **Moisture-sensitive components stored in open air** | BGA packages, MEMS microphones, and many ICs are moisture-sensitive. If not stored in dry cabinets or used within the MSL exposure window, they'll crack during reflow ("popcorn effect"). | Look for dry cabinets (humidity <10% RH) in the component storage area. Check if they track MSL exposure time. |

### Quality System

| # | Red Flag | What It Means | What to Look For |
|---|----------|---------------|-----------------|
| 15 | **No version control on manufacturing documents** | If the assembly instructions, test procedures, and BOM don't have revision numbers, your production run will be built to an unknown spec. | Ask to see the traveler (production work order) for a current product. It should reference specific BOM revision, firmware version, and test procedure version. |
| 16 | **Can't show you defect rate data** | If they don't track defects, they can't improve. You'll get the same problems on every batch. | Ask for first-pass yield data from the last 3 months. Good SMT lines: >98%. Good final assembly: >95%. |
| 17 | **No traceability** | If a field failure occurs, you need to trace it back to the production batch, component lot, and operator. Without traceability, you're debugging blind. | Ask how they trace a finished unit back to component lots. They should be able to show you: serial number -> test record -> component lot numbers. |
| 18 | **"We'll fix it in rework"** | A culture of rework means the process isn't controlled. Rework introduces new defects (heat damage, solder bridges). | Look at the rework area. If it's bigger than the production test area, that's a problem. |

---

## During Negotiations

### Business Red Flags

| # | Red Flag | What It Means | How to Handle |
|---|----------|---------------|--------------|
| 19 | **Requires >50% deposit before production** | Standard is 30% deposit, 70% before shipping. More than 50% upfront puts you at risk if they underperform or disappear. | Negotiate 30/70 terms. For new suppliers, consider: 30% deposit, 30% at first article approval, 40% before shipping. |
| 20 | **Won't sign an NNN agreement** | NNN = Non-disclosure, Non-use, Non-circumvention. A Chinese-law NNN (not a US NDA) is the minimum protection for your IP in China. | Prepare an NNN agreement under Chinese law, in Chinese and English. If they refuse to sign, walk away. |
| 21 | **Mold ownership is unclear** | Your molds are your IP. If the contract doesn't state you own the molds, the factory may hold them hostage when you want to move production. | Contract must explicitly state: molds are your property, factory stores them for you, you can request transfer at any time (with reasonable notice). |
| 22 | **No penalty clause for defect rates** | Without contractual quality standards, you have no leverage when quality drops. | Include in contract: maximum defect rate (e.g., <2% AQL 2.5), retest/rework at factory's cost if exceeded, right to reject the entire batch above threshold. |
| 23 | **Pressures you to skip EVT/DVT stages** | "We can go straight to mass production, save you 2 months." They're cutting corners. | Insist on the full EVT -> DVT -> PVT progression. A good supplier knows why these stages exist and will support them. See the [EVT/DVT/PVT Checklist](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/evt-dvt-pvt-checklist/). |

---

## AI Hardware-Specific Red Flags

These are unique to AI/ML hardware and won't appear on generic supplier checklists:

| # | Red Flag | What It Means |
|---|----------|---------------|
| 24 | **No experience with NPU/AI SoCs** | AI SoCs (Rockchip RK3588S, MediaTek Genio, Qualcomm QCS) have specific BSP requirements, thermal constraints, and DDR routing rules. A supplier without experience will make layout mistakes that cause signal integrity issues. Ask for previous products with NPUs. |
| 25 | **No thermal testing capability** | AI devices run hotter than standard consumer electronics. If the supplier can't do thermal imaging or thermocouple testing, they can't validate your thermal design. Look for a FLIR camera or equivalent. |
| 26 | **No RF test chamber or antenna test capability** | Most AI devices are wireless. If the supplier can't measure antenna performance, you won't know about RF issues until formal certification (the most expensive time to discover them). An anechoic chamber or at minimum a conducted test setup. |
| 27 | **No firmware programming/provisioning infrastructure** | AI devices need unique credentials, model updates, and calibration data. If the supplier expects you to manually flash each unit via USB, your production will be capped at ~50 units/day. Ask about their automated programming capability. |
| 28 | **Dismisses your thermal concerns** | "Don't worry, we'll add a thermal pad." If the supplier doesn't take thermal seriously during design review, your device will throttle, overheat, or fail reliability testing. The supplier should ask you about thermal simulation results, not dismiss the concern. |

---

## Green Flags -- What Good Suppliers Look Like

Not everything is a red flag. Here's what to look for in a strong supplier:

| Signal | What It Indicates |
|--------|------------------|
| Shows you their defect tracking dashboard without being asked | Data-driven quality culture |
| Asks detailed questions about your SoC, power budget, and antenna design | They understand the technical challenges |
| Suggests design changes that save cost or improve manufacturability | DFM expertise -- they've seen this before |
| Has a dedicated NPI (New Product Introduction) team | They know how to handle first-time products |
| Can show you 3+ products in a similar category (wearable, IoT, AI) | Relevant experience |
| Offers to do a DFM review before quoting | They want to give you an accurate quote, not a low-ball |
| Has ESD protection at every workstation | Basic but often missing at smaller factories |
| Documents everything in WeChat/email (not just verbal promises) | Professional communication that creates a paper trail |

---

## Supplier Evaluation Scorecard

Use this to compare 2-3 suppliers side by side:

| Category | Weight | Supplier A | Supplier B | Supplier C |
|----------|--------|-----------|-----------|-----------|
| Technical capability (SoC experience, SMT line, test equipment) | 30% | /10 | /10 | /10 |
| Quality system (IQC, SPI, traceability, defect tracking) | 25% | /10 | /10 | /10 |
| Component sourcing (authorized channels, IQC, MSL handling) | 15% | /10 | /10 | /10 |
| Business terms (payment, IP protection, mold ownership) | 15% | /10 | /10 | /10 |
| Communication (English capability, responsiveness, documentation) | 10% | /10 | /10 | /10 |
| Price competitiveness | 5% | /10 | /10 | /10 |

Note that price is only 5% of the weight. The cheapest supplier is almost never the best choice for a first production run. A 10% price advantage is meaningless if they deliver 3 months late with 15% defect rate.

---

## Source: ai-design-handoff/README.md

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
