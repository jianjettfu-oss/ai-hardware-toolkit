# NRE Cost Guide

Non-Recurring Engineering (NRE) costs for AI hardware products, based on Shenzhen pricing.

## What's Inside

**[nre-estimation-framework.md](./nre-estimation-framework.md)** -- A complete NRE breakdown covering 7 cost categories with low/mid/high estimates:

1. **Industrial Design** -- $2K-50K depending on finish level
2. **Mechanical Engineering** -- $3K-60K depending on complexity
3. **Electronics Engineering** -- $3K-55K depending on SoC tier
4. **Firmware & Software** -- $5K-100K (usually the largest line item)
5. **Tooling & Molds** -- $500-40K (soft mold for prototypes, steel for production)
6. **Prototyping** -- $500-40K per stage (3D prints through DVT builds)
7. **Certification** -- $1.5K-20K per certification (FCC, CE, UL, etc.)

Includes two fully worked example budgets:
- **AI Voice Pendant** (Plaud NotePin class): ~$103K total NRE
- **AI Smart Camera** (edge vision device): ~$162K total NRE

Plus a timeline overview showing how 6-9 months of development phases overlap.

## The Key Insight

For a 1,000-unit first run at $30/unit BOM cost, your NRE ($100K+) is **3x your production cost** ($30K). This ratio is why hardware startups need more capital than software startups, and why getting NRE estimates right matters more than shaving $0.50 off your BOM.

---

*Interactive version: [breezehw.com/tools/nre-simulator](https://breezehw.com/tools/nre-simulator)*
