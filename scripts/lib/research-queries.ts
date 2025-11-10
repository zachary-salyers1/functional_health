/**
 * Pre-defined PubMed search queries for biomarkers and interventions
 * These queries target high-quality studies on functional health optimization
 */

import type { PubMedSearchParams } from './pubmed-client';

export interface ResearchQuery extends PubMedSearchParams {
  id: string;
  description: string;
  biomarkerNames?: string[];
  interventionNames?: string[];
}

/**
 * Core research queries for MVP (targeting 25-30 studies)
 * Focus on: Glucose/metabolic health, Vitamin D, and Thyroid
 */
export const CORE_RESEARCH_QUERIES: ResearchQuery[] = [
  // ===== GLUCOSE & METABOLIC HEALTH =====
  {
    id: 'glucose-berberine',
    description: 'Berberine for glucose control',
    query: '(berberine OR berberis) AND (glucose OR "blood sugar" OR diabetes OR HbA1c OR "glycemic control")',
    maxResults: 5,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis', 'Systematic Review'],
    biomarkerNames: ['Fasting Glucose', 'Hemoglobin A1C', 'Fasting Insulin'],
    interventionNames: ['Berberine 500mg 3x/day']
  },
  {
    id: 'glucose-low-carb',
    description: 'Low-carb diet for glucose and insulin',
    query: '("low carbohydrate" OR "low-carb" OR "carbohydrate restriction") AND (glucose OR insulin OR "insulin sensitivity" OR diabetes OR HbA1c)',
    maxResults: 5,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis', 'Systematic Review'],
    biomarkerNames: ['Fasting Glucose', 'Hemoglobin A1C', 'Fasting Insulin', 'Triglycerides'],
    interventionNames: ['Low-Carb Diet (<100g/day)']
  },
  {
    id: 'glucose-exercise',
    description: 'Exercise for glucose control',
    query: '(exercise OR "physical activity" OR "resistance training" OR walking) AND (glucose OR "insulin sensitivity" OR diabetes OR HbA1c)',
    maxResults: 4,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['Fasting Glucose', 'Hemoglobin A1C', 'Fasting Insulin'],
    interventionNames: ['Daily 10,000 Steps', 'Resistance Training']
  },
  {
    id: 'triglycerides-omega3',
    description: 'Omega-3 for triglyceride reduction',
    query: '("omega-3" OR "fish oil" OR EPA OR DHA) AND (triglycerides OR hypertriglyceridemia OR "lipid profile")',
    maxResults: 4,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['Triglycerides', 'HDL Cholesterol'],
    interventionNames: ['Omega-3']
  },

  // ===== VITAMIN D =====
  {
    id: 'vitamin-d-supplementation',
    description: 'Vitamin D3 supplementation effectiveness',
    query: '("vitamin D" OR cholecalciferol OR "vitamin D3") AND supplementation AND ("serum levels" OR "25-hydroxyvitamin D" OR "vitamin D status")',
    maxResults: 4,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['Vitamin D, 25-Hydroxy'],
    interventionNames: ['Vitamin D3 5,000 IU daily']
  },
  {
    id: 'vitamin-d-immune',
    description: 'Vitamin D and immune function',
    query: '("vitamin D" OR cholecalciferol) AND ("immune function" OR "immune system" OR inflammation OR "C-reactive protein")',
    maxResults: 3,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis', 'Systematic Review'],
    biomarkerNames: ['Vitamin D, 25-Hydroxy', 'C-Reactive Protein'],
    interventionNames: ['Vitamin D3 5,000 IU daily']
  },

  // ===== THYROID HEALTH =====
  {
    id: 'thyroid-selenium',
    description: 'Selenium for thyroid function',
    query: '(selenium OR selenomethionine) AND (thyroid OR TSH OR "thyroid function" OR "Hashimoto" OR hypothyroid)',
    maxResults: 4,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['TSH', 'Free T3', 'Free T4'],
    interventionNames: ['Selenium supplementation']
  },
  {
    id: 'thyroid-iodine',
    description: 'Iodine and thyroid function',
    query: '(iodine OR "iodine deficiency") AND (thyroid OR TSH OR "thyroid function" OR hypothyroid)',
    maxResults: 3,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis', 'Systematic Review'],
    biomarkerNames: ['TSH', 'Free T3', 'Free T4'],
    interventionNames: ['Iodine supplementation']
  },

  // ===== INFLAMMATION =====
  {
    id: 'crp-lifestyle',
    description: 'Lifestyle interventions for inflammation',
    query: '("C-reactive protein" OR CRP OR inflammation) AND (diet OR exercise OR lifestyle OR "weight loss")',
    maxResults: 4,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['C-Reactive Protein'],
    interventionNames: ['Anti-inflammatory diet', 'Exercise']
  },

  // ===== CHOLESTEROL & LIPIDS =====
  {
    id: 'cholesterol-statins-natural',
    description: 'Natural alternatives for cholesterol',
    query: '(cholesterol OR LDL OR "lipid profile") AND ("red yeast rice" OR bergamot OR "plant sterols" OR policosanol)',
    maxResults: 4,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['Total Cholesterol', 'LDL Cholesterol', 'HDL Cholesterol'],
    interventionNames: ['Red yeast rice', 'Plant sterols']
  },

  // ===== HORMONES =====
  {
    id: 'testosterone-exercise',
    description: 'Exercise and testosterone',
    query: '(testosterone OR "male hormones") AND ("resistance training" OR exercise OR strength OR lifting)',
    maxResults: 3,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['Testosterone'],
    interventionNames: ['Resistance Training']
  },
  {
    id: 'cortisol-stress',
    description: 'Stress management and cortisol',
    query: '(cortisol OR "stress hormones") AND (meditation OR mindfulness OR "stress reduction" OR yoga OR breathing)',
    maxResults: 3,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['Cortisol'],
    interventionNames: ['Stress management', 'Meditation']
  },

  // ===== B VITAMINS =====
  {
    id: 'b12-supplementation',
    description: 'B12 supplementation effectiveness',
    query: '("vitamin B12" OR cobalamin OR methylcobalamin) AND supplementation AND ("serum levels" OR deficiency)',
    maxResults: 3,
    startYear: 2015,
    studyTypes: ['Randomized Controlled Trial', 'Meta-Analysis'],
    biomarkerNames: ['Vitamin B12'],
    interventionNames: ['Vitamin B12 supplementation']
  }
];

/**
 * Get total expected studies from all queries
 */
export function getTotalExpectedStudies(): number {
  return CORE_RESEARCH_QUERIES.reduce((sum, query) => sum + (query.maxResults || 10), 0);
}

/**
 * Get queries by biomarker
 */
export function getQueriesByBiomarker(biomarkerName: string): ResearchQuery[] {
  return CORE_RESEARCH_QUERIES.filter(query =>
    query.biomarkerNames?.some(name =>
      name.toLowerCase().includes(biomarkerName.toLowerCase())
    )
  );
}

/**
 * Get queries by intervention
 */
export function getQueriesByIntervention(interventionName: string): ResearchQuery[] {
  return CORE_RESEARCH_QUERIES.filter(query =>
    query.interventionNames?.some(name =>
      name.toLowerCase().includes(interventionName.toLowerCase())
    )
  );
}
