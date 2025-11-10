# Functional Health App: Research Database Structure

## Overview

This database structure is designed to transform lab biomarker data into actionable, research-backed protocols. It's the core intellectual property and competitive moat of your application.

## Database Schema

### 1. Biomarker Reference Table

Defines all trackable biomarkers with their optimal ranges.

```sql
CREATE TABLE biomarkers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'metabolic', 'hormonal', 'vitamins', 'minerals', 'lipids', 'thyroid', 'inflammatory'
    standard_unit VARCHAR(20) NOT NULL,
    alternative_units JSONB, -- For unit conversion
    clinical_range_low DECIMAL(10,3),
    clinical_range_high DECIMAL(10,3),
    functional_range_low DECIMAL(10,3), -- This is key - optimal vs just "normal"
    functional_range_high DECIMAL(10,3),
    description TEXT,
    why_it_matters TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Example data
INSERT INTO biomarkers (name, display_name, category, standard_unit, 
    clinical_range_low, clinical_range_high, 
    functional_range_low, functional_range_high,
    why_it_matters) 
VALUES 
    ('fasting_glucose', 'Fasting Glucose', 'metabolic', 'mg/dL', 
     70, 99, 
     75, 85,
     'Elevated fasting glucose indicates insulin resistance and increased diabetes risk. Functional range optimization improves energy, reduces inflammation, and supports longevity.'),
    ('vitamin_d', 'Vitamin D (25-OH)', 'vitamins', 'ng/mL',
     30, 100,
     50, 80,
     'Vitamin D regulates immune function, bone health, mood, and inflammation. Most Americans are deficient. Optimal levels support immunity, muscle function, and hormonal balance.');
```

### 2. Research Studies Table

Stores curated research with structured metadata.

```sql
CREATE TABLE research_studies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    authors TEXT,
    journal VARCHAR(200),
    publication_year INTEGER,
    pmid VARCHAR(20), -- PubMed ID
    doi VARCHAR(100),
    url TEXT NOT NULL,
    study_type VARCHAR(50), -- 'RCT', 'meta-analysis', 'cohort', 'case-control', 'review'
    quality_score INTEGER CHECK (quality_score BETWEEN 1 AND 10), -- Your internal rating
    sample_size INTEGER,
    duration_weeks INTEGER,
    summary TEXT NOT NULL, -- 2-3 sentence plain English summary
    key_findings TEXT NOT NULL,
    limitations TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Example data
INSERT INTO research_studies (title, journal, publication_year, pmid, url, 
    study_type, quality_score, sample_size, duration_weeks, summary, key_findings)
VALUES 
    ('Effect of berberine on insulin resistance in patients with type 2 diabetes: a systematic review and meta-analysis',
     'Journal of Ethnopharmacology', 2021, '33417972',
     'https://pubmed.ncbi.nlm.nih.gov/33417972/',
     'meta-analysis', 9, 1068, 12,
     'Meta-analysis of 12 RCTs examining berberine supplementation in type 2 diabetics. Participants took 0.9-1.5g daily for 8-16 weeks.',
     'Berberine significantly reduced fasting glucose by 15.5 mg/dL, HbA1c by 0.71%, and improved insulin sensitivity. Effects comparable to metformin in some studies. Well-tolerated with minimal side effects.');
```

### 3. Biomarker Conditions Table

Links biomarker ranges to condition classifications.

