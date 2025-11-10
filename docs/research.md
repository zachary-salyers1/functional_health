# Functional Health App - Research Database Template

## Overview
This database structure serves as the foundation for generating evidence-based, personalized health protocols. It connects biomarker values to actionable interventions backed by scientific research.

---

## Database Schema

### Table 1: `biomarkers`
Defines all biomarkers the app can interpret.

```sql
CREATE TABLE biomarkers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    standard_unit VARCHAR(20),
    optimal_range_min DECIMAL(10,3),
    optimal_range_max DECIMAL(10,3),
    clinical_low DECIMAL(10,3),
    clinical_high DECIMAL(10,3),
    description TEXT,
    why_it_matters TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Categories: metabolic, lipids, thyroid, vitamins, minerals, inflammation, hormones
```

**Example Row:**
```sql
INSERT INTO biomarkers (name, category, standard_unit, optimal_range_min, optimal_range_max, clinical_low, clinical_high, description, why_it_matters) 
VALUES (
    'Fasting Glucose',
    'metabolic',
    'mg/dL',
    70,
    85,
    65,
    99,
    'Blood sugar level after 8+ hours of fasting',
    'Elevated fasting glucose indicates insulin resistance and increased diabetes risk. Even levels in the "normal" clinical range (86-99) may indicate early metabolic dysfunction.'
);
```

---

### Table 2: `biomarker_conditions`
Defines health conditions based on biomarker ranges.

```sql
CREATE TABLE biomarker_conditions (
    id SERIAL PRIMARY KEY,
    biomarker_id INTEGER REFERENCES biomarkers(id),
    condition_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL, -- optimal, suboptimal, concerning, clinical
    min_value DECIMAL(10,3),
    max_value DECIMAL(10,3),
    description TEXT,
    priority_score INTEGER, -- 1-10, higher = more urgent to address
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Example Rows:**
```sql
-- Fasting Glucose conditions
INSERT INTO biomarker_conditions (biomarker_id, condition_name, severity, min_value, max_value, description, priority_score)
VALUES 
    (1, 'Optimal Glucose', 'optimal', 70, 85, 'Fasting glucose in ideal metabolic range', 1),
    (1, 'Elevated Normal', 'suboptimal', 86, 99, 'Clinically normal but functionally suboptimal - early insulin resistance', 6),
    (1, 'Prediabetic Range', 'concerning', 100, 125, 'Significant insulin resistance, high diabetes risk', 9),
    (1, 'Diabetic Range', 'clinical', 126, NULL, 'Clinical diabetes diagnosis threshold - requires medical intervention', 10);
