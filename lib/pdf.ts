// @ts-expect-error - pdf-parse/lib/pdf-parse.js has no explicit type definitions for direct file import
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { MAX_TEXT_CHARACTERS } from '@/utils/validation';

export interface PdfExtractionResult {
  text: string;
  numpages: number;
  truncated: boolean;
}

export async function extractTextFromPdf(buffer: Buffer): Promise<PdfExtractionResult> {
  try {
    const data = await pdfParse(buffer);
    let text = (data.text || '').trim();

    if (!text || text.length < 20) {
      throw new Error(
        "This PDF doesn't appear to contain readable text. Scanned/image-only PDFs aren't supported yet."
      );
    }

    let truncated = false;
    if (text.length > MAX_TEXT_CHARACTERS) {
      text = text.substring(0, MAX_TEXT_CHARACTERS);
      truncated = true;
    }

    return {
      text,
      numpages: data.numpages || 1,
      truncated,
    };
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("scanned/image-only")) {
      throw error;
    }
    console.error('PDF parsing error:', error);
    throw new Error('Failed to extract text from PDF. The document may be corrupted or password-protected.');
  }
}
