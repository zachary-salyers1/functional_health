# Research Curation Template & Workflow

## Overview

This template helps you systematically curate research for each biomarker. The goal is to build a high-quality research database in 40-60 hours that gives you a defensible competitive moat.

## Curation Workflow

### 1. Biomarker Setup (30 min per biomarker)

For each biomarker, gather baseline information:

```
BIOMARKER: Fasting Glucose
CATEGORY: Metabolic
STANDARD UNIT: mg/dL
ALTERNATIVE UNITS: mmol/L (conversion factor: 0.0555)

RANGES:
- Clinical Low: 70
- Clinical High: 99
- Functional Low: 75
- Functional High: 85

WHY IT MATTERS (2-3 sentences):
Fasting glucose reflects your body's baseline blood sugar regulation and insulin sensitivity. Elevated levels indicate insulin resistance, the root cause of type 2 diabetes, cardiovascular disease, and accelerated aging. Even "normal" but high-normal glucose (>90 mg/dL) correlates with increased disease risk.

RANGE SOURCES:
- Clinical: American Diabetes Association guidelines
- Functional: Multiple studies showing optimal longevity/health outcomes in 75-85 range
```

### 2. Research Collection (2-3 hours per biomarker)

Use this systematic approach:

#### A. Start with Examine.com (if subscribed)
- Search for the biomarker or condition
- Note their summary of effective interventions
- Capture study citations they reference
- This gives you a quick baseline of what works

#### B. PubMed Search Strategy

**Search Query Template:**
```
"[biomarker name]" AND ([intervention type]) AND (randomized controlled trial OR meta-analysis)
```

**Example searches:**
```
"fasting glucose" AND (berberine) AND (randomized controlled trial OR meta-analysis)
"vitamin D" AND (supplementation) AND (randomized controlled trial OR meta-analysis)
"LDL cholesterol" AND (dietary intervention) AND (meta-analysis)
```

**Filters to apply:**
- Publication date: Last 10 years (expand if needed)
- Article type: Clinical Trial, Meta-Analysis, Systematic Review
- Species: Humans
- Text availability: Full text (preferred, but abstract is okay)

#### C. Quality Check Criteria

For each study, quickly assess:
- ✅ Sample size >50 (preferred >100)
- ✅ Randomized controlled trial or meta-analysis
- ✅ Peer-reviewed journal
- ✅ Clear outcome measures related to your biomarker
- ✅ Statistical significance reported
- ❌ Industry-funded with obvious bias
- ❌ Predatory journal
- ❌ Major methodological flaws

### 3. Study Documentation Template

For each study you include, capture this information:

```markdown
## STUDY ENTRY

**Title:** Effect of berberine on insulin resistance in patients with type 2 diabetes: a systematic review and meta-analysis

**Authors:** Yao, J., et al.

**Journal:** Journal of Ethnopharmacology

**Year:** 2021

**PMID:** 33417972

**DOI:** 10.1016/j.jep.2021.113931

**URL:** https://pubmed.ncbi.nlm.nih.gov/33417972/

**Study Type:** Meta-analysis

**Quality Score (1-10):** 9
- Meta-analysis of 12 RCTs
- Total N=1,068 participants
- Clear methodology
- Published in reputable journal
- Consistent findings across studies

**Sample Size:** 1,068 (across 12 studies)

**Duration:** 8-16 weeks (varied by study)

**Intervention Details:**
- Berberine dosage: 0.9-1.5g daily (typically 500mg 3x/day)
- Comparison: Placebo or metformin
- Population: Type 2 diabetics

**Key Findings (plain English):**
Berberine supplementation significantly reduced fasting blood glucose by an average of 15.5 mg/dL, HbA1c by 0.71%, and fasting insulin levels. The effects were comparable to metformin in head-to-head comparisons. Participants tolerated it well with minimal gastrointestinal side effects.

**Statistical Significance:**
- FBG: MD -15.5 mg/dL, 95% CI [-20.0, -11.0], p<0.001
- HbA1c: MD -0.71%, 95% CI [-0.90, -0.52], p<0.001

**Limitations:**
- Study durations relatively short (most 12 weeks)
- Primarily Asian populations
- Heterogeneity in dosing protocols
- Most studies in diabetics, less data in pre-diabetics

**Clinical Relevance:**
HIGH - Strong evidence for berberine's glucose-lowering effects. Sufficient for inclusion in protocols for elevated fasting glucose.

**Quote for Protocol:**
"Berberine supplementation significantly improved glycemic control with effects comparable to metformin, reducing fasting glucose by approximately 15 mg/dL in 8-12 weeks."

**Tags:** #fasting_glucose #berberine #supplement #high_quality #meta_analysis
```

## Intervention Documentation Template

For each intervention, document:

