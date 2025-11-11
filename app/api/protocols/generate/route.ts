import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * POST /api/protocols/generate
 * Generates a personalized protocol based on lab upload results
 *
 * Body: { lab_upload_id: string }
 * Returns: { protocol_id: string, total_interventions: number }
 */
export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { lab_upload_id } = await request.json();

    if (!lab_upload_id) {
      return NextResponse.json(
        { error: 'lab_upload_id is required' },
        { status: 400 }
      );
    }

    // 1. Verify user owns this lab upload
    const { data: upload, error: uploadError } = await supabase
      .from('user_lab_uploads')
      .select('id, user_id')
      .eq('id', lab_upload_id)
      .single();

    if (uploadError || !upload) {
      return NextResponse.json(
        { error: 'Lab upload not found' },
        { status: 404 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== upload.user_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 2. Get all suboptimal/concerning biomarker results for this upload
    const { data: biomarkerResults, error: resultsError } = await supabase
      .from('user_biomarker_results')
      .select(`
        id,
        value,
        unit,
        condition_id,
        biomarker_id,
        biomarker_conditions!condition_id (
          id,
          condition_name,
          severity,
          biomarker_id
        )
      `)
      .eq('lab_upload_id', lab_upload_id)
      .in('biomarker_conditions.severity', ['suboptimal', 'concerning', 'clinical']);

    if (resultsError) {
      console.error('Error fetching biomarker results:', resultsError);
      return NextResponse.json(
        { error: 'Failed to fetch biomarker results' },
        { status: 500 }
      );
    }

    if (!biomarkerResults || biomarkerResults.length === 0) {
      return NextResponse.json(
        { error: 'No suboptimal markers found - all biomarkers are optimal!' },
        { status: 200 }
      );
    }

    // 3. Get applicable protocol rules for these conditions
    const conditionIds = biomarkerResults
      .map(r => r.condition_id)
      .filter(Boolean);

    const { data: protocolRules, error: rulesError } = await supabase
      .from('protocol_rules')
      .select(`
        id,
        biomarker_condition_id,
        intervention_id,
        recommendation_strength,
        priority_order,
        rationale,
        expected_outcome,
        timeframe_days,
        interventions (
          id,
          intervention_type,
          name,
          short_description,
          how_to_implement,
          dosage_info,
          frequency,
          timing,
          brand_recommendations,
          expected_outcome,
          typical_duration_days,
          difficulty_level,
          estimated_cost,
          contraindications,
          warnings
        )
      `)
      .in('biomarker_condition_id', conditionIds)
      .eq('is_active', true)
      .order('recommendation_strength', { ascending: true }) // primary first
      .order('priority_order', { ascending: true });

    if (rulesError) {
      console.error('Error fetching protocol rules:', rulesError);
      return NextResponse.json(
        { error: 'Failed to fetch protocol rules' },
        { status: 500 }
      );
    }

    if (!protocolRules || protocolRules.length === 0) {
      return NextResponse.json(
        { error: 'No protocol rules found for these conditions' },
        { status: 404 }
      );
    }

    // 4. Deduplicate interventions (same intervention may apply to multiple markers)
    const interventionMap = new Map();
    const strengthOrder = { primary: 1, secondary: 2, optional: 3 };

    for (const rule of protocolRules) {
      const interventionId = rule.intervention_id;
      const existing = interventionMap.get(interventionId);

      // Keep the highest priority (primary > secondary > optional)
      if (!existing || strengthOrder[rule.recommendation_strength] < strengthOrder[existing.recommendation_strength]) {
        interventionMap.set(interventionId, {
          ...rule,
          biomarker_result_ids: [biomarkerResults.find(r => r.condition_id === rule.biomarker_condition_id)?.id].filter(Boolean)
        });
      } else {
        // Same intervention applies to multiple markers - track all
        existing.biomarker_result_ids.push(
          biomarkerResults.find(r => r.condition_id === rule.biomarker_condition_id)?.id
        );
      }
    }

    const deduplicatedRules = Array.from(interventionMap.values());

    // 5. Prioritize and limit to 8-10 interventions
    const sortedRules = deduplicatedRules.sort((a, b) => {
      // Sort by strength first, then priority_order
      if (strengthOrder[a.recommendation_strength] !== strengthOrder[b.recommendation_strength]) {
        return strengthOrder[a.recommendation_strength] - strengthOrder[b.recommendation_strength];
      }
      return a.priority_order - b.priority_order;
    });

    const finalRules = sortedRules.slice(0, 10); // Limit to top 10

    // 6. Calculate protocol metadata
    const primaryCount = finalRules.filter(r => r.recommendation_strength === 'primary').length;
    const concerningCount = biomarkerResults.filter(r => r.biomarker_conditions?.severity === 'concerning').length;

    let priorityFocus = 'Metabolic Health Optimization';
    if (concerningCount > 0) {
      priorityFocus = 'Urgent Health Optimization';
    } else if (primaryCount >= 3) {
      priorityFocus = 'Comprehensive Health Optimization';
    }

    // Calculate average duration
    const avgDuration = Math.round(
      finalRules.reduce((sum, r) => sum + (r.timeframe_days || 90), 0) / finalRules.length
    );

    // Calculate retest date (typically 90 days from now)
    const retestDate = new Date();
    retestDate.setDate(retestDate.getDate() + 90);

    // 7. Create generated_protocol record
    const { data: protocol, error: protocolError } = await supabase
      .from('generated_protocols')
      .insert({
        user_id: user.id,
        lab_upload_id,
        protocol_name: `${priorityFocus} - ${new Date().toLocaleDateString()}`,
        priority_focus: priorityFocus,
        estimated_duration_days: avgDuration,
        retest_recommended_date: retestDate.toISOString().split('T')[0],
        status: 'active',
        total_interventions: finalRules.length,
        generation_method: 'rule_based',
        generation_version: '1.0'
      })
      .select()
      .single();

    if (protocolError) {
      console.error('Error creating protocol:', protocolError);
      return NextResponse.json(
        { error: 'Failed to create protocol' },
        { status: 500 }
      );
    }

    // 8. Create protocol_recommendations for each intervention
    const recommendations = finalRules.map((rule, index) => ({
      protocol_id: protocol.id,
      protocol_rule_id: rule.id,
      intervention_id: rule.intervention_id,
      biomarker_result_id: rule.biomarker_result_ids[0], // Link to primary biomarker
      priority_order: index + 1,
      recommendation_strength: rule.recommendation_strength,
      custom_rationale: rule.rationale,
      expected_outcome: rule.expected_outcome,
      estimated_timeframe_days: rule.timeframe_days,
      status: 'not_started'
    }));

    const { error: recommendationsError } = await supabase
      .from('protocol_recommendations')
      .insert(recommendations);

    if (recommendationsError) {
      console.error('Error creating recommendations:', recommendationsError);
      return NextResponse.json(
        { error: 'Failed to create recommendations' },
        { status: 500 }
      );
    }

    // 9. Return success with protocol details
    return NextResponse.json({
      success: true,
      protocol_id: protocol.id,
      protocol_name: protocol.protocol_name,
      total_interventions: finalRules.length,
      breakdown: {
        primary: finalRules.filter(r => r.recommendation_strength === 'primary').length,
        secondary: finalRules.filter(r => r.recommendation_strength === 'secondary').length,
        optional: finalRules.filter(r => r.recommendation_strength === 'optional').length
      },
      retest_date: protocol.retest_recommended_date
    });

  } catch (error) {
    console.error('Protocol generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
