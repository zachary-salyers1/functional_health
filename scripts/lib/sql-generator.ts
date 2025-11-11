/**
 * SQL Generation Utilities
 * Generates SQL INSERT statements for research studies
 */

import type { AnalyzedStudy } from './claude-analyzer';

/**
 * Generate SQL INSERT statement for a research study
 */
export function generateStudyInsert(study: AnalyzedStudy): string {
  const escapeSql = (str: string | null | undefined): string => {
    if (!str) return 'NULL';
    return `'${str.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
  };

  const escapeArray = (arr: string[]): string => {
    if (!arr || arr.length === 0) return 'ARRAY[]::VARCHAR[]';
    const escaped = arr.map(item => escapeSql(item).replace(/^'|'$/g, ''));
    return `ARRAY[${escaped.map(s => `'${s}'`).join(', ')}]::VARCHAR[]`;
  };

  const sql = `
-- Study: ${study.title}
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
  ${escapeSql(study.pmid)},
  ${escapeSql(study.doi)},
  ${escapeSql(study.title)},
  ${escapeSql(study.authors)},
  ${escapeSql(study.journal)},
  ${study.publicationYear},
  ${escapeSql(study.url)},
  ${escapeSql(study.studyType)},
  ${study.qualityScore},
  ${study.sampleSize !== null && study.sampleSize !== undefined ? study.sampleSize : 'NULL'},
  ${study.durationWeeks !== null && study.durationWeeks !== undefined ? study.durationWeeks : 'NULL'},
  ${escapeSql(study.populationDescription)},
  ${escapeSql(study.keyFindings)},
  ${escapeSql(study.statisticalSignificance)},
  ${escapeSql(study.limitations)},
  ${escapeArray(study.relevantBiomarkers)},
  ${escapeArray(study.relevantInterventions)},
  TRUE
)
ON CONFLICT (pubmed_id) DO UPDATE SET
  quality_score = EXCLUDED.quality_score,
  key_findings = EXCLUDED.key_findings,
  updated_at = NOW();
`.trim();

  return sql;
}

/**
 * Generate complete SQL migration file
 */
export function generateMigrationFile(studies: AnalyzedStudy[]): string {
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const filename = `${timestamp}_seed_research_studies.sql`;

  const header = `-- Research Studies Seeding Migration
-- Generated: ${new Date().toISOString()}
-- Total Studies: ${studies.length}
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

-- Insert research studies
`;

  const inserts = studies.map(study => generateStudyInsert(study)).join('\n\n');

  const footer = `

-- Summary
-- ========
-- Total studies inserted: ${studies.length}
-- By study type:
${generateStudyTypeSummary(studies)}
--
-- By quality score:
${generateQualityScoreSummary(studies)}
--
-- By biomarker (top 10):
${generateBiomarkerSummary(studies)}
--
-- By intervention (top 10):
${generateInterventionSummary(studies)}
`;

  return `${header}\n${inserts}\n${footer}`;
}

/**
 * Generate study type summary
 */
function generateStudyTypeSummary(studies: AnalyzedStudy[]): string {
  const counts = new Map<string, number>();

  for (const study of studies) {
    const type = study.studyType;
    counts.set(type, (counts.get(type) || 0) + 1);
  }

  const lines: string[] = [];
  for (const [type, count] of Array.from(counts.entries()).sort((a, b) => b[1] - a[1])) {
    lines.push(`--   ${type}: ${count}`);
  }

  return lines.join('\n');
}

/**
 * Generate quality score summary
 */
function generateQualityScoreSummary(studies: AnalyzedStudy[]): string {
  const ranges = {
    '9-10 (Excellent)': 0,
    '7-8 (Good)': 0,
    '5-6 (Fair)': 0,
    '1-4 (Poor)': 0
  };

  for (const study of studies) {
    const score = study.qualityScore;
    if (score >= 9) ranges['9-10 (Excellent)']++;
    else if (score >= 7) ranges['7-8 (Good)']++;
    else if (score >= 5) ranges['5-6 (Fair)']++;
    else ranges['1-4 (Poor)']++;
  }

  return Object.entries(ranges)
    .map(([range, count]) => `--   ${range}: ${count}`)
    .join('\n');
}

/**
 * Generate biomarker summary
 */
function generateBiomarkerSummary(studies: AnalyzedStudy[]): string {
  const counts = new Map<string, number>();

  for (const study of studies) {
    for (const biomarker of study.relevantBiomarkers) {
      const normalized = biomarker.toLowerCase();
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([biomarker, count]) => `--   ${biomarker}: ${count} studies`)
    .join('\n');
}

/**
 * Generate intervention summary
 */
function generateInterventionSummary(studies: AnalyzedStudy[]): string {
  const counts = new Map<string, number>();

  for (const study of studies) {
    for (const intervention of study.relevantInterventions) {
      const normalized = intervention.toLowerCase();
      counts.set(normalized, (counts.get(normalized) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([intervention, count]) => `--   ${intervention}: ${count} studies`)
    .join('\n');
}

/**
 * Generate JSON output for review
 */
export function generateJsonOutput(studies: AnalyzedStudy[]): string {
  return JSON.stringify(studies, null, 2);
}

/**
 * Generate markdown summary for review
 */
export function generateMarkdownSummary(studies: AnalyzedStudy[]): string {
  let md = `# Research Studies Summary\n\n`;
  md += `**Total Studies:** ${studies.length}\n`;
  md += `**Generated:** ${new Date().toISOString()}\n\n`;

  md += `## Studies by Quality\n\n`;

  const byQuality = [...studies].sort((a, b) => b.qualityScore - a.qualityScore);

  for (const study of byQuality) {
    md += `### [${study.qualityScore}/10] ${study.title}\n\n`;
    md += `**Authors:** ${study.authors}  \n`;
    md += `**Journal:** ${study.journal} (${study.publicationYear})  \n`;
    md += `**Type:** ${study.studyType}  \n`;
    md += `**PubMed:** [${study.pmid}](${study.url})  \n\n`;
    md += `**Key Findings:** ${study.keyFindings}\n\n`;
    md += `**Biomarkers:** ${study.relevantBiomarkers.join(', ')}  \n`;
    md += `**Interventions:** ${study.relevantInterventions.join(', ')}  \n\n`;
    md += `---\n\n`;
  }

  return md;
}
