/**
 * Script to seed CMP (Comprehensive Metabolic Panel) biomarkers to the database
 * Run with: npx tsx scripts/seed-cmp-biomarkers.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const cmpBiomarkers = [
  {
    name: 'Sodium',
    standard_unit: 'mmol/L',
    category: 'Metabolic',
  },
  {
    name: 'Potassium',
    standard_unit: 'mmol/L',
    category: 'Metabolic',
  },
  {
    name: 'Chloride',
    standard_unit: 'mmol/L',
    category: 'Metabolic',
  },
  {
    name: 'Carbon Dioxide',
    standard_unit: 'mmol/L',
    category: 'Metabolic',
  },
  {
    name: 'Creatinine',
    standard_unit: 'mg/dL',
    category: 'Metabolic',
  },
  {
    name: 'BUN',
    standard_unit: 'mg/dL',
    category: 'Metabolic',
  },
  {
    name: 'Calcium',
    standard_unit: 'mg/dL',
    category: 'Vitamins & Minerals',
  },
  {
    name: 'Albumin',
    standard_unit: 'gm/dL',
    category: 'Metabolic',
  },
  {
    name: 'Total Protein',
    standard_unit: 'gm/dL',
    category: 'Metabolic',
  },
  {
    name: 'Bilirubin',
    standard_unit: 'mg/dL',
    category: 'Metabolic',
  },
  {
    name: 'Anion Gap',
    standard_unit: 'mmol/L',
    category: 'Metabolic',
  },
];

async function seedBiomarkers() {
  console.log('🌱 Seeding CMP biomarkers...\n');

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const biomarker of cmpBiomarkers) {
    // Check if biomarker already exists
    const { data: existing } = await supabase
      .from('biomarkers')
      .select('id, name')
      .eq('name', biomarker.name)
      .single();

    if (existing) {
      console.log(`⏭️  Skipping ${biomarker.name} (already exists)`);
      skipCount++;
      continue;
    }

    // Insert biomarker
    const { error } = await supabase.from('biomarkers').insert(biomarker);

    if (error) {
      console.error(`❌ Error inserting ${biomarker.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Added ${biomarker.name} (${biomarker.standard_unit})`);
      successCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Added: ${successCount}`);
  console.log(`   ⏭️  Skipped: ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${cmpBiomarkers.length}`);
}

// Run the script
seedBiomarkers()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
