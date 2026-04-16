# AI Hardware Manufacturing Toolkit — Complete Knowledge Base

This document contains all reference data for the AI Hardware Manufacturing Advisor: BOM pricing, DFM checklist, NRE cost framework, certification decision tree, EVT/DVT/PVT validation stages, and supplier red flags.

---

# 1. BOM Cost Reference — Shenzhen Component Pricing

All prices in USD at 1,000-unit volume. Three price points: Low (aggressive negotiation, established relationship), Mid (typical first order), High (small quantities or premium suppliers).

## Processors / SoCs

| Component | Description | Low | Mid | High | Notes |
|-----------|-------------|-----|-----|------|-------|
| ESP32-S3 | Basic AI (voice, gesture). WiFi + BLE built-in. | 2.10 | 2.50 | 3.20 | Good for voice recorders and simple sensor devices |
| Rockchip RV1103 | Camera + AI, 0.5 TOPS NPU. Plaud NotePin tier. | 3.50 | 5.00 | 7.00 | Entry-level vision AI |
| Rockchip RK3562 | Mid-range AI, 1 TOPS NPU, Mali G52 GPU. | 7.89 | 10.00 | 13.00 | Handles most on-device inference workloads |
| Rockchip RK3588S | High-end, 6 TOPS NPU, octa-core. For edge servers. | 25.00 | 35.00 | 50.00 | Overkill for wearables — use for edge AI boxes |
| MediaTek Genio 510/700 | 4-10 TOPS NPU, industrial grade. | 18.00 | 28.00 | 40.00 | Long-term availability commitment from MTK |

## Memory

| Component | Description | Low | Mid | High | Notes |
|-----------|-------------|-----|-----|------|-------|
| 512MB + 4GB eMMC | Basic: voice recorder, simple sensor device. | 2.70 | 4.00 | 5.50 | Pairs with RV1103 |
| 1GB + 8GB eMMC | Standard: camera device, on-device AI inference. | 4.20 | 6.50 | 9.00 | Most common for AI wearables |
| 2GB + 32GB eMMC | High: smart display, local LLM, multi-model AI. | 8.00 | 11.50 | 16.00 | Required for on-device LLM |
| 8MB PSRAM + 4MB Flash | MCU-tier: ESP32-S3 builds, no discrete RAM. | 0.85 | 1.40 | 2.20 | Built into ESP32-S3 module pricing |

## Display

| Component | Description | Low | Mid | High | Notes |
|-----------|-------------|-----|-----|------|-------|
| No display | Audio-only device (like Plaud NotePin). | 0 | 0 | 0 | Simplest BOM — recommended for v1 |
| 0.96in OLED (mono) | Simple status display, 128x64. | 0.80 | 1.20 | 1.80 | SSD1306 driver — well-supported |
| 1.54in AMOLED (color) | Smartwatch-tier, 240x240. | 3.00 | 5.00 | 8.00 | Significant power draw — plan battery accordingly |
| 2.4in TFT LCD IPS | Full color display, 320x240. | 2.50 | 4.00 | 6.00 | Cheapest color option |
| 2.13in E-ink | Ultra-low power, 212x104. | 4.00 | 6.00 | 9.00 | Great for always-on status displays |

## Battery

| Component | Description | Low | Mid | High | Notes |
|-----------|-------------|-----|-----|------|-------|
| 100-150mAh | Ultra-slim pendant, ~4hr runtime. | 0.40 | 0.65 | 0.90 | Minimum viable for demo devices |
| 300-500mAh | Compact wearable, ~8-12hr runtime. | 1.00 | 1.40 | 2.00 | Sweet spot for AI pendants/badges |
| 800-1000mAh | Full-day device, ~16-20hr runtime. | 1.50 | 2.20 | 3.20 | Standard for smartwatch-class devices |
| 1500-2000mAh | Multi-day, larger form factor required. | 2.50 | 3.80 | 5.50 | Requires larger enclosure — consider trade-offs |

## Connectivity

