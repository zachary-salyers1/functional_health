import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/biomarkers/:id/ranges
 * Updates optimal ranges for a biomarker
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: biomarkerId } = await params;
    const { optimal_range_min, optimal_range_max } = await request.json();

    if (optimal_range_min === undefined || optimal_range_max === undefined) {
      return NextResponse.json(
        { error: 'Both optimal_range_min and optimal_range_max are required' },
        { status: 400 }
      );
    }

    if (optimal_range_min >= optimal_range_max) {
      return NextResponse.json(
        { error: 'Optimal min must be less than optimal max' },
        { status: 400 }
      );
    }

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

    // Update the biomarker ranges
    const { data: biomarker, error: updateError } = await supabase
      .from('biomarkers')
      .update({
        optimal_range_min,
        optimal_range_max,
        updated_at: new Date().toISOString(),
      })
      .eq('id', biomarkerId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating biomarker ranges:', updateError);
      return NextResponse.json(
        { error: 'Failed to update ranges' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      biomarker,
    });
  } catch (error) {
    console.error('Update ranges error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
