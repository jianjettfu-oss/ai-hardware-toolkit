import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Embedded toolkit data
// ---------------------------------------------------------------------------

const COMPONENT_PRICING: Record<string, { description: string; low: number; mid: number; high: number; notes: string }[]> = {
  "Processor / SoC": [
    { description: "ESP32-S3 — Basic AI (voice, gesture). WiFi + BLE built-in.", low: 2.10, mid: 2.50, high: 3.20, notes: "Good for voice recorders and simple sensor devices" },
    { description: "Rockchip RV1103 — Camera + AI, 0.5 TOPS NPU.", low: 3.50, mid: 5.00, high: 7.00, notes: "Entry-level vision AI, Plaud NotePin tier" },
    { description: "Rockchip RK3562 — Mid-range AI, 1 TOPS NPU, Mali G52 GPU.", low: 7.89, mid: 10.00, high: 13.00, notes: "Handles most on-device inference workloads" },
    { description: "Rockchip RK3588S — High-end, 6 TOPS NPU, octa-core.", low: 25.00, mid: 35.00, high: 50.00, notes: "Overkill for wearables — use for edge AI boxes" },
    { description: "MediaTek Genio 510/700 — 4-10 TOPS NPU, industrial grade.", low: 18.00, mid: 28.00, high: 40.00, notes: "Long-term availability commitment from MTK" },
  ],
  "Memory": [
    { description: "512MB + 4GB eMMC — Basic: voice recorder, simple sensor.", low: 2.70, mid: 4.00, high: 5.50, notes: "Pairs with RV1103" },
    { description: "1GB + 8GB eMMC — Standard: camera device, AI inference.", low: 4.20, mid: 6.50, high: 9.00, notes: "Most common for AI wearables" },
    { description: "2GB + 32GB eMMC — High: smart display, local LLM.", low: 8.00, mid: 11.50, high: 16.00, notes: "Required for on-device LLM" },
    { description: "8MB PSRAM + 4MB Flash — MCU-tier for ESP32-S3.", low: 0.85, mid: 1.40, high: 2.20, notes: "Built into ESP32-S3 module pricing" },
  ],
  "Display": [
    { description: "No display — Audio-only device.", low: 0, mid: 0, high: 0, notes: "Simplest BOM — recommended for v1" },
    { description: "0.96in OLED (mono) — 128x64 status display.", low: 0.80, mid: 1.20, high: 1.80, notes: "SSD1306 driver" },
    { description: "1.54in AMOLED (color) — 240x240 smartwatch-tier.", low: 3.00, mid: 5.00, high: 8.00, notes: "Significant power draw" },
    { description: "2.4in TFT LCD IPS — 320x240 full color.", low: 2.50, mid: 4.00, high: 6.00, notes: "Cheapest color option" },
    { description: "2.13in E-ink — Ultra-low power, 212x104.", low: 4.00, mid: 6.00, high: 9.00, notes: "Great for always-on status" },
  ],
  "Battery": [
    { description: "100-150mAh — Ultra-slim pendant, ~4hr.", low: 0.40, mid: 0.65, high: 0.90, notes: "Minimum viable for demos" },
    { description: "300-500mAh — Compact wearable, ~8-12hr.", low: 1.00, mid: 1.40, high: 2.00, notes: "Sweet spot for AI pendants/badges" },
    { description: "800-1000mAh — Full-day, ~16-20hr.", low: 1.50, mid: 2.20, high: 3.20, notes: "Standard for smartwatch-class" },
    { description: "1500-2000mAh — Multi-day, larger form factor.", low: 2.50, mid: 3.80, high: 5.50, notes: "Requires larger enclosure" },
  ],
  "Connectivity": [
    { description: "WiFi + BLE (built-in) — Included in ESP32-S3.", low: 0, mid: 0, high: 0, notes: "Only for Espressif SoCs" },
    { description: "BLE 5.0 module — nRF52840-based.", low: 2.00, mid: 3.50, high: 5.00, notes: "Best for battery-constrained" },
    { description: "WiFi/BT module (add-on) — For Rockchip/MTK.", low: 1.50, mid: 2.50, high: 4.00, notes: "Required for non-Espressif SoCs" },
    { description: "4G LTE Cat-1 — Quectel EC21/EC25.", low: 7.00, mid: 10.00, high: 15.00, notes: "Only if WiFi not available" },
    { description: "GPS/GNSS add-on.", low: 1.50, mid: 5.00, high: 8.00, notes: "Additional to other connectivity" },
  ],
  "Sensors": [
    { description: "MEMS Microphones (x2) — PDM/I2S for voice AI.", low: 0.60, mid: 1.00, high: 1.80, notes: "Use two for noise cancellation" },
    { description: "6-axis IMU — Accelerometer + Gyroscope.", low: 0.40, mid: 0.80, high: 1.50, notes: "Activity/gesture recognition" },
    { description: "Camera 2MP (OV2640) — Basic AI vision.", low: 1.50, mid: 2.50, high: 4.00, notes: "Adequate for most CV tasks" },
    { description: "Camera 5MP (OV5640) — Higher res, auto-focus.", low: 3.00, mid: 5.00, high: 8.00, notes: "Only if resolution matters" },
    { description: "Environmental (temp/humidity/pressure).", low: 0.50, mid: 0.90, high: 1.60, notes: "SHT30 + BMP280 combo" },
  ],
  "Fixed Cost": [
    { description: "PCB (4-layer rigid ~50cm2).", low: 0.50, mid: 0.90, high: 1.50, notes: "Per-unit at 1K volume" },
    { description: "Enclosure (injection mold 2-part).", low: 4.50, mid: 8.00, high: 13.00, notes: "Per-unit; mold cost is separate NRE" },
    { description: "SMT Assembly (medium complexity).", low: 3.00, mid: 5.00, high: 8.00, notes: "150-300 component placements" },
    { description: "Manual assembly + testing.", low: 1.30, mid: 2.50, high: 4.50, notes: "Labor in Shenzhen" },
    { description: "Passives, connectors, USB-C, LEDs.", low: 0.90, mid: 1.45, high: 2.25, notes: "Often underestimated" },
    { description: "Charging IC + power management.", low: 0.35, mid: 0.65, high: 1.10, notes: "TP4056 to IP5306" },
  ],
};

