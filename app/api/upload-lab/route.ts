import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { processLabPDF, matchBiomarkersToDatabase } from '@/lib/ocr/process-lab-pdf';

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

    // Parse the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Only PDF and image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${user.id}/${timestamp}-${file.name}`;

    // Upload to Supabase Storage
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('lab-uploads')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Create database record
    const { data: upload, error: dbError } = await supabase
      .from('user_lab_uploads')
      .insert({
        user_id: user.id,
        original_filename: file.name,
        pdf_s3_key: fileName,
        lab_date: new Date().toISOString().split('T')[0], // Today's date as default
        status: 'uploaded',
        ocr_completed: false,
        payment_status: 'free',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      // Try to clean up the uploaded file
      await supabase.storage.from('lab-uploads').remove([fileName]);
      return NextResponse.json(
        { error: 'Failed to create upload record' },
        { status: 500 }
      );
    }

    // Process file with OCR
    console.log(`Processing ${file.type} with OCR...`);
    const pdfResult = await processLabPDF(fileBuffer, file.type);

    // Log extracted text for debugging
    console.log('=== EXTRACTED TEXT (first 1000 chars) ===');
    console.log(pdfResult.rawText.substring(0, 1000));
    console.log('=== END TEXT ===');

    if (pdfResult.success && pdfResult.biomarkers.length > 0) {
      console.log(`Extracted ${pdfResult.biomarkers.length} biomarkers from PDF`);

      // Get biomarker definitions from database
      const { data: biomarkerDefs } = await supabase
        .from('biomarkers')
        .select('*');

      if (biomarkerDefs) {
        // Match extracted biomarkers to database
        const matchedBiomarkers = await matchBiomarkersToDatabase(
          pdfResult.biomarkers,
          biomarkerDefs
        );

        console.log(`Matched ${matchedBiomarkers.length} biomarkers to database`);

        // Get conditions for analysis
        const { data: conditions } = await supabase
          .from('biomarker_conditions')
          .select('*');

        // Insert biomarker results
        const resultsToInsert = matchedBiomarkers.map((mb) => {
          const biomarker = biomarkerDefs.find((b) => b.id === mb.biomarker_id);

          // Determine condition based on value
          let condition = null;
          if (conditions && biomarker) {
            const biomarkerConditions = conditions.filter(
              (c) => c.biomarker_id === mb.biomarker_id
            );

            for (const cond of biomarkerConditions) {
              const minMatch = cond.min_value === null || mb.value >= cond.min_value;
              const maxMatch = cond.max_value === null || mb.value <= cond.max_value;

              if (minMatch && maxMatch) {
                condition = cond.id;
                break;
              }
            }
          }

          return {
            lab_upload_id: upload.id,
            biomarker_id: mb.biomarker_id,
            value: mb.value,
            unit: mb.unit,
            condition_id: condition,
          };
        });

        if (resultsToInsert.length > 0) {
          await supabase.from('user_biomarker_results').insert(resultsToInsert);
        }

        // Update upload status
        await supabase
          .from('user_lab_uploads')
          .update({
            status: 'completed',
            ocr_completed: true,
            ocr_confidence_score: 0.8,
          })
          .eq('id', upload.id);
      }
    } else {
      console.log('No biomarkers extracted from PDF');
      await supabase
        .from('user_lab_uploads')
        .update({
          status: 'completed',
          ocr_completed: true,
          ocr_confidence_score: 0.0,
        })
        .eq('id', upload.id);
    }

    return NextResponse.json({
      success: true,
      uploadId: upload.id,
      biomarkersFound: pdfResult.biomarkers.length,
      message: 'File uploaded and processed successfully',
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
