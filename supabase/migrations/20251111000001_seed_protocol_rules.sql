-- ============================================================================
-- PROTOCOL RULES SEED DATA
-- ============================================================================
-- Created: November 11, 2025
-- Maps biomarker conditions to interventions with priority and rationale
-- ============================================================================

-- This file creates the rules that power protocol generation
-- Format: IF biomarker_condition THEN recommend intervention(s)
-- Priority: primary (must do), secondary (should do), optional (nice to have)

-- ============================================================================
-- GLUCOSE / INSULIN RESISTANCE CONDITIONS
-- ============================================================================

-- High Fasting Glucose → Berberine (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id as biomarker_condition_id,
  i.id as intervention_id,
  'primary' as recommendation_strength,
  1 as priority_order,
  'Berberine has metformin-like effects and significantly reduces fasting glucose through AMPK activation. Multiple meta-analyses demonstrate 15-30 mg/dL reductions in fasting glucose.' as rationale,
  'Fasting glucose reduction of 15-30 mg/dL within 12 weeks' as expected_outcome,
  90 as timeframe_days,
  TRUE as is_active
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%glucose%'
  OR bc.condition_name LIKE '%high%glucose%'
  AND i.name = 'Berberine Supplementation'
LIMIT 1;

-- High Fasting Glucose → Low-Carb Diet (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  2,
  'Carbohydrate restriction directly addresses the root cause of elevated blood glucose by reducing dietary glucose load and improving insulin sensitivity.',
  'HbA1c reduction of 0.5-1.0%, fasting glucose reduction of 10-30 mg/dL',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE (bc.condition_name LIKE '%elevated%glucose%' OR bc.condition_name LIKE '%high%glucose%')
  AND i.name = 'Low-Carbohydrate Diet (50-100g/day)'
LIMIT 1;

-- High Fasting Glucose → Post-Meal Walks (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  3,
  'Brief walks after meals significantly reduce postprandial glucose spikes by enhancing muscle glucose uptake. Easy, free intervention with immediate effects.',
  'Reduced post-meal glucose spikes by 20-30%',
  30,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE (bc.condition_name LIKE '%elevated%glucose%' OR bc.condition_name LIKE '%high%glucose%')
  AND i.name = 'Post-Meal Walks (10-15 min)'
LIMIT 1;

-- High Fasting Glucose → Resistance Training (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  1,
  'Resistance training improves insulin sensitivity by 25-40% through increased muscle mass and GLUT4 translocation. Provides sustainable long-term metabolic improvements.',
  'Improved insulin sensitivity (25-40%), better glucose disposal',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE (bc.condition_name LIKE '%elevated%glucose%' OR bc.condition_name LIKE '%high%glucose%')
  AND i.name = 'Resistance Training (2-3x/week)'
LIMIT 1;

-- High Fasting Glucose → Alpha-Lipoic Acid (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  2,
  'Alpha-lipoic acid improves insulin sensitivity and glucose uptake through antioxidant and insulin-signaling mechanisms.',
  'Improved insulin sensitivity (10-20%), reduced fasting glucose (5-15 mg/dL)',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE (bc.condition_name LIKE '%elevated%glucose%' OR bc.condition_name LIKE '%high%glucose%')
  AND i.name = 'Alpha-Lipoic Acid (ALA)'
LIMIT 1;

-- High Fasting Glucose → Eliminate Added Sugars (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  3,
  'Added sugars drive insulin resistance and glucose spikes. Elimination provides rapid improvements in glycemic control.',
  'Reduced glucose spikes (20-30%), decreased inflammation',
  30,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE (bc.condition_name LIKE '%elevated%glucose%' OR bc.condition_name LIKE '%high%glucose%')
  AND i.name = 'Eliminate Added Sugars (<25g/day)'
LIMIT 1;

-- ============================================================================
-- VITAMIN D DEFICIENCY
-- ============================================================================

-- Low Vitamin D → Vitamin D3 Supplementation (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  1,
  'Direct supplementation is the most effective way to correct vitamin D deficiency. Dosing should be based on current levels to reach optimal range (40-60 ng/mL).',
  'Vitamin D levels increase to optimal range (40-60 ng/mL) within 3 months',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE (bc.condition_name LIKE '%low%vitamin%d%' OR bc.condition_name LIKE '%deficient%vitamin%d%')
  AND i.name = 'Vitamin D3 Supplementation'
LIMIT 1;

-- Low Vitamin D → Sunlight Exposure (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  1,
  'Midday sun exposure (10am-2pm) supports natural vitamin D production. Complements supplementation for optimal levels and provides circadian rhythm benefits.',
  'Improved vitamin D production, better circadian rhythm and mood',
  30,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE (bc.condition_name LIKE '%low%vitamin%d%' OR bc.condition_name LIKE '%deficient%vitamin%d%')
  AND i.name = 'Sunlight Exposure (Morning + Midday)'
LIMIT 1;

-- ============================================================================
-- THYROID (HASHIMOTO / HYPOTHYROID)
-- ============================================================================

-- Elevated TPOAb → Selenium (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  1,
  'Selenium supplementation significantly reduces TPOAb and TGAb antibodies by 20-50% in Hashimoto thyroiditis. Multiple RCTs demonstrate efficacy.',
  'TPOAb and TGAb reduction of 20-50%, improved TSH',
  180,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%TPOAb%'
  AND i.name = 'Selenium Supplementation (for Hashimoto)'
LIMIT 1;

-- Elevated TPOAb → Gluten-Free Diet (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  1,
  'Gluten elimination can reduce thyroid antibodies by 20-40% in Hashimoto patients through reduced intestinal inflammation and molecular mimicry.',
  'Reduced thyroid antibodies (TPOAb reduction 20-40%), improved gut health',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%TPOAb%'
  AND i.name = 'Gluten-Free Diet (if indicated)'
LIMIT 1;

-- Elevated TPOAb → Vitamin D (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  2,
  'Vitamin D deficiency is common in Hashimoto. Optimization supports immune function and may help reduce autoimmune activity.',
  'Improved immune function, potential reduction in thyroid antibodies',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%TPOAb%'
  AND i.name = 'Vitamin D3 Supplementation'
LIMIT 1;

-- ============================================================================
-- INFLAMMATION (High CRP / IL-6)
-- ============================================================================

-- Elevated CRP → Anti-Inflammatory Diet (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  1,
  'Dietary modification is the foundation of reducing systemic inflammation. Focus on omega-3s, antioxidants, and elimination of pro-inflammatory foods.',
  'Reduced inflammatory markers (CRP reduction of 20-40%)',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%CRP%'
  AND i.name = 'Anti-Inflammatory Diet'
LIMIT 1;

-- Elevated CRP → Omega-3 Supplementation (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  2,
  'Omega-3s (EPA/DHA) reduce inflammation by 10-20% through resolution of inflammatory pathways and reduced cytokine production.',
  'Lower inflammation (CRP reduction 10-20%)',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%CRP%'
  AND i.name = 'Omega-3 Fish Oil (EPA/DHA)'
LIMIT 1;

-- Elevated CRP → Curcumin (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  1,
  'Curcumin is a potent anti-inflammatory compound that reduces CRP and IL-6 markers by 20-30% when using enhanced bioavailability forms.',
  'Reduced inflammation (CRP reduction 20-30%)',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%CRP%'
  AND i.name = 'Curcumin (Turmeric Extract)'
LIMIT 1;

-- Elevated CRP → Eliminate Ultra-Processed Foods (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  2,
  'Ultra-processed foods drive inflammation through refined carbs, trans fats, and chemical additives. Elimination provides foundational anti-inflammatory benefits.',
  'Reduced systemic inflammation, improved energy',
  60,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%CRP%'
  AND i.name = 'Eliminate Ultra-Processed Foods'
LIMIT 1;

-- ============================================================================
-- LIPIDS (High Cholesterol / Triglycerides)
-- ============================================================================

-- High Triglycerides → Omega-3 Supplementation (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  1,
  'Omega-3s (EPA/DHA) at 2-3g daily reduce triglycerides by 20-30% through reduced hepatic VLDL production.',
  'Reduced triglycerides (20-30%)',
  90,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%triglyceride%'
  AND i.name = 'Omega-3 Fish Oil (EPA/DHA)'
LIMIT 1;

-- High Triglycerides → Eliminate Added Sugars (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  2,
  'Added sugars, especially fructose, directly drive hepatic triglyceride synthesis. Elimination provides rapid improvements.',
  'Significant triglyceride reduction within 30 days',
  30,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%triglyceride%'
  AND i.name = 'Eliminate Added Sugars (<25g/day)'
LIMIT 1;

-- High Triglycerides → Reduce Alcohol (SECONDARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  1,
  'Alcohol increases hepatic triglyceride production. Reduction to ≤3 drinks/week improves lipid profile.',
  'Improved triglycerides, better liver enzymes',
  30,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%triglyceride%'
  AND i.name = 'Reduce Alcohol Consumption (≤3 drinks/week)'
LIMIT 1;

-- High LDL Cholesterol → Increase Soluble Fiber (PRIMARY)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'primary',
  1,
  'Soluble fiber binds cholesterol in the digestive tract, reducing LDL by 5-10%. Cost-effective, evidence-based intervention.',
  'LDL cholesterol reduction (5-10%)',
  60,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.condition_name LIKE '%elevated%LDL%'
  AND i.name = 'Increase Soluble Fiber (30g+/day)'
LIMIT 1;

-- ============================================================================
-- GENERAL METABOLIC HEALTH
-- ============================================================================

-- Any Suboptimal Marker → Sleep Optimization (SECONDARY - applies broadly)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'secondary',
  99, -- Low priority within secondary (foundational)
  'Sleep is foundational for metabolic health. Poor sleep drives insulin resistance, inflammation, and disrupts hormone balance. Optimize for all conditions.',
  'Improved glucose control (10-20%), reduced inflammation, normalized hormones',
  30,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.severity IN ('suboptimal', 'concerning')
  AND i.name = 'Sleep Optimization Protocol'
  AND NOT EXISTS (
    SELECT 1 FROM protocol_rules pr
    WHERE pr.biomarker_condition_id = bc.id
      AND pr.intervention_id = i.id
  )
LIMIT 20; -- Apply to first 20 suboptimal conditions

-- Any Suboptimal Marker → Stress Management (OPTIONAL - applies broadly)
INSERT INTO protocol_rules (
  biomarker_condition_id,
  intervention_id,
  recommendation_strength,
  priority_order,
  rationale,
  expected_outcome,
  timeframe_days,
  is_active
)
SELECT
  bc.id,
  i.id,
  'optional',
  1,
  'Chronic stress elevates cortisol, driving insulin resistance and inflammation. Meditation/mindfulness provides broad metabolic benefits.',
  'Reduced cortisol (15-25%), lower blood pressure, improved glucose control',
  60,
  TRUE
FROM biomarker_conditions bc
CROSS JOIN interventions i
WHERE bc.severity IN ('suboptimal', 'concerning')
  AND i.name = 'Stress Management (Meditation/Mindfulness)'
  AND NOT EXISTS (
    SELECT 1 FROM protocol_rules pr
    WHERE pr.biomarker_condition_id = bc.id
      AND pr.intervention_id = i.id
  )
LIMIT 20;

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This creates intelligent mappings between biomarker conditions and interventions
-- Protocol generation will use these rules to create personalized recommendations
--
-- Rule Structure:
-- - PRIMARY: Must-do interventions (highest impact, evidence-based)
-- - SECONDARY: Should-do interventions (important but not critical)
-- - OPTIONAL: Nice-to-have interventions (beneficial but lower priority)
--
-- The protocol generation algorithm will:
-- 1. Identify all suboptimal/concerning biomarker results
-- 2. Look up applicable protocol_rules for each condition
-- 3. Deduplicate interventions (same intervention may apply to multiple markers)
-- 4. Prioritize by recommendation_strength and priority_order
-- 5. Generate focused protocol (typically 6-10 interventions)