const DFM_CHECKLIST = [
  { id: 1, severity: "CRITICAL", category: "Thermal", item: "Thermal simulation for SoC under peak AI inference load", detail: "Edge AI chips hit 85C+ during sustained inference. Run thermal simulation early. Budget 2-5mm for heat spreader." },
  { id: 2, severity: "CRITICAL", category: "Thermal", item: "Adequate PCB copper pour for heat dissipation under SoC", detail: "Use thermal vias (0.3mm array) under SoC pad connected to internal ground plane." },
  { id: 3, severity: "MAJOR", category: "Thermal", item: "Enclosure material temperature rating", detail: "ABS softens at 80C. Use PC or ABS/PC blend near heat sources. Add ventilation if >3W sustained." },
  { id: 4, severity: "CRITICAL", category: "Thermal", item: "Battery positioned away from heat-generating components", detail: "Maintain >=3mm air gap or thermal barrier. LiPo degrades above 45C." },
  { id: 5, severity: "CRITICAL", category: "Antenna & RF", item: "Ground clearance zone around all antennas", detail: ">=5mm copper-free for 2.4GHz. 10mm for cellular. No ground plane under antenna. #1 cause of failed FCC/CE." },
  { id: 6, severity: "MAJOR", category: "Antenna & RF", item: "Antenna placement compatible with user grip/wear", detail: "Human body absorbs RF. Place antenna facing away from body." },
  { id: 7, severity: "MAJOR", category: "Antenna & RF", item: "Antenna detuning from enclosure material", detail: "Avoid metallic paint near antennas. Tune with final enclosure material." },
  { id: 8, severity: "MAJOR", category: "Antenna & RF", item: "Cellular antenna volume allocation", detail: "Multi-band cellular needs ~500-1000mm3. Consider FPC antenna." },
  { id: 9, severity: "CRITICAL", category: "Power & Battery", item: "Power consumption profiled across all operating modes", detail: "AI inference draws 10-50x more than idle. Size regulator for peak." },
  { id: 10, severity: "CRITICAL", category: "Power & Battery", item: "USB-C charging circuit designed safely", detail: "Use certified IC (TP4056 min). Add over-voltage, over-current, thermal cutoff." },
  { id: 11, severity: "MAJOR", category: "Power & Battery", item: "Voltage rails sequenced correctly", detail: "Many SoCs require specific power-up sequences (core -> I/O -> memory)." },
  { id: 12, severity: "MINOR", category: "Power & Battery", item: "Battery fuel gauge or level indicator", detail: "Use coulomb counter (MAX17048) or voltage lookup with load compensation." },
  { id: 13, severity: "CRITICAL", category: "Mechanical", item: "Minimum wall thickness >=1.0mm for injection molding", detail: "Walls <1.0mm cause short shots and sink marks. Maintain 1.2-1.5mm for ABS/PC." },
  { id: 14, severity: "CRITICAL", category: "Mechanical", item: "Draft angles >=1 degree on all vertical surfaces", detail: "Without draft, parts stick in mold. Textured surfaces need more." },
  { id: 15, severity: "MAJOR", category: "Mechanical", item: "Snap-fit or screw boss validated for repeated assembly", detail: "2% max strain for ABS. Test 20+ open/close cycles." },
  { id: 16, severity: "MINOR", category: "Mechanical", item: "Space reserved for regulatory markings", detail: "Reserve 15x8mm flat area for FCC/CE/UL marks." },
  { id: 17, severity: "MAJOR", category: "Mechanical", item: "IP rating requirements specified with sealing design", detail: "Define early. IPX4=gaskets. IPX7=O-rings+sealed connectors." },
  { id: 18, severity: "CRITICAL", category: "PCB Layout", item: "High-speed signals impedance-matched", detail: "90 ohm diff for USB, 100 ohm for MIPI. Specify in PCB fab notes." },
  { id: 19, severity: "MAJOR", category: "PCB Layout", item: "Decoupling capacitors within 2mm of power pins", detail: "Long traces cause voltage droop during AI inference bursts." },
  { id: 20, severity: "CRITICAL", category: "PCB Layout", item: "Microphone placement optimized", detail: "Align mic port with enclosure hole (<=0.5mm). Add 1-2mm acoustic chamber." },
  { id: 21, severity: "MAJOR", category: "PCB Layout", item: "Test points accessible for production testing", detail: "Add pads for power rails and key signals. Min 1.0mm for flying probe." },
  { id: 22, severity: "MINOR", category: "PCB Layout", item: "PCB panelized efficiently for SMT", detail: "3-5mm rails, V-score or tab-routing. 100x100mm to 250x330mm." },
  { id: 23, severity: "CRITICAL", category: "Firmware", item: "Reliable OTA firmware update mechanism", detail: "Dual-bank with rollback. Test power loss mid-update, corrupted image." },
  { id: 24, severity: "MAJOR", category: "Firmware", item: "Factory calibration and provisioning in production flow", detail: "Manual caps at ~100 units. Build tool: <30sec/unit." },
  { id: 25, severity: "MAJOR", category: "Firmware", item: "AI model optimized for target SoC", detail: "Quantize to INT8. Use vendor NPU SDK (RKNN/TFLite). Profile inference." },
  { id: 26, severity: "CRITICAL", category: "Compliance", item: "All required certifications identified", detail: "FCC/CE/SRRC/MIC per market. Budget 8-16 weeks and $8K-40K." },
  { id: 27, severity: "MAJOR", category: "Compliance", item: "EMI limits met without shield can", detail: "Shield cans late add $0.50-2/unit + PCB redesign. Pre-scan first." },
  { id: 28, severity: "CRITICAL", category: "Compliance", item: "Battery compliant with UN38.3", detail: "Without UN38.3, batteries can't ship by air. Budget $2K-5K if custom cell." },
  { id: 29, severity: "MAJOR", category: "Compliance", item: "Data privacy regulations addressed", detail: "AI devices recording audio/video face GDPR/CCPA. On-device processing recommended." },
];

const NRE_CATEGORIES: Record<string, { tiers: { name: string; description: string; low: number; mid: number; high: number }[]; timeline: string }> = {
  "Industrial Design": {
    timeline: "~4 weeks",
    tiers: [
      { name: "Basic", description: "Simple enclosure, 1 concept. MVP/dev kit.", low: 2000, mid: 4000, high: 6000 },
      { name: "Standard", description: "Refined, 2-3 concepts. Organic shapes, ergonomics.", low: 6000, mid: 12000, high: 18000 },
      { name: "Premium", description: "Consumer-grade, 5+ concepts. Apple-level finish.", low: 15000, mid: 30000, high: 50000 },
    ],
  },
  "Mechanical Engineering": {
    timeline: "~6 weeks",
    tiers: [
      { name: "Simple", description: "2-part, no moving parts. Badge/pendant.", low: 3000, mid: 6000, high: 10000 },
      { name: "Medium", description: "3-5 parts, buttons, sealing. IPX4.", low: 8000, mid: 15000, high: 25000 },
      { name: "Complex", description: "Hinge, slider, modular. AR glasses tier.", low: 20000, mid: 35000, high: 60000 },
    ],
  },
  "Electronics Engineering": {
    timeline: "~6 weeks",
    tiers: [
      { name: "MCU-based", description: "ESP32-S3 tier. 2-4 layer PCB.", low: 3000, mid: 5000, high: 8000 },
      { name: "Application processor", description: "Rockchip/MTK. DDR routing, 4-6 layer.", low: 8000, mid: 15000, high: 25000 },
      { name: "Advanced", description: "Multi-board, rigid-flex, custom RF.", low: 20000, mid: 35000, high: 55000 },
    ],
  },
  "Firmware & Software": {
    timeline: "~10 weeks",
    tiers: [
      { name: "Basic", description: "Sensor + BLE + app. No on-device AI.", low: 5000, mid: 10000, high: 18000 },
      { name: "On-device AI", description: "Inference + cloud sync, OTA.", low: 15000, mid: 30000, high: 50000 },
      { name: "Full stack", description: "Device + mobile app + cloud backend.", low: 30000, mid: 60000, high: 100000 },
    ],
  },
  "Tooling & Molds": {
    timeline: "~5 weeks",
    tiers: [
      { name: "Soft mold", description: "Aluminum, <500 units. Prototype.", low: 500, mid: 1500, high: 3000 },
      { name: "Production mold", description: "P20 steel, 100K+ shots.", low: 3000, mid: 6000, high: 12000 },
      { name: "Complex mold", description: "Multi-cavity, side actions, overmolding.", low: 10000, mid: 20000, high: 40000 },
    ],
  },
  "Prototyping": {
    timeline: "~4 weeks per stage",
    tiers: [
      { name: "3D printed enclosure", description: "3-5 units, SLA/SLS.", low: 500, mid: 1500, high: 3000 },
      { name: "PCBA prototypes", description: "5-10 assembled boards.", low: 1000, mid: 3000, high: 6000 },
      { name: "EVT build", description: "10-30 units, near-final.", low: 5000, mid: 10000, high: 20000 },
      { name: "DVT build", description: "30-100 units, production-intent.", low: 10000, mid: 20000, high: 40000 },
    ],
  },
  "Certification & Testing": {
    timeline: "~10 weeks",
    tiers: [
      { name: "FCC (US)", description: "Federal Communications Commission.", low: 3000, mid: 5000, high: 10000 },
      { name: "CE/RED (EU)", description: "Radio Equipment Directive.", low: 3000, mid: 6000, high: 12000 },
      { name: "UL/IEC 62368", description: "Global safety certification.", low: 5000, mid: 10000, high: 20000 },
      { name: "SRRC + CCC (China)", description: "Chinese radio + compulsory cert.", low: 4000, mid: 8000, high: 15000 },
      { name: "UN38.3 (Battery)", description: "Lithium battery transport.", low: 1500, mid: 3000, high: 5000 },
    ],
  },
};

