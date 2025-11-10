// Common biomarker name variations for matching
const BIOMARKER_PATTERNS: Record<string, string[]> = {
  // Metabolic/Glucose
  'Fasting Glucose': ['glucose', 'fasting glucose', 'blood glucose', 'blood sugar', 'glucose lvl'],
  'Hemoglobin A1C': ['a1c', 'hba1c', 'hemoglobin a1c', 'glycated hemoglobin'],
  'Fasting Insulin': ['insulin', 'fasting insulin'],
  'HOMA-IR': ['homa-ir', 'homa ir', 'insulin resistance'],

  // Lipids
  'Triglycerides': ['triglycerides', 'trig', 'trigs'],
  'Total Cholesterol': ['total cholesterol', 'cholesterol total', 'cholesterol'],
  'LDL Cholesterol': ['ldl', 'ldl cholesterol', 'ldl-c'],
  'HDL Cholesterol': ['hdl', 'hdl cholesterol', 'hdl-c'],

  // Thyroid
  'TSH': ['tsh', 'thyroid stimulating hormone'],
  'Free T3': ['free t3', 't3 free', 'ft3'],
  'Free T4': ['free t4', 't4 free', 'ft4'],

  // Vitamins & Minerals
  'Vitamin D (25-OH)': ['vitamin d', '25-oh vitamin d', '25(oh)d', 'calcidiol'],
  'Vitamin B12': ['vitamin b12', 'b12', 'cobalamin'],
  'Folate (B9)': ['folate', 'folic acid', 'vitamin b9', 'b9'],
  'Ferritin': ['ferritin'],
  'Serum Iron': ['iron', 'serum iron'],
  'Magnesium (RBC)': ['magnesium', 'rbc magnesium'],

  // Inflammatory
  'hs-CRP': ['crp', 'c-reactive protein', 'hs-crp', 'hscrp'],
  'Homocysteine': ['homocysteine'],

  // CMP Biomarkers (Comprehensive Metabolic Panel)
  'Sodium': ['sodium'],
  'Potassium': ['potassium'],
  'Chloride': ['chloride'],
  'Carbon Dioxide': ['co2', 'total co2', 'carbon dioxide'],
  'Creatinine': ['creatinine'],
  'BUN': ['bun', 'blood urea nitrogen'],
  'Calcium': ['calcium'],
  'Albumin': ['albumin'],
  'Total Protein': ['total protein', 'protein total'],
  'Bilirubin': ['bilirubin', 'bili total', 'total bilirubin'],
  'Anion Gap': ['anion gap'],
};

// Common units for validation
const COMMON_UNITS: Record<string, string[]> = {
  'mg/dL': ['mg/dl', 'mg/deciliter', 'mgdl'],
  'mmol/L': ['mmol/l', 'mmol/liter'],
  'gm/dL': ['gm/dl', 'g/dl', 'g/deciliter'],
  'μIU/mL': ['uiu/ml', 'μiu/ml', 'miu/ml'],
  'ng/mL': ['ng/ml', 'ng/deciliter'],
  'pg/mL': ['pg/ml', 'pg/deciliter'],
  'mIU/L': ['miu/l', 'μiu/l'],
  'μmol/L': ['umol/l', 'μmol/l', 'micromol/l'],
  '%': ['%', 'percent'],
};

export interface ExtractedBiomarker {
  name: string;
  value: number;
  unit: string;
  rawText: string;
  confidence: number;
}

export interface PDFProcessingResult {
  biomarkers: ExtractedBiomarker[];
  rawText: string;
  success: boolean;
  error?: string;
}

/**
 * Process a lab PDF and extract biomarker values
 */
