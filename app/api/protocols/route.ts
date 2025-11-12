import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/protocols
 * Retrieves all protocols for the authenticated user
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

    // Fetch all protocols for the user
    const { data: protocols, error: protocolsError } = await supabase
      .from('generated_protocols')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (protocolsError) {
      console.error('Error fetching protocols:', protocolsError);
      return NextResponse.json(
        { error: 'Failed to fetch protocols' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      protocols: protocols || [],
    });
  } catch (error) {
    console.error('Get protocols error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