const CERTIFICATIONS: Record<string, { fullName: string; region: string; timeline: string; costLow: number; costMid: number; costHigh: number; required: boolean; keyRequirements: string[]; tips: string[] }> = {
  FCC: {
    fullName: "Federal Communications Commission",
    region: "United States",
    timeline: "4-8 weeks",
    costLow: 3000, costMid: 5000, costHigh: 10000,
    required: true,
    keyRequirements: [
      "FCC Part 15 for WiFi/BLE (intentional radiator)",
      "FCC Part 15B for digital devices (unintentional radiator)",
      "5 production-representative samples needed",
      "FCC ID required — apply for Grantee Code early (1-2 weeks)",
    ],
    tips: [
      "Pre-scan at local EMC lab ($500-1K) before formal testing saves rework",
      "Pre-certified WiFi module = only unintentional radiator testing (40-60% cost savings)",
      "Small devices (<8cm) can use e-labeling",
      "Test labs: Bureau Veritas (Shenzhen), TUV SUD, SGS, Intertek",
    ],
  },
  "CE/RED": {
    fullName: "Radio Equipment Directive (2014/53/EU)",
    region: "European Union",
    timeline: "6-10 weeks",
    costLow: 3000, costMid: 6000, costHigh: 12000,
    required: true,
    keyRequirements: [
      "EN 301 489 (EMC), EN 300 328 (2.4GHz), EN 62368-1 (safety)",
      "EN 62311 (SAR for body-worn devices)",
      "Declaration of Conformity required",
      "EU Authorized Representative required since 2021 (~$500/yr)",
    ],
    tips: [
      "CE and FCC testing can be done in parallel at same lab",
      "Body-worn devices need SAR testing — budget extra $3K-5K",
      "Keep Technical File for 10 years",
      "Test labs: SGS (Shenzhen), Bureau Veritas, TUV Rheinland",
    ],
  },
  "UL/IEC 62368": {
    fullName: "Product Safety Certification",
    region: "Global",
    timeline: "8-14 weeks",
    costLow: 5000, costMid: 10000, costHigh: 20000,
    required: false,
    keyRequirements: [
      "Battery must meet IEC 62133 or UL 2054",
      "Factory inspection required (initial + annual $2K-4K/yr)",
      "All safety-critical components must be UL-recognized",
    ],
    tips: [
      "Not legally required but Amazon/Best Buy/Target often require it",
      "CB Scheme report transfers to multiple national marks",
      "Start with UL pre-submission consultation",
    ],
  },
  SRRC: {
    fullName: "State Radio Regulation of China",
    region: "China",
    timeline: "6-10 weeks",
    costLow: 4000, costMid: 8000, costHigh: 15000,
    required: true,
    keyRequirements: [
      "Chinese entity required as applicant",
      "Must obtain BEFORE applying for CCC",
      "5 samples required",
      "Certificate valid for 5 years",
    ],
    tips: [
      "Shenzhen manufacturing partner can be local applicant",
      "Pre-certified modules reduce scope",
      "Test labs: CTTL (Beijing), CESI, CTC (Shenzhen)",
    ],
  },
  "MIC/TELEC": {
    fullName: "Ministry of Internal Affairs and Communications (Japan)",
    region: "Japan",
    timeline: "4-8 weeks",
    costLow: 3000, costMid: 5000, costHigh: 10000,
    required: true,
    keyRequirements: [
      "TELEC certification for radio equipment",
      "Japanese entity as applicant or registered agent",
      "Testing per ARIB standards",
    ],
    tips: [
      "Many Shenzhen labs can do TELEC testing",
      "Can run parallel with FCC/CE",
      "Pre-certified modules simplify significantly",
    ],
  },
  ISED: {
    fullName: "Innovation, Science and Economic Development Canada",
    region: "Canada",
    timeline: "4-6 weeks",
    costLow: 2000, costMid: 4000, costHigh: 8000,
    required: true,
    keyRequirements: [
      "RSS-247 for WiFi/BLE devices",
      "RSS-102 for RF exposure (SAR for body-worn)",
    ],
    tips: [
      "Accepts FCC test data for most parameters — file together",
      "Mandatory for Amazon.ca sales",
      "Typically faster than FCC",
    ],
  },
  "UN38.3": {
    fullName: "UN Manual of Tests and Criteria Section 38.3",
    region: "Global (all markets with lithium battery)",
    timeline: "3-6 weeks",
    costLow: 1500, costMid: 3000, costHigh: 5000,
    required: true,
    keyRequirements: [
      "8 tests: altitude, thermal, vibration, shock, short circuit, impact, overcharge, forced discharge",
      "Must test specific cell AND battery pack",
      "MSDS also required for shipping",
    ],
    tips: [
      "Source batteries from suppliers with existing UN38.3 reports",
      "Custom shapes require new testing — use standard cells",
      "Keep report accessible — freight forwarders will ask for it",
    ],
  },
};

const MARKET_CERTS: Record<string, string[]> = {
  "US": ["FCC", "UN38.3"],
  "EU": ["CE/RED", "UN38.3"],
  "China": ["SRRC", "UN38.3"],
  "Japan": ["MIC/TELEC", "UN38.3"],
  "Canada": ["ISED", "UN38.3"],
  "US+EU": ["FCC", "CE/RED", "UN38.3"],
  "Global": ["FCC", "CE/RED", "UL/IEC 62368", "SRRC", "MIC/TELEC", "ISED", "UN38.3"],
};