```sql
CREATE TABLE biomarker_conditions (
    id SERIAL PRIMARY KEY,
    biomarker_id INTEGER REFERENCES biomarkers(id),
    condition_name VARCHAR(100) NOT NULL,
    condition_severity VARCHAR(50), -- 'optimal', 'suboptimal', 'concerning', 'clinical'
    range_operator VARCHAR(10), -- '>', '<', 'between', '>=', '<='
    value_low DECIMAL(10,3),
    value_high DECIMAL(10,3),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(biomarker_id, condition_name)
);

-- Example data
INSERT INTO biomarker_conditions (biomarker_id, condition_name, condition_severity, 
    range_operator, value_low, value_high, description)
VALUES 
    (1, 'Optimal Glucose', 'optimal', 'between', 75, 85,
     'Your fasting glucose is in the optimal range for metabolic health and longevity.'),
    (1, 'Elevated Normal', 'suboptimal', 'between', 86, 99,
     'Your glucose is technically normal but elevated. This suggests early insulin resistance.'),
    (1, 'Pre-diabetic Range', 'concerning', 'between', 100, 125,
     'Your glucose indicates pre-diabetes. Immediate lifestyle intervention is critical.'),
    (1, 'Diabetic Range', 'clinical', '>=', 126, NULL,
     'Your glucose is in diabetic range. Consult your physician immediately.');
```

### 4. Interventions Table

Specific actions to optimize biomarkers.

```sql
CREATE TABLE interventions (
    id SERIAL PRIMARY KEY,
    intervention_type VARCHAR(50) NOT NULL, -- 'supplement', 'diet', 'exercise', 'lifestyle', 'sleep', 'stress'
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    dosage VARCHAR(200), -- For supplements: "500mg, 3x daily with meals"
    timing VARCHAR(200), -- "Take with breakfast and dinner"
    duration_weeks INTEGER, -- Recommended duration
    cost_estimate_monthly DECIMAL(10,2),
    where_to_buy TEXT,
    contraindications TEXT, -- Important safety info
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Example data
INSERT INTO interventions (intervention_type, name, description, dosage, 
    timing, duration_weeks, cost_estimate_monthly, contraindications)
VALUES 
    ('supplement', 'Berberine HCl', 
     'Natural compound that improves insulin sensitivity and glucose metabolism. Comparable efficacy to metformin in some studies.',
     '500mg, 3 times daily (1500mg total)',
     'Take 15-30 minutes before meals',
     12, 25.00,
     'May lower blood sugar - monitor if diabetic or on diabetes medications. Can cause GI upset initially. Avoid if pregnant/nursing.'),
    ('diet', 'Low-Carb Mediterranean Diet',
     'Reduce total carbohydrates to under 100g daily while emphasizing healthy fats, fish, vegetables, and moderate protein.',
     'Total carbs: <100g/day, Protein: 1g/lb bodyweight, Fat: remainder of calories',
     'Focus carbs around training if active',
     12, NULL,
     'May require electrolyte supplementation initially. Monitor energy levels during adaptation (1-2 weeks).'),
    ('exercise', 'Post-Meal Walking',
     'A 10-15 minute walk after meals significantly reduces post-prandial glucose spikes.',
     '10-15 minutes of moderate-pace walking',
     'After lunch and dinner (minimum)',
     8, NULL,
     'Safe for most people. Start slowly if sedentary.');
```

### 5. Protocol Rules Table

The decision engine - maps conditions to interventions.

```sql
CREATE TABLE protocol_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(200) NOT NULL,
    biomarker_condition_id INTEGER REFERENCES biomarker_conditions(id),
    priority INTEGER DEFAULT 1, -- Higher priority interventions shown first
    intervention_id INTEGER REFERENCES interventions(id),
    research_study_ids INTEGER[], -- Array of study IDs supporting this intervention
    expected_improvement TEXT, -- "May reduce fasting glucose by 15-20 mg/dL in 8-12 weeks"
    confidence_level VARCHAR(20), -- 'high', 'moderate', 'low' based on research quality
    notes TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(biomarker_condition_id, intervention_id)
);

-- Example data
INSERT INTO protocol_rules (rule_name, biomarker_condition_id, priority, 
    intervention_id, research_study_ids, expected_improvement, confidence_level)
VALUES 
    ('Elevated Glucose - Berberine', 2, 1, 1, ARRAY[1],
     'Expected reduction of 10-20 mg/dL in fasting glucose within 8-12 weeks based on meta-analysis of 12 RCTs.',
     'high'),
    ('Elevated Glucose - Low Carb Diet', 2, 1, 2, ARRAY[2,3],
     'Low-carb diets typically reduce fasting glucose by 10-25 mg/dL and improve insulin sensitivity within 4-8 weeks.',
     'high'),
    ('Elevated Glucose - Post-Meal Walking', 2, 2, 3, ARRAY[4],
     'Post-meal walking reduces glucose spikes by 15-20% and improves 24-hour glucose control.',
     'high');
```