export async function processLabPDF(
  fileBuffer: Buffer,
  fileType: string
): Promise<PDFProcessingResult> {
  try {
    // Check if Vision API is configured
    if (!process.env.GOOGLE_CLOUD_CREDENTIALS && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      console.log('Google Vision API not configured - skipping OCR');
      return {
        biomarkers: [],
        rawText: '',
        success: true,
        error: 'OCR not configured. Add GOOGLE_CLOUD_CREDENTIALS to use OCR.',
      };
    }

    // Use Document AI for PDFs, Vision API for images
    let extractedText = '';
    let confidence = 0;

    if (fileType === 'application/pdf') {
      console.log('Processing PDF with Google Document AI...');

      // Check for required env vars
      const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
      const location = process.env.GOOGLE_CLOUD_LOCATION || 'us';
      const processorId = process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID;

      if (!projectId) {
        return {
          biomarkers: [],
          rawText: '',
          success: false,
          error: 'GOOGLE_CLOUD_PROJECT_ID not configured',
        };
      }

      const { extractTextWithDocumentAI } = await import('./document-ai');
      const docResult = await extractTextWithDocumentAI(
        fileBuffer,
        projectId,
        location,
        processorId
      );

      if (!docResult.success || !docResult.text) {
        return {
          biomarkers: [],
          rawText: docResult.text,
          success: false,
          error: docResult.error || 'No text extracted from PDF',
        };
      }

      extractedText = docResult.text;
      confidence = docResult.confidence;
    } else {
      console.log('Processing image with Google Cloud Vision API...');

      const { extractTextWithVision } = await import('./vision-ocr');
      const visionResult = await extractTextWithVision(fileBuffer, fileType);

      if (!visionResult.success || !visionResult.text) {
        return {
          biomarkers: [],
          rawText: visionResult.text,
          success: false,
          error: visionResult.error || 'No text extracted from image',
        };
      }

      extractedText = visionResult.text;
      confidence = visionResult.confidence;
    }

    console.log(`Extracted ${extractedText.length} characters with ${Math.round(confidence * 100)}% confidence`);

    // Extract biomarkers from text
    const biomarkers = extractBiomarkers(extractedText);

    console.log(`Extracted ${biomarkers.length} biomarkers from OCR text`);

    return {
      biomarkers,
      rawText: extractedText,
      success: true,
    };
  } catch (error) {
    console.error('PDF processing error:', error);
    return {
      biomarkers: [],
      rawText: '',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Extract biomarker values from text
 * Handles multiple lab report formats:
 * 1. MyChart format: "Biomarker\nNormal range: X - Y unit\nvalue"
 * 2. Standard format: "Biomarker: value unit"
 */
function extractBiomarkers(text: string): ExtractedBiomarker[] {
  const results: ExtractedBiomarker[] = [];
  const lines = text.split('\n');

  // Try MyChart format first
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line matches a biomarker name
    for (const [biomarkerName, patterns] of Object.entries(BIOMARKER_PATTERNS)) {
      for (const pattern of patterns) {
        const patternRegex = new RegExp(`^${pattern}$`, 'i');

        if (patternRegex.test(line)) {
          // Look ahead for "Normal range:" and then the value
          let rangeLineIndex = -1;
          let valueLineIndex = -1;

          // Search next few lines for range and value
          for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
            const nextLine = lines[j].trim();

            if (nextLine.toLowerCase().includes('normal range:') && rangeLineIndex === -1) {
              rangeLineIndex = j;
            } else if (rangeLineIndex !== -1 && /^\d+\.?\d*$/.test(nextLine)) {
              // Found a numeric value after the range
              // Skip if it's part of the range itself (appears before we've moved past range line)
              if (j === rangeLineIndex) continue;

              valueLineIndex = j;
              break;
            }
          }

          if (rangeLineIndex !== -1 && valueLineIndex !== -1) {
            const rangeLine = lines[rangeLineIndex].trim();
            const valueLine = lines[valueLineIndex].trim();

            // Extract unit from range line (handles formats like "74 - 100 mg/dL" or "0.67 - 1.30 mg/dL")
            const unitMatch = rangeLine.match(/(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*([a-zA-Zμ/%]+)/i);
            const value = parseFloat(valueLine);
            const unit = unitMatch ? normalizeUnit(unitMatch[3]) : '';

            if (!isNaN(value) && value > 0) {
              const existing = results.find((r) => r.name === biomarkerName);
              if (!existing) {
                console.log(`Found ${biomarkerName}: ${value} ${unit}`);
                results.push({
                  name: biomarkerName,
                  value,
                  unit,
                  rawText: `${line} -> ${valueLine}`,
                  confidence: 0.85,
                });
                break;
              }
            }
          }
        }
      }
    }
  }

  // If MyChart format didn't find anything, try standard format
  if (results.length === 0) {
    const normalizedText = text.toLowerCase();

    for (const [biomarkerName, patterns] of Object.entries(BIOMARKER_PATTERNS)) {
      for (const pattern of patterns) {
        const regex = new RegExp(
          `${pattern}[\\s:]*([0-9]+\\.?[0-9]*)\\s*([a-zA-Zμ/%]+)`,
          'gi'
        );

        let match;
        while ((match = regex.exec(normalizedText)) !== null) {
          const value = parseFloat(match[1]);
          const unit = normalizeUnit(match[2]);

          if (!isNaN(value) && value > 0) {
            const existing = results.find((r) => r.name === biomarkerName);

            if (!existing) {
              results.push({
                name: biomarkerName,
                value,
                unit,
                rawText: match[0],
                confidence: 0.8,
              });
              break;
            }
          }
        }
      }
    }
  }

  return results;
}

/**
 * Normalize unit variations to standard units
 */
function normalizeUnit(unit: string): string {
  const normalized = unit.toLowerCase().trim();

  for (const [standardUnit, variations] of Object.entries(COMMON_UNITS)) {
    if (variations.includes(normalized)) {
      return standardUnit;
    }
  }

  return unit; // Return as-is if no match found
}

/**
 * Match extracted biomarkers to database biomarkers
 */
export async function matchBiomarkersToDatabase(
  extracted: ExtractedBiomarker[],
  databaseBiomarkers: any[]
): Promise<Array<{ biomarker_id: string; value: number; unit: string }>> {
  const matched: Array<{ biomarker_id: string; value: number; unit: string }> = [];

  for (const extractedBiomarker of extracted) {
    // Find matching database biomarker
    const dbBiomarker = databaseBiomarkers.find(
      (db) =>
        db.name.toLowerCase() === extractedBiomarker.name.toLowerCase() ||
        BIOMARKER_PATTERNS[extractedBiomarker.name]?.some(
          (pattern) => pattern === db.name.toLowerCase()
        )
    );

    if (dbBiomarker) {
      matched.push({
        biomarker_id: dbBiomarker.id,
        value: extractedBiomarker.value,
        unit: extractedBiomarker.unit,
      });
    }
  }

  return matched;
}
