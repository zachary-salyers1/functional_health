# Email Setup Guide

This guide explains how to set up email delivery for protocol notifications using Resend.

## Overview

The app automatically sends emails when protocols are generated, including:
- Personalized email with protocol summary
- PDF attachment of the full protocol
- Links to view the protocol in the app

## Prerequisites

1. **Resend Account**: Sign up at [resend.com](https://resend.com)
2. **Verified Domain** (for production): Add and verify your sending domain
3. **API Key**: Generate an API key from your Resend dashboard

## Setup Steps

### 1. Create Resend Account

1. Go to [resend.com](https://resend.com) and sign up
2. For development: You can use the sandbox domain `onboarding@resend.dev`
3. For production: Add and verify your custom domain (e.g., `functionalhealth.app`)

### 2. Get API Key

1. Navigate to **API Keys** in your Resend dashboard
2. Click **Create API Key**
3. Give it a name (e.g., "Functional Health Production")
4. Set permissions (recommended: Full Access for now)
5. Copy the API key (starts with `re_...`)

### 3. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Resend Email Service
RESEND_API_KEY=re_your_api_key_here

# Email Configuration
EMAIL_FROM="Functional Health <noreply@yourdomain.com>"
SUPPORT_EMAIL="support@yourdomain.com"

# App URL (for email links)
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_APP_URL=https://yourapp.com  # Production
```

### 4. Verify Domain (Production Only)

For production use, you need to verify your sending domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `functionalhealth.app`)
4. Add the provided DNS records to your domain:
   - SPF record (TXT)
   - DKIM record (TXT)
   - DMARC record (TXT) - optional but recommended
5. Wait for verification (usually 5-30 minutes)

### 5. Test Email Delivery

#### Development Testing

In development, you can use the sandbox domain:

```bash
EMAIL_FROM="Functional Health <onboarding@resend.dev>"
```

**Note**: Emails from sandbox domain can only be sent to your verified email address in Resend.

#### Production Testing

After domain verification, update to your custom domain:

```bash
EMAIL_FROM="Functional Health <noreply@functionalhealth.app>"
```

## Email Templates

### Protocol Ready Email

Sent automatically when a protocol is generated via `/api/protocols/generate`

**Features:**
- Personalized greeting
- Protocol summary (name, focus, duration, interventions)
- Direct link to view protocol
- PDF attachment
- Medical disclaimer
- Responsive HTML design

**Template Location:** `/lib/email/templates/protocol-ready-email.tsx`

## Email Functions

### `sendProtocolEmail()`

Located in: `/lib/email/send-protocol-email.ts`

**Usage:**
```typescript
import { sendProtocolEmail } from '@/lib/email/send-protocol-email';

await sendProtocolEmail({
  to: 'user@example.com',
  userName: 'John Doe',
  protocol: {
    id: 'protocol-id',
    protocol_name: 'Metabolic Health Optimization',
    priority_focus: 'Focus on glucose and insulin',
    estimated_duration_days: 90,
    retest_recommended_date: '2025-03-15',
    created_at: '2024-12-15',
    recommendations_by_type: {
      dietary: 3,
      supplement: 4,
      lifestyle: 2,
      exercise: 1,
      sleep: 1
    }
  },
  recommendations: [...], // Full recommendation data
  totalInterventions: 11,
  appUrl: 'https://yourapp.com' // Optional, defaults to NEXT_PUBLIC_APP_URL
});
```

**Returns:**
```typescript
{ success: true, emailId: 'email-id-from-resend' }
```

## Email Limits

### Resend Free Tier
- 100 emails/day
- 3,000 emails/month
- Unlimited verified recipients

### Paid Plans
- Starting at $20/month for 50,000 emails/month
- No daily limits
- Advanced analytics

## Troubleshooting

### Email Not Sending

1. **Check API Key**: Ensure `RESEND_API_KEY` is set correctly
2. **Check Logs**: Look for error messages in server console
3. **Verify Domain**: Ensure domain is verified (production)
4. **Check Recipient**: In sandbox mode, ensure recipient is verified in Resend

### Email Goes to Spam

1. **Verify Domain**: Complete SPF, DKIM, DMARC setup
2. **Warm Up Domain**: Start with small volumes, gradually increase
3. **Content**: Ensure email content is not spammy
4. **Sender Reputation**: Use a dedicated domain for transactional emails

### PDF Attachment Issues

1. **Check PDF Generation**: Test `/api/protocols/:id/pdf` endpoint separately
2. **File Size**: Ensure PDFs are under 10MB
3. **Memory**: Increase Node.js memory if needed: `NODE_OPTIONS=--max-old-space-size=4096`

### Rate Limiting

Resend has rate limits:
- 10 requests/second per API key
- Burst: up to 100 requests in a 10-second window

If you hit rate limits, implement queuing:
```typescript
// Use a job queue like Bull or pg-boss
await emailQueue.add('send-protocol', {
  to: user.email,
  protocol: protocol,
  // ... other params
});
```

## Best Practices

### 1. Email Deliverability

- Use a dedicated domain for transactional emails
- Implement DMARC with `p=quarantine` or `p=reject`
- Monitor bounce rates and unsubscribes
- Maintain a clean email list

### 2. Performance

- Send emails asynchronously (fire-and-forget)
- Don't block protocol generation on email delivery
- Use background jobs for bulk emails

### 3. Testing

- Test emails locally before deploying
- Use Resend's test mode for development
- Monitor email delivery status in Resend dashboard

### 4. Compliance

- Include unsubscribe link (for marketing emails)
- Add physical address (required by CAN-SPAM)
- Respect user email preferences
- Include clear medical disclaimers

## Monitoring

### Resend Dashboard

Monitor email performance:
- Delivery rate
- Bounce rate
- Open rate (if tracking enabled)
- Click rate
- Spam complaints

### Application Logs

Check server logs for:
```
✅ Protocol email sent successfully: { id: 'xxx', ... }
❌ Error sending protocol email: ...
✉️ Protocol email queued for: user@example.com
```

## Future Enhancements

Potential improvements:

1. **Email Preferences**: Let users control email frequency
2. **Follow-up Emails**: Day 7, 30, 90 check-ins
3. **Email Templates**: Welcome, password reset, etc.
4. **Batch Sending**: For admin announcements
5. **Email Analytics**: Track opens, clicks, conversions
6. **Personalization**: Dynamic content based on user data

## Support

For Resend support:
- Documentation: [resend.com/docs](https://resend.com/docs)
- Email: support@resend.com
- Discord: [resend.com/discord](https://resend.com/discord)

For app-specific issues, check server logs and ensure environment variables are configured correctly.
