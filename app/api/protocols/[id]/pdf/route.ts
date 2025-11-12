import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { ProtocolPDF } from '@/lib/pdf/protocol-pdf';

export const dynamic = 'force-dynamic';

/**
 * GET /api/protocols/:id/pdf
 * Generates and downloads a PDF of the protocol
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: protocol_id } = await params;
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

    // 1. Get protocol and verify ownership
    const { data: protocol, error: protocolError } = await supabase
      .from('generated_protocols')
      .select('*')
      .eq('id', protocol_id)
      .single();

    if (protocolError || !protocol) {
      return NextResponse.json(
        { error: 'Protocol not found' },
        { status: 404 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== protocol.user_id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // 2. Get user info for PDF personalization
    const { data: userData } = await supabase
      .from('users')
      .select('first_name, last_name, email')
      .eq('id', user.id)
      .single();

    const userName = userData
      ? `${userData.first_name} ${userData.last_name}`.trim() || userData.email
      : 'Valued User';

    // 3. Get all protocol recommendations with full intervention details
    const { data: recommendations, error: recommendationsError } = await supabase
      .from('protocol_recommendations')
      .select(`
        *,
        interventions (
          id,
          intervention_type,
          name,
          short_description,
          detailed_description,
          how_to_implement,
          dosage_info,
          frequency,
          timing,
          brand_recommendations,
          expected_outcome,
          typical_duration_days,
          expected_improvement_percentage,
          difficulty_level,
          estimated_cost,
          contraindications,
          warnings
        )
      `)
      .eq('protocol_id', protocol_id)
      .order('priority_order', { ascending: true });

    if (recommendationsError || !recommendations) {
      return NextResponse.json(
        { error: 'Failed to fetch recommendations' },
        { status: 500 }
      );
    }

    // 4. Calculate recommendations by type
    const recommendationsByType = {
      dietary: recommendations.filter(r => r.interventions?.intervention_type === 'dietary').length,
      supplement: recommendations.filter(r => r.interventions?.intervention_type === 'supplement').length,
      lifestyle: recommendations.filter(r => r.interventions?.intervention_type === 'lifestyle').length,
      exercise: recommendations.filter(r => r.interventions?.intervention_type === 'exercise').length,
      sleep: recommendations.filter(r => r.interventions?.intervention_type === 'sleep').length,
    };

    // 5. Generate PDF
    const pdfStream = await renderToStream(
      ProtocolPDF({
        protocol: {
          ...protocol,
          recommendations_by_type: recommendationsByType,
        },
        recommendations,
        userName,
      })
    );

    // 6. Convert stream to buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream as any) {
      chunks.push(chunk);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // 7. Generate filename
    const filename = `protocol-${protocol.protocol_name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;

    // 8. Return PDF with proper headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