const SUPPLIER_RED_FLAGS = [
  { id: 1, category: "Desktop Research", flag: "Trading company pretending to be manufacturer", detail: "Subcontracts everything, 15-30% markup. Check business license for trade vs manufacturing." },
  { id: 2, category: "Desktop Research", flag: "Company less than 2 years old", detail: "If they fold, molds/components/deposit are lost." },
  { id: 3, category: "Desktop Research", flag: "Claims to do everything (PCB, SMT, mold, CNC, etc.)", detail: "No factory does all well. They are subcontracting." },
  { id: 4, category: "Desktop Research", flag: "Won't share BOM cost breakdown", detail: "Hiding 30-50% margins vs normal 10-15%." },
  { id: 5, category: "Desktop Research", flag: "No experience with your SoC platform", detail: "They'll learn on your project. 2-4 month delay." },
  { id: 6, category: "Production", flag: "SMT line idle or running others' boards", detail: "Low business = low priority for your order." },
  { id: 7, category: "Production", flag: "No solder paste inspection (SPI) machine", detail: "SPI catches 70% of defects. Without it: 2-5% defect rate on fine-pitch." },
  { id: 8, category: "Production", flag: "No reflow oven temperature profiling", detail: "Causes cold solder joints or component damage." },
  { id: 9, category: "Production", flag: "Manual soldering for production (not rework)", detail: "SMT line can't handle your design complexity." },
  { id: 10, category: "Production", flag: "No functional test station", detail: "10% sampling is not acceptable for electronics." },
  { id: 11, category: "Components", flag: "Sources from Huaqiangbei street markets", detail: "Counterfeit/pulls/off-spec. Use LCSC/Mouser/DigiKey/authorized." },
  { id: 12, category: "Components", flag: "Won't let you specify component sources", detail: "Will substitute cheaper/fake parts." },
  { id: 13, category: "Components", flag: "No incoming quality inspection (IQC)", detail: "Should have LCR meter, microscope, MSL storage." },
  { id: 14, category: "Components", flag: "Moisture-sensitive components in open air", detail: "BGA/MEMS crack during reflow. Need dry cabinets <10% RH." },
  { id: 15, category: "Quality", flag: "No version control on manufacturing documents", detail: "Production built to unknown spec." },
  { id: 16, category: "Quality", flag: "Can't show defect rate data", detail: "Good SMT >98%. Good assembly >95%." },
  { id: 17, category: "Quality", flag: "No traceability (serial to component lots)", detail: "Can't debug field failures." },
  { id: 18, category: "Quality", flag: "'We'll fix it in rework' culture", detail: "Rework introduces new defects." },
  { id: 19, category: "Negotiation", flag: "Requires >50% deposit", detail: "Standard is 30/70. New: 30/30/40." },
  { id: 20, category: "Negotiation", flag: "Won't sign NNN agreement", detail: "NNN under Chinese law is minimum IP protection." },
  { id: 21, category: "Negotiation", flag: "Mold ownership unclear", detail: "Contract must state molds are your property." },
  { id: 22, category: "Negotiation", flag: "No penalty clause for defect rates", detail: "Need AQL 2.5 in contract, rework at factory cost." },
  { id: 23, category: "Negotiation", flag: "Pressures to skip EVT/DVT", detail: "Cutting corners will cost more later." },
  { id: 24, category: "AI-Specific", flag: "No experience with NPU/AI SoCs", detail: "DDR routing, thermal, BSP issues likely." },
  { id: 25, category: "AI-Specific", flag: "No thermal testing capability", detail: "AI devices run hotter. Need FLIR camera." },
  { id: 26, category: "AI-Specific", flag: "No RF test chamber", detail: "Antenna issues found at certification = expensive." },
  { id: 27, category: "AI-Specific", flag: "No firmware provisioning infrastructure", detail: "Manual USB flash caps at ~50 units/day." },
  { id: 28, category: "AI-Specific", flag: "Dismisses thermal concerns", detail: "'We'll add a thermal pad' without simulation = red flag." },
];