| Component | Description | Low | Mid | High | Notes |
|-----------|-------------|-----|-----|------|-------|
| WiFi + BLE (built-in) | Included in ESP32-S3. No extra cost. | 0 | 0 | 0 | Only applies to Espressif SoCs |
| BLE 5.0 module | nRF52840-based, ultra-low power. | 2.00 | 3.50 | 5.00 | Best for battery-constrained devices |
| WiFi/BT module (add-on) | For non-Espressif SoCs. | 1.50 | 2.50 | 4.00 | Required when using Rockchip/MTK SoCs |
| 4G LTE Cat-1 | Quectel EC21/EC25. Adds SIM slot + antenna. | 7.00 | 10.00 | 15.00 | Significant cost — only if WiFi not an option |
| GPS/GNSS add-on | Location tracking. | 1.50 | 5.00 | 8.00 | Additional to other connectivity |

## Sensors

| Component | Description | Low | Mid | High | Notes |
|-----------|-------------|-----|-----|------|-------|
| MEMS Microphones (x2) | PDM/I2S. Essential for voice AI. | 0.60 | 1.00 | 1.80 | Use two for noise cancellation |
| 6-axis IMU | Accelerometer + Gyroscope. | 0.40 | 0.80 | 1.50 | Activity detection and gesture recognition |
| Camera 2MP (OV2640) | Basic AI vision, fixed focus. | 1.50 | 2.50 | 4.00 | Adequate for most CV tasks |
| Camera 5MP (OV5640) | Higher resolution, auto-focus. | 3.00 | 5.00 | 8.00 | Only if resolution is a feature differentiator |
| Environmental (temp/humidity/pressure) | SHT30 + BMP280 combo. | 0.50 | 0.90 | 1.60 | Cheap to add — good for health wearables |

## Fixed Costs (Per-Unit at 1K Volume)

| Component | Description | Low | Mid | High | Notes |
|-----------|-------------|-----|-----|------|-------|
| PCB (4-layer rigid ~50cm2) | Standard 4-layer PCB for AI device. | 0.50 | 0.90 | 1.50 | Per-unit at 1K volume |
| Enclosure (injection mold 2-part) | Production injection-molded enclosure. | 4.50 | 8.00 | 13.00 | Per-unit — mold cost is separate NRE |
| SMT Assembly (medium complexity) | Pick-and-place + reflow + inspection. | 3.00 | 5.00 | 8.00 | 150-300 component placements |
| Manual assembly + testing | Final assembly and functional test. | 1.30 | 2.50 | 4.50 | Labor cost in Shenzhen — will decrease at volume |
| Passives, connectors, USB-C, LEDs | All small passive components. | 0.90 | 1.45 | 2.25 | Often underestimated — track carefully |
| Charging IC + power management | Battery charging and voltage regulation. | 0.35 | 0.65 | 1.10 | TP4056 (basic) to IP5306 (power path) |

## Quick BOM Profiles

**AI Voice Pendant (like Plaud NotePin):** ESP32-S3 ($2.50) + 8MB/4MB ($1.40) + no display ($0) + 300mAh battery ($1.40) + built-in WiFi/BLE ($0) + 2x MEMS mics ($1.00) + PCB ($0.90) + enclosure ($8.00) + SMT ($5.00) + assembly ($2.50) + passives ($1.45) + charging IC ($0.65) = **~$24.80 mid estimate per unit**

**AI Camera Badge:** RV1103 ($5.00) + 512MB/4GB ($4.00) + 0.96in OLED ($1.20) + 500mAh ($1.40) + WiFi module ($2.50) + 2MP camera ($2.50) + IMU ($0.80) + fixed costs ($18.50) = **~$35.90 mid estimate per unit**

**Edge AI Box:** RK3588S ($35.00) + 2GB/32GB ($11.50) + 2.4in TFT ($4.00) + 1500mAh ($3.80) + WiFi module ($2.50) + 5MP camera ($5.00) + environmental sensors ($0.90) + fixed costs ($18.50) = **~$81.20 mid estimate per unit**

---

# 2. DFM Checklist — 29 Items

## Thermal Management

| # | Severity | Item | Details |
|---|----------|------|---------|
| 1 | CRITICAL | Thermal simulation for SoC under peak AI inference load | Edge AI chips (RK3588S, QCS6490) can hit 85C+ during sustained inference. Run thermal simulation early. Budget 2-5mm for heat spreader or thermal pad. |
| 2 | CRITICAL | Adequate PCB copper pour for heat dissipation under SoC | Use thermal vias (array of 0.3mm vias) under the SoC pad, connected to an internal ground plane. |
| 3 | MAJOR | Enclosure material temperature rating | ABS softens at 80C. Use PC (polycarbonate) or ABS/PC blend for areas near heat sources. Add ventilation slots if >3W sustained. |
| 4 | CRITICAL | Battery positioned away from heat-generating components | LiPo batteries degrade rapidly above 45C and can swell or fail. Maintain >=3mm air gap or thermal barrier between battery and SoC. |

