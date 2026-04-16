# EVT / DVT / PVT Validation Checklist

Stage-gate checklists for engineering, design, and production validation of AI hardware devices.

## What's Inside

**[validation-stages.md](./validation-stages.md)** -- Pass/fail criteria for each validation stage:

### EVT (Engineering Validation Test) -- 10-30 units
- Electronics: voltage rails, SoC boot, peripheral function, power profiling, burn-in
- AI/Inference: model execution, latency, accuracy, thermal under inference, power during inference
- Mechanical: PCB fit, user interaction, battery clearance, weight
- RF: WiFi/BLE connectivity with enclosure

### DVT (Design Validation Test) -- 30-100 units
- Reliability: drop test, temperature cycling, humidity, connector durability, battery cycle life
- Thermal: skin temperature, junction temperature, battery charging temperature, throttling
- Battery: runtime verification, charge time, low-battery behavior, charge protection
- RF pre-compliance: conducted/radiated emissions, receiver sensitivity, SAR
- Firmware: OTA update, failure recovery, factory reset, rollback, provisioning
- Usability: setup time, voice accuracy, wear comfort, status indicators

### PVT (Production Validation Test) -- 100-500 units
- Production line: SMT yield, cycle time, ICT pass rate, functional test, cosmetics
- Quality: golden sample match, unit-to-unit consistency, packaging drop test, AQL sampling
- Provisioning: throughput, unique credentials, firmware version lock, OTA server readiness
- Certification: all certs received, markings correct, safety docs, RoHS/REACH

## Why This Matters

No public resource exists with AI-hardware-specific validation criteria. Generic hardware checklists miss:
- **AI inference thermal testing** -- Sustained NPU load creates thermal profiles unlike any other consumer device
- **OTA failure recovery** -- AI devices ship half-finished and improve via updates. If OTA breaks, you can't fix anything.
- **Voice/vision AI accuracy on-device** -- Quantization and edge deployment change model performance in ways you must validate

## When to Use This

| Stage | Entry condition | Exit condition |
|-------|----------------|----------------|
| EVT | First assembled prototypes | Core tech proven, design changes documented |
| DVT | Design changes from EVT implemented | Design freeze, certification testing booked |
| PVT | Certification received, production mold ready | Factory process validated, ready to ship |

---

*Part of the [AI Hardware Manufacturing Toolkit](../)*
