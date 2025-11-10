import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function GET() {
  try {
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

    return NextResponse.json({ biomarkers });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