## Antenna & RF Design

| # | Severity | Item | Details |
|---|----------|------|---------|
| 5 | CRITICAL | Ground clearance zone around all antennas | Keep >=5mm copper-free zone around 2.4GHz antenna. 10mm for cellular. No ground plane under the antenna element. #1 cause of failed FCC/CE tests. |
| 6 | MAJOR | Antenna placement compatible with user grip/wear positions | Human body absorbs RF. Place antenna on the side facing away from the body. Test with phantom hand/body. |
| 7 | MAJOR | Antenna detuning from enclosure material | Plastic enclosures shift antenna resonant frequency. Avoid metallic paint near antennas. Tune antenna with final enclosure material. |
| 8 | MAJOR | Cellular antenna volume allocation | Multi-band cellular needs ~500-1000mm3. Consider FPC (flex PCB) antenna if space is tight. |

## Power & Battery

| # | Severity | Item | Details |
|---|----------|------|---------|
| 9 | CRITICAL | Power consumption profiled across all operating modes | AI inference can draw 10-50x more current than idle. Measure current in each mode. Size regulator for peak, not average. |
| 10 | CRITICAL | USB-C charging circuit designed safely | Use certified charging IC (TP4056 minimum, IP5306 for power path). Add over-voltage, over-current, and thermal cutoff protection. |
| 11 | MAJOR | Voltage rails sequenced correctly | Many SoCs require specific power-up sequences (core -> I/O -> memory). Read the SoC datasheet. Use PMIC with sequencing support. |
| 12 | MINOR | Battery fuel gauge or level indicator | Use a coulomb counter IC (MAX17048) for accuracy, or voltage lookup table with load compensation. |

## Mechanical & Enclosure

| # | Severity | Item | Details |
|---|----------|------|---------|
| 13 | CRITICAL | Minimum wall thickness for injection molding (>=1.0mm) | Walls <1.0mm cause short shots and sink marks. Maintain 1.2-1.5mm for ABS/PC. Keep uniform thickness to prevent warping. |
| 14 | CRITICAL | Draft angles (>=1 degree) on all vertical surfaces | Without draft, parts stick in the mold. Textured surfaces need more (1 degree per 0.025mm texture depth). |
| 15 | MAJOR | Snap-fit or screw boss design validated | Design snap-fits with 2% max strain for ABS. Add screw bosses as backup. Test with 20+ open/close cycles. |
| 16 | MINOR | Space reserved for FCC/CE/UL markings | Reserve a 15x8mm flat area for laser-engraved or pad-printed regulatory marks. Plan in ID phase. |
| 17 | MAJOR | IP rating requirements specified with sealing design | Define IP rating early. IPX4 needs gaskets. IPX7 needs O-rings, sealed connectors, and pressure-tested enclosures. |

## PCB Layout

| # | Severity | Item | Details |
|---|----------|------|---------|
| 18 | CRITICAL | High-speed signals impedance-matched (USB, MIPI, DDR) | 90 ohm differential for USB, 100 ohm for MIPI. Specify in PCB fab notes. |
| 19 | MAJOR | Decoupling capacitors within 2mm of each power pin | Long traces to decoupling caps add inductance, causing voltage droop during AI inference bursts. |
| 20 | CRITICAL | Microphone placement optimized for acoustic performance | Align mic sound port with enclosure hole (<=0.5mm offset). Add 1-2mm acoustic chamber. Keep away from speaker and motor. |
| 21 | MAJOR | Test points accessible for production testing | Add test pads for all power rails, key signals, and programming interfaces. Min pad size 1.0mm for flying probe. |
| 22 | MINOR | PCB panelized efficiently for SMT production | Design panel with 3-5mm rails, V-score or tab-routing. Keep within 100x100mm to 250x330mm for standard SMT lines. |

## Firmware & Software

