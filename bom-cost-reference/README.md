# BOM Cost Reference -- Shenzhen Component Pricing

Real component pricing from Shenzhen suppliers at **1,000-unit volume** (2025-2026 data).

## What's Inside

**[shenzhen-component-pricing.csv](./shenzhen-component-pricing.csv)** -- A reference BOM with low/mid/high pricing for every major component category in a typical AI hardware device:

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

Add NRE (mold tooling, certification) on top -- see the [NRE Cost Guide](../nre-cost-guide/).

## Important Notes

- Prices are FOB Shenzhen (before shipping, duties, import fees)
- Component availability fluctuates -- always verify lead times before committing
- These are component costs only -- does not include NRE, certification, packaging, or margin
- Custom battery shapes cost 2-3x more than standard cells and require new UN38.3 testing

---

*Interactive version: [breezehw.com/tools/bom-estimator](https://breezehw.com/tools/bom-estimator)*
