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

**What to do:** Map target markets to required certs at project start. Budget 8-16 weeks and $8K-40K for testing. See the [Certification Guide](../certification-guide/).

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
