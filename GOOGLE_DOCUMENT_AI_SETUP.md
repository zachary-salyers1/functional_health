# Google Document AI Setup Guide

This guide will help you set up Google Document AI for PDF OCR processing in your Functional Health Lab Analysis app.

## Prerequisites

- Google Cloud account with billing enabled
- Project already created (`functional-health-477819`)
- Service account JSON key already downloaded (`functional-health-477819-542534ddb669.json`)

## Step 1: Enable Document AI API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `functional-health-477819`
3. Navigate to **APIs & Services** > **Library**
4. Search for "Document AI API"
5. Click **Enable**

## Step 2: Create a Document AI Processor

1. Go to [Document AI Console](https://console.cloud.google.com/ai/document-ai/processors)
2. Select your project if prompted
3. Click **Create Processor**
4. Choose processor type: **Document OCR**
5. Enter processor details:
   - **Processor name**: `Lab Report OCR` (or any name you prefer)
   - **Region**: `us` (United States)
6. Click **Create**
7. **IMPORTANT**: Copy the **Processor ID** from the processor details page
   - It looks like: `1234567890abcdef`
   - You'll need this for your environment variables

## Step 3: Grant Permissions to Service Account

1. Go to **IAM & Admin** > **IAM**
2. Find your service account: `vision-api-user@functional-health-477819.iam.gserviceaccount.com`
3. Click **Edit** (pencil icon)
4. Click **Add Another Role**
5. Add role: **Document AI API User**
6. Click **Save**

## Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```bash
# Google Cloud APIs (for OCR)
# Option 1: JSON credentials as string (recommended for deployment)
GOOGLE_CLOUD_CREDENTIALS='{"type":"service_account","project_id":"functional-health-477819",...}'

# Option 2: Path to service account JSON file (for local development)
GOOGLE_APPLICATION_CREDENTIALS=c:\Users\Zachary\functional_health\functional-health-477819-542534ddb669.json

# Google Cloud Project settings
GOOGLE_CLOUD_PROJECT_ID=functional-health-477819
GOOGLE_CLOUD_LOCATION=us
GOOGLE_DOCUMENT_AI_PROCESSOR_ID=YOUR_PROCESSOR_ID_HERE
```

**Replace `YOUR_PROCESSOR_ID_HERE`** with the processor ID you copied in Step 2.

## Step 5: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/upload`

3. Upload a lab report PDF

4. Check the console logs for:
   - "Processing PDF with Google Document AI..."
   - "Document AI extracted X characters with Y% confidence"
   - "Extracted N biomarkers from OCR text"

## How It Works

The system uses two different OCR services:

- **Google Document AI**: For PDF files (better accuracy for documents)
- **Google Vision API**: For image files (PNG, JPG)

The processing logic automatically detects the file type and routes to the appropriate service.

## Pricing

Document AI pricing (as of 2025):
- First 1,000 pages per month: **FREE**
- Additional pages: $1.50 per 1,000 pages

For a typical lab report (1-3 pages), this is very cost-effective.

## Troubleshooting

### Error: "Processor not found"

**Solution**: Make sure you've added the correct processor ID to your `.env.local` file.

### Error: "Permission denied"

**Solution**: Verify that your service account has the "Document AI API User" role.

### Error: "Document AI API has not been used"

**Solution**: Make sure you've enabled the Document AI API in Step 1.

### No text extracted

**Solution**:
- Check that your PDF is not scanned at too low a resolution
- Ensure the PDF contains actual text/images (not just blank pages)
- Try a different lab report to verify the OCR is working

## Next Steps

After setup is complete:
1. Test with multiple lab report formats
2. Verify biomarker extraction accuracy
3. Adjust biomarker patterns in `lib/ocr/process-lab-pdf.ts` if needed
4. Consider adding support for additional biomarkers

## Resources

- [Document AI Documentation](https://cloud.google.com/document-ai/docs)
- [Document AI Pricing](https://cloud.google.com/document-ai/pricing)
- [Supported File Types](https://cloud.google.com/document-ai/docs/file-types)
