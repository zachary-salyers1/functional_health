// Common biomarker name variations for matching
const BIOMARKER_PATTERNS: Record<string, string[]> = {
  'Fasting Glucose': ['glucose', 'fasting glucose', 'blood glucose', 'blood sugar'],
  'Hemoglobin A1C': ['a1c', 'hba1c', 'hemoglobin a1c', 'glycated hemoglobin'],
  'Fasting Insulin': ['insulin', 'fasting insulin'],
  'HOMA-IR': ['homa-ir', 'homa ir', 'insulin resistance'],
  'Triglycerides': ['triglycerides', 'trig', 'trigs'],
  'Total Cholesterol': ['total cholesterol', 'cholesterol total', 'cholesterol'],
  'LDL Cholesterol': ['ldl', 'ldl cholesterol', 'ldl-c'],
  'HDL Cholesterol': ['hdl', 'hdl cholesterol', 'hdl-c'],
  'TSH': ['tsh', 'thyroid stimulating hormone'],
  'Free T3': ['free t3', 't3 free', 'ft3'],
  'Free T4': ['free t4', 't4 free', 'ft4'],
  'Vitamin D (25-OH)': ['vitamin d', '25-oh vitamin d', '25(oh)d', 'calcidiol'],
  'Vitamin B12': ['vitamin b12', 'b12', 'cobalamin'],
  'Folate (B9)': ['folate', 'folic acid', 'vitamin b9', 'b9'],
  'Ferritin': ['ferritin'],
  'Serum Iron': ['iron', 'serum iron'],
  'Magnesium (RBC)': ['magnesium', 'mg', 'rbc magnesium'],
  'hs-CRP': ['crp', 'c-reactive protein', 'hs-crp', 'hscrp'],
  'Homocysteine': ['homocysteine'],
};

// Common units for validation
const COMMON_UNITS: Record<string, string[]> = {
  'mg/dL': ['mg/dl', 'mg/deciliter', 'mgdl'],
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
  pdfBuffer: Buffer
): Promise<PDFProcessingResult> {
  try {
    // Use require for CommonJS module compatibility
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse');

    // Extract text from PDF
    const data = await pdfParse(pdfBuffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return {
        biomarkers: [],
        rawText: '',
        success: false,
        error: 'No text found in PDF',
      };
    }

    // Extract biomarkers from text
    const biomarkers = extractBiomarkers(text);

    return {
      biomarkers,
      rawText: text,
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
 */
function extractBiomarkers(text: string): ExtractedBiomarker[] {
  const results: ExtractedBiomarker[] = [];
  const lines = text.split('\n');

  // Normalize text for better matching
  const normalizedText = text.toLowerCase();

  for (const [biomarkerName, patterns] of Object.entries(BIOMARKER_PATTERNS)) {
    for (const pattern of patterns) {
      // Look for the pattern in the text
      const regex = new RegExp(
        `${pattern}[\\s:]*([0-9]+\\.?[0-9]*)\\s*([a-zA-Zμ/%]+)`,
        'gi'
      );

      let match;
      while ((match = regex.exec(normalizedText)) !== null) {
        const value = parseFloat(match[1]);
        const unit = normalizeUnit(match[2]);

        if (!isNaN(value) && value > 0) {
          // Check if we already have this biomarker
          const existing = results.find((r) => r.name === biomarkerName);

          if (!existing) {
            results.push({
              name: biomarkerName,
              value,
              unit,
              rawText: match[0],
              confidence: 0.8, // Basic confidence score
            });
            break; // Move to next biomarker
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
