import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export { resend };

// Email sender configuration
export const EMAIL_FROM = process.env.EMAIL_FROM || 'Functional Health <noreply@functionalhealth.app>';
export const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || 'support@functionalhealth.app';