| # | Severity | Item | Details |
|---|----------|------|---------|
| 23 | CRITICAL | Reliable firmware update mechanism (OTA or USB) | Implement dual-bank OTA with rollback. Test update failure scenarios (power loss mid-update, corrupted image). |
| 24 | MAJOR | Factory calibration and provisioning in production flow | Manual provisioning caps at ~100 units. Build a factory tool: program credentials, run self-test, log results in <30 seconds per unit. |
| 25 | MAJOR | AI model optimized for target SoC | Quantize to INT8. Use the SoC vendor's NPU SDK (RKNN for Rockchip, TFLite for ESP32). Profile inference time and power. |

## Compliance & Certification

| # | Severity | Item | Details |
|---|----------|------|---------|
| 26 | CRITICAL | All required certifications identified for target markets | FCC (US), CE (EU), SRRC (China), MIC (Japan). Budget 8-16 weeks and $8K-40K for testing. |
| 27 | MAJOR | EMI limits met without requiring shield can | Adding shield cans late adds $0.50-2/unit, height, and requires PCB redesign. Follow EMI best practices from the start. Pre-scan with near-field probe. |
| 28 | CRITICAL | Battery compliant with UN38.3 | Lithium batteries without UN38.3 certification cannot be shipped by air. Source batteries from suppliers with UN38.3 reports. Budget $2K-5K for custom cells. |
| 29 | MAJOR | Data privacy regulations addressed (GDPR, CCPA) | AI devices recording audio/video face strict privacy requirements. Implement on-device processing. Add clear privacy controls. |

## Summary Scorecard

| Category | Critical | Major | Minor | Total |
|----------|----------|-------|-------|-------|
| Thermal Management | 3 | 1 | 0 | 4 |
| Antenna & RF Design | 1 | 3 | 0 | 4 |
| Power & Battery | 2 | 1 | 1 | 4 |
| Mechanical & Enclosure | 2 | 2 | 1 | 5 |
| PCB Layout | 2 | 2 | 1 | 5 |
| Firmware & Software | 1 | 2 | 0 | 3 |
| Compliance & Certification | 2 | 2 | 0 | 4 |
| **Total** | **13** | **13** | **3** | **29** |

Address all 13 Critical items before committing to tooling. Major items should be resolved before DVT. Minor items can be addressed during PVT.

---

# 3. NRE Cost Estimation Framework

Non-Recurring Engineering (NRE) is the one-time cost to get from concept to production-ready product. For most AI hardware startups, NRE is $50K-200K.

## 3.1 Industrial Design (~4 weeks)

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Basic | Simple enclosure, 1 concept. Rectangular housing. MVP/dev kit. | $2,000 | $4,000 | $6,000 |
| Standard | Refined design, 2-3 concepts. Organic shapes, ergonomics, CMF spec. | $6,000 | $12,000 | $18,000 |
| Premium | Consumer-grade, 5+ concepts. Apple-level finish. Multiple rounds. | $15,000 | $30,000 | $50,000 |

## 3.2 Mechanical Engineering (~6 weeks)

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Simple | 2-part enclosure, no moving parts. Badge/pendant form factor. | $3,000 | $6,000 | $10,000 |
| Medium | 3-5 parts, buttons, sealing. Watch-like, IPX4. | $8,000 | $15,000 | $25,000 |
| Complex | Hinge, slider, modular. AR glasses tier. | $20,000 | $35,000 | $60,000 |

## 3.3 Electronics Engineering (~6 weeks)

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| MCU-based | ESP32-S3 tier. Simple SoC + sensors + BLE. 2-4 layer PCB. | $3,000 | $5,000 | $8,000 |
| Application processor | Rockchip/MTK tier. DDR routing, 4-6 layer PCB. | $8,000 | $15,000 | $25,000 |
| Advanced | Multi-board, flex, custom RF. Rigid-flex PCB. | $20,000 | $35,000 | $55,000 |

## 3.4 Firmware & Software (~10 weeks)

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Basic | Sensor + BLE + app. No on-device AI. | $5,000 | $10,000 | $18,000 |
| On-device AI | Inference + cloud sync. Edge model, OTA updates. | $15,000 | $30,000 | $50,000 |
| Full stack | Device + app + cloud backend. Complete product software. | $30,000 | $60,000 | $100,000 |

## 3.5 Tooling & Molds (~5 weeks)

| Tier | Description | Low | Mid | High |
|------|-------------|-----|-----|------|
| Soft mold | Aluminum, <500 units. Quick-turn prototype. | $500 | $1,500 | $3,000 |
| Production mold | P20 steel, 100K+ shots. Standard. | $3,000 | $6,000 | $12,000 |
| Complex mold | Multi-cavity, side actions. H13 steel, overmolding. | $10,000 | $20,000 | $40,000 |