```markdown
## INTERVENTION ENTRY

**Name:** Berberine HCl

**Type:** Supplement

**Biomarkers Affected:** 
- Fasting Glucose (primary)
- HbA1c (primary)
- Fasting Insulin (secondary)
- LDL Cholesterol (secondary)
- Triglycerides (secondary)

**Description:**
Berberine is a natural alkaloid compound extracted from various plants. It improves insulin sensitivity through activation of AMPK (the same pathway as metformin) and has glucose-lowering effects comparable to metformin in clinical studies.

**Dosage:** 500mg, 3 times daily (1,500mg total)

**Timing:** Take 15-30 minutes before meals

**Duration:** Minimum 8 weeks, typically 12-16 weeks for full effect

**Expected Results:**
- Fasting glucose reduction: 10-20 mg/dL
- HbA1c reduction: 0.5-0.7%
- Timeline: 4-8 weeks for initial effects, 12 weeks for maximum benefit

**Cost Estimate:** $20-30/month

**Where to Buy:** 
- Thorne Research Berberine (high quality)
- Pure Encapsulations Berberine
- Available on Amazon, iHerb, direct from manufacturer

**Contraindications:**
- May lower blood sugar significantly - monitor if diabetic or on diabetes medications
- Can interact with CYP3A4 medications
- May cause GI upset initially (start with lower dose)
- Avoid if pregnant or nursing
- Not recommended with other blood sugar lowering medications without physician supervision

**Side Effects:**
- Mild GI upset (diarrhea, constipation, gas) in ~30% of users
- Usually resolves after 1-2 weeks
- Taking with food helps minimize

**Notes:**
Start with 500mg 2x/day for the first week, then increase to 3x/day to minimize GI side effects. Best taken consistently with meals.

**Supporting Studies:** [Link to study IDs: 1, 2, 3]

**Confidence Level:** HIGH - Multiple meta-analyses and RCTs
```

## Pre-populated Research Curation Checklist

Use this checklist for your MVP (20 biomarkers):

### Tier 1: Highest Priority (These affect most people)

#### 1. Fasting Glucose
- [ ] Define ranges (clinical + functional)
- [ ] Curate 3-5 studies on:
  - [ ] Berberine supplementation
  - [ ] Low-carb diets
  - [ ] Exercise (resistance + walking)
  - [ ] Chromium or alpha-lipoic acid
  - [ ] Cinnamon extract
- [ ] Document 5-7 interventions
- [ ] Create protocol rules

#### 2. Vitamin D
- [ ] Define ranges (clinical + functional)
- [ ] Curate 3-5 studies on:
  - [ ] Supplementation dosing (1000-5000 IU)
  - [ ] D3 vs D2
  - [ ] Co-factors (K2, magnesium)
  - [ ] Sun exposure
- [ ] Document 3-4 interventions
- [ ] Create protocol rules

#### 3. HbA1c
- [ ] Define ranges
- [ ] Studies on:
  - [ ] Diet interventions
  - [ ] Berberine
  - [ ] Exercise
  - [ ] Continuous glucose monitoring benefits
- [ ] Document interventions
- [ ] Create protocol rules

