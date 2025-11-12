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

    // 2. Get all protocol recommendations with full intervention details
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

    // 3. Update last_viewed_at timestamp
    await supabase
      .from('generated_protocols')
      .update({ last_viewed_at: new Date().toISOString() })
      .eq('id', protocol_id);

    // 4. Group recommendations by type for better UX
    const groupedRecommendations = {
      dietary: recommendations.filter(r => r.interventions?.intervention_type === 'dietary'),
      supplement: recommendations.filter(r => r.interventions?.intervention_type === 'supplement'),
      lifestyle: recommendations.filter(r => r.interventions?.intervention_type === 'lifestyle'),
      exercise: recommendations.filter(r => r.interventions?.intervention_type === 'exercise'),
      sleep: recommendations.filter(r => r.interventions?.intervention_type === 'sleep')
    };

    // 5. Return comprehensive protocol data
    return NextResponse.json({
      protocol: {
        ...protocol,
        total_recommendations: recommendations.length,
        recommendations_by_type: {
          dietary: groupedRecommendations.dietary.length,
          supplement: groupedRecommendations.supplement.length,
          lifestyle: groupedRecommendations.lifestyle.length,
          exercise: groupedRecommendations.exercise.length,
          sleep: groupedRecommendations.sleep.length
        }
      },
      recommendations,
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
