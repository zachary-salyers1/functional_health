import { DocumentProcessorServiceClient } from '@google-cloud/documentai';

/**
 * Initialize Google Document AI client
 */
function getDocumentAIClient() {
  if (process.env.GOOGLE_CLOUD_CREDENTIALS) {
    const credentials = JSON.parse(process.env.GOOGLE_CLOUD_CREDENTIALS);
    return new DocumentProcessorServiceClient({
      credentials,
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new DocumentProcessorServiceClient();
  } else {
    throw new Error(
      'Google Cloud credentials not found. Set GOOGLE_CLOUD_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS'
    );
  }
}

export interface DocumentAIResult {
  text: string;
  confidence: number;
  success: boolean;
  error?: string;
}

/**
 * Extract text from a PDF using Google Document AI
 *
 * @param fileBuffer - PDF file buffer
 * @param projectId - Google Cloud project ID
 * @param location - Processor location (us or eu)
 * @param processorId - Document AI processor ID
 */
export async function extractTextWithDocumentAI(
  fileBuffer: Buffer,
  projectId: string,
  location: string = 'us',
  processorId?: string
): Promise<DocumentAIResult> {
  try {
    const client = getDocumentAIClient();

    // Use default OCR processor if not specified
    const processor = processorId || 'OCR_PROCESSOR';

    const name = `projects/${projectId}/locations/${location}/processors/${processor}`;

    console.log('Document AI processor:', name);

    // Encode file to base64
    const encodedFile = fileBuffer.toString('base64');

    // Process the document
    const [result] = await client.processDocument({
      name,
      rawDocument: {
        content: encodedFile,
        mimeType: 'application/pdf',
      },
    });

    const document = result.document;

    if (!document || !document.text) {
      return {
        text: '',
        confidence: 0,
        success: true,
        error: 'No text found in document',
      };
    }

    // Calculate average confidence from pages
    const pages = document.pages || [];
    const confidences: number[] = [];

    pages.forEach((page) => {
      page.blocks?.forEach((block) => {
        if (block.layout?.confidence) {
          confidences.push(block.layout.confidence);
        }
      });
    });

    const avgConfidence = confidences.length > 0
      ? confidences.reduce((a, b) => a + b, 0) / confidences.length
      : 0;

    console.log(`Document AI extracted ${document.text.length} characters with ${Math.round(avgConfidence * 100)}% confidence`);

    return {
      text: document.text,
      confidence: avgConfidence,
      success: true,
    };
  } catch (error: any) {
    console.error('Document AI error:', error);

    // Provide helpful error messages
    let errorMessage = error.message || 'Unknown error';

    if (error.code === 5 && error.message?.includes('Processor')) {
      errorMessage = 'Document AI processor not found. Please create a processor in Google Cloud Console.';
    } else if (error.code === 7 && error.message?.includes('permission')) {
      errorMessage = 'Permission denied. Make sure Document AI API is enabled and service account has proper permissions.';
    }

    return {
      text: '',
      confidence: 0,
      success: false,
      error: errorMessage,
    };
  }
}