### 6. Supporting Evidence Junction Table

Links interventions to multiple studies for comprehensive backing.

```sql
CREATE TABLE intervention_evidence (
    id SERIAL PRIMARY KEY,
    intervention_id INTEGER REFERENCES interventions(id),
    research_study_id INTEGER REFERENCES research_studies(id),
    relevance_score INTEGER CHECK (relevance_score BETWEEN 1 AND 10),
    key_quote TEXT, -- Specific finding from study relevant to this intervention
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(intervention_id, research_study_id)
);
```

### 7. User Lab Data Tables

```sql
CREATE TABLE user_lab_uploads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    upload_date TIMESTAMP NOT NULL,
    lab_date DATE NOT NULL, -- When labs were actually drawn
    lab_company VARCHAR(100), -- 'Quest', 'LabCorp', 'Function Health', etc.
    pdf_url TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processed', 'reviewed'
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_biomarker_results (
    id SERIAL PRIMARY KEY,
    lab_upload_id INTEGER REFERENCES user_lab_uploads(id),
    biomarker_id INTEGER REFERENCES biomarkers(id),
    value DECIMAL(10,3) NOT NULL,
    unit VARCHAR(20) NOT NULL,
    status VARCHAR(50), -- 'optimal', 'suboptimal', 'concerning', 'clinical'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(lab_upload_id, biomarker_id)
);

CREATE TABLE user_protocols (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    lab_upload_id INTEGER REFERENCES user_lab_uploads(id),
    generated_at TIMESTAMP DEFAULT NOW(),
    protocol_data JSONB NOT NULL, -- Stores the complete generated protocol
    pdf_url TEXT,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'completed', 'archived'
    notes TEXT
);
```

## Protocol Generation Logic

### Step 1: Analyze User's Biomarkers

```javascript
// Pseudo-code for protocol generation
async function generateProtocol(labUploadId) {
    // 1. Get all user biomarker results
    const userResults = await getUserBiomarkerResults(labUploadId);
    
    // 2. For each biomarker, determine its condition
    const conditions = [];
    for (const result of userResults) {
        const condition = await determineCondition(
            result.biomarker_id, 
            result.value
        );
        if (condition.severity !== 'optimal') {
            conditions.push({
                biomarker: result,
                condition: condition
            });
        }
    }
    
    // 3. Sort by priority (most concerning first)
    conditions.sort((a, b) => {
        const severityRank = {
            'clinical': 4,
            'concerning': 3,
            'suboptimal': 2,
            'optimal': 1
        };
        return severityRank[b.condition.severity] - severityRank[a.condition.severity];
    });
    
    // 4. For each condition, get recommended interventions
    const protocol = {
        focus_areas: [],
        all_interventions: []
    };
    
    for (const item of conditions) {
        const rules = await getProtocolRules(item.condition.id);
        
        // Group interventions by type
        const interventions = {
            supplements: [],
            dietary: [],
            exercise: [],
            lifestyle: []
        };
        
        for (const rule of rules) {
            const intervention = await getIntervention(rule.intervention_id);
            const studies = await getStudies(rule.research_study_ids);
            
            interventions[intervention.intervention_type].push({
                intervention: intervention,
                expectedImprovement: rule.expected_improvement,
                confidence: rule.confidence_level,
                studies: studies,
                priority: rule.priority
            });
        }
        
        protocol.focus_areas.push({
            biomarker: item.biomarker,
            condition: item.condition,
            interventions: interventions
        });
    }
    
    return protocol;
}
```

### Step 2: Format Protocol Output

