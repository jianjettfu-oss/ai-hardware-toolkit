---
name: hardware-certification-plan
description: Plan the regulatory certifications for an electronic or AI hardware product by target market (FCC, CE/RED, UL / IEC 62368-1, SRRC, CCC, MIC/TELEC, ISED, UN38.3 for batteries), with typical cost, timeline, test-lab choice, money-saving tactics and common mistakes, plus the EU rules that reach into the design (RED cybersecurity and EN 18031, Cyber Resilience Act reporting, user-replaceable batteries from 2027). Use when someone asks which certifications a device needs, what certification costs or how long it takes, how to launch in the US and EU, whether a pre-certified radio module helps, whether EU cybersecurity or the CRA applies to a device, or how to budget certification in an NRE plan.
license: MIT
---

# Hardware certification plan

The decision tree is in [reference/certification-decision-tree.md](reference/certification-decision-tree.md): markets to certifications, then details, cost ranges and timelines for each, then a US + EU launch strategy, money-saving tactics and common mistakes.

## How to build the plan

1. **Pin down the inputs**: target markets, radios (Wi-Fi, BLE, cellular, sub-GHz), battery chemistry and capacity, power source (USB, mains adapter), body contact (wearable or not), and whether a pre-certified radio module is used. Ask for any that are missing.
2. **Map markets to certifications** with Step 1 of the reference.
3. **For each certification**, give the cost range and timeline from the reference, and the single requirement most likely to cause a retest for this product.
4. **For an EU launch, check the three design-level rules** in the reference (under CE / RED and UN38.3): which RED cybersecurity requirements apply and whether the password design allows self-declaration under EN 18031; whether CRA Article 14 reporting already applies (it does for any product with digital elements on the EU market); and whether the battery must be user-replaceable from 18 February 2027. These belong at EVT, not at the lab.
5. **Sequence the work**: pre-scan during DVT, formal testing on PVT-representative units, battery transport (UN38.3) before the first shipment.
6. **Flag what the reference may not cover.** Rules change. The cost and timeline figures are planning ranges, not quotes, and there is no sourced figure for EN 18031 work. Tell the user to confirm current requirements with an accredited lab, and give the date the reference says its EU rules were last checked.

## Output format

A table: market, certification, required or optional, cost range, timeline, the risk for this product. Then the sequence with the build stage each test belongs to, and the open questions for the lab.

Source and updates: https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/certification-guide (maintained by Breeze, breezehw.com).
