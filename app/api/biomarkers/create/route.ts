import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // Cookie setting not supported in this context
            }
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

    const body = await request.json();
    const { name, unit, category, description } = body;

    if (!name || !unit || !category) {
      return NextResponse.json(
        { error: 'Name, unit, and category are required' },
        { status: 400 }
      );
    }

    // Insert the new biomarker
    const { data: biomarker, error: insertError } = await supabase
      .from('biomarkers')
      .insert({
        name,
        unit,
        category,
        description: description || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating biomarker:', insertError);
      return NextResponse.json(
        { error: 'Failed to create biomarker' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      biomarker,
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
