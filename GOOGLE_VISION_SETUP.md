# Google Cloud Vision API Setup

This guide will help you set up Google Cloud Vision API for OCR (Optical Character Recognition) to extract biomarker data from lab PDFs and images.

## Prerequisites

- Google Cloud account
- Billing enabled on your Google Cloud project

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Give it a name (e.g., "functional-health")
4. Click "Create"

### 2. Enable Cloud Vision API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Cloud Vision API"
3. Click on it and press "Enable"

### 3. Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - **Service account name**: `functional-health-ocr`
   - **Service account description**: "OCR for lab results"
4. Click "Create and Continue"
5. Grant the role: **"Cloud Vision AI Service Agent"**
6. Click "Continue" → "Done"

### 4. Create and Download JSON Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON"
5. Click "Create" - the JSON file will download automatically

### 5. Add Credentials to Your App

You have two options:

#### Option A: Environment Variable (Recommended for Production)

1. Open the downloaded JSON file
2. Copy the entire JSON content
3. In your `.env.local` file, add:
   ```
   GOOGLE_CLOUD_CREDENTIALS='{"type":"service_account","project_id":"your-project",...}'
   ```
   (Paste the entire JSON as a single-line string)

#### Option B: File Path (Easier for Local Development)

1. Save the JSON file somewhere secure (e.g., `~/credentials/functional-health.json`)
2. In your `.env.local` file, add:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/your-service-account-key.json
   ```

   Or on Windows:
   ```
   GOOGLE_APPLICATION_CREDENTIALS=C:\Users\YourName\credentials\functional-health.json
   ```

**⚠️ IMPORTANT**: Never commit the JSON file or credentials to Git!

### 6. Verify Setup

1. Restart your development server: `npm run dev`
2. Upload a lab PDF or image at `http://localhost:3000/upload`
3. Check the terminal for logs like:
   ```
   Processing with Google Cloud Vision API...
   Vision API extracted 1234 characters with 98% confidence
   Extracted 15 biomarkers from OCR text
   ```

## Pricing

Google Cloud Vision API pricing (as of 2024):
- **First 1,000 images/month**: FREE
- **1,001 - 5,000,000 images**: $1.50 per 1,000 images
- **5,000,001+ images**: $0.60 per 1,000 images

For this app with ~100-500 users uploading 1-2 labs/month, you'll likely stay in the free tier.

## Troubleshooting

### Error: "credentials not found"
- Make sure `GOOGLE_CLOUD_CREDENTIALS` or `GOOGLE_APPLICATION_CREDENTIALS` is set in `.env.local`
- Restart your dev server after adding env vars

### Error: "API not enabled"
- Make sure Cloud Vision API is enabled in your Google Cloud project
- Wait 1-2 minutes after enabling for it to propagate

### Error: "Permission denied"
- Make sure your service account has the "Cloud Vision AI Service Agent" role
- Check that billing is enabled on your project

## Security Best Practices

1. **Never commit credentials**: Add `*.json` to `.gitignore`
2. **Use environment variables**: For production deployments (Vercel, Railway, etc.)
3. **Rotate keys periodically**: Create new keys every 90 days
4. **Limit permissions**: Only grant "Cloud Vision AI Service Agent" role

## For Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add `GOOGLE_CLOUD_CREDENTIALS` with the JSON content as the value
4. Make sure to add it for all environments (Production, Preview, Development)
