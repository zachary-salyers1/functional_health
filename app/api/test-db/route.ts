import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabase';

export async function GET() {
  try {
    // Test database connection by fetching biomarkers
    const { data, error } = await supabase
      .from('biomarkers')
      .select('id, name, category')
      .limit(5);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          hint: 'Make sure you have run the database schema migration'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database connection successful!',
      biomarker_count: data?.length || 0,
      sample_data: data
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
