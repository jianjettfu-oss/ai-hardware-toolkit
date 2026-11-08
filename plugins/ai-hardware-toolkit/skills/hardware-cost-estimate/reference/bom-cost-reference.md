<!-- GENERATED from bom-cost-reference/README.md by scripts/build-llm.mjs. Edit the source file, then rebuild. -->

# BOM Cost Reference -- Shenzhen Component Pricing

Real component pricing from Shenzhen suppliers at **1,000-unit volume** (2025-2026 data).

> **Memory rows re-read 2026-11-08.** Legacy DRAM and eMMC now cost many times what they did in early 2025. The press, quoting DRAMeXchange, put the DDR4 8Gb contract price at about $1.35 in March 2025 and about $27.50 in October 2026. In a small device, memory is now often the biggest line in the BOM. The memory notes in the CSV show how each range was built and how sure we are (mostly low confidence; the 2GB + 32GB row is an estimate). Get quotes before you commit to a price, and prefer a SoC or module with memory in the package where the product allows it.

## What's Inside

**[shenzhen-component-pricing.csv](https://github.com/jianjettfu-oss/ai-hardware-toolkit/blob/main/bom-cost-reference/shenzhen-component-pricing.csv)** -- A reference BOM with low/mid/high pricing for every major component category in a typical AI hardware device:

- **Processors/SoCs** -- From ESP32-S3 ($2.10) to RK3588S ($50) with TOPS ratings
- **Memory** -- PSRAM+Flash for MCUs through 2GB+32GB for on-device LLM
- **Displays** -- No display through E-ink, OLED, AMOLED, LCD
- **Batteries** -- 100mAh pendant through 2000mAh multi-day
- **Connectivity** -- Built-in WiFi/BLE, standalone BLE, 4G LTE, GPS
- **Sensors** -- MEMS mics, IMU, cameras (2MP/5MP), environmental
- **Fixed costs** -- PCB, enclosure, SMT assembly, manual assembly, passives, power management

## How to Use This

1. Pick one option from each category that matches your product
2. Sum the "Mid" column for a realistic baseline estimate
3. The "Low" column is achievable with volume commitments and aggressive sourcing
4. The "High" column accounts for supply constraints, rush orders, or premium specs

## Volume Scaling

These prices are at 1,000 units. Apply these multipliers for other volumes:

| Volume | Multiplier | Example ($30 BOM at 1K) |
|--------|-----------|------------------------|
| 500 units | 1.30x | $39.00 |
| 1,000 units | 1.00x | $30.00 |
| 5,000 units | 0.75x | $22.50 |
| 10,000 units | 0.60x | $18.00 |
| 50,000+ units | 0.48x | $14.40 |

The jump from 500 to 1,000 units is the steepest discount. This is why most first production runs target 1K minimum.

## Example: AI Voice Pendant (Plaud NotePin class)

| Component | Selection | Mid Price |
|-----------|-----------|----------|
| SoC | Rockchip RV1103 | $5.00 |
| Memory | 512MB + 4GB eMMC | $4.00 |
| Display | None | $0.00 |
| Battery | 300-500mAh | $1.40 |
| Connectivity | BLE 5.0 module | $3.50 |
| Sensors | MEMS Mics x2 | $1.00 |
| PCB | 4-layer | $0.90 |
| Enclosure | Injection mold | $8.00 |
| Assembly | SMT + manual | $7.50 |
| Passives | USB-C, LEDs, etc. | $1.45 |
| Power | Charging IC + PMIC | $0.65 |
| **Total** | | **$33.40** |

Add NRE (mold tooling, certification) on top -- see the [NRE Cost Guide](https://github.com/jianjettfu-oss/ai-hardware-toolkit/tree/main/nre-cost-guide/).

## Important Notes

- Prices are FOB Shenzhen (before shipping, duties, import fees)
- Component availability fluctuates -- always verify lead times before committing
- These are component costs only -- does not include NRE, certification, packaging, or margin
- Custom battery shapes cost 2-3x more than standard cells and require new UN38.3 testing

---

*Interactive version: [breezehw.com/tools/bom-estimator](https://breezehw.com/tools/bom-estimator)*
