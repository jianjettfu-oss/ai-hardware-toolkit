# Certification Decision Tree for AI Hardware

A practical guide to regulatory certifications for AI hardware devices. Covers which certifications you need, what they cost, how long they take, and how to avoid the mistakes that delay most first-time hardware companies by 2-3 months.

---

## Step 1: Identify Your Target Markets

Your target markets determine which certifications are mandatory:

| Market | Required Certs | Optional but Recommended |
|--------|---------------|------------------------|
| United States | FCC | UL / IEC 62368 |
| European Union | CE / RED | -- |
| China | SRRC + CCC (if applicable) | -- |
| Japan | MIC / TELEC | -- |
| Canada | ISED | -- |
| Global (all major) | FCC + CE + UL + SRRC + MIC + ISED | -- |

**If your device has a lithium battery (almost all AI hardware does), add UN38.3 to every market.** Without it, your batteries cannot be shipped by air. Your entire supply chain stops.

---

## Step 2: Understand Each Certification

### FCC (United States)

**Full name:** Federal Communications Commission  
**What it covers:** Any electronic device that emits RF energy sold in the US -- intentional radiators (WiFi, BLE, cellular) and unintentional radiators (digital devices).  
**Timeline:** 4-8 weeks  
**Cost:** $3,000-10,000

**Key requirements:**
- FCC Part 15 for WiFi/BLE (intentional radiator)
- FCC Part 15B for digital devices (unintentional radiator)
- FCC ID required -- must apply through a Grantee Code
- 5 production-representative samples needed
- Label with FCC ID must be visible or e-label for small devices

**Tips:**
- Apply for a Grantee Code early -- it takes 1-2 weeks
- Pre-scan at a local EMC lab ($500-1000) before formal testing saves rework
- Small devices (<8cm) can use e-labeling instead of physical FCC ID label
- If using a pre-certified WiFi module, you may only need unintentional radiator testing (significant cost savings)

**Test labs:** Bureau Veritas (Shenzhen), TUV SUD, SGS, Intertek

---

### CE / RED (European Union)

**Full name:** Radio Equipment Directive (2014/53/EU)  
**What it covers:** Mandatory for placing radio equipment on the EU market. Covers safety (LVD), EMC, and radio spectrum requirements.  
**Timeline:** 6-10 weeks  
**Cost:** $3,000-12,000

**Key requirements:**
- EN 301 489 -- EMC for radio equipment
- EN 300 328 -- 2.4GHz WiFi/BLE
- EN 62368-1 -- Safety (replaces EN 60950-1)
- EN 62311 -- Human exposure to electromagnetic fields (SAR for body-worn)
- Declaration of Conformity (DoC) required
- Authorized representative in the EU required since 2021

**Tips:**
- CE and FCC testing can be done in parallel at the same lab to save time
- Body-worn devices need SAR testing -- budget extra $3K-5K
- You need an EU-based Authorized Representative (can be a service for ~$500/yr)
- Keep the Technical File (design docs, test reports, risk assessment) for 10 years

**Test labs:** SGS (Shenzhen), Bureau Veritas, TUV Rheinland, CTTL

---

### UL / IEC 62368 (Global Safety)

**Full name:** UL 62368-1 / IEC 62368-1 Safety Certification  
**What it covers:** Product safety for audio/video, IT, and communication equipment. Covers fire, electric shock, and mechanical hazards.  
**Timeline:** 8-14 weeks  
**Cost:** $5,000-20,000  
**Legally required?** No -- but major retailers (Amazon, Best Buy, Target) and insurance companies often require it.

**Key requirements:**
- Battery-powered devices: battery must meet IEC 62133 or UL 2054
- Charging system evaluated for abnormal conditions
- All safety-critical components must be UL-recognized or tested
- Factory inspection required (initial + annual follow-up)

**Tips:**
- Start with a preliminary review -- UL offers "pre-submission" consultations
- Amazon often requires UL certification for lithium battery products
- CB Scheme report (IEC 62368-1) can be transferred to multiple national marks
- Annual factory inspections: budget $2K-4K/year ongoing cost

**Test labs:** UL (direct), TUV SUD, CSA Group, Intertek (ETL)

---

### SRRC (China)

**Full name:** State Radio Regulation of China  
**What it covers:** Radio type approval required for any wireless device sold in China.  
**Timeline:** 6-10 weeks  
**Cost:** $4,000-15,000

**Key requirements:**
- Type approval application to MIIT (Ministry of Industry and Information Technology)
- Testing at designated Chinese lab
- Chinese entity required as applicant (or local agent)
- 5 samples required
- SRRC certificate valid for 5 years

**Tips:**
- If you have a Shenzhen manufacturing partner, they can be the local applicant
- SRRC must be obtained BEFORE applying for CCC
- Pre-certified WiFi/BLE modules reduce scope to just the host device
- Processing time has improved -- typically 4-6 weeks after submission

**Test labs:** CTTL (Beijing), CESI, CTC (Shenzhen), MTNet

---

### CCC (China)

