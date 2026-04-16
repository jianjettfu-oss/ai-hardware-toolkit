# DFM Checklist for AI Hardware

A 29-point design-for-manufacturing checklist built specifically for AI hardware devices -- wearables, edge AI boxes, voice pendants, smart cameras, and similar products.

## Why This Exists

Generic DFM checklists miss the issues unique to AI hardware:
- **Thermal** -- Edge AI chips under sustained inference hit temperatures that generic consumer electronics never see
- **RF/Antenna** -- AI devices are almost always wireless, and antenna issues are the #1 cause of failed certification
- **Power** -- The 10-50x current swing between idle and AI inference breaks assumptions baked into standard power design
- **Acoustic** -- Voice AI devices need precise MEMS microphone placement that most ME teams don't account for

## What's Inside

**[ai-hardware-dfm-checklist.md](./ai-hardware-dfm-checklist.md)** covers 7 categories:

| Category | Critical | Major | Minor |
|----------|----------|-------|-------|
| Thermal Management | 3 | 1 | 0 |
| Antenna & RF Design | 1 | 3 | 0 |
| Power & Battery | 2 | 1 | 1 |
| Mechanical & Enclosure | 2 | 2 | 1 |
| PCB Layout | 2 | 2 | 1 |
| Firmware & Software | 1 | 2 | 0 |
| Compliance & Certification | 2 | 2 | 0 |

Every item includes:
- **Why it matters** -- The actual failure mode, not theoretical risk
- **What to do** -- Concrete fix with specific numbers (clearances, thicknesses, part numbers)
- **Severity** -- Critical (blocks production), Major (costly rework), Minor (quality/cost impact)

## When to Use This

- **Before schematic review** -- Catch thermal, power, and RF issues early
- **Before PCB layout review** -- Verify impedance, test points, microphone placement
- **Before tooling release** -- Confirm mechanical tolerances, draft angles, IP rating design
- **Before certification submission** -- Verify all regulatory requirements are addressed

---

*Interactive version: [breezehw.com/tools/dfm-checklist](https://breezehw.com/tools/dfm-checklist)*
