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
| 23 | **Pressures you to skip EVT/DVT stages** | "We can go straight to mass production, save you 2 months." They're cutting corners. | Insist on the full EVT -> DVT -> PVT progression. A good supplier knows why these stages exist and will support them. See the [EVT/DVT/PVT Checklist](../evt-dvt-pvt-checklist/). |

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