**Full name:** China Compulsory Certification  
**What it covers:** Compulsory for specific product categories sold in China. Not all electronics require CCC -- check the CCC catalog.  
**Timeline:** 8-16 weeks  
**Cost:** $5,000-20,000  
**Legally required?** Only if your product falls in the CCC catalog.

**Key requirements:**
- Must be in the CCC product catalog to be required
- Factory audit required (initial + annual)
- SRRC must be obtained first (if wireless)
- Testing at CNCA-designated lab
- Chinese entity required as certificate holder

**Tips:**
- Many AI wearables are CCC-exempt -- check the catalog before budgeting
- Battery-only devices (no mains power) are often exempt
- If exempt from CCC, voluntary CQC mark is available but rarely needed
- Factory audit can be done at your Shenzhen manufacturing facility

**Test labs:** CQC (direct), CESI, CTC

---

### MIC / TELEC (Japan)

**Full name:** Ministry of Internal Affairs and Communications  
**What it covers:** Technical standards conformity certification for radio equipment in Japan.  
**Timeline:** 4-8 weeks  
**Cost:** $3,000-10,000

**Key requirements:**
- TELEC certification for specified radio equipment
- Testing per ARIB standards
- Japanese entity as applicant (or registered agent)
- Technical document submission in Japanese

**Tips:**
- Many test labs in Shenzhen can do TELEC testing
- Can run in parallel with FCC/CE testing
- Pre-certified modules simplify the process significantly
- Japan has specific requirements for 5GHz WiFi DFS channels

**Test labs:** TUV Rheinland (Shenzhen), SGS, Bureau Veritas

---

### ISED (Canada)

**Full name:** Innovation, Science and Economic Development Canada  
**What it covers:** Canadian radio certification, similar to FCC.  
**Timeline:** 4-6 weeks  
**Cost:** $2,000-8,000

**Key requirements:**
- RSS-247 for WiFi/BLE devices
- RSS-102 for RF exposure (SAR for body-worn)
- ISED certification number on label
- Can often use same test data as FCC (save cost)

**Tips:**
- File FCC and ISED together -- many labs do both in one test run
- ISED accepts FCC test data for most parameters
- If selling via Amazon.ca, ISED certification is mandatory
- Processing time is typically faster than FCC

**Test labs:** Same labs as FCC -- Bureau Veritas, SGS, TUV

---

### UN38.3 (Battery Transport -- Global)

**Full name:** UN Manual of Tests and Criteria -- Section 38.3  
**What it covers:** Required for ALL lithium battery products for air/sea transport.  
**Timeline:** 3-6 weeks  
**Cost:** $1,500-5,000

**Key requirements:**
- 8 tests: altitude, thermal, vibration, shock, short circuit, impact, overcharge, forced discharge
- Test report (not certification) is the deliverable
- Must test the specific cell AND the battery pack
- MSDS (Material Safety Data Sheet) also required for shipping

**Tips:**
- Source batteries from suppliers who already have UN38.3 reports
- Custom battery shapes require new testing -- use standard cells when possible
- Keep the UN38.3 report accessible -- freight forwarders will ask for it
- Some airlines have additional requirements beyond UN38.3

**Test labs:** SGS, Bureau Veritas, TUV, UL

---

## Step 3: Plan Your Certification Strategy

### For US + EU launch (most common for AI startups):

| Certification | Cost (Mid) | Timeline | When to Start |
|--------------|-----------|----------|---------------|
| FCC | $5,000 | 4-8 weeks | After DVT build |
| CE / RED | $6,000 | 6-10 weeks | Parallel with FCC |
| UN38.3 | $3,000 | 3-6 weeks | During DVT (battery must be final) |
| UL (if Amazon) | $10,000 | 8-14 weeks | Parallel with above |
| **Total** | **$14,000-24,000** | **10-14 weeks** | |

### Money-saving tactics:

1. **Use pre-certified wireless modules.** If your WiFi/BLE module already has FCC/CE/ISED approval, you only need unintentional radiator testing for the host device. This can cut FCC cost by 40-60%.

2. **Test FCC + CE + ISED at the same lab in one run.** Most Shenzhen labs can do all three. Shared setup saves $2K-4K.

3. **Pre-scan before formal testing.** A $500-1000 pre-scan at a local EMC lab catches 80% of issues. Failing formal testing and re-submitting costs $3K-5K in wasted time and fees.

4. **Don't certify before design freeze.** Any PCB change after certification means re-testing. This is the most expensive mistake first-time hardware companies make.

---

## Common Mistakes

1. **Starting certification too early.** Certify after DVT, not EVT. EVT designs change.
2. **Forgetting UN38.3.** Your logistics partner will refuse to ship without it.
3. **Not budgeting for SAR testing.** Body-worn devices need it for CE. Budget $3K-5K extra.
4. **Changing the PCB after certification.** Any change to the RF section requires re-testing.
5. **Not having an EU Authorized Representative.** Required since 2021. Services cost ~$500/yr.
6. **Underestimating timeline.** Certification labs have queues. Book your slot 4-6 weeks before samples are ready.

---

*Interactive version: [breezehw.com/tools/cert-navigator](https://breezehw.com/tools/cert-navigator)*