```javascript
// Example protocol structure
const protocolOutput = {
    user_id: 123,
    lab_date: '2025-11-01',
    generated_at: '2025-11-10',
    
    executive_summary: {
        primary_concerns: [
            'Elevated fasting glucose (pre-diabetic range)',
            'Suboptimal Vitamin D',
            'Elevated LDL cholesterol'
        ],
        focus_for_next_90_days: 'Improve insulin sensitivity and metabolic health'
    },
    
    priority_biomarkers: [
        {
            name: 'Fasting Glucose',
            your_value: 108,
            optimal_range: '75-85 mg/dL',
            status: 'concerning',
            why_it_matters: 'Your glucose is in the pre-diabetic range...',
            
            recommended_interventions: {
                supplements: [
                    {
                        name: 'Berberine HCl',
                        dosage: '500mg, 3x daily with meals',
                        expected_results: 'May reduce fasting glucose by 15-20 mg/dL in 8-12 weeks',
                        cost: '$25/month',
                        supporting_research: [
                            {
                                title: 'Effect of berberine on insulin resistance...',
                                summary: 'Meta-analysis of 12 RCTs...',
                                link: 'https://pubmed.ncbi.nlm.nih.gov/33417972/'
                            }
                        ]
                    }
                ],
                dietary: [
                    {
                        name: 'Low-Carb Mediterranean Diet',
                        specifics: 'Total carbs <100g/day...',
                        expected_results: 'May reduce fasting glucose by 10-25 mg/dL in 4-8 weeks',
                        supporting_research: [...]
                    }
                ],
                exercise: [...],
                lifestyle: [...]
            },
            
            retest_timeline: '8-12 weeks',
            success_metrics: 'Target: Fasting glucose <90 mg/dL'
        }
    ],
    
    90_day_action_plan: {
        week_1_4: {
            primary_focus: 'Implement dietary changes and start berberine',
            specific_actions: [
                'Begin tracking daily carbohydrate intake',
                'Start berberine supplementation with meals',
                'Walk 10-15 minutes after lunch and dinner',
                'Order Vitamin D3 (5000 IU daily)'
            ]
        },
        week_5_8: {
            primary_focus: 'Continue interventions, add resistance training',
            specific_actions: [...]
        },
        week_9_12: {
            primary_focus: 'Retest biomarkers, evaluate progress',
            specific_actions: [
                'Order follow-up lab work',
                'Document changes in energy, sleep, body composition',
                'Upload new labs for progress comparison'
            ]
        }
    },
    
    shopping_list: {
        supplements: [
            'Berberine HCl 500mg (buy 3-month supply: ~$60)',
            'Vitamin D3 5000 IU (buy 3-month supply: ~$15)'
        ],
        foods_to_emphasize: [
            'Wild-caught fish (salmon, sardines)',
            'Leafy greens',
            'Olive oil',
            'Berries (in moderation)'
        ]
    },
    
    total_monthly_cost: 50.00,
    confidence_level: 'High - based on multiple high-quality RCTs and meta-analyses'
};
```

## Research Curation Process

### Initial Database Population

**Phase 1: Core 20 Biomarkers (40-60 hours)**

For each biomarker, curate:
- 3-5 high-quality studies (RCTs or meta-analyses preferred)
- 2-3 supplements with strong evidence
- 2-3 dietary interventions
- 1-2 exercise interventions
- 1-2 lifestyle interventions

**Priority biomarkers for MVP:**
1. Fasting Glucose
2. HbA1c
3. Vitamin D
4. Vitamin B12
5. TSH (thyroid)
6. Total Cholesterol
7. LDL Cholesterol
8. HDL Cholesterol
9. Triglycerides
10. Ferritin
11. CRP (inflammation)
12. Testosterone (total)
13. Cortisol
14. Magnesium
15. Homocysteine
16. DHEA-S
17. Free T3
18. Free T4
19. Insulin (fasting)
20. HOMA-IR

### Research Quality Criteria

