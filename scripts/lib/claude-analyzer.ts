/**
 * Claude API Client for Research Study Analysis
 * Uses Anthropic Claude API to extract structured data from research abstracts
 */

import Anthropic from '@anthropic-ai/sdk';
import type { PubMedArticle } from './pubmed-client';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export interface AnalyzedStudy {
  // Original PubMed data
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  publicationYear: number;
  doi?: string;
  url: string;

  // AI-extracted data
  studyType: string;
  qualityScore: number;
  sampleSize: number | null;
  durationWeeks: number | null;
  populationDescription: string;
  keyFindings: string;
  statisticalSignificance: string;
  limitations: string;
  relevantBiomarkers: string[];
  relevantInterventions: string[];
}

/**
 * Analyze a research study using Claude API
 */
export async function analyzeStudy(article: PubMedArticle): Promise<AnalyzedStudy | null> {
  console.log(`🤖 Analyzing: ${article.title.substring(0, 60)}...`);

  const prompt = `You are a medical research analyst. Analyze this research study and extract structured information.

STUDY DETAILS:
Title: ${article.title}
Journal: ${article.journal}
Publication Year: ${article.publicationYear}
Abstract: ${article.abstract}

Extract the following information in JSON format:

{
  "studyType": "<RCT|meta-analysis|systematic_review|cohort|case-control|observational|review>",
  "qualityScore": <1-10, where 10 is highest quality. RCTs and meta-analyses typically 7-10, observational 4-6>,
  "sampleSize": <number of participants, or null if not mentioned>,
  "durationWeeks": <study duration in weeks, or null if not mentioned>,
  "populationDescription": "<brief description of study population: age, sex, health status>",
  "keyFindings": "<1-2 sentences summarizing the main results and effect sizes>",
  "statisticalSignificance": "<brief note on p-values, confidence intervals, or effect sizes>",
  "limitations": "<1-2 sentences on study limitations, conflicts of interest, or caveats>",
  "relevantBiomarkers": ["<list of biomarkers measured or affected>"],
  "relevantInterventions": ["<list of interventions tested>"]
}

Guidelines:
- For studyType, choose the most specific type that applies
- For qualityScore, consider: sample size, study design, randomization, blinding, statistical rigor
- For keyFindings, be specific about magnitudes (e.g., "reduced glucose by 15 mg/dL")
- For relevantBiomarkers, use standard names: glucose, HbA1c, vitamin D, cholesterol, triglycerides, insulin, TSH, etc.
- For relevantInterventions, use descriptive names: vitamin D supplementation, low-carb diet, berberine, exercise, etc.
- Be conservative with qualityScore - only give 9-10 to exceptional studies

Return ONLY the JSON object, no other text.`;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022', // Using Haiku for speed and cost efficiency
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Parse JSON response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('   ❌ Failed to extract JSON from Claude response');
      return null;
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Combine with original article data
    const analyzedStudy: AnalyzedStudy = {
      pmid: article.pmid,
      title: article.title,
      authors: article.authors.slice(0, 3).join(', ') + (article.authors.length > 3 ? ' et al.' : ''),
      journal: article.journal,
      publicationYear: article.publicationYear,
      doi: article.doi,
      url: `https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`,

      studyType: analysis.studyType || 'observational',
      qualityScore: analysis.qualityScore || 5,
      sampleSize: analysis.sampleSize,
      durationWeeks: analysis.durationWeeks,
      populationDescription: analysis.populationDescription || 'Not specified',
      keyFindings: analysis.keyFindings || '',
      statisticalSignificance: analysis.statisticalSignificance || 'Not specified',
      limitations: analysis.limitations || 'Not specified',
      relevantBiomarkers: analysis.relevantBiomarkers || [],
      relevantInterventions: analysis.relevantInterventions || []
    };

    console.log(`   ✅ Quality Score: ${analyzedStudy.qualityScore}/10 | Type: ${analyzedStudy.studyType}`);

    return analyzedStudy;

  } catch (error) {
    console.error(`   ❌ Error analyzing study:`, error);
    return null;
  }
}

/**
 * Analyze multiple studies in batch (with rate limiting)
 */
export async function analyzeStudies(
  articles: PubMedArticle[],
  delayMs: number = 1000
): Promise<AnalyzedStudy[]> {
  const analyzedStudies: AnalyzedStudy[] = [];

  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    console.log(`\n[${i + 1}/${articles.length}]`);

    const analyzed = await analyzeStudy(article);

    if (analyzed) {
      analyzedStudies.push(analyzed);
    }

    // Rate limiting - be respectful to Claude API
    if (i < articles.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return analyzedStudies;
}

/**
 * Filter studies by quality threshold
 */
export function filterByQuality(
  studies: AnalyzedStudy[],
  minQualityScore: number = 6
): AnalyzedStudy[] {
  return studies.filter(study => study.qualityScore >= minQualityScore);
}

/**
 * Group studies by biomarker
 */
export function groupByBiomarker(studies: AnalyzedStudy[]): Map<string, AnalyzedStudy[]> {
  const grouped = new Map<string, AnalyzedStudy[]>();

  for (const study of studies) {
    for (const biomarker of study.relevantBiomarkers) {
      const normalized = biomarker.toLowerCase();
      if (!grouped.has(normalized)) {
        grouped.set(normalized, []);
      }
      grouped.get(normalized)!.push(study);
    }
  }

  return grouped;
}

/**
 * Group studies by intervention
 */
export function groupByIntervention(studies: AnalyzedStudy[]): Map<string, AnalyzedStudy[]> {
  const grouped = new Map<string, AnalyzedStudy[]>();

  for (const study of studies) {
    for (const intervention of study.relevantInterventions) {
      const normalized = intervention.toLowerCase();
      if (!grouped.has(normalized)) {
        grouped.set(normalized, []);
      }
      grouped.get(normalized)!.push(study);
    }
  }

  return grouped;
}
