export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MiB
export const MAX_PDF_PAGES = 100;

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
      error: `File size (${sizeInMB}MB) exceeds the 4 MiB upload limit. Please choose a smaller PDF.`,
    };
  }

  return { valid: true };
}
