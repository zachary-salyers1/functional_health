-- Research Studies Seeding Migration
-- Generated: 2025-11-10T23:36:15.906Z
-- Total Studies: 43
--
-- This file seeds the research_studies table with high-quality studies
-- from PubMed, analyzed and structured by Claude AI.
--

-- Add columns for text arrays if they don't exist
-- (This allows us to store biomarker/intervention names before linking to IDs)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'research_studies'
                 AND column_name = 'relevant_biomarkers_text') THEN
    ALTER TABLE research_studies
    ADD COLUMN relevant_biomarkers_text VARCHAR[] DEFAULT ARRAY[]::VARCHAR[];
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                 WHERE table_name = 'research_studies'
                 AND column_name = 'relevant_interventions_text') THEN
    ALTER TABLE research_studies
    ADD COLUMN relevant_interventions_text VARCHAR[] DEFAULT ARRAY[]::VARCHAR[];
  END IF;
END $$;

-- Add UNIQUE constraint on pubmed_id if it doesn't exist
-- (Required for ON CONFLICT clause to work)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'research_studies_pubmed_id_unique'
  ) THEN
    ALTER TABLE research_studies
    ADD CONSTRAINT research_studies_pubmed_id_unique UNIQUE (pubmed_id);
  END IF;
END $$;

-- Insert research studies