## 3.6 Prototyping (~4 weeks per stage)

| Item | Low | Mid | High |
|------|-----|-----|------|
| 3D printed enclosure (3-5 units) | $500 | $1,500 | $3,000 |
| PCBA prototypes (5-10 boards) | $1,000 | $3,000 | $6,000 |
| EVT build (10-30 units) | $5,000 | $10,000 | $20,000 |
| DVT build (30-100 units) | $10,000 | $20,000 | $40,000 |

## 3.7 Certification & Testing (~10 weeks)

| Certification | Region | Low | Mid | High |
|--------------|--------|-----|-----|------|
| FCC | United States | $3,000 | $5,000 | $10,000 |
| CE / RED | European Union | $3,000 | $6,000 | $12,000 |
| UL / IEC 62368 | Global (Safety) | $5,000 | $10,000 | $20,000 |
| SRRC + CCC | China | $4,000 | $8,000 | $15,000 |
| UN38.3 | Global (Battery) | $1,500 | $3,000 | $5,000 |

## Example NRE Budgets

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

## Key Insight

NRE is front-loaded. For a 1,000-unit first run at $30/unit BOM, your NRE ($100K+) is 3x your production cost ($30K). This ratio improves dramatically at 10K units but is painful at launch.

## Timeline Overview

Typical: 6-9 months from kickoff to production-ready. Phases overlap:
- Weeks 1-4: Industrial Design
- Weeks 3-8: Mechanical + Electronics Engineering (parallel)
- Weeks 5-14: Firmware & Software
- Weeks 8-12: Tooling (after design freeze)
- Weeks 6-16: Prototyping (EVT -> DVT)
- Weeks 14-24: Certification (after DVT)

---

# 4. Certification Decision Tree

## Target Markets and Required Certifications

| Market | Required Certs | Optional but Recommended |
|--------|---------------|------------------------|
| United States | FCC | UL / IEC 62368 |
| European Union | CE / RED | -- |
| China | SRRC + CCC (if applicable) | -- |
| Japan | MIC / TELEC | -- |
| Canada | ISED | -- |
| Global (all major) | FCC + CE + UL + SRRC + MIC + ISED | -- |

**If your device has a lithium battery (almost all AI hardware does), add UN38.3 to every market.**

## Certification Details

### FCC (United States)
- **Timeline:** 4-8 weeks
- **Cost:** $3,000-10,000
- FCC Part 15 for WiFi/BLE (intentional radiator)
- FCC Part 15B for digital devices (unintentional radiator)
- 5 production-representative samples needed
- FCC ID required — must apply through a Grantee Code (takes 1-2 weeks)
- Pre-certified WiFi module = only unintentional radiator testing (40-60% cost savings)
- Pre-scan at local EMC lab ($500-1000) catches 80% of issues before formal testing
- Small devices (<8cm) can use e-labeling instead of physical FCC ID label
- **Test labs:** Bureau Veritas (Shenzhen), TUV SUD, SGS, Intertek

### CE / RED (European Union)
- **Timeline:** 6-10 weeks
- **Cost:** $3,000-12,000
- EN 301 489 (EMC), EN 300 328 (2.4GHz WiFi/BLE), EN 62368-1 (safety), EN 62311 (SAR for body-worn)
- EU Authorized Representative required since 2021 (~$500/yr service)
- Body-worn devices need SAR testing — budget extra $3K-5K
- CE and FCC testing can be done in parallel at the same lab
- Keep the Technical File for 10 years
- **Test labs:** SGS (Shenzhen), Bureau Veritas, TUV Rheinland, CTTL

### UL / IEC 62368 (Global Safety)
- **Timeline:** 8-14 weeks
- **Cost:** $5,000-20,000
- Not legally required but Amazon, Best Buy, Target often require it
- Battery must meet IEC 62133 or UL 2054
- Factory inspection required (initial + annual follow-up $2K-4K/yr)
- CB Scheme report can transfer to multiple national marks
- **Test labs:** UL (direct), TUV SUD, CSA Group, Intertek (ETL)

