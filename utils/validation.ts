export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_TEXT_CHARACTERS = 30000; // ~30k chars safety cutoff for gemini-1.5-flash MVP

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validatePdfFile(file: File | null | undefined): ValidationResult {
  if (!file) {
    return { valid: false, error: 'No file was uploaded. Please select a PDF file.' };
  }

  // Check file extension and MIME type
  const isPdfExtension = file.name.toLowerCase().endsWith('.pdf');
  const isPdfMime = file.type === 'application/pdf' || file.type === '';

  if (!isPdfExtension && !isPdfMime) {
    return { valid: false, error: 'Invalid file type. Only PDF files (.pdf) are supported.' };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size (${sizeInMB}MB) exceeds the maximum limit of 10MB for the free tier.`,
    };
  }

  return { valid: true };
}
