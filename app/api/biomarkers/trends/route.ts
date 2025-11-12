import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/biomarkers/trends
 * Retrieves historical data for all biomarkers for the authenticated user
 */
export async function GET() {
  try {
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

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all biomarker results for the user with biomarker details
    const { data: results, error: resultsError } = await supabase
      .from('user_biomarker_results')
      .select(`
        biomarker_id,
        value,
        unit,
        created_at,
        biomarkers (
          name,
          standard_unit,
          optimal_range_min,
          optimal_range_max,
          clinical_low,
          clinical_high
        ),
        user_lab_uploads!inner (
          user_id,
          lab_date
        ),
        biomarker_conditions!condition_id (
          severity
        )
      `)
      .eq('user_lab_uploads.user_id', user.id)
      .order('created_at', { ascending: false });

    if (resultsError) {
      console.error('Error fetching trends:', resultsError);
      return NextResponse.json(
        { error: 'Failed to fetch trends' },
        { status: 500 }
      );
    }

    // Group results by biomarker
    const trendsByBiomarker = new Map();

    for (const result of results || []) {
      if (!result.biomarkers) continue;

      if (!trendsByBiomarker.has(result.biomarker_id)) {
        trendsByBiomarker.set(result.biomarker_id, {
          biomarker_id: result.biomarker_id,
          biomarker_name: result.biomarkers.name,
          standard_unit: result.biomarkers.standard_unit,
          optimal_range_min: result.biomarkers.optimal_range_min,
          optimal_range_max: result.biomarkers.optimal_range_max,
          clinical_low: result.biomarkers.clinical_low,
          clinical_high: result.biomarkers.clinical_high,
          results: [],
        });
      }

      trendsByBiomarker.get(result.biomarker_id).results.push({
        value: parseFloat(result.value),
        lab_date: result.user_lab_uploads?.lab_date || result.created_at,
        severity: result.biomarker_conditions?.severity || 'unknown',
      });
    }

    // Convert map to array and filter biomarkers with at least 1 result
    const trends = Array.from(trendsByBiomarker.values())
      .filter((trend) => trend.results.length > 0)
      .sort((a, b) => a.biomarker_name.localeCompare(b.biomarker_name));

    return NextResponse.json({ trends });
  } catch (error) {
    console.error('Get trends error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
