import React from 'react';

type ProtocolReadyEmailProps = {
  userName: string;
  protocolName: string;
  protocolUrl: string;
  totalInterventions: number;
  durationDays: number;
  retestDate: string;
  priorityFocus: string;
};

export const ProtocolReadyEmail: React.FC<ProtocolReadyEmailProps> = ({
  userName,
  protocolName,
  protocolUrl,
  totalInterventions,
  durationDays,
  retestDate,
  priorityFocus,
}) => {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f9fafb',
        margin: 0,
        padding: 0,
      }}>
        <table width="100%" cellPadding="0" cellSpacing="0" style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
        }}>
          {/* Header */}
          <tr>
            <td style={{
              backgroundColor: '#2563eb',
              padding: '40px 30px',
              textAlign: 'center',
            }}>
              <h1 style={{
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: 'bold',
                margin: 0,
              }}>
                🎯 Your Protocol is Ready!
              </h1>
            </td>
          </tr>

          {/* Body */}
          <tr>
            <td style={{ padding: '40px 30px' }}>
              <p style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: '24px',
                margin: '0 0 20px 0',
              }}>
                Hi {userName},
              </p>

              <p style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: '24px',
                margin: '0 0 20px 0',
              }}>
                Great news! Your personalized health optimization protocol is ready to view. We've analyzed your lab results and created a comprehensive plan to help you reach optimal health.
              </p>

              {/* Protocol Summary Card */}
              <table width="100%" cellPadding="0" cellSpacing="0" style={{
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
              }}>
                <tr>
                  <td>
                    <h2 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      margin: '0 0 16px 0',
                    }}>
                      {protocolName}
                    </h2>
                    <p style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '20px',
                      margin: '0 0 16px 0',
                    }}>
                      {priorityFocus}
                    </p>

                    {/* Stats */}
                    <table width="100%" cellPadding="0" cellSpacing="0">
                      <tr>
                        <td style={{ padding: '8px 0' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '4px',
                          }}>
                            Total Interventions
                          </div>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#2563eb',
                          }}>
                            {totalInterventions}
                          </div>
                        </td>
                        <td style={{ padding: '8px 0' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '4px',
                          }}>
                            Protocol Duration
                          </div>
                          <div style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            color: '#059669',
                          }}>
                            {durationDays} days
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} style={{ padding: '8px 0' }}>
                          <div style={{
                            fontSize: '12px',
                            color: '#6b7280',
                            marginBottom: '4px',
                          }}>
                            Recommended Retest Date
                          </div>
                          <div style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#7c3aed',
                          }}>
                            {retestDate}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              {/* CTA Button */}
              <table width="100%" cellPadding="0" cellSpacing="0" style={{ marginBottom: '24px' }}>
                <tr>
                  <td align="center">
                    <a
                      href={protocolUrl}
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        padding: '16px 32px',
                        borderRadius: '8px',
                      }}
                    >
                      View Your Protocol →
                    </a>
                  </td>
                </tr>
              </table>

              <p style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: '24px',
                margin: '0 0 20px 0',
              }}>
                Your protocol includes:
              </p>

              <ul style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '22px',
                margin: '0 0 20px 0',
                paddingLeft: '20px',
              }}>
                <li style={{ marginBottom: '8px' }}>Specific dietary recommendations backed by research</li>
                <li style={{ marginBottom: '8px' }}>Supplement protocols with dosages and timing</li>
                <li style={{ marginBottom: '8px' }}>Lifestyle and exercise interventions</li>
                <li style={{ marginBottom: '8px' }}>Expected outcomes and timelines</li>
                <li style={{ marginBottom: '8px' }}>Brand recommendations and implementation guides</li>
              </ul>

              <p style={{
                fontSize: '16px',
                color: '#374151',
                lineHeight: '24px',
                margin: '0 0 20px 0',
              }}>
                We recommend starting with the dietary and lifestyle changes first (they're free and have the highest impact), then adding supplements based on the priority order.
              </p>

              {/* Warning Box */}
              <table width="100%" cellPadding="0" cellSpacing="0" style={{
                backgroundColor: '#fef3c7',
                border: '2px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px',
              }}>
                <tr>
                  <td>
                    <p style={{
                      fontSize: '12px',
                      color: '#92400e',
                      lineHeight: '18px',
                      margin: 0,
                    }}>
                      <strong>⚠️ Important:</strong> This protocol is for educational purposes only and is not medical advice. Always consult with your healthcare provider before starting any new supplements, dietary changes, or exercise programs.
                    </p>
                  </td>
                </tr>
              </table>

              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '20px',
                margin: 0,
              }}>
                Questions? Reply to this email or contact us at support@functionalhealth.app
              </p>
            </td>
          </tr>

          {/* Footer */}
          <tr>
            <td style={{
              backgroundColor: '#f9fafb',
              padding: '30px',
              textAlign: 'center',
              borderTop: '1px solid #e5e7eb',
            }}>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: '0 0 8px 0',
              }}>
                Functional Health Lab Analysis
              </p>
              <p style={{
                fontSize: '12px',
                color: '#9ca3af',
                margin: 0,
              }}>
                Transform your lab results into actionable protocols
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  );
};

// Plain text version for email clients that don't support HTML
export const getPlainTextVersion = (props: ProtocolReadyEmailProps): string => {
  return `
Hi ${props.userName},

Your Personalized Health Protocol is Ready!

${props.protocolName}
${props.priorityFocus}

Protocol Summary:
- Total Interventions: ${props.totalInterventions}
- Protocol Duration: ${props.durationDays} days
- Recommended Retest Date: ${props.retestDate}

View your protocol here: ${props.protocolUrl}

Your protocol includes:
- Specific dietary recommendations backed by research
- Supplement protocols with dosages and timing
- Lifestyle and exercise interventions
- Expected outcomes and timelines
- Brand recommendations and implementation guides

We recommend starting with the dietary and lifestyle changes first (they're free and have the highest impact), then adding supplements based on the priority order.

⚠️ Important: This protocol is for educational purposes only and is not medical advice. Always consult with your healthcare provider before starting any new supplements, dietary changes, or exercise programs.

Questions? Reply to this email or contact us at support@functionalhealth.app

---
Functional Health Lab Analysis
Transform your lab results into actionable protocols
  `.trim();
};