const VALIDATION_STAGES: Record<string, { goal: string; volume: string; duration: string; checks: { id: string; area: string; check: string; criteria: string }[]; exitCriteria: string[]; doNotProceedIf: string }> = {
  EVT: {
    goal: "Prove core technology works",
    volume: "10-30 units",
    duration: "4-6 weeks",
    checks: [
      { id: "E1", area: "Electronics", check: "Voltage rails within spec", criteria: "+/-5% of target under load" },
      { id: "E2", area: "Electronics", check: "SoC boots and runs firmware", criteria: "Linux/RTOS boots, serial console accessible" },
      { id: "E3", area: "Electronics", check: "All peripherals functional", criteria: "Each sensor, radio, display, mic responds" },
      { id: "E4", area: "Electronics", check: "Power consumption measured", criteria: "Sleep, idle, active, peak inference recorded" },
      { id: "E5", area: "Electronics", check: "USB-C charging", criteria: "0-100% without overheating" },
      { id: "E6", area: "Electronics", check: "48-hour burn-in", criteria: "No component failures" },
      { id: "A1", area: "AI/Inference", check: "AI model runs on target SoC", criteria: "Completes without crash or timeout" },
      { id: "A2", area: "AI/Inference", check: "Inference latency", criteria: "Voice <500ms, vision <200ms/frame" },
      { id: "A3", area: "AI/Inference", check: "Model accuracy on device", criteria: "Within 5% of desktop/cloud version" },
      { id: "A4", area: "AI/Inference", check: "Thermal during inference", criteria: "SoC <85C after 30 min continuous" },
      { id: "A5", area: "AI/Inference", check: "Power during inference", criteria: "Current draw recorded at peak" },
      { id: "M1", area: "Mechanical", check: "PCB fits in enclosure", criteria: "Connectors, buttons, ports align" },
      { id: "M2", area: "Mechanical", check: "User can interact with controls", criteria: "Buttons, touch, mic holes accessible" },
      { id: "M3", area: "Mechanical", check: "Battery fits with clearance", criteria: ">=1mm on all sides" },
      { id: "M4", area: "Mechanical", check: "Weight within target", criteria: "Measured total assembly weight" },
      { id: "R1", area: "RF", check: "WiFi connects", criteria: ">-70dBm at 5m, stable transfer" },
      { id: "R2", area: "RF", check: "BLE connects", criteria: "Pairs at 10m, iOS + Android" },
      { id: "R3", area: "RF", check: "Antenna with enclosure", criteria: "No more than 3dB degradation" },
    ],
    exitCriteria: ["All E1-E6 pass", "A1-A3 pass (A4-A5 can be marginal)", "M1-M3 pass (M4 within 20%)", "R1-R2 pass", "Bug list created", "DVT changes documented"],
    doNotProceedIf: "SoC doesn't boot reliably, AI model can't run, or power >2x budget",
  },
  DVT: {
    goal: "Validate design for users and real-world conditions",
    volume: "30-100 units",
    duration: "6-10 weeks",
    checks: [
      { id: "D1", area: "Reliability", check: "Drop test", criteria: "1.2m onto concrete, all 6 faces + edges" },
      { id: "D2", area: "Reliability", check: "Temperature cycling", criteria: "-10C to +50C, 10 cycles" },
      { id: "D3", area: "Reliability", check: "Humidity exposure", criteria: "48hr at 85% RH, 35C" },
      { id: "D4", area: "Reliability", check: "Button endurance", criteria: "10,000 press cycles" },
      { id: "D5", area: "Reliability", check: "USB-C durability", criteria: "5,000 insert/remove cycles" },
      { id: "D6", area: "Reliability", check: "Battery cycle life", criteria: ">300 cycles to 80% capacity" },
      { id: "T1", area: "Thermal", check: "Skin temperature", criteria: "<42C on user-facing surface" },
      { id: "T2", area: "Thermal", check: "SoC junction temp", criteria: "<90C max, <80C recommended" },
      { id: "T3", area: "Thermal", check: "Battery temp during charging", criteria: "<45C fast charge, <40C normal" },
      { id: "T4", area: "Thermal", check: "Thermal throttling", criteria: "Graceful degradation, not crash" },
      { id: "B1", area: "Battery", check: "Battery life vs claims", criteria: "Within 10% of spec per mode" },
      { id: "B2", area: "Battery", check: "Charge time", criteria: "Within spec" },
      { id: "B3", area: "Battery", check: "Low battery behavior", criteria: "Warning at 10%, shutdown at 5%" },
      { id: "B4", area: "Battery", check: "Charge protection", criteria: "Stops at 4.2V, survives 72hr" },
      { id: "P1", area: "RF Pre-Compliance", check: "Conducted emissions", criteria: "Within FCC Part 15 limits" },
      { id: "P2", area: "RF Pre-Compliance", check: "Radiated emissions", criteria: "Within limits at 3m" },
      { id: "P3", area: "RF Pre-Compliance", check: "Receiver sensitivity", criteria: "Within module spec" },
      { id: "P4", area: "RF Pre-Compliance", check: "SAR (body-worn)", criteria: "Within limits" },
      { id: "F1", area: "Firmware", check: "OTA success", criteria: "100% over 20 updates" },
      { id: "F2", area: "Firmware", check: "OTA failure recovery", criteria: "Survives power loss, corruption" },
      { id: "F3", area: "Firmware", check: "Factory reset", criteria: "Clears all user data" },
      { id: "F4", area: "Firmware", check: "Firmware rollback", criteria: "Can revert to previous" },
      { id: "F5", area: "Firmware", check: "Provisioning speed", criteria: "<30sec/unit" },
      { id: "U1", area: "Usability", check: "Setup time", criteria: "<5 minutes for new user" },
      { id: "U2", area: "Usability", check: "Voice recognition", criteria: ">90% at 0.5m quiet room" },
      { id: "U3", area: "Usability", check: "Comfort (wearable)", criteria: "4+ hours without complaint" },
      { id: "U4", area: "Usability", check: "Status indicators", criteria: "Users identify state >80%" },
    ],
    exitCriteria: ["All reliability D1-D6 pass", "All thermal T1-T4 pass", "Battery B1-B4 pass", "Pre-compliance P1-P3 pass", "Firmware F1-F5 pass", "Usability issues have fixes", "Design freeze declared", "Certification booked", "Production mold ordered"],
    doNotProceedIf: "Any reliability test fails, pre-compliance issues, or OTA unreliable",
  },
  PVT: {
    goal: "Prove factory can build consistently at quality and speed targets",
    volume: "100-500 units",
    duration: "4-6 weeks",
    checks: [
      { id: "L1", area: "Production", check: "SMT yield", criteria: ">98% first-pass" },
      { id: "L2", area: "Production", check: "Assembly cycle time", criteria: "Within target takt time" },
      { id: "L3", area: "Production", check: "ICT/flying probe", criteria: ">99% pass rate" },
      { id: "L4", area: "Production", check: "Functional test", criteria: ">95% first pass" },
      { id: "L5", area: "Production", check: "Cosmetic inspection", criteria: "<2% rejection rate" },
      { id: "Q1", area: "Quality", check: "Golden sample match", criteria: "Matches DVT golden sample" },
      { id: "Q2", area: "Quality", check: "Unit consistency", criteria: "Specs within +/-10% across 20 units" },
      { id: "Q3", area: "Quality", check: "Packaging drop test", criteria: "Survives ISTA 2A" },
      { id: "Q4", area: "Quality", check: "Outgoing QC", criteria: "AQL 2.5 critical, 4.0 major" },
      { id: "FP1", area: "Provisioning", check: "Throughput", criteria: "<30sec/unit including test" },
      { id: "FP2", area: "Provisioning", check: "Unique credentials", criteria: "Verified on 10 random units" },
      { id: "FP3", area: "Provisioning", check: "Firmware version locked", criteria: "Tagged release, no 'latest'" },
      { id: "FP4", area: "Provisioning", check: "OTA server ready", criteria: "Tested on 10 PVT units" },
      { id: "C1", area: "Certification", check: "All certs received", criteria: "FCC, CE, UL, UN38.3 in hand" },
      { id: "C2", area: "Certification", check: "Regulatory markings", criteria: "Correct on device + packaging" },
      { id: "C3", area: "Certification", check: "Safety documentation", criteria: "Manual, warranty card complete" },
      { id: "C4", area: "Certification", check: "RoHS/REACH", criteria: "Material declarations collected" },
    ],
    exitCriteria: ["All production L1-L5 pass", "All quality Q1-Q4 pass", "Provisioning FP1-FP4 pass", "Certification C1-C4 pass", "Shipping process validated", "Customer support ready", "Mass production authorized"],
    doNotProceedIf: "Yield <95%, variation exceeds spec, or any cert missing",
  },
};

// ---------------------------------------------------------------------------
// Server setup
// ---------------------------------------------------------------------------

