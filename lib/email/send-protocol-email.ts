import { render } from '@react-email/components';
import { renderToStream } from '@react-pdf/renderer';
import { resend, EMAIL_FROM } from './resend-client';
import { ProtocolReadyEmail, getPlainTextVersion } from './templates/protocol-ready-email';
import { ProtocolPDF } from '../pdf/protocol-pdf';

type SendProtocolEmailParams = {
  to: string;
  userName: string;
  protocol: {
    id: string;
    protocol_name: string;
    priority_focus: string;
    estimated_duration_days: number;
    retest_recommended_date: string;
    created_at: string;
    recommendations_by_type: {
      dietary: number;
      supplement: number;
      lifestyle: number;
      exercise: number;
      sleep: number;
    };
  };
  recommendations: any[];
  totalInterventions: number;
  appUrl?: string;
};

export async function sendProtocolEmail({
  to,
  userName,
  protocol,
  recommendations,
  totalInterventions,
  appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}: SendProtocolEmailParams) {
  try {
    // 1. Format dates
    const retestDate = new Date(protocol.retest_recommended_date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    // 2. Generate protocol URL
    const protocolUrl = `${appUrl}/protocol/${protocol.id}`;

    // 3. Create email props
    const emailProps = {
      userName,
      protocolName: protocol.protocol_name,
      protocolUrl,
      totalInterventions,
      durationDays: protocol.estimated_duration_days,
      retestDate,
      priorityFocus: protocol.priority_focus,
    };

    // 4. Render HTML email using React Email
    const htmlContent = render(ProtocolReadyEmail(emailProps));

    // 5. Get plain text version
    const textContent = getPlainTextVersion(emailProps);

    // 6. Generate PDF for attachment
    let pdfBuffer: Buffer | null = null;
    try {
      const pdfStream = await renderToStream(
        ProtocolPDF({
          protocol,
          recommendations,
          userName,
        })
      );

      const chunks: Uint8Array[] = [];
      for await (const chunk of pdfStream as any) {
        chunks.push(chunk);
      }
      pdfBuffer = Buffer.concat(chunks);
    } catch (pdfError) {
      console.error('Error generating PDF attachment:', pdfError);
      // Continue without PDF attachment if generation fails
    }

    // 7. Prepare attachments
    const attachments = pdfBuffer
      ? [
          {
            filename: `protocol-${protocol.protocol_name.toLowerCase().replace(/\s+/g, '-')}.pdf`,
            content: pdfBuffer,
          },
        ]
      : [];

    // 8. Send email via Resend
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject: `Your Personalized Health Protocol is Ready - ${protocol.protocol_name}`,
      html: htmlContent,
      text: textContent,
      attachments,
    });

    console.log('✅ Protocol email sent successfully:', result);
    return { success: true, emailId: result.id };
  } catch (error) {
    console.error('❌ Error sending protocol email:', error);
    throw error;
  }
}
