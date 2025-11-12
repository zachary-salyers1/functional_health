import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

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
    } = await supabase.auth.getUser();

    // Fetch all biomarkers
    const { data: biomarkers, error } = await supabase
      .from('biomarkers')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch biomarkers' },
        { status: 500 }
      );
    }

    // If user is authenticated, fetch their latest values for each biomarker
    if (user) {
      const { data: latestResults } = await supabase
        .from('user_biomarker_results')
        .select(`
          biomarker_id,
          value,
          unit,
          created_at,
          lab_upload_id,
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

      // Map latest values to biomarkers
      const biomarkerMap = new Map();

      if (latestResults) {
        for (const result of latestResults) {
          if (!biomarkerMap.has(result.biomarker_id)) {
            biomarkerMap.set(result.biomarker_id, {
              latest_value: result.value,
              latest_date: result.user_lab_uploads?.lab_date || result.created_at,
              latest_status: result.biomarker_conditions?.severity || 'unknown',
            });
          }
        }
      }

      // Merge latest values with biomarkers
      const enrichedBiomarkers = biomarkers?.map((biomarker) => ({
        ...biomarker,
        ...biomarkerMap.get(biomarker.id),
      }));

      return NextResponse.json({ biomarkers: enrichedBiomarkers });
    }

    return NextResponse.json({ biomarkers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