-- Study: Berberine and health outcomes: An umbrella review.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36999891',
  '10.1002/ptr.7806',
  'Berberine and health outcomes: An umbrella review.',
  'Zhongyu Li, Yang Wang, Qing Xu et al.',
  'Phytotherapy research : PTR',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/36999891/',
  'meta-analysis',
  7,
  NULL,
  NULL,
  'Various clinical populations across multiple meta-analyses',
  'Berberine significantly improved multiple health parameters, including blood glucose, insulin resistance, blood lipids, body composition, and inflammatory markers',
  'Statistically significant effects across multiple health outcomes compared to controls',
  'Need for improvement in methodological quality of meta-analyses and confirmation through high-quality randomized controlled trials',
  ARRAY['glucose', 'insulin', 'lipids', 'inflammatory markers']::VARCHAR[],
  ARRAY['berberine supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Gut microbiome-related effects of berberine and probiotics on type 2 diabetes (the PREMOTE study).
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '33024120',
  '10.1038/s41467-020-18414-8',
  'Gut microbiome-related effects of berberine and probiotics on type 2 diabetes (the PREMOTE study).',
  'Yifei Zhang, Yanyun Gu, Huahui Ren et al.',
  'Nature communications',
  2020,
  'https://pubmed.ncbi.nlm.nih.gov/33024120/',
  'RCT',
  8,
  409,
  12,
  'Newly diagnosed type 2 diabetes patients from 20 centers in China',
  'Combination of berberine and probiotics, and berberine alone, significantly reduced glycated hemoglobin compared to placebo, with a reduction of approximately 1% and 0.99% respectively',
  'P < 0.001, with 95% confidence intervals reported for HbA1c changes',
  'BBR treatment induced more gastrointestinal side effects; study conducted only in Chinese population',
  ARRAY['HbA1c', 'DCA']::VARCHAR[],
  ARRAY['berberine', 'probiotics', 'gentamycin pretreatment']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: The effect of Berberine on weight loss in order to prevent obesity: A systematic review.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '32353823',
  '10.1016/j.biopha.2020.110137',
  'The effect of Berberine on weight loss in order to prevent obesity: A systematic review.',
  'Zahra Ilyas, Simone Perna, Salwa Al-Thawadi et al.',
  'Biomedicine & pharmacotherapy = Biomedecine & pharmacotherapie',
  2020,
  'https://pubmed.ncbi.nlm.nih.gov/32353823/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'Multiple experimental models: in vitro, animal, and human studies examining obesity and metabolic health',
  'Berberine demonstrated multiple mechanisms of action for weight management, including modulating gut microbiota, inhibiting glucose absorption, and reducing adipocyte differentiation',
  'Multiple dose-dependent effects observed across different experimental models',
  'Review study with varied experimental models, lacking a single comprehensive clinical trial; primarily preclinical and limited human data',
  ARRAY['glucose', 'cholesterol', 'AMPK', 'LXRs', 'PPARs', 'SREBPs']::VARCHAR[],
  ARRAY['berberine', 'red yeast rice', 'berberine supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Comparative efficacy of oral insulin sensitizers metformin, thiazolidinediones, inositol, and berberine in improving endocrine and metabolic profiles in women with PCOS: a network meta-analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '34407851',
  '10.1186/s12978-021-01207-7',
  'Comparative efficacy of oral insulin sensitizers metformin, thiazolidinediones, inositol, and berberine in improving endocrine and metabolic profiles in women with PCOS: a network meta-analysis.',
  'Han Zhao, Chuan Xing, Jiaqi Zhang et al.',
  'Reproductive health',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/34407851/',
  'meta-analysis',
  7,
  NULL,
  NULL,
  'Women with polycystic ovary syndrome (PCOS)',
  'Network meta-analysis comparing oral insulin sensitizers to improve endocrine and metabolic profiles in PCOS patients, providing evidence for multiple treatment options',
  'Not specified',
  'Comparative effectiveness of different oral insulin sensitizers not previously explored, leading to clinical uncertainty',
  ARRAY['insulin', 'glucose', 'endocrine markers']::VARCHAR[],
  ARRAY['metformin', 'thiazolidinediones', 'inositol', 'berberine']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: The Effect of Berberine on Metabolic Profiles in Type 2 Diabetic Patients: A Systematic Review and Meta-Analysis of Randomized Controlled Trials.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '34956436',
  '10.1155/2021/2074610',
  'The Effect of Berberine on Metabolic Profiles in Type 2 Diabetic Patients: A Systematic Review and Meta-Analysis of Randomized Controlled Trials.',
  'Jing Guo, Hongdong Chen, Xueqin Zhang et al.',
  'Oxidative medicine and cellular longevity',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/34956436/',
  'meta-analysis',
  8,
  NULL,
  NULL,
  'Type 2 diabetic patients',
  'Berberine showed potential hypoglycemic effects in patients with type 2 diabetes mellitus, demonstrating promising metabolic profile improvements',
  'Systematic review and meta-analysis indicating statistically significant metabolic effects',
  'Exact sample size and specific intervention details not fully specified in the abstract',
  ARRAY['glucose', 'metabolic profiles']::VARCHAR[],
  ARRAY['berberine', 'Rhizoma Coptidis extract']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Ultra-processed food exposure and adverse health outcomes: umbrella review of epidemiological meta-analyses.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '38418082',
  '10.1136/bmj-2023-077310',
  'Ultra-processed food exposure and adverse health outcomes: umbrella review of epidemiological meta-analyses.',
  'Melissa M Lane, Elizabeth Gamage, Shutong Du et al.',
  'BMJ (Clinical research ed.)',
  2024,
  'https://pubmed.ncbi.nlm.nih.gov/38418082/',
  'meta-analysis',
  8,
  NULL,
  NULL,
  'Broad population across multiple epidemiological studies examining ultra-processed food exposure',
  'Comprehensive review of existing evidence linking ultra-processed food consumption to multiple adverse health outcomes across different population groups',
  'Likely significant associations found through systematic review of multiple meta-analyses',
  'Umbrella review relying on existing meta-analyses, potential publication bias, heterogeneity across studies',
  ARRAY['glucose', 'cholesterol', 'triglycerides', 'inflammatory markers']::VARCHAR[],
  ARRAY['dietary modification', 'ultra-processed food reduction']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Ketogenic Diet Benefits to Weight Loss, Glycemic Control, and Lipid Profiles in Overweight Patients with Type 2 Diabetes Mellitus: A Meta-Analysis of Randomized Controlled Trails.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36012064',
  '10.3390/ijerph191610429',
  'Ketogenic Diet Benefits to Weight Loss, Glycemic Control, and Lipid Profiles in Overweight Patients with Type 2 Diabetes Mellitus: A Meta-Analysis of Randomized Controlled Trails.',
  'Chong Zhou, Meng Wang, Jiling Liang et al.',
  'International journal of environmental research and public health',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/36012064/',
  'meta-analysis',
  8,
  NULL,
  NULL,
  'Overweight patients with type 2 diabetes mellitus',
  'Ketogenic diet significantly reduced body weight (SMD -5.63), waist circumference (SMD -2.32), and improved glycemic control and lipid profiles in T2DM patients',
  'Multiple statistically significant results with p-values ranging from 0.0001 to 0.04',
  'Relies on only eight randomized controlled trials, potential publication bias, and lack of long-term follow-up data',
  ARRAY['glycated hemoglobin', 'triglycerides', 'high-density lipoproteins']::VARCHAR[],
  ARRAY['ketogenic diet']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Efficacy and safety of low and very low carbohydrate diets for type 2 diabetes remission: systematic review and meta-analysis of published and unpublished randomized trial data.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '33441384',
  '10.1136/bmj.m4743',
  'Efficacy and safety of low and very low carbohydrate diets for type 2 diabetes remission: systematic review and meta-analysis of published and unpublished randomized trial data.',
  'Joshua Z Goldenberg, Andrew Day, Grant D Brinkworth et al.',
  'BMJ (Clinical research ed.)',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/33441384/',
  'meta-analysis',
  9,
  NULL,
  NULL,
  'People with type 2 diabetes',
  'Systematic review aimed to evaluate the efficacy and safety of low and very low carbohydrate diets for type 2 diabetes remission',
  'Not specified',
  'Not specified',
  ARRAY['glucose', 'HbA1c']::VARCHAR[],
  ARRAY['low carbohydrate diet', 'very low carbohydrate diet']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effect of a ketogenic diet versus Mediterranean diet on glycated hemoglobin in individuals with prediabetes and type 2 diabetes mellitus: The interventional Keto-Med randomized crossover trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '35641199',
  '10.1093/ajcn/nqac154',
  'Effect of a ketogenic diet versus Mediterranean diet on glycated hemoglobin in individuals with prediabetes and type 2 diabetes mellitus: The interventional Keto-Med randomized crossover trial.',
  'Christopher D Gardner, Matthew J Landry, Dalia Perelman et al.',
  'The American journal of clinical nutrition',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/35641199/',
  'RCT',
  8,
  NULL,
  NULL,
  'Individuals with prediabetes and type 2 diabetes mellitus',
  'Comparison of ketogenic and Mediterranean diet effects on glycated hemoglobin in diabetes and prediabetes populations, with no clear consensus on optimal diet',
  'Not specified',
  'No consensus reached on optimal diet approach for individuals with prediabetes and type 2 diabetes',
  ARRAY['HbA1c', 'glucose']::VARCHAR[],
  ARRAY['ketogenic diet', 'Mediterranean diet']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Low-carbohydrate versus balanced-carbohydrate diets for reducing weight and cardiovascular risk.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '35088407',
  '10.1002/14651858.CD013334.pub2',
  'Low-carbohydrate versus balanced-carbohydrate diets for reducing weight and cardiovascular risk.',
  'Celeste E Naude, Amanda Brand, Anel Schoonees et al.',
  'The Cochrane database of systematic reviews',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/35088407/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'Adults with obesity, general population',
  'Compared low-carbohydrate diets with balanced-carbohydrate diets for weight reduction and cardiovascular risk management',
  'Ongoing debate about effectiveness and safety of dietary interventions',
  'Exact details of systematic review not fully specified in abstract, potential publication bias',
  ARRAY['weight', 'cardiovascular risk markers']::VARCHAR[],
  ARRAY['low-carbohydrate diet', 'balanced-carbohydrate diet']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Strength training is more effective than aerobic exercise for improving glycaemic control and body composition in people with normal-weight type 2 diabetes: a randomised controlled trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '37493759',
  '10.1007/s00125-023-05958-9',
  'Strength training is more effective than aerobic exercise for improving glycaemic control and body composition in people with normal-weight type 2 diabetes: a randomised controlled trial.',
  'Yukari Kobayashi, Jin Long, Shozen Dan et al.',
  'Diabetologia',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/37493759/',
  'RCT',
  8,
  NULL,
  NULL,
  'People with normal-weight type 2 diabetes (BMI <25 kg/m2)',
  'Strength training was more effective than aerobic exercise for improving glycaemic control and body composition in normal-weight type 2 diabetes patients',
  'Not specified',
  'Details of sample size and study duration not provided in abstract',
  ARRAY['glucose', 'insulin']::VARCHAR[],
  ARRAY['strength training', 'aerobic exercise']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Diagnosis and Management of Prediabetes: A Review.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '37039787',
  '10.1001/jama.2023.4063',
  'Diagnosis and Management of Prediabetes: A Review.',
  'Justin B Echouffo-Tcheugui, Leigh Perreault, Linong Ji et al.',
  'JAMA',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/37039787/',
  'review',
  7,
  NULL,
  NULL,
  'US and global adult population with prediabetes',
  'Prediabetes affects approximately 1 in 3 US adults and 720 million individuals worldwide, representing a significant metabolic health challenge',
  'Not specified',
  'Narrative review with potential selection bias; does not provide original research data',
  ARRAY['glucose', 'HbA1c', 'insulin']::VARCHAR[],
  ARRAY['diet modification', 'lifestyle changes', 'weight management', 'exercise']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Exercise and insulin resistance in type 2 diabetes mellitus: A systematic review and meta-analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '30553010',
  '10.1016/j.rehab.2018.11.001',
  'Exercise and insulin resistance in type 2 diabetes mellitus: A systematic review and meta-analysis.',
  'A Sampath Kumar, Arun G Maiya, B A Shastry et al.',
  'Annals of physical and rehabilitation medicine',
  2019,
  'https://pubmed.ncbi.nlm.nih.gov/30553010/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'Type 2 diabetes mellitus patients with insulin resistance',
  'Exercise is shown to improve insulin resistance in type 2 diabetes, suggesting a potential non-pharmacological intervention for managing the condition',
  'Specific statistical details not provided in the abstract',
  'Limited details in abstract; comprehensive statistical analysis would require full study review',
  ARRAY['insulin', 'glucose']::VARCHAR[],
  ARRAY['exercise']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Exercise and Neuropathy: Systematic Review with Meta-Analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '34964950',
  '10.1007/s40279-021-01596-6',
  'Exercise and Neuropathy: Systematic Review with Meta-Analysis.',
  'Fiona Streckmann, Maryam Balke, Guido Cavaletti et al.',
  'Sports medicine (Auckland, N.Z.)',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/34964950/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'Patients with peripheral neuropathies',
  'Systematic review suggests potential therapeutic benefits of exercise interventions for patients with polyneuropathy, with increased research focus since 2014',
  'Not specified',
  'Unable to determine specific causal treatment options, heterogeneous group of diseases',
  ARRAY[]::VARCHAR[],
  ARRAY['exercise']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effect of High-Dose Omega-3 Fatty Acids vs Corn Oil on Major Adverse Cardiovascular Events in Patients at High Cardiovascular Risk: The STRENGTH Randomized Clinical Trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '33190147',
  '10.1001/jama.2020.22258',
  'Effect of High-Dose Omega-3 Fatty Acids vs Corn Oil on Major Adverse Cardiovascular Events in Patients at High Cardiovascular Risk: The STRENGTH Randomized Clinical Trial.',
  'Stephen J Nicholls, A Michael Lincoff, Michelle Garcia et al.',
  'JAMA',
  2020,
  'https://pubmed.ncbi.nlm.nih.gov/33190147/',
  'RCT',
  8,
  13078,
  NULL,
  'High cardiovascular risk patients, specific details not fully provided in abstract',
  'Omega-3 fatty acids (EPA and DHA) did not significantly reduce cardiovascular risk compared to corn oil in high-risk patients',
  'No statistically significant difference in major adverse cardiovascular events was observed',
  'Uncertainty remains about omega-3 fatty acids'' cardiovascular risk reduction potential',
  ARRAY['EPA', 'DHA']::VARCHAR[],
  ARRAY['High-dose omega-3 fatty acids', 'Corn oil supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Omega-3 fatty acids for the primary and secondary prevention of cardiovascular disease.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '32114706',
  '10.1002/14651858.CD003177.pub5',
  'Omega-3 fatty acids for the primary and secondary prevention of cardiovascular disease.',
  'Asmaa S Abdelhamid, Tracey J Brown, Julii S Brainard et al.',
  'The Cochrane database of systematic reviews',
  2020,
  'https://pubmed.ncbi.nlm.nih.gov/32114706/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'General cardiovascular health population, no specific age or sex restriction mentioned',
  'Recent trials have not confirmed cardiovascular health benefits from omega-3 fatty acids, contrary to previous guideline recommendations',
  'Not specified in the abstract, requires full review of study details',
  'Conflicting evidence between previous guidelines and recent trial results suggests uncertainty in omega-3 cardiovascular benefits',
  ARRAY['EPA', 'DHA', 'alpha-linolenic acid']::VARCHAR[],
  ARRAY['omega-3 fatty acid supplementation', 'dietary omega-3 intake']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Omega-3 fatty acids for the primary and secondary prevention of cardiovascular disease.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '30019766',
  '10.1002/14651858.CD003177.pub3',
  'Omega-3 fatty acids for the primary and secondary prevention of cardiovascular disease.',
  'Asmaa S Abdelhamid, Tracey J Brown, Julii S Brainard et al.',
  'The Cochrane database of systematic reviews',
  2018,
  'https://pubmed.ncbi.nlm.nih.gov/30019766/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'Adults of various cardiovascular risk profiles',
  'Recent trials have not confirmed previous suggestions that omega-3 fatty acids provide significant cardiovascular health benefits',
  'Insufficient evidence to support cardiovascular disease prevention with omega-3 supplementation',
  'Variability in study designs, omega-3 sources, and dosages across reviewed research',
  ARRAY['EPA', 'DHA', 'ALA']::VARCHAR[],
  ARRAY['omega-3 supplementation', 'dietary omega-3 intake']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Update on Omega-3 Polyunsaturated Fatty Acids on Cardiovascular Health.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36501174',
  '10.3390/nu14235146',
  'Update on Omega-3 Polyunsaturated Fatty Acids on Cardiovascular Health.',
  'Daniel Rodriguez, Carl J Lavie, Andrew Elagizi et al.',
  'Nutrients',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/36501174/',
  'review',
  7,
  NULL,
  NULL,
  'Cardiovascular disease patients, focus on those with hyperlipidemia and hypertriglyceridemia',
  'Omega-3 fatty acids significantly reduced very high triglyceride levels, hospitalizations, and cardiovascular disease mortality, with notable reductions in fatal and total myocardial infarctions',
  'Significant effects demonstrated across multiple meta-analyses and randomized controlled trials',
  'Review highlights ongoing controversies surrounding omega-3 fatty acids, indicating potential inconsistencies in research findings',
  ARRAY['triglycerides', 'cholesterol', 'high-density lipoprotein cholesterol']::VARCHAR[],
  ARRAY['omega-3 fatty acids supplementation', 'fish oil supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Supplemental Vitamin D and Incident Fractures in Midlife and Older Adults.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '35939577',
  '10.1056/NEJMoa2202106',
  'Supplemental Vitamin D and Incident Fractures in Midlife and Older Adults.',
  'Meryl S LeBoff, Sharon H Chou, Kristin A Ratliff et al.',
  'The New England journal of medicine',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/35939577/',
  'RCT',
  8,
  NULL,
  NULL,
  'Midlife and older adults',
  'Vitamin D supplements did not consistently prevent fractures in the study population.',
  'Inconsistent data suggest no clear statistically significant effect on fracture prevention',
  'Abstract provides limited details about methodology and specific results',
  ARRAY['vitamin D']::VARCHAR[],
  ARRAY['vitamin D supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effect of High-Dose Vitamin D Supplementation on Volumetric Bone Density and Bone Strength: A Randomized Clinical Trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '31454046',
  '10.1001/jama.2019.11889',
  'Effect of High-Dose Vitamin D Supplementation on Volumetric Bone Density and Bone Strength: A Randomized Clinical Trial.',
  'Lauren A Burt, Emma O Billington, Marianne S Rose et al.',
  'JAMA',
  2019,
  'https://pubmed.ncbi.nlm.nih.gov/31454046/',
  'RCT',
  7,
  NULL,
  NULL,
  'US adults consuming high-dose vitamin D (≥4000 IU per day)',
  'Study examined effects of high-dose vitamin D supplementation on bone density and strength over extended period',
  'Not specified',
  'Abstract provides limited details about specific methodology and results',
  ARRAY['vitamin D']::VARCHAR[],
  ARRAY['high-dose vitamin D supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Psoriasis and Vitamin D: A Systematic Review and Meta-Analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '37571324',
  '10.3390/nu15153387',
  'Psoriasis and Vitamin D: A Systematic Review and Meta-Analysis.',
  'Elena Formisano, Elisa Proietti, Consuelo Borgarelli et al.',
  'Nutrients',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/37571324/',
  'meta-analysis',
  7,
  9408,
  NULL,
  'Patients with psoriasis and healthy controls',
  'Psoriasis patients had significantly lower serum vitamin D levels (21.0 ± 8.3) compared to controls (27.3 ± 9.8), but vitamin D supplementation did not improve PASI scores',
  'Significant difference in vitamin D levels (p < 0.00001), non-significant impact of supplementation',
  'Limited RCT methodology may have influenced analysis; small number of randomized trials examined',
  ARRAY['vitamin D', '25(OH)D', 'parathormone']::VARCHAR[],
  ARRAY['vitamin D supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Infections and Autoimmunity-The Immune System and Vitamin D: A Systematic Review.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '37686873',
  '10.3390/nu15173842',
  'Infections and Autoimmunity-The Immune System and Vitamin D: A Systematic Review.',
  'Sunil J Wimalawansa',
  'Nutrients',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/37686873/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'General human population, focus on immune health and vitamin D status',
  'Maintaining serum 25(OH)D concentrations above 50 ng/mL significantly reduces risks from viral and bacterial infections, sepsis, and autoimmune disorders',
  'Strong evidence from well-designed randomized controlled trials, most studies showing substantial benefits',
  'Lack of standardized guidance from health agencies, potential variability in individual vitamin D metabolism and absorption',
  ARRAY['25(OH)D', '1,25(OH)2D', 'serum vitamin D levels']::VARCHAR[],
  ARRAY['vitamin D supplementation', 'sun exposure', 'daily vitamin D intake (5000-8000 IU)']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Vitamin D and marine omega 3 fatty acid supplementation and incident autoimmune disease: VITAL randomized controlled trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '35082139',
  '10.1136/bmj-2021-066452',
  'Vitamin D and marine omega 3 fatty acid supplementation and incident autoimmune disease: VITAL randomized controlled trial.',
  'Jill Hahn, Nancy R Cook, Erik K Alexander et al.',
  'BMJ (Clinical research ed.)',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/35082139/',
  'RCT',
  8,
  NULL,
  NULL,
  'Participants with autoimmune disease risk, likely general adult population',
  'Investigated whether vitamin D and marine omega-3 fatty acid supplementation reduces autoimmune disease risk',
  'Not specified',
  'Not specified',
  ARRAY['vitamin D']::VARCHAR[],
  ARRAY['vitamin D supplementation', 'marine omega-3 fatty acid supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Risk factors for type 2 diabetes mellitus: An exposure-wide umbrella review of meta-analyses.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '29558518',
  '10.1371/journal.pone.0194127',
  'Risk factors for type 2 diabetes mellitus: An exposure-wide umbrella review of meta-analyses.',
  'Vanesa Bellou, Lazaros Belbasis, Ioanna Tzoulaki et al.',
  'PloS one',
  2018,
  'https://pubmed.ncbi.nlm.nih.gov/29558518/',
  'meta-analysis',
  8,
  NULL,
  NULL,
  'Global population at risk of type 2 diabetes mellitus',
  'Identified multiple non-genetic risk factors for type 2 diabetes, assessing their overall epidemiological credibility',
  'Comprehensive review of meta-analyses to evaluate risk factor evidence',
  'Does not specify specific quantitative risk increases, focuses on overall epidemiological assessment of risk factors',
  ARRAY['glucose', 'insulin', 'HbA1c']::VARCHAR[],
  ARRAY['lifestyle modification', 'diet interventions', 'exercise']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Selenium Supplementation in Patients with Hashimoto Thyroiditis: A Systematic Review and Meta-Analysis of Randomized Clinical Trials.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '38243784',
  '10.1089/thy.2023.0556',
  'Selenium Supplementation in Patients with Hashimoto Thyroiditis: A Systematic Review and Meta-Analysis of Randomized Clinical Trials.',
  'Valentina V Huwiler, Stephanie Maissen-Abgottspon, Zeno Stanga et al.',
  'Thyroid : official journal of the American Thyroid Association',
  2024,
  'https://pubmed.ncbi.nlm.nih.gov/38243784/',
  'meta-analysis',
  8,
  2358,
  NULL,
  'Patients with Hashimoto thyroiditis, with and without thyroid hormone replacement therapy',
  'Selenium supplementation significantly reduced TSH by 0.21 standard mean differences and TPOAb by 0.96 standard mean differences in patients with Hashimoto thyroiditis',
  'Confidence intervals and low heterogeneity suggest reliable results, with moderate overall evidence certainty',
  'Variability in study populations and potential publication bias; only moderate certainty of evidence',
  ARRAY['TSH', 'TPOAb', 'TGAb', 'fT4', 'T4', 'fT3', 'T3', 'malondialdehyde', 'interleukin-2', 'interleukin-10']::VARCHAR[],
  ARRAY['selenium supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effect of selenium on thyroid autoimmunity and regulatory T cells in patients with Hashimoto's thyroiditis: A prospective randomized-controlled trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '33650299',
  '10.1111/cts.12993',
  'Effect of selenium on thyroid autoimmunity and regulatory T cells in patients with Hashimoto''s thyroiditis: A prospective randomized-controlled trial.',
  'Yifang Hu, Wenwen Feng, Huanhuan Chen et al.',
  'Clinical and translational science',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/33650299/',
  'RCT',
  7,
  90,
  26,
  'Patients with Hashimoto''s thyroiditis, specific demographics not detailed',
  'Selenium supplementation significantly decreased thyroid peroxidase antibodies, thyroglobulin antibodies, and TSH levels, while increasing activated regulatory T cells',
  'Statistically significant changes observed in multiple biomarkers, with notable interaction effects in subclinical Hashimoto''s thyroiditis',
  'Single-center study, limited long-term follow-up, potential selection bias',
  ARRAY['TPOAb', 'TGAb', 'TSH', 'Selenium', 'GPx3', 'SePP1', 'Regulatory T cells']::VARCHAR[],
  ARRAY['Selenious yeast tablet supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effects of different supplements on Hashimoto's thyroiditis: a systematic review and network meta-analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '39698034',
  '10.3389/fendo.2024.1445878',
  'Effects of different supplements on Hashimoto''s thyroiditis: a systematic review and network meta-analysis.',
  'Bingcong Peng, Weiwei Wang, Qingling Gu et al.',
  'Frontiers in endocrinology',
  2024,
  'https://pubmed.ncbi.nlm.nih.gov/39698034/',
  'systematic_review',
  8,
  NULL,
  24,
  'Patients with Hashimoto''s thyroiditis in euthyroid state',
  'Selenium supplementation significantly reduced thyroid peroxidase and thyroglobulin autoantibody levels compared to placebo, while Myo-inositol, Vitamin D, and selenium+Myo-inositol combinations showed no significant effect.',
  'Selenium effects: TPOAb SMD -2.44 (95% CI: -4.19, -0.69), TgAb SMD -2.76 (95% CI: -4.50, -1.02)',
  'No direct mention of study limitations; meta-analysis based on 10 case-control studies with potential heterogeneity',
  ARRAY['TSH', 'TPOAb', 'TgAb']::VARCHAR[],
  ARRAY['selenium supplementation', 'vitamin D supplementation', 'myo-inositol supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: The Influence of Nutritional Intervention in the Treatment of Hashimoto's Thyroiditis-A Systematic Review.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36839399',
  '10.3390/nu15041041',
  'The Influence of Nutritional Intervention in the Treatment of Hashimoto''s Thyroiditis-A Systematic Review.',
  'Karolina Osowiecka, Joanna Myszkowska-Ryciak',
  'Nutrients',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/36839399/',
  'systematic_review',
  7,
  NULL,
  NULL,
  'Individuals with Hashimoto''s thyroiditis, including mostly female participants, with various thyroid function levels',
  'Nutritional interventions including energy deficit, gluten/lactose elimination, and Nigella sativa supplementation showed improvements in thyroid antibody levels and thyroid hormone parameters',
  'Varied outcomes suggest individual variability, but positive trends in antibody and hormone levels',
  'Heterogeneous study populations, high patient variability, and differences in nutrient intake limit generalizability of findings',
  ARRAY['anti-TPO', 'TSH', 'free thyroxine (fT4)']::VARCHAR[],
  ARRAY['gluten elimination', 'lactose elimination', 'energy restriction', 'Nigella sativa consumption', 'dietary iodine restriction']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effect of Anti-Inflammatory Diets on Pain in Rheumatoid Arthritis: A Systematic Review and Meta-Analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '34959772',
  '10.3390/nu13124221',
  'Effect of Anti-Inflammatory Diets on Pain in Rheumatoid Arthritis: A Systematic Review and Meta-Analysis.',
  'Katja A Sch&#xf6;nenberger, Anne-Catherine Sch&#xfc;pfer, Viktoria L Gloy et al.',
  'Nutrients',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/34959772/',
  'meta-analysis',
  6,
  326,
  NULL,
  'Patients with rheumatoid arthritis',
  'Anti-inflammatory diets significantly reduced pain by 9.22 mm on a 10 cm visual analogue scale compared to ordinary diets',
  'p = 0.0002, 95% CI -14.15 to -4.29',
  'All studies had a high risk of bias and evidence was very low quality',
  ARRAY['C-reactive protein', 'erythrocyte sedimentation rate']::VARCHAR[],
  ARRAY['Mediterranean diet', 'vegetarian diet', 'vegan diet', 'ketogenic diet']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effect of aerobic exercise training on asthma in adults: a systematic review and meta-analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '32350100',
  '10.1183/13993003.00146-2020',
  'Effect of aerobic exercise training on asthma in adults: a systematic review and meta-analysis.',
  'Erik Soeren Halvard Hansen, Anders Pitzner-Fabricius, Louise Lindhardt Toennesen et al.',
  'The European respiratory journal',
  2020,
  'https://pubmed.ncbi.nlm.nih.gov/32350100/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'Adults with asthma',
  'Systematic review and meta-analysis examining effects of aerobic exercise on asthma control, lung function, and airway inflammation in adult patients',
  'Detailed statistical analysis comparing exercise interventions to control groups',
  'Meta-analysis may have inherent limitations from variability in included studies and potential publication bias',
  ARRAY['lung function markers', 'inflammatory markers']::VARCHAR[],
  ARRAY['aerobic exercise training']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Combination of exercise and GLP-1 receptor agonist treatment reduces severity of metabolic syndrome, abdominal obesity, and inflammation: a randomized controlled trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36841762',
  '10.1186/s12933-023-01765-z',
  'Combination of exercise and GLP-1 receptor agonist treatment reduces severity of metabolic syndrome, abdominal obesity, and inflammation: a randomized controlled trial.',
  'Rasmus M Sandsdal, Christian R Juhl, Simon B K Jensen et al.',
  'Cardiovascular diabetology',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/36841762/',
  'RCT',
  8,
  NULL,
  NULL,
  'Individuals living with obesity',
  'Combination of exercise and GLP-1 receptor agonist treatment reduced severity of metabolic syndrome, abdominal obesity, and inflammation',
  'Not specified',
  'Specific details about statistical significance and sample size not provided in abstract',
  ARRAY['inflammation markers']::VARCHAR[],
  ARRAY['exercise', 'GLP-1 receptor agonist treatment']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: The effects of foods on LDL cholesterol levels: A systematic review of the accumulated evidence from systematic reviews and meta-analyses of randomized controlled trials.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '33762150',
  '10.1016/j.numecd.2020.12.032',
  'The effects of foods on LDL cholesterol levels: A systematic review of the accumulated evidence from systematic reviews and meta-analyses of randomized controlled trials.',
  'Malin Schoeneck, David Iggman',
  'Nutrition, metabolism, and cardiovascular diseases : NMCD',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/33762150/',
  'systematic_review',
  8,
  NULL,
  NULL,
  'General population, no specific age or health status restriction',
  'Systematic review evaluated accumulated evidence on how different foods impact LDL cholesterol levels, comparing findings with current clinical guidelines',
  'Comprehensive analysis of multiple systematic reviews and meta-analyses of randomized controlled trials',
  'Unable to determine specific limitations without full text; potential publication bias in included studies',
  ARRAY['LDL cholesterol']::VARCHAR[],
  ARRAY['dietary interventions', 'food consumption patterns']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Comparative Effects of Low-Dose Rosuvastatin, Placebo, and Dietary Supplements on Lipids and Inflammatory&#xa0;Biomarkers.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36351465',
  '10.1016/j.jacc.2022.10.013',
  'Comparative Effects of Low-Dose Rosuvastatin, Placebo, and Dietary Supplements on Lipids and Inflammatory&#xa0;Biomarkers.',
  'Luke J Laffin, Dennis Bruemmer, Michelle Garcia et al.',
  'Journal of the American College of Cardiology',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/36351465/',
  'RCT',
  8,
  NULL,
  NULL,
  'Individuals with indications for lipid-lowering therapy',
  'Study compared the effectiveness of low-dose rosuvastatin against placebo and dietary supplements in lowering LDL cholesterol',
  'Not specified',
  'Abstract provides limited details about specific methodology and results',
  ARRAY['LDL cholesterol', 'inflammatory biomarkers']::VARCHAR[],
  ARRAY['low-dose rosuvastatin', 'placebo', 'dietary supplements']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Antioxidant-Enriched Diet on Oxidative Stress and Inflammation Gene Expression: A Randomized Controlled Trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36672947',
  '10.3390/genes14010206',
  'Antioxidant-Enriched Diet on Oxidative Stress and Inflammation Gene Expression: A Randomized Controlled Trial.',
  'Paola Gualtieri, Marco Marchetti, Giulia Frank et al.',
  'Genes',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/36672947/',
  'RCT',
  7,
  24,
  2,
  'Participants on Mediterranean Diet, specific demographics not detailed',
  'Mixed apple and bergamot juice supplementation increased lean mass and improved cholesterol ratios, with significant upregulation of several inflammatory and oxidative stress genes',
  'Significant changes in gene expression (MIF, PPAR&#x3b3;, SOD1, VDR) at p ≤ 0.05 to p < 0.001',
  'Small sample size, relatively short duration, potential generalizability concerns',
  ARRAY['Superoxide dismutase (SOD1)', 'PPAR&#x3b3;', 'Catalase (CAT)', 'CCL5', 'NFKB1', 'Vitamin D Receptor (VDR)', 'Macrophage Migration Inhibitory Factor (MIF)', 'Total cholesterol', 'HDL cholesterol']::VARCHAR[],
  ARRAY['Mediterranean Diet', 'Mixed apple and bergamot juice supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: A network meta-analysis on the comparative effect of nutraceuticals on lipid profile in adults.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '35988871',
  '10.1016/j.phrs.2022.106402',
  'A network meta-analysis on the comparative effect of nutraceuticals on lipid profile in adults.',
  'Tadeusz Osadnik, Marcin Go&#x142;awski, Piotr Lewandowski et al.',
  'Pharmacological research',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/35988871/',
  'meta-analysis',
  8,
  13062,
  NULL,
  'Adults with hypercholesterolemia or lipid profile concerns',
  'Bergamot and red yeast rice were most effective in lowering LDL-C and total cholesterol, with reductions of 46.8 mg/dL and 36.4 mg/dL respectively compared to placebo',
  'Random effects network meta-analysis showed statistically significant reductions in lipid markers for most nutraceuticals',
  'Bergamot evidence based on small study group, requiring further investigation',
  ARRAY['LDL cholesterol', 'total cholesterol', 'HDL cholesterol', 'triglycerides']::VARCHAR[],
  ARRAY['artichoke', 'berberine', 'bergamot', 'garlic', 'green tea extract', 'plant sterols/stanols', 'policosanols', 'red yeast rice', 'silymarin', 'spirulina']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Neither soy nor isoflavone intake affects male reproductive hormones: An expanded and updated meta-analysis of clinical studies.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '33383165',
  '10.1016/j.reprotox.2020.12.019',
  'Neither soy nor isoflavone intake affects male reproductive hormones: An expanded and updated meta-analysis of clinical studies.',
  'Katharine E Reed, Juliana Camargo, Jill Hamilton-Reeves et al.',
  'Reproductive toxicology (Elmsford, N.Y.)',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/33383165/',
  'meta-analysis',
  8,
  1753,
  NULL,
  'Adult men, various studies examining soy and isoflavone intake',
  'No significant effects of soy protein or isoflavone intake on male reproductive hormones were observed across multiple studies',
  'No statistically significant changes were found across different statistical models and sub-analyses',
  'Limited to English-language peer-reviewed studies between 2010-2020; potential publication bias',
  ARRAY['total testosterone', 'free testosterone', 'estradiol', 'estrone', 'sex hormone binding globulin']::VARCHAR[],
  ARRAY['soy protein intake', 'isoflavone supplementation', 'soy food consumption']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Does creatine cause hair loss? A 12-week randomized controlled trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '40265319',
  '10.1080/15502783.2025.2495229',
  'Does creatine cause hair loss? A 12-week randomized controlled trial.',
  'Mohammadyasin Lak, Scott C Forbes, Damoon Ashtary-Larky et al.',
  'Journal of the International Society of Sports Nutrition',
  2025,
  'https://pubmed.ncbi.nlm.nih.gov/40265319/',
  'RCT',
  7,
  NULL,
  12,
  'Healthy young males',
  'Preliminary investigation of creatine''s potential impact on DHT levels and hair follicle health',
  'Not specified',
  'Sample size and detailed results not specified in abstract',
  ARRAY['DHT']::VARCHAR[],
  ARRAY['creatine supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '26609282',
  '10.1186/s12970-015-0104-9',
  'Examining the effect of Withania somnifera supplementation on muscle strength and recovery: a randomized controlled trial.',
  'Sachin Wankhede, Deepak Langade, Kedar Joshi et al.',
  'Journal of the International Society of Sports Nutrition',
  2015,
  'https://pubmed.ncbi.nlm.nih.gov/26609282/',
  'RCT',
  7,
  NULL,
  NULL,
  'Healthy young men engaged in resistance training',
  'Investigated potential effects of ashwagandha root extract on muscle mass and strength in resistance training participants',
  'Not specified',
  'Partial abstract limits ability to fully assess study details and comprehensive findings',
  ARRAY[]::VARCHAR[],
  ARRAY['Withania somnifera (ashwagandha) root extract supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Hydrocortisone in Severe Community-Acquired Pneumonia.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '36942789',
  '10.1056/NEJMoa2215145',
  'Hydrocortisone in Severe Community-Acquired Pneumonia.',
  'Pierre-Fran&#xe7;ois Dequin, Ferhat Meziani, Jean-Pierre Quenot et al.',
  'The New England journal of medicine',
  2023,
  'https://pubmed.ncbi.nlm.nih.gov/36942789/',
  'RCT',
  8,
  NULL,
  NULL,
  'Patients with severe community-acquired pneumonia',
  'Study investigated whether glucocorticoids (hydrocortisone) could potentially reduce mortality in severe pneumonia cases',
  'Not specified',
  'Limited details available from abstract, unclear definitive clinical outcomes',
  ARRAY['inflammatory markers', 'immune system markers']::VARCHAR[],
  ARRAY['hydrocortisone', 'glucocorticoid treatment']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Hydrocortisone plus Fludrocortisone for Adults with Septic Shock.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '29490185',
  '10.1056/NEJMoa1705716',
  'Hydrocortisone plus Fludrocortisone for Adults with Septic Shock.',
  'Djillali Annane, Alain Renault, Christian Brun-Buisson et al.',
  'The New England journal of medicine',
  2018,
  'https://pubmed.ncbi.nlm.nih.gov/29490185/',
  'RCT',
  8,
  NULL,
  NULL,
  'Adults with septic shock',
  'Study investigated the potential of hydrocortisone plus fludrocortisone or drotrecogin alfa to modulate host response in septic shock',
  'Not specified',
  'Abstract provides limited details about specific outcomes or statistical analysis',
  ARRAY[]::VARCHAR[],
  ARRAY['hydrocortisone', 'fludrocortisone', 'drotrecogin alfa']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Yoga, mindfulness-based stress reduction and stress-related physiological measures: A meta-analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '28963884',
  '10.1016/j.psyneuen.2017.08.008',
  'Yoga, mindfulness-based stress reduction and stress-related physiological measures: A meta-analysis.',
  'Michaela C Pascoe, David R Thompson, Chantal F Ski',
  'Psychoneuroendocrinology',
  2017,
  'https://pubmed.ncbi.nlm.nih.gov/28963884/',
  'meta-analysis',
  8,
  NULL,
  NULL,
  'Individuals practicing yoga and mindfulness-based stress reduction techniques',
  'Meta-analysis investigating the neurobiological effects of yoga and mindfulness practices on stress reactivity, comparing interventions to active control groups',
  'Statistical analysis of physiological markers of stress across multiple studies',
  'Many previous studies lacked active control groups, limiting comprehensive understanding of intervention effectiveness',
  ARRAY['stress physiological markers']::VARCHAR[],
  ARRAY['yoga asanas', 'mindfulness-based stress reduction']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: Effects of Vitamin B12 Supplementation on Cognitive Function, Depressive Symptoms, and Fatigue: A Systematic Review, Meta-Analysis, and Meta-Regression.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '33809274',
  '10.3390/nu13030923',
  'Effects of Vitamin B12 Supplementation on Cognitive Function, Depressive Symptoms, and Fatigue: A Systematic Review, Meta-Analysis, and Meta-Regression.',
  'Stefan Markun, Isaac Gravestock, Levy J&#xe4;ger et al.',
  'Nutrients',
  2021,
  'https://pubmed.ncbi.nlm.nih.gov/33809274/',
  'meta-analysis',
  8,
  6276,
  NULL,
  'Patients without advanced neurological disorders or overt vitamin B12 deficiency',
  'No significant effects of vitamin B12 supplementation on cognitive function, depressive symptoms, or fatigue',
  'No statistically significant associations found in meta-regression analyses',
  'Limited data on fatigue, only one study reporting fatigue outcomes, potentially heterogeneous study populations',
  ARRAY['vitamin B12']::VARCHAR[],
  ARRAY['vitamin B12 supplementation', 'vitamin B complex supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();

-- Study: B vitamins and prevention of cognitive decline and incident dementia: a systematic review and meta-analysis.
INSERT INTO research_studies (
  pubmed_id,
  doi,
  title,
  authors,
  journal,
  publication_year,
  url,
  study_type,
  quality_score,
  sample_size,
  duration_weeks,
  population_description,
  key_findings,
  statistical_significance,
  limitations,
  relevant_biomarkers_text,
  relevant_interventions_text,
  is_active
) VALUES (
  '34432056',
  '10.1093/nutrit/nuab057',
  'B vitamins and prevention of cognitive decline and incident dementia: a systematic review and meta-analysis.',
  'Zhibin Wang, Wei Zhu, Yi Xing et al.',
  'Nutrition reviews',
  2022,
  'https://pubmed.ncbi.nlm.nih.gov/34432056/',
  'meta-analysis',
  8,
  NULL,
  NULL,
  'Adults at risk of cognitive decline and dementia',
  'Systematic review investigated the potential of B vitamins to reduce homocysteine levels and prevent cognitive decline, with mixed evidence on effectiveness',
  'Unclear from abstract, requires full text review',
  'Controversy exists regarding the direct link between homocysteine reduction and cognitive function preservation',
  ARRAY['homocysteine']::VARCHAR[],
  ARRAY['B vitamin supplementation']::VARCHAR[],
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();


-- Summary
-- ========
-- Total studies inserted: 43
-- By study type:
--   meta-analysis: 15
--   RCT: 15
--   systematic_review: 11
--   review: 2
--
-- By quality score:
--   9-10 (Excellent): 1
--   7-8 (Good): 41
--   5-6 (Fair): 1
--   1-4 (Poor): 0
--
-- By biomarker (top 10):
--   glucose: 11 studies
--   insulin: 6 studies
--   hba1c: 5 studies
--   inflammatory markers: 4 studies
--   triglycerides: 4 studies
--   vitamin d: 4 studies
--   tsh: 4 studies
--   cholesterol: 3 studies
--   epa: 3 studies
--   dha: 3 studies
--
-- By intervention (top 10):
--   berberine: 5 studies
--   exercise: 5 studies
--   vitamin d supplementation: 5 studies
--   ketogenic diet: 3 studies
--   mediterranean diet: 3 studies
--   berberine supplementation: 2 studies
--   red yeast rice: 2 studies
--   dietary omega-3 intake: 2 studies
--   selenium supplementation: 2 studies
--   hydrocortisone: 2 studies
