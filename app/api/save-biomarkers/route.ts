import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
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

    const body = await request.json();
    const { testDate, labName, biomarkers } = body;

    if (!testDate || !biomarkers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create lab upload record
    const { data: upload, error: uploadError } = await supabase
      .from('user_lab_uploads')
      .insert({
        user_id: user.id,
        lab_source: labName || 'Manual Entry',
        lab_date: testDate,
        status: 'completed',
        ocr_completed: true,
        payment_status: 'free',
      })
      .select()
      .single();

    if (uploadError) {
      console.error('Failed to create upload:', uploadError);
      return NextResponse.json(
        { error: 'Failed to create upload record' },
        { status: 500 }
      );
    }

    // Get all biomarker definitions and conditions
    const { data: biomarkerDefs, error: biomarkerError } = await supabase
      .from('biomarkers')
      .select('*');

    if (biomarkerError) {
      console.error('Failed to fetch biomarkers:', biomarkerError);
      return NextResponse.json(
        { error: 'Failed to fetch biomarker definitions' },
        { status: 500 }
      );
    }

    const { data: conditions, error: conditionsError } = await supabase
      .from('biomarker_conditions')
      .select('*');

    if (conditionsError) {
      console.error('Failed to fetch conditions:', conditionsError);
      return NextResponse.json(
        { error: 'Failed to fetch conditions' },
        { status: 500 }
      );
    }

    // Process each biomarker result
    const results = [];
    for (const [biomarkerId, value] of Object.entries(biomarkers)) {
      if (!value || value === '') continue;

      const numValue = parseFloat(value as string);
      if (isNaN(numValue)) continue;

      const biomarker = biomarkerDefs.find((b) => b.id === biomarkerId);
      if (!biomarker) continue;

      // Determine the condition based on value ranges
      const biomarkerConditions = conditions.filter(
        (c) => c.biomarker_id === biomarkerId
      );

      let matchedCondition = null;

      for (const condition of biomarkerConditions) {
        const minMatch =
          condition.range_min === null || numValue >= condition.range_min;
        const maxMatch =
          condition.range_max === null || numValue <= condition.range_max;

        if (minMatch && maxMatch) {
          matchedCondition = condition;
          break;
        }
      }

      // If no condition matched, create a default one
      if (!matchedCondition) {
        // Determine severity based on ranges
        let severity = 'optimal';
        if (
          numValue >= biomarker.optimal_range_min &&
          numValue <= biomarker.optimal_range_max
        ) {
          severity = 'optimal';
        } else if (
          numValue >= biomarker.clinical_low &&
          numValue <= biomarker.clinical_high
        ) {
          severity = 'suboptimal';
        } else {
          severity = 'clinical';
        }

        // Create a simple condition record
        const { data: newCondition, error: conditionError } = await supabase
          .from('biomarker_conditions')
          .insert({
            biomarker_id: biomarkerId,
            condition_name: `${biomarker.name} - ${severity}`,
            severity,
            range_min: numValue,
            range_max: numValue,
            priority_score: severity === 'clinical' ? 80 : severity === 'suboptimal' ? 50 : 30,
          })
          .select()
          .single();

        if (!conditionError) {
          matchedCondition = newCondition;
        }
      }

      results.push({
        lab_upload_id: upload.id,
        biomarker_id: biomarkerId,
        value: numValue,
        unit: biomarker.standard_unit,
        condition_id: matchedCondition?.id || null,
      });
    }

    // Insert all results
    if (results.length > 0) {
      const { error: resultsError } = await supabase
        .from('user_biomarker_results')
        .insert(results);

      if (resultsError) {
        console.error('Failed to insert results:', resultsError);
        return NextResponse.json(
          { error: 'Failed to save biomarker results' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      message: 'Biomarkers saved successfully',
    });
  } catch (error) {
    console.error('Save biomarkers error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
