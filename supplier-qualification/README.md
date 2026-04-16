# Supplier Qualification Checklist

Red flags and green flags when evaluating Shenzhen electronics manufacturers for your first AI hardware production run.

## What's Inside

**[supplier-red-flags.md](./supplier-red-flags.md)** -- 28 red flags organized into 5 categories:

1. **Desktop Research (5 flags)** -- What to check before you visit: trading companies posing as manufacturers, company age, capability claims, BOM transparency, SoC platform experience

2. **Production Capability (5 flags)** -- What to look at on the factory floor: idle SMT lines, missing SPI machines, manual soldering, no functional test, reflow profiling

3. **Component Sourcing (4 flags)** -- The #1 cause of "worked in prototyping, fails in production": Huaqiangbei street market parts, no incoming QC, moisture-sensitive component handling

4. **Business (5 flags)** -- Deposit structures, NNN agreements (not NDA -- Chinese law), mold ownership, defect penalties, pressure to skip validation stages

5. **AI Hardware-Specific (5 flags)** -- Issues unique to AI devices: no NPU experience, no thermal testing, no RF test capability, no firmware provisioning infrastructure

Plus: **Green flags** (what good suppliers look like) and a **weighted evaluation scorecard** for comparing 2-3 suppliers side by side.

## Why This Matters

Generic factory audits focus on ISO certification, fire exits, and worker conditions. Those matter, but they won't tell you whether a factory can:
- Route DDR memory traces for an RK3588S
- Handle thermal management for sustained AI inference
- Set up automated firmware provisioning at 30 seconds per unit
- Source genuine components instead of Huaqiangbei counterfeits

This guide fills that gap.

---

*Part of the [AI Hardware Manufacturing Toolkit](../)*
