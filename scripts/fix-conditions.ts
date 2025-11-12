// Script to fix missing condition associations for biomarker results
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixConditions() {
  console.log('Fetching all biomarker results...');

  // Get all biomarker results
  const { data: results, error: resultsError } = await supabase
    .from('user_biomarker_results')
    .select(`
      id,
      biomarker_id,
      value,
      condition_id,
      biomarker:biomarkers (
        name,
        optimal_range_min,
        optimal_range_max,
        clinical_low,
        clinical_high
      )
    `);

  if (resultsError) {
    console.error('Error fetching results:', resultsError);
    return;
  }

  console.log(`Found ${results.length} biomarker results`);

  // Get all conditions
  const { data: conditions, error: conditionsError } = await supabase
    .from('biomarker_conditions')
    .select('*');

  if (conditionsError) {
    console.error('Error fetching conditions:', conditionsError);
    return;
  }

  console.log(`Found ${conditions.length} conditions in database`);

  let fixed = 0;
  let created = 0;

  for (const result of results) {
    if (!result.biomarker) {
      console.log(`Skipping result ${result.id} - no biomarker found`);
      continue;
    }

    const value = parseFloat(result.value);
    const biomarker = result.biomarker;

    // Find matching condition
    const biomarkerConditions = conditions.filter(c => c.biomarker_id === result.biomarker_id);

    let matchedCondition = null;

    // Try to find existing condition that matches this value
    for (const condition of biomarkerConditions) {
      const minMatch = condition.min_value === null || value >= condition.min_value;
      const maxMatch = condition.max_value === null || value <= condition.max_value;

      if (minMatch && maxMatch) {
        matchedCondition = condition;
        break;
      }
    }

    // If no condition matched, create one
    if (!matchedCondition) {
      let severity = 'optimal';
      let conditionName = '';

      if (value >= biomarker.optimal_range_min && value <= biomarker.optimal_range_max) {
        severity = 'optimal';
        conditionName = `Optimal ${biomarker.name}`;
      } else if (value >= biomarker.clinical_low && value <= biomarker.clinical_high) {
        severity = 'suboptimal';
        conditionName = value < biomarker.optimal_range_min ? 'Below Optimal' : 'Elevated Normal';
      } else {
        severity = 'concerning';
        conditionName = value < biomarker.clinical_low ? 'Deficient' : 'Elevated';
      }

      console.log(`Creating condition for ${biomarker.name} (value: ${value}, severity: ${severity})`);

      const { data: newCondition, error: createError } = await supabase
        .from('biomarker_conditions')
        .insert({
          biomarker_id: result.biomarker_id,
          condition_name: conditionName,
          severity,
          min_value: severity === 'optimal' ? biomarker.optimal_range_min :
                     (value < biomarker.optimal_range_min ? biomarker.clinical_low : biomarker.optimal_range_max),
          max_value: severity === 'optimal' ? biomarker.optimal_range_max :
                     (value < biomarker.optimal_range_min ? biomarker.optimal_range_min : biomarker.clinical_high),
          priority_score: severity === 'concerning' ? 80 : severity === 'suboptimal' ? 50 : 30,
        })
        .select()
        .single();

      if (createError) {
        console.error(`Error creating condition:`, createError);
        continue;
      }

      matchedCondition = newCondition;
      conditions.push(newCondition);
      created++;
    }

    // Update the result if condition changed
    if (matchedCondition && result.condition_id !== matchedCondition.id) {
      console.log(`Updating result ${result.id} with condition ${matchedCondition.id} (${matchedCondition.condition_name})`);

      const { error: updateError } = await supabase
        .from('user_biomarker_results')
        .update({ condition_id: matchedCondition.id })
        .eq('id', result.id);

      if (updateError) {
        console.error(`Error updating result:`, updateError);
      } else {
        fixed++;
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`- Created ${created} new conditions`);
  console.log(`- Fixed ${fixed} biomarker results`);
  console.log(`Done!`);
}

fixConditions().catch(console.error);