#### 4. TSH (Thyroid)
- [ ] Define ranges (controversial - functional vs clinical)
- [ ] Studies on:
  - [ ] Selenium supplementation
  - [ ] Iodine (when indicated)
  - [ ] Gluten elimination (Hashimoto's)
  - [ ] Stress management
- [ ] Document interventions
- [ ] Create protocol rules

#### 5. LDL Cholesterol
- [ ] Define ranges
- [ ] Studies on:
  - [ ] Dietary patterns (Mediterranean, low-carb)
  - [ ] Fiber supplementation
  - [ ] Plant sterols
  - [ ] Exercise
  - [ ] Berberine (yes, also helps lipids!)
- [ ] Document interventions
- [ ] Create protocol rules

### Tier 2: Common Issues

#### 6. HDL Cholesterol (Low HDL)
- [ ] Ranges + studies
- [ ] Interventions: Exercise, omega-3s, niacin, low-carb

#### 7. Triglycerides
- [ ] Ranges + studies  
- [ ] Interventions: Carb reduction, omega-3s, exercise

#### 8. Ferritin (Iron Storage)
- [ ] Ranges + studies
- [ ] Interventions: Iron supplementation (if low), blood donation (if high), vitamin C for absorption

#### 9. Vitamin B12
- [ ] Ranges + studies
- [ ] Interventions: B12 supplementation (methylcobalamin vs cyanocobalamin), dietary sources

#### 10. Magnesium
- [ ] Ranges + studies
- [ ] Interventions: Magnesium glycinate supplementation, dietary sources

### Tier 3: Hormonal (If targeting fitness/performance audience)

#### 11. Testosterone (Total)
- [ ] Ranges + studies
- [ ] Interventions: Vitamin D, zinc, magnesium, resistance training, sleep optimization, stress management

#### 12. Free Testosterone
- [ ] Ranges + studies
- [ ] Interventions: Similar to total T, plus body fat reduction

#### 13. Cortisol
- [ ] Ranges + studies
- [ ] Interventions: Ashwagandha, meditation, sleep, exercise (moderate, not excessive)

#### 14. DHEA-S
- [ ] Ranges + studies
- [ ] Interventions: Stress management, DHEA supplementation (if appropriate)

### Tier 4: Additional Metabolic

#### 15. Fasting Insulin
- [ ] Ranges + studies
- [ ] Interventions: Same as glucose (insulin resistance focus)

#### 16. HOMA-IR (Insulin Resistance Score)
- [ ] Ranges + studies
- [ ] Interventions: Same as glucose + insulin

#### 17. CRP (Inflammation)
- [ ] Ranges + studies
- [ ] Interventions: Omega-3s, curcumin, diet quality, exercise, sleep

#### 18. Homocysteine
- [ ] Ranges + studies
- [ ] Interventions: B-vitamin complex (B6, B9, B12), TMG/betaine

### Tier 5: Thyroid Panel

#### 19. Free T3
- [ ] Ranges + studies
- [ ] Interventions: Selenium, iodine (careful), conversion support

#### 20. Free T4
- [ ] Ranges + studies
- [ ] Interventions: Thyroid support, stress management, nutrient status

## Time-Saving Strategies

### 1. Start with Meta-Analyses
- Search for "[biomarker] AND meta-analysis" first
- One good meta-analysis can give you 10-20 individual studies to reference
- Saves hours of individual study review

### 2. Use Examine.com Research Database
- If you have access, start here for supplements
- They've already done the heavy lifting
- Verify their citations and add to your database

### 3. Focus on "Greatest Hits" First
- 80/20 rule: The most common interventions get you 80% of the value
- Berberine, Vitamin D, Omega-3s, Magnesium cover a huge % of recommendations
- Document these thoroughly first

### 4. Template Everything
- Use the templates above
- Copy/paste and fill in the blanks
- Consistent structure speeds up work

### 5. Quality Over Quantity
- 3 excellent studies > 10 mediocre studies
- Focus on meta-analyses and large RCTs
- You can add more studies later as you scale

## Research Curation Schedule

**Week 1: Foundation (15 hours)**
- Day 1-2: Set up database structure (5 hours)
- Day 3-4: Curate Tier 1 biomarkers 1-3 (10 hours)
  - Fasting Glucose (4 hours)
  - Vitamin D (3 hours)
  - HbA1c (3 hours)

**Week 2: Core Metabolic + Lipids (15 hours)**
- Day 5-6: TSH + LDL Cholesterol (7 hours)
- Day 7-8: HDL, Triglycerides, Ferritin, B12, Magnesium (8 hours)

**Week 3: Hormonal + Advanced (10 hours)**
- Day 9-10: Testosterone, Free T, Cortisol, DHEA-S (6 hours)
- Day 11: Insulin, HOMA-IR, CRP, Homocysteine (4 hours)

**Week 4: Thyroid + Polish (10 hours)**
- Day 12: Free T3, Free T4 (4 hours)
- Day 13-14: Review, fill gaps, test protocol generation (6 hours)

**Total: 50 hours over 4 weeks**

## Quality Assurance Checklist

Before launching, verify:

- [ ] Each biomarker has clear functional ranges (not just clinical)
- [ ] Each biomarker has "why it matters" explanation in plain English
- [ ] Minimum 3 interventions per common biomarker issue
- [ ] Each intervention has at least 2 supporting studies
- [ ] Study citations are accurate (PMID verified)
- [ ] Dosages are safe and evidence-based
- [ ] Contraindications are documented
- [ ] Expected results are realistic and cited
- [ ] Cost estimates are accurate
- [ ] "Where to buy" recommendations are current

## Ongoing Maintenance

**Monthly (2-3 hours):**
- Check PubMed for new meta-analyses on your covered biomarkers
- Update any changed recommendations
- Add newly discovered interventions

**Quarterly (5-10 hours):**
- Review user feedback on protocol effectiveness
- Update based on real-world outcomes
- Add new biomarkers if user demand exists

**Annually (20-30 hours):**
- Comprehensive review of all recommendations
- Update ranges if new research emerges
- Add advanced protocol combinations

---

## Next Steps for You

1. **This week:** Set up the database schema and populate the biomarkers table with your 20 core markers

2. **Next 2 weeks:** Start with Tier 1 biomarkers (Glucose, Vitamin D, HbA1c, TSH, LDL) - these are the most common issues and will give you a launchable product

3. **Week 4:** Add remaining Tier 2-4 biomarkers at a lighter level of detail (can be expanded post-launch)

4. **Week 5+:** Build the protocol generation engine using the data you've curated

**Pro tip:** You can launch with just Tier 1 fully built (5 biomarkers, ~20 interventions, ~40 studies) and be helpful to 80% of users. Add the rest as you get paying customers and feedback.

Want me to create:
- A Google Sheets template pre-formatted for this curation process?
- Example completed entries for Fasting Glucose so you can see the end product?
- The actual SQL schema setup scripts you can run?