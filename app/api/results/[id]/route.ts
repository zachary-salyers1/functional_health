import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: uploadId } = await params;

    // Get the session
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

    // Fetch upload record
    const { data: upload, error: uploadError } = await supabase
      .from('user_lab_uploads')
      .select('*')
      .eq('id', uploadId)
      .eq('user_id', user.id)
      .single();

    if (uploadError || !upload) {
      return NextResponse.json(
        { error: 'Upload not found' },
        { status: 404 }
      );
    }

    // Fetch biomarker results with related data
    const { data: results, error: resultsError } = await supabase
      .from('user_biomarker_results')
      .select(`
        id,
        biomarker_id,
        value,
        unit,
        condition_id,
        biomarker:biomarkers (
          name,
          category,
          standard_unit,
          optimal_range_min,
          optimal_range_max,
          clinical_low,
          clinical_high,
          short_description,
          why_it_matters
        ),
        condition:biomarker_conditions!condition_id (
          condition_name,
          severity,
          clinical_significance
        )
      `)
      .eq('lab_upload_id', uploadId)
      .order('biomarker_id');

    if (resultsError) {
      console.error('Results error:', resultsError);
      return NextResponse.json(
        { error: 'Failed to fetch results' },
        { status: 500 }
      );
    }

    // Debug logging
    console.log('Results fetched:', results?.length || 0);
    console.log('Sample result with condition:', results?.[0]);
    const withConditions = results?.filter(r => r.condition) || [];
    console.log(`Results with conditions: ${withConditions.length}/${results?.length || 0}`);

    return NextResponse.json({
      upload,
      results: results || [],
    });
  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
