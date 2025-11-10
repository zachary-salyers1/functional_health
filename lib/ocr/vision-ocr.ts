import vision from '@google-cloud/vision';

/**
 * Initialize Google Cloud Vision client
 * Supports two authentication methods:
 * 1. GOOGLE_APPLICATION_CREDENTIALS env var pointing to JSON file
 * 2. GOOGLE_CLOUD_CREDENTIALS env var containing JSON string
 */
function getVisionClient() {
  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    // Parse JSON credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    return new vision.ImageAnnotatorClient({
      credentials,
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // Use credentials file path
    return new vision.ImageAnnotatorClient();
  } else {
    throw new Error(
      'Google Cloud credentials not found. Set GOOGLE_CLOUD_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS'
    );
  }
}

export interface VisionOCRResult {
  text: string;
  confidence: number;
  success: boolean;
  error?: string;
}

/**
 * Extract text from an image using Google Cloud Vision API
 * NOTE: Vision API does NOT support PDFs - use Document AI for PDFs instead
 */
export async function extractTextWithVision(
  fileBuffer: Buffer,
  mimeType: string = 'image/png'
): Promise<VisionOCRResult> {
  try {
    const client = getVisionClient();

    // For images, use text detection
    const [result] = await client.textDetection({
      image: {
        content: fileBuffer.toString('base64'),
      },
    });
    const detections = result.textAnnotations;

    if (!detections || detections.length === 0) {
      return {
        text: '',
        confidence: 0,
        success: true,
        error: 'No text found in image',
      };
    }

    // First annotation contains the full text
    const fullText = detections[0]?.description || '';

    // Calculate average confidence from all detections
    const confidences = detections
      .slice(1) // Skip first (full text) annotation
      .map((d) => d.confidence || 0)
      .filter((c) => c > 0);

    const avgConfidence =
      confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;

    return {
      text: fullText,
      confidence: avgConfidence,
      success: true,
    };
  } catch (error) {
    console.error('Vision API error:', error);
    return {
      text: '',
      confidence: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Extract text from multiple pages (for PDFs converted to images)
 */
export async function extractTextFromPages(
  pageBuffers: Buffer[]
): Promise<VisionOCRResult> {
  try {
    const results = await Promise.all(
      pageBuffers.map((buffer) => extractTextWithVision(buffer))
    );

    // Combine all text from all pages
    const fullText = results.map((r) => r.text).join('\n\n');

    // Calculate average confidence
    const confidences = results.map((r) => r.confidence).filter((c) => c > 0);
    const avgConfidence =
      confidences.length > 0
        ? confidences.reduce((a, b) => a + b, 0) / confidences.length
        : 0;

    const allSuccess = results.every((r) => r.success);

    return {
      text: fullText,
      confidence: avgConfidence,
      success: allSuccess,
      error: allSuccess ? undefined : 'Some pages failed to process',
    };
  } catch (error) {
    console.error('Multi-page Vision API error:', error);
    return {
      text: '',
      confidence: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
