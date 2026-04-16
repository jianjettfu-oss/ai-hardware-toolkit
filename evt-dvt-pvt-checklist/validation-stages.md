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
