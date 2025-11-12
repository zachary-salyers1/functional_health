import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/lab-uploads
 * Retrieves all lab uploads for the authenticated user
 */
export async function GET(request: Request) {
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

    // Fetch all lab uploads for the user
    const { data: uploads, error: uploadsError } = await supabase
      .from('user_lab_uploads')
      .select('id, lab_date, lab_source, created_at, status')
      .eq('user_id', user.id)
      .order('lab_date', { ascending: false });

    if (uploadsError) {
      console.error('Error fetching lab uploads:', uploadsError);
      return NextResponse.json(
        { error: 'Failed to fetch lab uploads' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      uploads: uploads || [],
    });
  } catch (error) {
    console.error('Get lab uploads error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