### SRRC (China)
- **Timeline:** 6-10 weeks
- **Cost:** $4,000-15,000
- Chinese entity required as applicant (manufacturing partner can serve)
- SRRC must be obtained BEFORE applying for CCC
- Pre-certified modules reduce scope
- Certificate valid for 5 years
- **Test labs:** CTTL (Beijing), CESI, CTC (Shenzhen), MTNet

### CCC (China)
- **Timeline:** 8-16 weeks
- **Cost:** $5,000-20,000
- Only required if product falls in CCC catalog
- Many AI wearables are CCC-exempt — check catalog first
- Battery-only devices (no mains power) are often exempt
- Factory audit required

### MIC / TELEC (Japan)
- **Timeline:** 4-8 weeks
- **Cost:** $3,000-10,000
- Many Shenzhen labs can do TELEC testing
- Can run parallel with FCC/CE
- Pre-certified modules simplify significantly

### ISED (Canada)
- **Timeline:** 4-6 weeks
- **Cost:** $2,000-8,000
- Accepts FCC test data for most parameters — file together to save
- Mandatory for Amazon.ca sales

### UN38.3 (Battery Transport — Global)
- **Timeline:** 3-6 weeks
- **Cost:** $1,500-5,000
- 8 tests: altitude, thermal, vibration, shock, short circuit, impact, overcharge, forced discharge
- Source batteries from suppliers with existing UN38.3 reports
- Custom shapes require new testing — use standard cells when possible
- MSDS also required for shipping

## US + EU Launch Strategy (Most Common)

| Certification | Cost (Mid) | Timeline | When to Start |
|--------------|-----------|----------|---------------|
| FCC | $5,000 | 4-8 weeks | After DVT build |
| CE / RED | $6,000 | 6-10 weeks | Parallel with FCC |
| UN38.3 | $3,000 | 3-6 weeks | During DVT |
| UL (if Amazon) | $10,000 | 8-14 weeks | Parallel |
| **Total** | **$14,000-24,000** | **10-14 weeks** | |

## Money-Saving Tactics
1. Use pre-certified wireless modules (40-60% FCC savings)
2. Test FCC + CE + ISED at same lab in one run (save $2K-4K)
3. Pre-scan before formal testing ($500-1K catches 80% of issues)
4. Do NOT certify before design freeze

## Common Certification Mistakes
1. Starting certification too early (certify after DVT, not EVT)
2. Forgetting UN38.3 (logistics partner will refuse to ship)
3. Not budgeting for SAR testing (body-worn = extra $3K-5K for CE)
4. Changing PCB after certification (RF changes = re-testing)
5. No EU Authorized Representative (required since 2021)
6. Underestimating timeline (book lab slot 4-6 weeks before samples ready)

---

# 5. EVT / DVT / PVT Validation Stages

## EVT — Engineering Validation Test

**Goal:** Prove the core technology works.
**Volume:** 10-30 units
**Assembly:** Hand-soldered or semi-automated. 3D printed enclosures.
**Duration:** 4-6 weeks

### Electronics Checks
- E1: All voltage rails within +/-5% of target under load
- E2: SoC boots and runs basic firmware
- E3: All peripherals functional (each sensor, radio, display, mic)
- E4: Power consumption measured in each mode (sleep, idle, active, peak inference)
- E5: USB-C charging functional (0-100% without overheating)
- E6: 48-hour burn-in with no component failures

### AI / Inference Checks
- A1: AI model runs on target SoC without crash or timeout
- A2: Inference latency acceptable (voice: <500ms, vision: <200ms/frame)
- A3: Model accuracy within 5% of desktop/cloud version
- A4: SoC junction temp <85C after 30 min continuous inference
- A5: Power during inference measured

### Mechanical Checks
- M1: PCB fits in enclosure, connectors align
- M2: User can interact with all controls
- M3: Battery fits with >=1mm clearance on all sides
- M4: Weight within target (users notice 10g in wearables)

### RF Checks
- R1: WiFi connects at >-70dBm at 5m, stable transfer
- R2: BLE pairs and maintains connection at 10m (iOS + Android)
- R3: Antenna performance with enclosure: no more than 3dB degradation

### EVT Exit Criteria
All E1-E6 pass. A1-A3 pass (A4-A5 can be marginal if fix identified). M1-M3 pass. R1-R2 pass. Bug list created. Design changes for DVT documented.

**Do NOT proceed to DVT if:** SoC doesn't boot reliably, AI model can't run on device, or power consumption is >2x budget.

## DVT — Design Validation Test