```

---

### Table 3: `interventions`
All possible interventions (diet, supplements, lifestyle, testing).

```sql
CREATE TABLE interventions (
    id SERIAL PRIMARY KEY,
    intervention_type VARCHAR(50) NOT NULL, -- dietary, supplement, lifestyle, exercise, sleep, stress, testing
    name VARCHAR(200) NOT NULL,
    description TEXT,
    implementation_details TEXT,
    typical_duration_days INTEGER,
    difficulty_level VARCHAR(20), -- easy, moderate, advanced
    cost_estimate VARCHAR(50), -- free, low (<$30/mo), medium ($30-100/mo), high (>$100/mo)
    contraindications TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Example Rows:**
```sql
INSERT INTO interventions (intervention_type, name, description, implementation_details, typical_duration_days, difficulty_level, cost_estimate, contraindications)
VALUES 
    (
        'dietary',
        'Low-Carb Diet (<100g/day)',
        'Reduce daily carbohydrate intake to improve insulin sensitivity',
        'Target 75-100g carbs daily. Focus on: lean proteins (chicken, fish, turkey), non-starchy vegetables, healthy fats (avocado, olive oil, nuts). Avoid: bread, pasta, rice, sugary foods, processed snacks. Track macros using MyFitnessPal or similar app.',
        90,
        'moderate',
        'free',
        'Not recommended for type 1 diabetics without medical supervision. May need medication adjustment if on diabetes drugs.'
    ),
    (
        'supplement',
        'Berberine 500mg 3x/day',
        'Natural compound that improves insulin sensitivity and glucose metabolism',
        'Take 500mg with each meal (breakfast, lunch, dinner) for total of 1,500mg daily. Take with food to reduce GI side effects. Best brands: Thorne, Pure Encapsulations, or Life Extension.',
        90,
        'easy',
        'low',
        'May interact with diabetes medications - consult doctor if on metformin or insulin. Can cause digestive upset initially.'
    ),
    (
        'lifestyle',
        'Daily 10,000 Steps',
        'Increase non-exercise activity thermogenesis (NEAT) to improve insulin sensitivity',
        'Walk 10,000 steps daily (tracked via smartphone or fitness watch). Spread throughout the day - walk after meals for additional glucose control benefit. Can be broken into 2-3 walking sessions.',
        90,
        'easy',
        'free',
        'None for most people. Start with lower step count if currently sedentary.'
    ),
    (
        'exercise',
        'Resistance Training 3x/week',
        'Build muscle mass to improve glucose disposal and insulin sensitivity',
        'Full-body workouts 3 days per week. Focus on compound movements: squats, deadlifts, bench press, rows, overhead press. 3-4 sets of 6-12 reps per exercise. Progressive overload - gradually increase weight over time.',
        90,
        'moderate',
        'low',
        'Consult physician if new to exercise or have cardiovascular concerns.'
    ),
    (
        'testing',
        'Continuous Glucose Monitor (CGM) 14-day trial',
        'Track glucose response to foods and activities in real-time',
        'Use Freestyle Libre, Dexcom, or similar CGM for 14 days. Monitor glucose spikes after meals. Identify problem foods. Optimal: stay below 120 mg/dL post-meal, return to baseline within 2 hours.',
        14,
        'easy',
        'medium',
        'None - over-the-counter device'
    );
```

---

### Table 4: `research_studies`
Scientific evidence supporting interventions.

```sql
CREATE TABLE research_studies (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    authors TEXT,
    journal VARCHAR(200),
    publication_year INTEGER,
    pubmed_id VARCHAR(20),
    doi VARCHAR(100),
    study_type VARCHAR(50), -- RCT, meta-analysis, systematic_review, cohort, case-control
    quality_score INTEGER, -- 1-10, based on study design and execution
    sample_size INTEGER,
    duration_weeks INTEGER,
    key_findings TEXT,
    limitations TEXT,
    url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**Example Row:**
```sql
INSERT INTO research_studies (title, authors, journal, publication_year, pubmed_id, study_type, quality_score, sample_size, duration_weeks, key_findings, limitations, url)
VALUES (
    'Berberine in the treatment of type 2 diabetes mellitus: a systemic review and meta-analysis',
    'Liang Y, Xu X, Yin M, et al.',
    'World Journal of Diabetes',
    2019,
    '31328019',
    'meta-analysis',
    8,
    1068,
    12,
    'Berberine significantly reduced fasting blood glucose by 15.9 mg/dL and HbA1c by 0.71%. Effects comparable to metformin in some studies. Also improved lipid profiles (reduced LDL and triglycerides).',
    'Most studies from China, limited long-term data beyond 12 weeks, optimal dosing not fully established',
    'https://pubmed.ncbi.nlm.nih.gov/31328019/'
);
```

---

### Table 5: `protocol_rules`
Decision logic connecting conditions to interventions with research backing.

```sql
CREATE TABLE protocol_rules (
    id SERIAL PRIMARY KEY,
    biomarker_condition_id INTEGER REFERENCES biomarker_conditions(id),
    intervention_id INTEGER REFERENCES interventions(id),
    recommendation_strength VARCHAR(20), -- primary, secondary, optional
    rationale TEXT,
    expected_outcome TEXT,
    timeframe_days INTEGER, -- expected time to see improvement
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE protocol_rule_studies (
    protocol_rule_id INTEGER REFERENCES protocol_rules(id),
    research_study_id INTEGER REFERENCES research_studies(id),
    relevance_score INTEGER, -- 1-10, how directly applicable
    PRIMARY KEY (protocol_rule_id, research_study_id)
);
```

**Example Rows:**
```sql
-- For "Elevated Normal" glucose (86-99 mg/dL)
INSERT INTO protocol_rules (biomarker_condition_id, intervention_id, recommendation_strength, rationale, expected_outcome, timeframe_days)
VALUES 
    (
        2, -- Elevated Normal Glucose
        1, -- Low-Carb Diet
        'primary',
        'Reducing carbohydrate intake decreases glucose load and improves insulin sensitivity. This is the most effective dietary intervention for elevated fasting glucose.',
        'Expect fasting glucose to decrease by 10-20 mg/dL within 4-8 weeks. Should move toward optimal range (70-85 mg/dL).',
        56
    ),
    (
        2, -- Elevated Normal Glucose
        2, -- Berberine
        'primary',
        'Berberine activates AMPK (similar to metformin) and improves glucose uptake in cells. Meta-analyses show 15-20 mg/dL reduction in fasting glucose.',
        'Expect 10-20 mg/dL reduction in fasting glucose within 8-12 weeks. Also improves lipid profiles.',
        84
    ),
    (
        2, -- Elevated Normal Glucose
        3, -- 10K Steps Daily
        'secondary',
        'Increased NEAT improves insulin sensitivity and glucose disposal without structured exercise. Walking after meals particularly effective.',
        'Improved post-meal glucose control. Contributes to overall metabolic health and weight management.',
        56
    ),
    (
        2, -- Elevated Normal Glucose
        4, -- Resistance Training
        'primary',
        'Muscle is the primary site of glucose disposal. Increasing muscle mass and activity improves insulin sensitivity significantly.',
        'Expect improved glucose control and insulin sensitivity within 8-12 weeks. May see 5-15 mg/dL improvement in fasting glucose.',
        84
    ),
    (
        2, -- Elevated Normal Glucose
        5, -- CGM Trial
        'optional',
        'Identifies individual glucose response to specific foods. Helps personalize dietary recommendations beyond general low-carb approach.',
        'Gain insight into personal glucose patterns. Can fine-tune diet based on individual responses.',
        14
    );
```

---

### Table 6: `user_lab_uploads`
Stores user lab data.

```sql
CREATE TABLE user_lab_uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    upload_date DATE NOT NULL,
    lab_date DATE, -- date labs were drawn
    lab_source VARCHAR(100), -- Quest, LabCorp, Function Health, etc.
    pdf_url TEXT,
    status VARCHAR(20), -- uploaded, processing, completed, error
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### Table 7: `user_biomarker_results`
Individual biomarker values from user labs.

```sql
CREATE TABLE user_biomarker_results (
    id SERIAL PRIMARY KEY,
    lab_upload_id INTEGER REFERENCES user_lab_uploads(id),
    biomarker_id INTEGER REFERENCES biomarkers(id),
    value DECIMAL(10,3),
    unit VARCHAR(20),
    lab_reference_low DECIMAL(10,3),
    lab_reference_high DECIMAL(10,3),
    condition_id INTEGER REFERENCES biomarker_conditions(id), -- auto-assigned based on value
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

### Table 8: `generated_protocols`
Protocols generated for users.

```sql
CREATE TABLE generated_protocols (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    lab_upload_id INTEGER REFERENCES user_lab_uploads(id),
    protocol_name VARCHAR(200),
    generated_at TIMESTAMP DEFAULT NOW(),
    priority_focus VARCHAR(100), -- e.g., "Metabolic Health Optimization"
    estimated_duration_days INTEGER,
    pdf_url TEXT,
    status VARCHAR(20) -- active, completed, abandoned
);
```

---

### Table 9: `protocol_recommendations`
Individual recommendations within a protocol.

```sql
CREATE TABLE protocol_recommendations (
    id SERIAL PRIMARY KEY,
    protocol_id INTEGER REFERENCES generated_protocols(id),
    protocol_rule_id INTEGER REFERENCES protocol_rules(id),
    biomarker_result_id INTEGER REFERENCES user_biomarker_results(id),
    priority_order INTEGER, -- 1 = highest priority
    user_notes TEXT,
    status VARCHAR(20), -- pending, started, completed, skipped
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Data Curation Workflow

### Step 1: Identify Core Biomarkers (Start with 20)

**Metabolic (5):**
1. Fasting Glucose
2. Hemoglobin A1C (HbA1c)
3. Fasting Insulin
4. HOMA-IR (calculated)
5. Triglycerides

**Lipids (4):**
6. Total Cholesterol
7. LDL Cholesterol
8. HDL Cholesterol
9. Triglyceride:HDL Ratio

**Thyroid (3):**
10. TSH
11. Free T3
12. Free T4

**Vitamins (3):**
13. Vitamin D (25-OH)
14. Vitamin B12
15. Folate

**Minerals (3):**
16. Ferritin
17. Iron (Serum)
18. Magnesium (RBC preferred)

**Inflammation (2):**
19. hs-CRP
20. Homocysteine

### Step 2: Define Optimal Ranges

For each biomarker, research and document:
- **Clinical Reference Range:** What labs use as "normal"
- **Functional/Optimal Range:** What functional medicine practitioners target
- **Why They Differ:** Brief explanation of the gap

**Example: Vitamin D**
- Clinical Range: 30-100 ng/mL (deficiency <20)
- Functional/Optimal: 50-80 ng/mL
- Why: Bone health requires 30+, but immune function, mood, and metabolic health optimize at 50-80

**Sources for Optimal Ranges:**
- Examine.com (best evidence-based resource)
- Functional medicine textbooks (Textbook of Functional Medicine)
- Cleveland Clinic Functional Medicine protocols
- Research papers on "optimal" vs "normal" ranges

### Step 3: Build Intervention Library

For each common suboptimal condition, identify 3-5 interventions:

**Template for Each Intervention:**
```
Intervention Name: [Clear, specific name]
Type: [Dietary/Supplement/Lifestyle/Exercise/Sleep/Stress/Testing]
Description: [1-2 sentences on what it is]
How to Implement: [Step-by-step specifics]
Expected Outcome: [What results to expect and timeline]
Difficulty: [Easy/Moderate/Advanced]
Cost: [Free/Low/Medium/High]
Contraindications: [Who should NOT do this]
```

**Priority Order:**
1. **Dietary interventions** (often most impactful, free)
2. **Lifestyle interventions** (free, sustainable)
3. **Exercise interventions** (free, broad health benefits)
4. **Supplement interventions** (targeted, research-backed)
5. **Testing interventions** (for validation and monitoring)

### Step 4: Research Curation Process

For each intervention, find 2-5 high-quality studies:

**Quality Hierarchy:**
1. Meta-analyses and systematic reviews (highest quality)
2. Randomized controlled trials (RCTs)
3. Cohort studies
4. Case-control studies
5. Case reports (lowest quality)

**Information to Extract:**
- Study design and sample size
- Duration of intervention
- Specific outcomes measured
- Magnitude of effect (e.g., "20% reduction in fasting glucose")
- Limitations and caveats

**Efficient Research Tools:**
- **Examine.com:** Pre-summarized research on supplements and interventions
- **PubMed:** Use advanced search with filters (meta-analysis, RCT, last 10 years)
- **Google Scholar:** Cited by counts help identify influential papers
- **UpToDate:** Clinical decision support (requires subscription)

**Time-Saving Tip:** Start with Examine.com for supplements, then verify with 2-3 PubMed citations. Don't reinvent the wheel.

### Step 5: Create Protocol Rules

For each biomarker condition, define the protocol logic:

**Framework:**
1. **Primary Interventions:** Most effective, evidence-backed (recommend 2-3)
2. **Secondary Interventions:** Supportive, synergistic (recommend 1-2)
3. **Optional Interventions:** For advanced optimization or monitoring

**Example Protocol Rule:**
```
Condition: Vitamin D 20-30 ng/mL (insufficient)

Primary Interventions:
- Vitamin D3 supplementation: 5,000 IU daily with fatty meal
  → Evidence: RCTs show 5,000 IU increases levels 20-30 ng/mL over 8-12 weeks
  
- Sun exposure: 15-30 minutes midday, 40% body exposed, 3-4x/week
  → Evidence: Adequate UVB exposure can maintain levels >40 ng/mL without supplementation

Secondary Interventions:
- Optimize magnesium: Required for vitamin D metabolism
  → Evidence: Magnesium deficiency impairs vitamin D activation

Testing Intervention:
- Retest in 8-12 weeks to confirm levels reach 50+ ng/mL
```

---

## MVP Research Database Content

### Recommended Starting Point

Focus on **3 biomarker categories** for MVP to prove the concept:

**1. Metabolic Health (Glucose Focus)**
- Biomarkers: Fasting glucose, HbA1c, fasting insulin
- Conditions: Optimal, elevated normal, prediabetic
- Interventions: Low-carb diet, berberine, exercise, CGM
- Research: 10-15 studies

**2. Vitamin D**
- Biomarkers: 25-OH Vitamin D
- Conditions: Deficient (<20), insufficient (20-30), suboptimal (30-50), optimal (50-80)
- Interventions: D3 supplementation, sun exposure, K2 co-supplementation
- Research: 5-10 studies

**3. Thyroid Function**
- Biomarkers: TSH, Free T3, Free T4
- Conditions: Subclinical hypothyroid, low T3, optimal
- Interventions: Selenium, iodine, stress management, further testing (antibodies)
- Research: 8-12 studies

**Total Research Effort:** 20-30 hours to build solid MVP database

---

## Example: Complete Biomarker Entry

### Fasting Glucose - Full Database Entry

**1. Biomarker Definition**
```sql
INSERT INTO biomarkers VALUES (
    1,
    'Fasting Glucose',
    'metabolic',
    'mg/dL',
    70.0,
    85.0,
    65.0,
    99.0,
    'Blood sugar level measured after an overnight fast (8-12 hours). Primary marker of glucose metabolism and insulin sensitivity.',
    'Fasting glucose is the most basic measure of blood sugar control. Even slight elevations within the "normal" clinical range predict increased risk of type 2 diabetes, cardiovascular disease, and metabolic dysfunction. Optimal fasting glucose (70-85 mg/dL) indicates good insulin sensitivity and metabolic health. Values above 85 suggest early insulin resistance, even if below the clinical threshold of 100 mg/dL.'
);
```

**2. Conditions**
```sql
INSERT INTO biomarker_conditions VALUES
    (1, 1, 'Optimal Glucose', 'optimal', 70, 85, 'Ideal fasting glucose indicating excellent insulin sensitivity and metabolic health', 1),
    (2, 1, 'Elevated Normal', 'suboptimal', 86, 99, 'Clinically normal but functionally suboptimal. Indicates early insulin resistance and increased diabetes risk. Should be addressed proactively.', 6),
    (3, 1, 'Prediabetic Range', 'concerning', 100, 125, 'Significant insulin resistance. High risk of progression to type 2 diabetes. Requires aggressive lifestyle intervention.', 9),
    (4, 1, 'Diabetic Range', 'clinical', 126, NULL, 'Meets clinical criteria for type 2 diabetes. Requires medical evaluation and treatment. These recommendations complement but do not replace medical care.', 10);
```

**3. Interventions** (already shown above)

**4. Research Studies**

```sql
-- Study 1: Low-carb diet meta-analysis
INSERT INTO research_studies VALUES (
    1,
    'Effects of low-carbohydrate diets versus low-fat diets on metabolic risk factors: a meta-analysis of randomized controlled clinical trials',
    'Hu T, Mills KT, Yao L, et al.',
    'American Journal of Epidemiology',
    2012,
    '22935614',
    '10.1093/aje/kws166',
    'meta-analysis',
    8,
    1141,
    52,
    'Low-carb diets were more effective than low-fat diets for reducing fasting glucose, insulin, HbA1c, triglycerides, and blood pressure. Fasting glucose decreased by average of 8.7 mg/dL more in low-carb vs low-fat groups.',
    'Studies varied in carb intake definition (50-150g/day). Adherence challenges not fully addressed. Most studies 6-12 months duration.',
    'https://pubmed.ncbi.nlm.nih.gov/22935614/'
);

-- Study 2: Berberine for glucose control
INSERT INTO research_studies VALUES (
    2,
    'Efficacy of berberine in patients with type 2 diabetes mellitus',
    'Yin J, Xing H, Ye J',
    'Metabolism: Clinical and Experimental',
    2008,
    '18442638',
    '10.1016/j.metabol.2008.01.013',
    'RCT',
    7,
    116,
    12,
    'Berberine (1000mg/day) was as effective as metformin in reducing fasting glucose (from 191 to 124 mg/dL, -35% reduction) and HbA1c (from 9.5% to 7.5%). Also improved insulin sensitivity and lipid profiles.',
    'Single-center study in China. Participants had overt diabetes (FBG >126), so effects may differ in prediabetic range. GI side effects in 20% of participants.',
    'https://pubmed.ncbi.nlm.nih.gov/18442638/'
);

-- Study 3: Exercise and insulin sensitivity
INSERT INTO research_studies VALUES (
    3,
    'Resistance training is medicine: effects of strength training on health',
    'Westcott WL',
    'Current Sports Medicine Reports',
    2012,
    '22777332',
    '10.1249/JSR.0b013e31825dabb8',
    'systematic_review',
    7,
    NULL,
    NULL,
    'Resistance training improves insulin sensitivity, glucose metabolism, and reduces diabetes risk. Benefits seen with just 2-3 sessions per week. Increases in muscle mass directly correlate with improved glucose disposal.',
    'Review article synthesizing multiple studies. Individual study quality varies.',
    'https://pubmed.ncbi.nlm.nih.gov/22777332/'
);

-- Study 4: Walking and glucose control
INSERT INTO research_studies VALUES (
    4,
    'Breaking up prolonged sitting with light walking improves postprandial glycemia in older adults',
    'Dunstan DW, Kingwell BA, Larsen R, et al.',
    'Diabetes Care',
    2012,
    '22773702',
    '10.2337/dc12-0084',
    'RCT',
    8,
    19,
    1,
    'Light-intensity walking breaks (2 minutes every 20 minutes) reduced postprandial glucose by 24% compared to prolonged sitting. Even light activity significantly improves glucose control.',
    'Small sample size (n=19), short duration (1 day), older adults (mean age 63). Effects on fasting glucose not measured.',
    'https://pubmed.ncbi.nlm.nih.gov/22773702/'
);

-- Study 5: CGM for behavior change
INSERT INTO research_studies VALUES (
    5,
    'Use of a Real-Time Continuous Glucose Monitoring System as a Motivational Device for Poorly Controlled Type 2 Diabetes',
    'Yoo HJ, An HG, Park SY, et al.',
    'Diabetes Care',
    2008,
    '18390798',
    '10.2337/dc07-2046',
    'RCT',
    6,
    65,
    12,
    'CGM use led to significant improvements in HbA1c (-0.6%) and fasting glucose (-15 mg/dL) compared to control. Participants reported CGM helped identify problematic foods and motivated dietary changes.',
    'Type 2 diabetics only. Effects in prediabetic or elevated-normal populations not studied. CGM was motivational device, not just monitoring tool.',
    'https://pubmed.ncbi.nlm.nih.gov/18390798/'
);
```

**5. Protocol Rules**

```sql
-- For Elevated Normal Glucose (86-99 mg/dL)
INSERT INTO protocol_rules VALUES
    (1, 2, 1, 'primary', 'Reducing carbohydrate intake is the most direct way to lower glucose levels and improve insulin sensitivity. Meta-analyses show 8-10 mg/dL reduction in fasting glucose.', 'Expect fasting glucose to decrease by 10-20 mg/dL within 4-8 weeks, moving toward optimal range (70-85 mg/dL). Also improves triglycerides and HDL.', 56),
    (2, 2, 2, 'primary', 'Berberine activates AMPK (similar mechanism to metformin) and improves cellular glucose uptake. RCTs show 15-35% reduction in fasting glucose.', 'Expect 10-20 mg/dL reduction in fasting glucose within 8-12 weeks. Also improves cholesterol and triglycerides by 10-20%.', 84),
    (3, 2, 4, 'primary', 'Muscle tissue is the primary site of glucose disposal. Resistance training increases muscle mass and insulin sensitivity. Benefits seen with just 2-3 sessions per week.', 'Improved insulin sensitivity within 4-6 weeks. May see 5-15 mg/dL improvement in fasting glucose within 8-12 weeks. Long-term metabolic benefits increase with consistency.', 84),
    (4, 2, 3, 'secondary', 'Increased NEAT (non-exercise activity thermogenesis) improves insulin sensitivity throughout the day. Walking after meals particularly effective for glucose control.', 'Improved post-meal glucose control. Contributes 5-10% to overall metabolic improvement. Works synergistically with diet and exercise interventions.', 56),
    (5, 2, 5, 'optional', 'CGM provides real-time feedback on glucose response to specific foods and activities. Helps personalize recommendations beyond general guidelines. Strong motivational tool.', 'Identify personal glucose response patterns to specific foods. Can fine-tune carbohydrate intake based on individual responses. 2-week trial provides actionable insights.', 14);

-- Link studies to protocol rules
INSERT INTO protocol_rule_studies VALUES
    (1, 1, 9), -- Low-carb diet <-> carb restriction study
    (2, 2, 10), -- Berberine <-> berberine RCT
    (2, 2, 10), -- Berberine <-> berberine meta-analysis (would add this)
    (3, 3, 8), -- Resistance training <-> resistance training review
    (4, 4, 7), -- Walking <-> walking breaks study
    (5, 5, 8); -- CGM <-> CGM behavior change study
```

---

## Protocol Generation Logic (Pseudocode)

```javascript
function generateProtocol(userBiomarkerResults) {
    let protocol = {
        focus_areas: [],
        recommendations: []
    };
    
    // Step 1: Identify all suboptimal markers
    let suboptimalMarkers = userBiomarkerResults.filter(
        result => result.condition.severity != 'optimal'
    );
    
    // Step 2: Prioritize by severity and priority_score
    let prioritizedMarkers = suboptimalMarkers.sort(
        (a, b) => b.condition.priority_score - a.condition.priority_score
    );
    
    // Step 3: Generate recommendations for top 3-5 issues
    for (let marker of prioritizedMarkers.slice(0, 5)) {
        
        // Get all protocol rules for this condition
        let rules = getProtocolRules(marker.condition_id);
        
        // Add primary interventions (typically 2-3)
        let primaryInterventions = rules.filter(
            rule => rule.recommendation_strength === 'primary'
        );
        
        for (let rule of primaryInterventions) {
            protocol.recommendations.push({
                biomarker: marker.biomarker.name,
                intervention: rule.intervention,
                rationale: rule.rationale,
                expected_outcome: rule.expected_outcome,
                studies: getStudies(rule.id),
                priority: 'high'
            });
        }
        
        // Add secondary interventions (supporting)
        let secondaryInterventions = rules.filter(
            rule => rule.recommendation_strength === 'secondary'
        ).slice(0, 2); // Max 2 secondary per marker
        
        for (let rule of secondaryInterventions) {
            protocol.recommendations.push({
                biomarker: marker.biomarker.name,
                intervention: rule.intervention,
                rationale: rule.rationale,
                expected_outcome: rule.expected_outcome,
                studies: getStudies(rule.id),
                priority: 'medium'
            });
        }
    }
    
    // Step 4: Remove duplicates (same intervention for multiple markers)
    protocol.recommendations = deduplicateInterventions(
        protocol.recommendations
    );
    
    // Step 5: Organize by intervention type for clarity
    protocol.recommendations = groupByType(protocol.recommendations);
    
    // Step 6: Add summary and focus areas
    protocol.focus_areas = identifyFocusAreas(prioritizedMarkers);
    protocol.summary = generateSummary(protocol);
    
    return protocol;
}

function deduplicateInterventions(recommendations) {
    // If same intervention recommended for multiple markers,
    // consolidate into single recommendation that mentions all markers
    
    let consolidated = {};
    
    for (let rec of recommendations) {
        let key = rec.intervention.id;
        
        if (!consolidated[key]) {
            consolidated[key] = rec;
            consolidated[key].relevant_markers = [rec.biomarker];
        } else {
            consolidated[key].relevant_markers.push(rec.biomarker);
            // Update rationale to mention all markers
        }
    }
    
    return Object.values(consolidated);
}

function identifyFocusAreas(prioritizedMarkers) {
    // Group markers by category to identify focus areas
    let categories = {};
    
    for (let marker of prioritizedMarkers) {
        let category = marker.biomarker.category;
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(marker);
    }
    
    // Prioritize categories with most suboptimal markers
    let focusAreas = Object.keys(categories).sort(
        (a, b) => categories[b].length - categories[a].length
    );
    
    return focusAreas.map(category => ({
        category: category,
        markers: categories[category],
        priority: categories[category][0].condition.priority_score
    }));
}
```

---

## Protocol Output Format

### PDF Report Structure

**Page 1: Executive Summary**
- Your Name
- Lab Date
- Analysis Date
- Overall Health Score (calculated from biomarker distribution)
- Top 3 Focus Areas
- Quick Start Action Items (3-5 most important interventions)

**Page 2-3: Biomarker Overview**
- Visual dashboard of all biomarkers
- Color-coded: Green (optimal), Yellow (suboptimal), Red (concerning)
- Comparison to functional optimal ranges
- Key insights and patterns

**Page 4+: Detailed Protocol (organized by category)**

For each focus area:
```
FOCUS AREA: METABOLIC HEALTH

Your Results:
• Fasting Glucose: 94 mg/dL (Optimal: 70-85, Your Status: Elevated Normal)
• HbA1c: 5.6% (Optimal: <5.4%, Your Status: Elevated Normal)
• Fasting Insulin: 12 μIU/mL (Optimal: <7, Your Status: Insulin Resistant)

What This Means:
Your glucose markers indicate early insulin resistance. While still in "clinically normal" ranges, these values predict increased risk of type 2 diabetes and metabolic syndrome. The good news: this is highly reversible with targeted interventions.

Your Personalized 90-Day Protocol:

1. DIETARY INTERVENTION: Low-Carbohydrate Diet (<100g/day)
   
   What to do:
   • Target 75-100g total carbs per day
   • Focus on: lean proteins, non-starchy vegetables, healthy fats
   • Avoid: bread, pasta, rice, sugary foods, processed snacks
   • Track macros using MyFitnessPal for first 30 days
   
   Expected outcome:
   • 10-20 mg/dL reduction in fasting glucose (4-8 weeks)
   • Improved energy and reduced cravings (2-4 weeks)
   • 5-10 lb weight loss if overweight (8-12 weeks)
   
   Research backing:
   • Meta-analysis of 23 studies (1,141 participants): Low-carb diets reduced fasting 
     glucose by 8.7 mg/dL more than low-fat diets [1]
   • Particularly effective for insulin resistance and prediabetes
   
   [1] Hu T, et al. American Journal of Epidemiology. 2012.
   https://pubmed.ncbi.nlm.nih.gov/22935614/

2. SUPPLEMENT: Berberine 500mg 3x/day
   
   What to do:
   • Take 500mg with each meal (total 1,500mg daily)
   • Take with food to minimize GI upset
   • Recommended brands: Thorne, Pure Encapsulations, Life Extension
   • Cost: ~$20-30/month
   
   Expected outcome:
   • 10-20 mg/dL reduction in fasting glucose (8-12 weeks)
   • 10-20% improvement in cholesterol (8-12 weeks)
   • Enhanced effects when combined with low-carb diet
   
   Research backing:
   • RCT: Berberine reduced fasting glucose by 35% (from 191→124 mg/dL) in 
     type 2 diabetics, similar efficacy to metformin [2]
   • Meta-analysis: Consistent 15-20 mg/dL reduction across multiple studies [3]
   
   Cautions:
   • May interact with diabetes medications - consult physician if on metformin
   • Can cause digestive upset initially (typically resolves in 1-2 weeks)
   
   [2] Yin J, et al. Metabolism. 2008. https://pubmed.ncbi.nlm.nih.gov/18442638/
   [3] Liang Y, et al. World J Diabetes. 2019. https://pubmed.ncbi.nlm.nih.gov/31328019/

3. EXERCISE: Resistance Training 3x/week
   
   [Similar detailed format...]

4. LIFESTYLE: Daily 10,000 Steps
   
   [Similar detailed format...]

OPTIONAL: 14-Day CGM Trial
   [Format as above...]

---

RETEST IN: 8-12 weeks
Retest these markers: Fasting Glucose, HbA1c, Fasting Insulin
Expected improvements: Move fasting glucose to 75-85 mg/dL range
```

**Final Page: Resources & Next Steps**
- Shopping list for supplements
- Sample meal plans/food lists
- Recommended apps (MyFitnessPal, fitness tracker)
- How to retest (order labs yourself or through physician)
- When to seek medical attention

---

## Quality Assurance Checklist

Before launching, verify:

✅ **Accuracy**
- All optimal ranges cross-referenced with multiple sources
- Every intervention has 2+ peer-reviewed studies
- Contraindications clearly stated
- Medical disclaimer prominent

✅ **Completeness**
- Every condition has actionable interventions
- Every intervention has implementation details
- Every recommendation has expected outcomes
- All PubMed links work

✅ **Usability**
- Protocol is actionable (not just "eat healthy")
- Recommendations are prioritized (most important first)
- Timeframes are realistic (not overnight miracles)
- Cost estimates provided

✅ **Legal Protection**
- Clear disclaimers: not medical advice
- Encourages physician consultation
- No diagnosis or treatment of diseases
- Focus on optimization, not cure

---

## Expansion Roadmap

After MVP validation with glucose/vitamin D/thyroid:

**Phase 2 Biomarkers (Add 10 more):**
- Inflammation: CRP, ESR, homocysteine
- Hormones: Testosterone, estradiol, cortisol, DHEA
- Advanced metabolic: Uric acid, liver enzymes (ALT, AST)

**Phase 3 Biomarkers (Add 15 more):**
- Advanced lipids: ApoB, Lp(a), LDL particle size
- Kidney function: Creatinine, BUN, eGFR
- Methylation: MTHFR considerations, B vitamin status
- Micronutrients: Zinc, selenium, copper, omega-3 index

**Future Features:**
- Supplement interaction checker
- Progress tracking over multiple lab uploads
- Personalized supplement shopping (affiliate revenue)
- Integration with FitCoach AI (training + nutrition + labs)
- White-label version for health coaches

---

## Time Investment Estimate

**Initial Build (60-80 hours):**
- Database schema setup: 4 hours
- 20 biomarker definitions: 10 hours (30 min each)
- 40-50 condition definitions: 8 hours
- 50-60 interventions: 15 hours (detailed protocols)
- Research curation (30 studies): 25 hours
- Protocol rules logic: 10 hours
- Testing and QA: 8 hours

**Ongoing Maintenance:**
- Add new biomarker: 2-3 hours (definition, conditions, interventions, research)
- Update existing intervention: 30 minutes (new study, updated protocol)
- Quality review: 2 hours/month

---

## Next Steps

1. **Set up PostgreSQL database** with schema above
2. **Start with 3 biomarker categories** (glucose, vitamin D, thyroid)
3. **Curate 20-30 studies** using Examine.com + PubMed
4. **Build protocol generation logic** (can be simple conditionals initially)
5. **Create PDF template** for protocol output
6. **Test with 5 sample labs** (your own, family, friends)
7. **Iterate based on feedback**
8. **Launch to first 10 customers**

---

This template gives you everything you need to build your research database moat. The key is starting focused (3 biomarker categories) and expanding methodically based on user demand.

Your applied physiology background means you can curate this database better than competitors - that's your sustainable advantage.

Ready to start building? Want me to help with the technical implementation (database setup, protocol generation code) or focus on a specific biomarker category first?