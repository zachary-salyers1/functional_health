import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/protocols/:id
 * Retrieves a generated protocol with all recommendations
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: protocol_id } = await params;
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      }
    );

    // 1. Get protocol and verify ownership
    const { data: protocol, error: protocolError } = await supabase
      .from('generated_protocols')
      .select('*')
      .eq('id', protocol_id)
      .single();

    if (protocolError || !protocol) {
      return NextResponse.json(
        { error: 'Protocol not found' },
        { status: 404 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== protocol.user_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 2. Get all protocol recommendations with full intervention details and research studies
    const { data: recommendations, error: recommendationsError } = await supabase
      .from('protocol_recommendations')
      .select(`
        *,
        interventions (
          id,
          intervention_type,
          name,
          short_description,
          detailed_description,
          how_to_implement,
          dosage_info,
          frequency,
          timing,
          brand_recommendations,
          expected_outcome,
          typical_duration_days,
          expected_improvement_percentage,
          difficulty_level,
          estimated_cost,
          contraindications,
          warnings
        ),
        user_biomarker_results (
          id,
          value,
          unit,
          biomarkers (
            id,
            name,
            category
          )
        )
      `)
      .eq('protocol_id', protocol_id)
      .order('priority_order', { ascending: true });

    if (recommendationsError) {
      console.error('Error fetching recommendations:', recommendationsError);
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      );
    }

    // 2b. Fetch research studies for each recommendation
    const recommendationIds = recommendations?.map(r => r.id) || [];
    let studiesByRecommendation: Record<string, any[]> = {};

    if (recommendationIds.length > 0) {
      const { data: recStudies, error: studiesError } = await supabase
        .from('protocol_recommendation_studies')
        .select(`
          recommendation_id,
          research_study_id,
          display_order,
          research_studies (
            id,
            title,
            authors,
            journal,
            publication_year,
            pubmed_id,
            doi,
            url,
            study_type,
            quality_score,
            sample_size,
            duration_weeks,
            key_findings,
            statistical_significance
          )
        `)
        .in('recommendation_id', recommendationIds)
        .order('display_order', { ascending: true });

      if (!studiesError && recStudies) {
        // Group studies by recommendation_id
        recStudies.forEach((rs: any) => {
          if (!studiesByRecommendation[rs.recommendation_id]) {
            studiesByRecommendation[rs.recommendation_id] = [];
          }
          studiesByRecommendation[rs.recommendation_id].push(rs.research_studies);
        });
      }
    }

    // Add research studies to each recommendation
    const recommendationsWithStudies = recommendations?.map(rec => ({
      ...rec,
      research_studies: studiesByRecommendation[rec.id] || []
    }));

    // 3. Update last_viewed_at timestamp
    await supabase
      .from('generated_protocols')
      .update({ last_viewed_at: new Date().toISOString() })
      .eq('id', protocol_id);

    // 4. Group recommendations by type for better UX
    const groupedRecommendations = {
      dietary: recommendationsWithStudies.filter(r => r.interventions?.intervention_type === 'dietary'),
      supplement: recommendationsWithStudies.filter(r => r.interventions?.intervention_type === 'supplement'),
      lifestyle: recommendationsWithStudies.filter(r => r.interventions?.intervention_type === 'lifestyle'),
      exercise: recommendationsWithStudies.filter(r => r.interventions?.intervention_type === 'exercise'),
      sleep: recommendationsWithStudies.filter(r => r.interventions?.intervention_type === 'sleep')
    };

    // 5. Return comprehensive protocol data
    return NextResponse.json({
      protocol: {
        ...protocol,
        total_recommendations: recommendationsWithStudies.length,
        recommendations_by_type: {
          dietary: groupedRecommendations.dietary.length,
          supplement: groupedRecommendations.supplement.length,
          lifestyle: groupedRecommendations.lifestyle.length,
          exercise: groupedRecommendations.exercise.length,
          sleep: groupedRecommendations.sleep.length
        }
      },
      recommendations: recommendationsWithStudies,
      grouped_recommendations: groupedRecommendations
    });

  } catch (error) {
    console.error('Error fetching protocol:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
