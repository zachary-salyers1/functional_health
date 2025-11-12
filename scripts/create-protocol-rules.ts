// Script to create protocol rules for concerning conditions
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createProtocolRules() {
  // Get all concerning/suboptimal conditions
  const { data: conditions, error: condError } = await supabase
    .from('biomarker_conditions')
    .select('id, biomarker_id, condition_name, severity')
    .in('severity', ['concerning', 'suboptimal', 'clinical']);

  if (condError) {
    console.error('Error fetching conditions:', condError);
    return;
  }

  console.log(`Found ${conditions?.length} conditions needing protocol rules`);

  // Get all interventions
  const { data: interventions } = await supabase
    .from('interventions')
    .select('id, name, intervention_type');

  console.log(`Found ${interventions?.length} interventions`);

  // Check existing rules
  const { data: existingRules } = await supabase
    .from('protocol_rules')
    .select('biomarker_condition_id, intervention_id');

  const existingSet = new Set(
    existingRules?.map(r => `${r.biomarker_condition_id}-${r.intervention_id}`) || []
  );

  console.log(`Found ${existingRules?.length} existing protocol rules`);

  // Create some basic rules for common elevated markers
  const rulesToCreate = [];

  // For each concerning condition, add a couple of generic interventions
  for (const condition of conditions || []) {
    // Add basic lifestyle interventions for all concerning conditions
    const stressIntervention = interventions?.find(i => i.name.includes('Stress Management'));
    const exerciseIntervention = interventions?.find(i => i.name.includes('Zone 2'));
    const sleepIntervention = interventions?.find(i => i.name.includes('Sleep Optimization'));

    if (stressIntervention) {
      const key = `${condition.id}-${stressIntervention.id}`;
      if (!existingSet.has(key)) {
        rulesToCreate.push({
          biomarker_condition_id: condition.id,
          intervention_id: stressIntervention.id,
          recommendation_strength: 'secondary',
          priority_order: 2,
          rationale: `Stress management can help improve ${condition.condition_name}`,
          expected_outcome: 'Improved biomarker levels through stress reduction',
          timeframe_days: 60,
          is_active: true
        });
      }
    }

    if (exerciseIntervention && condition.severity === 'concerning') {
      const key = `${condition.id}-${exerciseIntervention.id}`;
      if (!existingSet.has(key)) {
        rulesToCreate.push({
          biomarker_condition_id: condition.id,
          intervention_id: exerciseIntervention.id,
          recommendation_strength: 'primary',
          priority_order: 1,
          rationale: `Regular exercise can help address ${condition.condition_name}`,
          expected_outcome: 'Improved metabolic health and biomarker optimization',
          timeframe_days: 90,
          is_active: true
        });
      }
    }

    if (sleepIntervention) {
      const key = `${condition.id}-${sleepIntervention.id}`;
      if (!existingSet.has(key)) {
        rulesToCreate.push({
          biomarker_condition_id: condition.id,
          intervention_id: sleepIntervention.id,
          recommendation_strength: 'secondary',
          priority_order: 3,
          rationale: `Quality sleep supports recovery and can improve ${condition.condition_name}`,
          expected_outcome: 'Better biomarker levels through improved sleep quality',
          timeframe_days: 60,
          is_active: true
        });
      }
    }
  }

  console.log(`Creating ${rulesToCreate.length} new protocol rules...`);

  if (rulesToCreate.length > 0) {
    const { error: insertError } = await supabase
      .from('protocol_rules')
      .insert(rulesToCreate);

    if (insertError) {
      console.error('Error creating rules:', insertError);
    } else {
      console.log(`✅ Successfully created ${rulesToCreate.length} protocol rules`);
    }
  } else {
    console.log('No new rules to create');
  }
}

createProtocolRules().catch(console.error);
