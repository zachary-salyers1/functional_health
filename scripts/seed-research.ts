#!/usr/bin/env tsx

/**
 * Research Database Seeding Script
 *
 * This script:
 * 1. Queries PubMed for research studies on biomarkers and interventions
 * 2. Uses Claude AI to analyze and extract structured data
 * 3. Generates SQL migration file to seed the database
 *
 * Usage:
 *   npm run seed:research
 *   or
 *   tsx scripts/seed-research.ts
 *
 * Environment Variables Required:
 *   ANTHROPIC_API_KEY - Your Claude API key
 */

import * as fs from 'fs';
import * as path from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.resolve(__dirname, '../.env.local') });

import { searchAndFetchArticles, type PubMedArticle } from './lib/pubmed-client';
import { analyzeStudies, filterByQuality, type AnalyzedStudy } from './lib/claude-analyzer';
import { CORE_RESEARCH_QUERIES, getTotalExpectedStudies } from './lib/research-queries';
import {
  generateMigrationFile,
  generateJsonOutput,
  generateMarkdownSummary
} from './lib/sql-generator';

// Configuration
const OUTPUT_DIR = path.join(process.cwd(), 'scripts', 'output');
const MIN_QUALITY_SCORE = 6; // Only include studies with quality score >= 6

/**
 * Main seeding function
 */
async function seedResearchDatabase() {
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   Research Database Seeding Pipeline                    ║');
  console.log('║   Powered by PubMed + Claude AI                         ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');

  // Validate API key
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('❌ Error: ANTHROPIC_API_KEY environment variable not set');
    console.error('   Please add your Claude API key to .env file');
    process.exit(1);
  }

  console.log(`📊 Total Queries: ${CORE_RESEARCH_QUERIES.length}`);
  console.log(`🎯 Expected Studies: ~${getTotalExpectedStudies()}`);
  console.log(`⭐ Quality Threshold: ${MIN_QUALITY_SCORE}/10\n`);

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Phase 1: Fetch studies from PubMed
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📚 PHASE 1: Fetching Studies from PubMed\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const allArticles: PubMedArticle[] = [];
  const queryResults = new Map<string, PubMedArticle[]>();

  for (let i = 0; i < CORE_RESEARCH_QUERIES.length; i++) {
    const query = CORE_RESEARCH_QUERIES[i];

    console.log(`\n[Query ${i + 1}/${CORE_RESEARCH_QUERIES.length}] ${query.description}`);
    console.log(`ID: ${query.id}`);

    try {
      const articles = await searchAndFetchArticles(query);
      queryResults.set(query.id, articles);
      allArticles.push(...articles);

      // Rate limiting - be respectful to NCBI
      if (i < CORE_RESEARCH_QUERIES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`   ❌ Error fetching query ${query.id}:`, error);
    }
  }

  // Remove duplicates (same PMID)
  const uniqueArticles = Array.from(
    new Map(allArticles.map(article => [article.pmid, article])).values()
  );

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Phase 1 Complete: ${uniqueArticles.length} unique articles fetched`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Save raw articles for reference
  const articlesJson = JSON.stringify(uniqueArticles, null, 2);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'articles-raw.json'),
    articlesJson
  );
  console.log(`💾 Saved raw articles to: scripts/output/articles-raw.json\n`);

  // Phase 2: Analyze with Claude
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('🤖 PHASE 2: Analyzing Studies with Claude AI\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const analyzedStudies = await analyzeStudies(uniqueArticles, 1500); // 1.5 second delay between calls

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`✅ Phase 2 Complete: ${analyzedStudies.length} studies analyzed`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Filter by quality
  const highQualityStudies = filterByQuality(analyzedStudies, MIN_QUALITY_SCORE);

  console.log(`\n📊 Quality Filtering:`);
  console.log(`   Total analyzed: ${analyzedStudies.length}`);
  console.log(`   High quality (≥${MIN_QUALITY_SCORE}/10): ${highQualityStudies.length}`);
  console.log(`   Filtered out: ${analyzedStudies.length - highQualityStudies.length}\n`);

  // Phase 3: Generate outputs
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📝 PHASE 3: Generating Output Files\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Generate SQL migration
  const sqlMigration = generateMigrationFile(highQualityStudies);
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
  const sqlFilename = `${timestamp}_seed_research_studies.sql`;
  fs.writeFileSync(
    path.join(OUTPUT_DIR, sqlFilename),
    sqlMigration
  );
  console.log(`✅ SQL migration: scripts/output/${sqlFilename}`);

  // Generate JSON for review
  const jsonOutput = generateJsonOutput(highQualityStudies);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'studies-analyzed.json'),
    jsonOutput
  );
  console.log(`✅ JSON output: scripts/output/studies-analyzed.json`);

  // Generate Markdown summary
  const markdownSummary = generateMarkdownSummary(highQualityStudies);
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'studies-summary.md'),
    markdownSummary
  );
  console.log(`✅ Markdown summary: scripts/output/studies-summary.md`);

  // Phase 4: Summary Statistics
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('📊 SUMMARY STATISTICS\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log(`Total Studies: ${highQualityStudies.length}\n`);

  // Study types
  const studyTypes = new Map<string, number>();
  for (const study of highQualityStudies) {
    studyTypes.set(study.studyType, (studyTypes.get(study.studyType) || 0) + 1);
  }
  console.log('By Study Type:');
  for (const [type, count] of Array.from(studyTypes.entries()).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${type}: ${count}`);
  }

  // Quality distribution
  const qualityRanges = {
    '9-10': 0,
    '7-8': 0,
    '6': 0
  };
  for (const study of highQualityStudies) {
    if (study.qualityScore >= 9) qualityRanges['9-10']++;
    else if (study.qualityScore >= 7) qualityRanges['7-8']++;
    else qualityRanges['6']++;
  }
  console.log('\nBy Quality Score:');
  console.log(`  9-10 (Excellent): ${qualityRanges['9-10']}`);
  console.log(`  7-8 (Good): ${qualityRanges['7-8']}`);
  console.log(`  6 (Fair): ${qualityRanges['6']}`);

  // Top biomarkers
  const biomarkerCounts = new Map<string, number>();
  for (const study of highQualityStudies) {
    for (const biomarker of study.relevantBiomarkers) {
      const normalized = biomarker.toLowerCase();
      biomarkerCounts.set(normalized, (biomarkerCounts.get(normalized) || 0) + 1);
    }
  }
  console.log('\nTop Biomarkers:');
  Array.from(biomarkerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([biomarker, count]) => {
      console.log(`  ${biomarker}: ${count} studies`);
    });

  // Top interventions
  const interventionCounts = new Map<string, number>();
  for (const study of highQualityStudies) {
    for (const intervention of study.relevantInterventions) {
      const normalized = intervention.toLowerCase();
      interventionCounts.set(normalized, (interventionCounts.get(normalized) || 0) + 1);
    }
  }
  console.log('\nTop Interventions:');
  Array.from(interventionCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([intervention, count]) => {
      console.log(`  ${intervention}: ${count} studies`);
    });

  // Final instructions
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✨ NEXT STEPS\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('1. Review the generated files in scripts/output/');
  console.log('2. Check studies-summary.md for a readable overview');
  console.log('3. Review the SQL migration file');
  console.log('4. If satisfied, copy the SQL file to supabase/migrations/');
  console.log('5. Run the migration to seed your database\n');

  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║   ✅ Pipeline Complete!                                  ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
}

// Run the script
if (require.main === module) {
  seedResearchDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Fatal Error:', error);
      process.exit(1);
    });
}

export { seedResearchDatabase };
