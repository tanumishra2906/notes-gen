// @ts-expect-error - pdf-parse/lib/pdf-parse.js has no explicit type definitions for direct file import
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

const CLEAR_PDF_FAILURE =
  /encrypt|password|corrupt|invalid pdf|xref|malformed|unexpected eof|unexpected end|invalid header/i;

export async function readPdfPageCount(buffer: Buffer): Promise<number | null> {
  try {
    const data = await pdfParse(buffer);
    return Number.isInteger(data.numpages) && data.numpages > 0 ? data.numpages : null;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (CLEAR_PDF_FAILURE.test(message)) {
      throw error;
    }
    console.warn('Could not read PDF page count; continuing with Gemini PDF processing:', message);
    return null;
  }
}
