---
name: hardware-certification-plan
description: Plan the regulatory certifications for an electronic or AI hardware product by target market (FCC, CE/RED, UL / IEC 62368-1, SRRC, CCC, MIC/TELEC, ISED, UN38.3 for batteries), with typical cost, timeline, test-lab choice, money-saving tactics and common mistakes. Use when someone asks which certifications a device needs, what certification costs or how long it takes, how to launch in the US and EU, whether a pre-certified radio module helps, or how to budget certification in an NRE plan.
license: MIT
---

# Hardware certification plan

The decision tree is in [reference/certification-decision-tree.md](reference/certification-decision-tree.md): markets to certifications, then details, cost ranges and timelines for each, then a US + EU launch strategy, money-saving tactics and common mistakes.

## How to build the plan

1. **Pin down the inputs**: target markets, radios (Wi-Fi, BLE, cellular, sub-GHz), battery chemistry and capacity, power source (USB, mains adapter), body contact (wearable or not), and whether a pre-certified radio module is used. Ask for any that are missing.
2. **Map markets to certifications** with Step 1 of the reference.
3. **For each certification**, give the cost range and timeline from the reference, and the single requirement most likely to cause a retest for this product.
4. **Sequence the work**: pre-scan during DVT, formal testing on PVT-representative units, battery transport (UN38.3) before the first shipment.
5. **Flag what the reference may not cover.** Rules change. The cost and timeline figures are planning ranges, not quotes. Tell the user to confirm current requirements with an accredited lab, and to check EU cybersecurity rules for connected radio products (RED delegated act, EN 18031) and the Cyber Resilience Act if the product connects to the internet.

## Output format

A table: market, certification, required or optional, cost range, timeline, the risk for this product. Then the sequence with the build stage each test belongs to, and the open questions for the lab.

Source and updates: https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/certification-guide (maintained by Breeze, breezehw.com).