**Include studies that are:**
- Published in peer-reviewed journals
- Human studies (not animal/in-vitro unless no human data exists)
- Sample size >50 participants (preferred)
- RCTs or meta-analyses (highest priority)
- Published within last 10 years (prefer recent, but include seminal older studies)

**Avoid:**
- Industry-sponsored studies with clear bias
- Case reports or anecdotes
- Studies with major methodological flaws
- Predatory journals

### Research Sources

**Primary:**
1. **PubMed** - Free, comprehensive
2. **Examine.com** - Already synthesized supplement research (worth the subscription)
3. **UpToDate** - Clinical guidelines (if you have access)
4. **Cochrane Reviews** - Gold standard meta-analyses

**Secondary:**
1. Functional medicine practitioner resources
2. Cleveland Clinic Functional Medicine
3. Institute for Functional Medicine publications

## Curation Template

Use this structure for each biomarker:

```markdown
# [BIOMARKER NAME]

## Clinical vs Functional Ranges
- Clinical: [range]
- Functional: [range]
- Source: [citation]

## Interventions

### Supplements
1. **[Supplement Name]**
   - Dosage: 
   - Timing: 
   - Expected results: 
   - Time to results: 
   - Cost: 
   - Contraindications:
   - Studies:
     * [PMID] - [Title] - [Key Finding]
     * [PMID] - [Title] - [Key Finding]

### Dietary
1. **[Diet Pattern/Change]**
   - Specifics:
   - Expected results:
   - Studies:
     * [PMID] - [Title] - [Key Finding]

### Exercise
[Same structure]

### Lifestyle
[Same structure]

## Combinations That Work
- [Intervention A] + [Intervention B] = synergistic effect
- Source: [study]

## What Doesn't Work
- [Common intervention with weak/no evidence]
- Why: [explanation]
```

## Scaling Strategy

### Immediate (MVP):
- Manually curate 20 biomarkers
- 3-5 interventions per biomarker
- ~100 total studies in database

### Month 3-6:
- Expand to 40 biomarkers
- Add more intervention combinations
- Begin tracking user outcomes data
- ~250 studies in database

### Month 6-12:
- Full comprehensive panel (100+ biomarkers)
- Advanced protocol optimization based on user data
- Machine learning for personalization
- ~500+ studies in database

### Long-term:
- Continuous research monitoring (new studies published)
- User outcome tracking improves recommendations
- Partnerships with functional medicine practitioners
- Proprietary outcome database becomes additional moat

## Quality Assurance

**Before launching any protocol rule:**
1. Verify study exists and is correctly cited
2. Confirm dosages are safe and evidence-based
3. Legal disclaimer review
4. Have a functional medicine practitioner review (consultant basis)

**Ongoing:**
- Monthly research update process
- User feedback loop (did recommendations work?)
- Track which interventions get best results
- Update protocol rules based on outcomes

## Implementation Priority

**Week 1-2:**
- Build database schema
- Populate biomarker reference table (20 markers)
- Add clinical vs functional ranges

**Week 3-4:**
- Curate top 5 most common issues:
  * Elevated glucose / pre-diabetes
  * Low Vitamin D
  * Suboptimal thyroid
  * High cholesterol
  * Low testosterone (if target market is male)
- Add ~50 studies supporting these
- Create ~30 intervention entries
- Link via protocol_rules table

**Week 5-6:**
- Build protocol generation engine
- Create PDF output formatting
- Test with sample lab data

**Week 7-8:**
- Finish remaining 15 biomarkers (can be less comprehensive initially)
- Polish protocol output
- Prepare for launch

---

## Next Steps

Would you like me to:
1. **Create the actual SQL migration files** for this database?
2. **Build a research curation spreadsheet template** you can use to organize studies before adding to DB?
3. **Create example protocol outputs** for common conditions (elevated glucose, low vitamin D, etc.)?
4. **Design the protocol generation algorithm** in more detail?

This database structure is your competitive advantage - the combination of functional ranges + research-backed interventions + personalized protocols is unique in the market.