const server = new McpServer({
  name: "ai-hardware-toolkit",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool: estimate_bom
// ---------------------------------------------------------------------------

server.tool(
  "estimate_bom",
  "Estimate BOM (Bill of Materials) cost for an AI hardware device at 1K-unit Shenzhen volume. Returns per-unit cost breakdown.",
  {
    processor: z.enum(["ESP32-S3", "RV1103", "RK3562", "RK3588S", "Genio"]).describe("SoC choice"),
    memory: z.enum(["8MB_PSRAM", "512MB_4GB", "1GB_8GB", "2GB_32GB"]).describe("Memory configuration"),
    display: z.enum(["none", "oled_096", "amoled_154", "tft_24", "eink_213"]).describe("Display type"),
    battery: z.enum(["100mAh", "300mAh", "800mAh", "1500mAh"]).describe("Battery capacity"),
    connectivity: z.array(z.enum(["wifi_ble_builtin", "ble_module", "wifi_bt_addon", "lte_cat1", "gps"])).describe("Connectivity options"),
    sensors: z.array(z.enum(["mems_mic", "imu", "camera_2mp", "camera_5mp", "environmental"])).describe("Sensors included"),
    price_point: z.enum(["low", "mid", "high"]).default("mid").describe("Price estimate tier (default: mid)"),
  },
  async ({ processor, memory, display, battery, connectivity, sensors, price_point }) => {
    const p = price_point as "low" | "mid" | "high";
    const lines: string[] = ["# BOM Cost Estimate", "", "| Component | Selection | Cost (USD) |", "|-----------|-----------|-----------|"];
    let total = 0;

    const processorMap: Record<string, number> = { "ESP32-S3": 0, "RV1103": 1, "RK3562": 2, "RK3588S": 3, "Genio": 4 };
    const proc = COMPONENT_PRICING["Processor / SoC"][processorMap[processor]];
    lines.push(`| Processor | ${processor} | $${proc[p].toFixed(2)} |`);
    total += proc[p];

    const memMap: Record<string, number> = { "8MB_PSRAM": 3, "512MB_4GB": 0, "1GB_8GB": 1, "2GB_32GB": 2 };
    const mem = COMPONENT_PRICING["Memory"][memMap[memory]];
    lines.push(`| Memory | ${memory} | $${mem[p].toFixed(2)} |`);
    total += mem[p];

    const dispMap: Record<string, number> = { "none": 0, "oled_096": 1, "amoled_154": 2, "tft_24": 3, "eink_213": 4 };
    const disp = COMPONENT_PRICING["Display"][dispMap[display]];
    lines.push(`| Display | ${display} | $${disp[p].toFixed(2)} |`);
    total += disp[p];

    const batMap: Record<string, number> = { "100mAh": 0, "300mAh": 1, "800mAh": 2, "1500mAh": 3 };
    const bat = COMPONENT_PRICING["Battery"][batMap[battery]];
    lines.push(`| Battery | ${battery} | $${bat[p].toFixed(2)} |`);
    total += bat[p];

    const connMap: Record<string, number> = { "wifi_ble_builtin": 0, "ble_module": 1, "wifi_bt_addon": 2, "lte_cat1": 3, "gps": 4 };
    for (const c of connectivity) {
      const conn = COMPONENT_PRICING["Connectivity"][connMap[c]];
      lines.push(`| Connectivity | ${c} | $${conn[p].toFixed(2)} |`);
      total += conn[p];
    }

    const sensorMap: Record<string, number> = { "mems_mic": 0, "imu": 1, "camera_2mp": 2, "camera_5mp": 3, "environmental": 4 };
    for (const s of sensors) {
      const sens = COMPONENT_PRICING["Sensors"][sensorMap[s]];
      lines.push(`| Sensor | ${s} | $${sens[p].toFixed(2)} |`);
      total += sens[p];
    }

    for (const fc of COMPONENT_PRICING["Fixed Cost"]) {
      lines.push(`| Fixed | ${fc.description.split(".")[0]} | $${fc[p].toFixed(2)} |`);
      total += fc[p];
    }

    lines.push(`| **TOTAL** | | **$${total.toFixed(2)}** |`);
    lines.push("", `Price point: ${p}. At 1K-unit Shenzhen volume.`);
    lines.push("", "Note: NRE (one-time engineering costs) are separate — typically $50K-200K. Use the estimate_nre tool for details.");

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: check_dfm
// ---------------------------------------------------------------------------

server.tool(
  "check_dfm",
  "Run DFM (Design for Manufacturing) checks against the 29-item AI hardware checklist. Filter by category or severity.",
  {
    categories: z.array(z.enum(["Thermal", "Antenna & RF", "Power & Battery", "Mechanical", "PCB Layout", "Firmware", "Compliance", "all"])).default(["all"]).describe("Categories to check"),
    severity_filter: z.enum(["all", "CRITICAL", "MAJOR", "MINOR"]).default("all").describe("Minimum severity to show"),
    design_description: z.string().optional().describe("Optional: describe your design for targeted advice"),
  },
  async ({ categories, severity_filter, design_description }) => {
    const sevOrder: Record<string, number> = { "CRITICAL": 3, "MAJOR": 2, "MINOR": 1 };
    const minSev = sevOrder[severity_filter] || 0;

    let filtered = DFM_CHECKLIST;
    if (!categories.includes("all")) {
      filtered = filtered.filter(item => categories.some(c => item.category.includes(c)));
    }
    if (severity_filter !== "all") {
      filtered = filtered.filter(item => sevOrder[item.severity] >= minSev);
    }

    const lines: string[] = ["# DFM Checklist Results", ""];
    if (design_description) {
      lines.push(`**Design:** ${design_description}`, "");
    }

    lines.push(`Showing ${filtered.length} of 29 items (filter: ${categories.join(", ")}, severity >= ${severity_filter})`, "");

    let currentCat = "";
    for (const item of filtered) {
      if (item.category !== currentCat) {
        currentCat = item.category;
        lines.push(`## ${currentCat}`, "");
      }
      lines.push(`### [${item.severity}] #${item.id}: ${item.item}`);
      lines.push(item.detail, "");
    }

    const critCount = filtered.filter(i => i.severity === "CRITICAL").length;
    const majCount = filtered.filter(i => i.severity === "MAJOR").length;
    const minCount = filtered.filter(i => i.severity === "MINOR").length;
    lines.push("---", `**Summary:** ${critCount} Critical, ${majCount} Major, ${minCount} Minor`);
    lines.push("", "Address all Critical items before committing to tooling. Major before DVT. Minor during PVT.");

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: estimate_nre
// ---------------------------------------------------------------------------

server.tool(
  "estimate_nre",
  "Estimate NRE (Non-Recurring Engineering) costs for an AI hardware project. Returns breakdown by category.",
  {
    industrial_design: z.enum(["Basic", "Standard", "Premium"]).describe("ID complexity tier"),
    mechanical: z.enum(["Simple", "Medium", "Complex"]).describe("Mechanical complexity"),
    electronics: z.enum(["MCU-based", "Application processor", "Advanced"]).describe("Electronics complexity"),
    firmware: z.enum(["Basic", "On-device AI", "Full stack"]).describe("Software scope"),
    tooling: z.enum(["Soft mold", "Production mold", "Complex mold"]).describe("Tooling type"),
    prototyping_stages: z.array(z.enum(["3D printed enclosure", "PCBA prototypes", "EVT build", "DVT build"])).describe("Prototyping stages needed"),
    certifications: z.array(z.enum(["FCC (US)", "CE/RED (EU)", "UL/IEC 62368", "SRRC + CCC (China)", "UN38.3 (Battery)"])).describe("Required certifications"),
    price_point: z.enum(["low", "mid", "high"]).default("mid").describe("Estimate tier"),
  },
  async ({ industrial_design, mechanical, electronics, firmware, tooling, prototyping_stages, certifications, price_point }) => {
    const p = price_point as "low" | "mid" | "high";
    const lines: string[] = ["# NRE Cost Estimate", "", "| Category | Tier | Cost (USD) | Timeline |", "|----------|------|-----------|----------|"];
    let total = 0;

    const selections: [string, string][] = [
      ["Industrial Design", industrial_design],
      ["Mechanical Engineering", mechanical],
      ["Electronics Engineering", electronics],
      ["Firmware & Software", firmware],
      ["Tooling & Molds", tooling],
    ];

    for (const [cat, tierName] of selections) {
      const catData = NRE_CATEGORIES[cat];
      const tier = catData.tiers.find(t => t.name === tierName);
      if (tier) {
        lines.push(`| ${cat} | ${tierName} | $${tier[p].toLocaleString()} | ${catData.timeline} |`);
        total += tier[p];
      }
    }

    const protoData = NRE_CATEGORIES["Prototyping"];
    for (const stage of prototyping_stages) {
      const tier = protoData.tiers.find(t => t.name === stage);
      if (tier) {
        lines.push(`| Prototyping | ${stage} | $${tier[p].toLocaleString()} | ${protoData.timeline} |`);
        total += tier[p];
      }
    }

    const certData = NRE_CATEGORIES["Certification & Testing"];
    for (const cert of certifications) {
      const tier = certData.tiers.find(t => t.name === cert);
      if (tier) {
        lines.push(`| Certification | ${cert} | $${tier[p].toLocaleString()} | ${certData.timeline} |`);
        total += tier[p];
      }
    }

    lines.push(`| **TOTAL NRE** | | **$${total.toLocaleString()}** | |`);
    lines.push("", `Price point: ${p}.`);
    lines.push("", "**Key insight:** NRE is front-loaded. For 1,000 units at $30/unit BOM, NRE is 3x production cost.");
    lines.push("", "**Timeline:** 6-9 months typical from kickoff to production-ready.");

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: plan_certification
// ---------------------------------------------------------------------------

server.tool(
  "plan_certification",
  "Plan certification requirements based on target markets and device features. Returns required certs, costs, and timeline.",
  {
    markets: z.array(z.enum(["US", "EU", "China", "Japan", "Canada"])).describe("Target markets"),
    has_lithium_battery: z.boolean().default(true).describe("Device has lithium battery (default: true)"),
    is_body_worn: z.boolean().default(false).describe("Device is worn on the body"),
    has_wifi: z.boolean().default(true).describe("Device has WiFi"),
    has_bluetooth: z.boolean().default(true).describe("Device has Bluetooth"),
    has_cellular: z.boolean().default(false).describe("Device has cellular connectivity"),
    needs_amazon: z.boolean().default(false).describe("Will sell on Amazon (may require UL)"),
    uses_precertified_module: z.boolean().default(false).describe("Using pre-certified WiFi/BLE module"),
  },
  async ({ markets, has_lithium_battery, is_body_worn, has_wifi, has_bluetooth, has_cellular, needs_amazon, uses_precertified_module }) => {
    const needed = new Set<string>();
    for (const market of markets) {
      const base = MARKET_CERTS[market] || [];
      for (const cert of base) needed.add(cert);
    }
    if (has_lithium_battery) needed.add("UN38.3");
    if (needs_amazon && !needed.has("UL/IEC 62368")) needed.add("UL/IEC 62368");

    const lines: string[] = ["# Certification Plan", ""];
    lines.push(`**Markets:** ${markets.join(", ")}`);
    lines.push(`**Features:** ${[has_wifi && "WiFi", has_bluetooth && "BLE", has_cellular && "Cellular", has_lithium_battery && "Li Battery", is_body_worn && "Body-worn", needs_amazon && "Amazon"].filter(Boolean).join(", ")}`, "");

    lines.push("## Required Certifications", "", "| Certification | Region | Timeline | Cost (Mid) | Cost Range |", "|--------------|--------|----------|-----------|-----------|");
    let totalMid = 0;
    let maxWeeks = 0;
    for (const certName of needed) {
      const cert = CERTIFICATIONS[certName];
      if (cert) {
        lines.push(`| ${certName} | ${cert.region} | ${cert.timeline} | $${cert.costMid.toLocaleString()} | $${cert.costLow.toLocaleString()}-${cert.costHigh.toLocaleString()} |`);
        totalMid += cert.costMid;
        const weeks = parseInt(cert.timeline.split("-")[1]) || 0;
        if (weeks > maxWeeks) maxWeeks = weeks;
      }
    }
    lines.push(`| **TOTAL** | | **${maxWeeks} weeks (parallel)** | **$${totalMid.toLocaleString()}** | |`);

    if (is_body_worn) {
      lines.push("", "**SAR Testing Required:** Body-worn devices need SAR testing for CE. Budget extra $3K-5K.");
    }

    lines.push("", "## Cost-Saving Opportunities", "");
    if (uses_precertified_module) {
      lines.push("- Pre-certified module: 40-60% savings on FCC intentional radiator testing");
    }
    if (markets.includes("US") && markets.includes("Canada")) {
      lines.push("- FCC + ISED at same lab: ISED accepts FCC data, save $2K-4K");
    }
    if (markets.includes("US") && markets.includes("EU")) {
      lines.push("- FCC + CE in parallel at same lab saves setup costs");
    }
    lines.push("- Pre-scan before formal testing ($500-1K catches 80% of issues)");
    lines.push("- Do NOT certify before design freeze");

    lines.push("", "## Key Requirements & Tips", "");
    for (const certName of needed) {
      const cert = CERTIFICATIONS[certName];
      if (cert) {
        lines.push(`### ${certName}`);
        for (const req of cert.keyRequirements) lines.push(`- ${req}`);
        for (const tip of cert.tips) lines.push(`- TIP: ${tip}`);
        lines.push("");
      }
    }

    lines.push("## Common Mistakes to Avoid");
    lines.push("1. Starting certification too early (certify after DVT, not EVT)");
    lines.push("2. Forgetting UN38.3 (logistics will refuse to ship)");
    if (is_body_worn) lines.push("3. Not budgeting for SAR testing");
    lines.push("4. Changing PCB after certification (RF changes = re-testing)");
    if (markets.includes("EU")) lines.push("5. No EU Authorized Representative (required since 2021)");
    lines.push("6. Not booking lab slot 4-6 weeks before samples ready");

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: evaluate_supplier
// ---------------------------------------------------------------------------

server.tool(
  "evaluate_supplier",
  "Evaluate a Shenzhen electronics manufacturer against 28 red flags for AI hardware production.",
  {
    supplier_name: z.string().describe("Supplier company name"),
    company_age_years: z.number().optional().describe("Years since company registration"),
    is_manufacturer: z.boolean().optional().describe("True manufacturer vs trading company"),
    shares_bom_breakdown: z.boolean().optional().describe("Shares component-level pricing"),
    has_soc_experience: z.string().optional().describe("SoC platforms they've worked with"),
    has_spi_machine: z.boolean().optional().describe("Has solder paste inspection"),
    has_reflow_profiling: z.boolean().optional().describe("Does reflow temperature profiling"),
    has_functional_test: z.boolean().optional().describe("Has functional test station"),
    component_sources: z.string().optional().describe("Where they source components"),
    has_iqc: z.boolean().optional().describe("Has incoming quality inspection"),
    has_msl_storage: z.boolean().optional().describe("Has dry cabinets for MSL components"),
    has_traceability: z.boolean().optional().describe("Can trace serial to component lots"),
    deposit_percentage: z.number().optional().describe("Deposit percentage required"),
    signs_nnn: z.boolean().optional().describe("Willing to sign NNN agreement"),
    mold_ownership_clear: z.boolean().optional().describe("Clear mold ownership in contract"),
    has_thermal_testing: z.boolean().optional().describe("Has FLIR or thermal testing"),
    has_rf_testing: z.boolean().optional().describe("Has RF test capability"),
    has_provisioning_infra: z.boolean().optional().describe("Has automated firmware provisioning"),
    additional_notes: z.string().optional().describe("Any other observations"),
  },
  async (input) => {
    const lines: string[] = [`# Supplier Evaluation: ${input.supplier_name}`, ""];
    const redFlags: string[] = [];
    const greenFlags: string[] = [];
    const unknowns: string[] = [];

    // Check each assessable red flag
    if (input.is_manufacturer === false) redFlags.push("#1: Trading company, not manufacturer (15-30% markup, no quality control)");
    else if (input.is_manufacturer === true) greenFlags.push("Verified manufacturer");
    else unknowns.push("#1: Verify manufacturer vs trading company (check business license)");

    if (input.company_age_years !== undefined && input.company_age_years < 2) redFlags.push(`#2: Company only ${input.company_age_years} years old (risk of folding)`);
    else if (input.company_age_years !== undefined) greenFlags.push(`Established ${input.company_age_years}+ years`);
    else unknowns.push("#2: Check company registration date on Tianyancha");

    if (input.shares_bom_breakdown === false) redFlags.push("#4: Won't share BOM cost breakdown (hiding margins)");
    else if (input.shares_bom_breakdown === true) greenFlags.push("Transparent BOM pricing");
    else unknowns.push("#4: Request open BOM with component costs");

    if (input.has_soc_experience) {
      greenFlags.push(`SoC experience: ${input.has_soc_experience}`);
    } else {
      unknowns.push("#5: Verify SoC platform experience (ask for 3 previous projects)");
    }

    if (input.has_spi_machine === false) redFlags.push("#7: No SPI machine (2-5% defect rate on fine-pitch)");
    else if (input.has_spi_machine === true) greenFlags.push("Has SPI machine");
    else unknowns.push("#7: Check for SPI machine on SMT line");

    if (input.has_reflow_profiling === false) redFlags.push("#8: No reflow temperature profiling (cold joints or damage)");
    else if (input.has_reflow_profiling === true) greenFlags.push("Does reflow profiling");

    if (input.has_functional_test === false) redFlags.push("#10: No functional test station (sampling only)");
    else if (input.has_functional_test === true) greenFlags.push("Has functional test station");

    if (input.component_sources?.toLowerCase().includes("huaqiangbei") || input.component_sources?.toLowerCase().includes("market")) {
      redFlags.push("#11: Sources from Huaqiangbei markets (counterfeit risk)");
    } else if (input.component_sources) {
      greenFlags.push(`Component sources: ${input.component_sources}`);
    }

    if (input.has_iqc === false) redFlags.push("#13: No incoming quality inspection");
    else if (input.has_iqc === true) greenFlags.push("Has IQC");

    if (input.has_msl_storage === false) redFlags.push("#14: No MSL dry storage (popcorn effect risk)");
    else if (input.has_msl_storage === true) greenFlags.push("Has MSL dry cabinets");

    if (input.has_traceability === false) redFlags.push("#17: No traceability (can't debug field failures)");
    else if (input.has_traceability === true) greenFlags.push("Has serial-to-lot traceability");

    if (input.deposit_percentage !== undefined && input.deposit_percentage > 50) redFlags.push(`#19: Requires ${input.deposit_percentage}% deposit (standard is 30%)`);
    else if (input.deposit_percentage !== undefined) greenFlags.push(`Reasonable ${input.deposit_percentage}% deposit`);

    if (input.signs_nnn === false) redFlags.push("#20: Won't sign NNN agreement (IP risk)");
    else if (input.signs_nnn === true) greenFlags.push("Willing to sign NNN");

    if (input.mold_ownership_clear === false) redFlags.push("#21: Mold ownership unclear (hostage risk)");
    else if (input.mold_ownership_clear === true) greenFlags.push("Clear mold ownership");

    if (input.has_thermal_testing === false) redFlags.push("#25: No thermal testing capability (AI devices run hot)");
    else if (input.has_thermal_testing === true) greenFlags.push("Has thermal testing (FLIR)");

    if (input.has_rf_testing === false) redFlags.push("#26: No RF test capability (antenna issues found late)");
    else if (input.has_rf_testing === true) greenFlags.push("Has RF testing");

    if (input.has_provisioning_infra === false) redFlags.push("#27: No automated provisioning (caps at ~50 units/day)");
    else if (input.has_provisioning_infra === true) greenFlags.push("Has automated provisioning");

    // Report
    lines.push("## Red Flags Found", "");
    if (redFlags.length === 0) lines.push("None identified from provided information.", "");
    else for (const f of redFlags) lines.push(`- ${f}`);

    lines.push("", "## Green Flags", "");
    if (greenFlags.length === 0) lines.push("None identified.", "");
    else for (const f of greenFlags) lines.push(`- ${f}`);

    lines.push("", "## Still Need to Verify", "");
    if (unknowns.length === 0) lines.push("All key items assessed.", "");
    else for (const f of unknowns) lines.push(`- ${f}`);

    // Risk score
    const assessed = redFlags.length + greenFlags.length;
    const riskScore = assessed > 0 ? Math.round((redFlags.length / assessed) * 10) : 5;
    lines.push("", `## Risk Score: ${riskScore}/10 (${riskScore <= 3 ? "LOW" : riskScore <= 6 ? "MEDIUM" : "HIGH"} risk)`);
    lines.push(`Based on ${assessed} assessed items (${unknowns.length} still unknown).`);

    if (input.additional_notes) {
      lines.push("", `## Additional Notes`, input.additional_notes);
    }

    lines.push("", "## Recommended Scorecard Weights");
    lines.push("- Technical capability (30%): SoC experience, SMT line, test equipment");
    lines.push("- Quality system (25%): IQC, SPI, traceability, defect tracking");
    lines.push("- Component sourcing (15%): Authorized channels, MSL handling");
    lines.push("- Business terms (15%): Payment, IP protection, mold ownership");
    lines.push("- Communication (10%): English, responsiveness, documentation");
    lines.push("- Price (5%): Cheapest is almost never best for first run");

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Tool: get_validation_checklist
// ---------------------------------------------------------------------------

server.tool(
  "get_validation_checklist",
  "Get the EVT, DVT, or PVT validation checklist with pass/fail criteria for AI hardware products.",
  {
    stage: z.enum(["EVT", "DVT", "PVT"]).describe("Validation stage"),
    area_filter: z.string().optional().describe("Optional: filter to a specific area (e.g., 'Thermal', 'Firmware', 'RF')"),
  },
  async ({ stage, area_filter }) => {
    const data = VALIDATION_STAGES[stage];
    const lines: string[] = [`# ${stage} — ${data.goal}`, ""];
    lines.push(`**Volume:** ${data.volume} | **Duration:** ${data.duration}`, "");

    let checks = data.checks;
    if (area_filter) {
      checks = checks.filter(c => c.area.toLowerCase().includes(area_filter.toLowerCase()));
      lines.push(`*Filtered to: ${area_filter}*`, "");
    }

    lines.push("## Checks", "", "| ID | Area | Check | Pass Criteria |", "|-----|------|-------|--------------|");
    for (const c of checks) {
      lines.push(`| ${c.id} | ${c.area} | ${c.check} | ${c.criteria} |`);
    }

    lines.push("", "## Exit Criteria", "");
    for (const ec of data.exitCriteria) {
      lines.push(`- [ ] ${ec}`);
    }

    lines.push("", `**Do NOT proceed if:** ${data.doNotProceedIf}`);

    return { content: [{ type: "text" as const, text: lines.join("\n") }] };
  }
);

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