**Goal:** Prove the product design works for users and survives real-world conditions.
**Volume:** 30-100 units
**Assembly:** Production-intent. Injection-molded (soft mold OK). SMT line.
**Duration:** 6-10 weeks

### Reliability
- D1: Drop test — survives 1.2m onto concrete on all 6 faces + edges
- D2: Temperature cycling — functions at -10C to +50C, 10 cycles
- D3: Humidity — functions after 48hr at 85% RH, 35C
- D4: Button endurance — 10,000 press cycles
- D5: USB-C connector — 5,000 insert/remove cycles
- D6: Battery cycle life — >300 cycles to 80% capacity

### Thermal
- T1: Skin temperature <42C on any user-facing surface (wearables)
- T2: SoC junction temp <90C absolute max, <80C recommended
- T3: Battery temp <45C during fast charge, <40C during normal
- T4: Graceful thermal throttling (reduce performance, don't crash)

### Battery & Power
- B1: Battery life within 10% of spec per mode
- B2: Charge time within spec
- B3: Warning at 10%, safe shutdown at 5%, no data corruption
- B4: Charge protection — stops at 4.2V, survives 72hr on charger

### RF Pre-Compliance
- P1: Conducted emissions within FCC Part 15 limits
- P2: Radiated emissions within limits at 3m
- P3: Receiver sensitivity within module spec
- P4: SAR pre-assessment within limits (body-worn)

### Firmware / OTA
- F1: OTA 100% success over 20 consecutive updates
- F2: Recovery from power loss mid-update, corrupted image, network drop
- F3: Factory reset clears all user data
- F4: Firmware rollback to previous version
- F5: Production provisioning in <30sec/unit

### Usability
- U1: New user setup <5 minutes
- U2: Voice recognition >90% at 0.5m in quiet room (if applicable)
- U3: Physical comfort for 4+ hours (wearable)
- U4: LED/status indicators correctly identified by users >80%

### DVT Exit Criteria
All reliability, thermal, battery, pre-compliance, firmware, and usability tests pass. **Design freeze declared.** Certification testing booked. Production steel mold ordered.

**Do NOT proceed to PVT if:** Any reliability test fails, pre-compliance shows issues, or OTA doesn't work reliably.

## PVT — Production Validation Test

**Goal:** Prove the factory can build consistently at quality and speed targets.
**Volume:** 100-500 units
**Assembly:** Full production line and tooling.
**Duration:** 4-6 weeks

### Production Line
- L1: SMT yield >98% first-pass
- L2: Assembly cycle time within target takt time
- L3: ICT/flying probe pass rate >99%
- L4: Functional test pass rate >95%
- L5: Cosmetic inspection <2% rejection rate

### Quality
- Q1: PVT units match DVT golden sample
- Q2: Key specs within +/-10% across 20 random units
- Q3: Packaging drop test (ISTA 2A)
- Q4: Outgoing QC: AQL 2.5 critical, AQL 4.0 major

### Firmware & Provisioning
- FP1: Provisioning <30sec/unit including test
- FP2: Unique device IDs verified (spot-check 10 units)
- FP3: All units ship with tagged firmware release
- FP4: OTA server live, tested on 10 PVT units

### Certification & Compliance
- C1: All certifications received (FCC, CE, UL, UN38.3)
- C2: Regulatory markings correct on device and packaging
- C3: Safety documentation complete (manual, warranty)
- C4: RoHS/REACH compliance docs collected

### PVT Exit Criteria
All checks pass. Packing/shipping validated. Customer support ready. **Mass production authorized.**

**Do NOT ship if:** First-pass yield <95%, unit-to-unit variation exceeds spec, or any certification missing.

## Timeline Summary

| Stage | Duration | Units | Key Deliverable |
|-------|----------|-------|-----------------|
| EVT | 4-6 weeks | 10-30 | Proof of concept works |
| DVT | 6-10 weeks | 30-100 | Validated design, ready for cert |
| PVT | 4-6 weeks | 100-500 | Production process validated |
| **Total** | **14-22 weeks** | | Budget 6-9 months realistic |

---

# 6. Supplier Red Flags

## Desktop Research (5 red flags)

1. **Trading company pretending to be manufacturer** — Subcontracts everything, marks up 15-30%. Check business license (营业执照) for "贸易" (trade) vs "制造" (manufacturing). Search Tianyancha or Qichacha.
2. **Company <2 years old** — If they fold, your molds, components, and deposit disappear.
3. **Claims to do everything** (PCB, SMT, mold, CNC, packaging, cert, software) — No factory excels at all. They're subcontracting most of it.
4. **Won't share BOM cost breakdown** — Hiding 30-50% margins (vs normal 10-15%). Request open BOM. Verify against LCSC/DigiKey.
5. **No experience with your SoC platform** — They'll learn on your project. 2-4 month delay. Ask for 3 previous projects with same SoC family.

## Factory Visit — Production (5 red flags)

6. **SMT line idle or running others' boards** — Low business means low priority for you. Healthy lines run 2 shifts (16hr/day).
7. **No solder paste inspection (SPI) machine** — SPI catches 70% of defects before reflow. Without it: 2-5% defect rate on fine-pitch (QFN, BGA).
8. **No reflow oven temperature profiling** — Each PCB needs a specific profile. Without it: cold solder joints or component damage.
9. **Manual soldering for production** (not rework) — If hand-soldering 0402 passives or fine-pitch ICs, their SMT line can't handle your design.
10. **No functional test station** — "We test 10% by sampling" is not acceptable for electronics. Every board must be tested.

## Factory Visit — Components (4 red flags)

11. **Sources from Huaqiangbei street markets** — Counterfeit, pulls, off-spec components. Acceptable: LCSC, Mouser, DigiKey, authorized distributors.
12. **Won't let you specify component sources** — Will substitute cheaper/fake parts. BOM should specify approved manufacturers.
13. **No incoming quality inspection (IQC)** — Should have: LCR meter, microscope, MSL storage near warehouse.
14. **Moisture-sensitive components in open air** — BGA, MEMS mics crack during reflow ("popcorn effect"). Need dry cabinets <10% RH.

## Factory Visit — Quality (4 red flags)

15. **No version control on manufacturing documents** — Production built to unknown spec. Check traveler/work order for revision numbers.
16. **Can't show defect rate data** — Good SMT: >98% first-pass. Good final assembly: >95%.
17. **No traceability** — Must trace: serial number -> test record -> component lots.
18. **"We'll fix it in rework" culture** — Rework introduces new defects. If rework area is bigger than test area, that's a problem.

## Negotiations (5 red flags)

19. **Requires >50% deposit** — Standard: 30% deposit, 70% before shipping. New suppliers: 30/30/40.
20. **Won't sign NNN agreement** — NNN (Non-disclosure, Non-use, Non-circumvention) under Chinese law is minimum IP protection.
21. **Mold ownership unclear** — Contract must state: molds are your property, storable, transferable.
22. **No penalty clause for defect rates** — Contract needs: max defect rate (AQL 2.5), rework at factory cost, right to reject batch.
23. **Pressures to skip EVT/DVT** — "Straight to mass production" = cutting corners.

## AI Hardware-Specific (5 red flags)

24. **No experience with NPU/AI SoCs** — Rockchip, MTK Genio, Qualcomm QCS have specific BSP, thermal, DDR routing requirements.
25. **No thermal testing capability** — AI devices run hotter. Need FLIR camera or thermocouple setup.
26. **No RF test chamber** — Can't measure antenna performance before certification.
27. **No firmware programming/provisioning infrastructure** — Manual USB flash caps at ~50 units/day.
28. **Dismisses thermal concerns** — "We'll add a thermal pad" without thermal simulation = red flag.

## Green Flags (What Good Suppliers Look Like)
- Shows defect tracking dashboard unprompted
- Asks detailed questions about SoC, power budget, antenna
- Suggests DFM changes that save cost or improve manufacturability
- Dedicated NPI team
- 3+ products in similar category (wearable, IoT, AI)
- Offers DFM review before quoting
- ESD protection at every workstation
- Documents everything in WeChat/email

## Supplier Evaluation Scorecard

| Category | Weight |
|----------|--------|
| Technical capability (SoC experience, SMT, test equipment) | 30% |
| Quality system (IQC, SPI, traceability, defect tracking) | 25% |
| Component sourcing (authorized channels, MSL handling) | 15% |
| Business terms (payment, IP protection, mold ownership) | 15% |
| Communication (English, responsiveness, documentation) | 10% |
| Price competitiveness | 5% |

**Price is only 5% weight.** The cheapest supplier is almost never the best choice for a first production run.
