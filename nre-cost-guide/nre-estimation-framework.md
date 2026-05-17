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

**Guidance:** Don't skip prototyping stages. The progression is: 3D prints -> PCBA -> EVT -> DVT -> PVT -> mass production. Each stage catches problems that would be 10x more expensive to fix later. See the [EVT/DVT/PVT Checklist](../evt-dvt-pvt-checklist/) for stage-specific pass/fail criteria.

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

**Guidance:** FCC + CE is the minimum for most startups targeting US + EU markets. Add UN38.3 if you have a lithium battery (you almost certainly do). UL is not legally required but Amazon and most major retailers require it. Budget for certification early -- it's not optional and timeline is fixed. See the [Certification Guide](../certification-guide/) for detailed requirements per market.

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
