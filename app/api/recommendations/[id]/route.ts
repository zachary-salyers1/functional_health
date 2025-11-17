import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/recommendations/:id
 * Updates the status of a specific recommendation
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: recommendationId } = await params;
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

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status
    const validStatuses = ['pending', 'started', 'completed', 'skipped'];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: pending, started, completed, skipped' },
        { status: 400 }
      );
    }

    // Verify the recommendation belongs to the user's protocol
    const { data: recommendation, error: fetchError } = await supabase
      .from('protocol_recommendations')
      .select(`
        id,
        protocol_id,
        status,
        started_at,
        completed_at,
        generated_protocols!inner (
          user_id
        )
      `)
      .eq('id', recommendationId)
      .single();

    if (fetchError || !recommendation) {
      return NextResponse.json(
        { error: 'Recommendation not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (recommendation.generated_protocols.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update the status
    const updateData: any = { status, updated_at: new Date().toISOString() };

    // Set timestamps based on status
    if (status === 'started' && !recommendation.started_at) {
      updateData.started_at = new Date().toISOString();
    } else if (status === 'completed' && !recommendation.completed_at) {
      updateData.completed_at = new Date().toISOString();
    }

    const { data: updated, error: updateError } = await supabase
      .from('protocol_recommendations')
      .update(updateData)
      .eq('id', recommendationId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating recommendation:', updateError);
      return NextResponse.json(
        { error: 'Failed to update recommendation status' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      recommendation: updated
    });

  } catch (error) {
    console.error('Error in PATCH /api/recommendations/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
