import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { MAX_PDF_PAGES, validatePdfFile } from '@/utils/validation';
import { readPdfPageCount } from '@/lib/pdf';
import { generateStudyContent } from '@/lib/gemini';
import { withAuthenticatedApiUser } from '@/lib/supabase/api-auth';
import { formatErrorMessage } from '@/utils/formatError';
import type { StudyContent } from '@/types/study';

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  return withAuthenticatedApiUser(request, (user, supabase) =>
    handleProcessPdf(request, user, supabase)
  );
}

async function handleProcessPdf(
  request: NextRequest,
  user: User,
  supabase: SupabaseClient
) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    // 1. Validate file uploaded
    const validation = validatePdfFile(file);
    if (!validation.valid || !file) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid PDF file.' },
        { status: 400 }
      );
    }

    // 2. Read PDF metadata and pass the original PDF to Gemini
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.subarray(0, 1024).includes(Buffer.from('%PDF-'))) {
      return NextResponse.json(
        { success: false, error: 'This file is not a valid PDF. Please choose a PDF document.' },
        { status: 400 }
      );
    }

    let pageCount: number | null = null;
    try {
      pageCount = await readPdfPageCount(buffer);
    } catch (pdfError: unknown) {
      const msg = pdfError instanceof Error ? pdfError.message : '';
      if (/encrypt|password/i.test(msg)) {
        return NextResponse.json(
          {
            success: false,
            error: 'This PDF is password-protected or encrypted. Please upload an unlocked PDF.',
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'This PDF appears to be corrupt or invalid. Please try another PDF.' },
        { status: 400 }
      );
    }

    if (pageCount !== null && pageCount > MAX_PDF_PAGES) {
      return NextResponse.json(
        {
          success: false,
          pageCount,
          error: `This PDF has ${pageCount} pages. The maximum supported length is ${MAX_PDF_PAGES} pages. Please upload a shorter PDF.`,
        },
        { status: 422 }
      );
    }

    // 3. Process the original PDF with Gemini
    let studyContent: StudyContent;
    try {
      studyContent = await generateStudyContent(buffer.toString('base64'));
    } catch (geminiError: unknown) {
      const errMsg = geminiError instanceof Error ? geminiError.message : '';
      if (/encrypt|password/i.test(errMsg)) {
        return NextResponse.json(
          {
            success: false,
            error: 'This PDF is password-protected or encrypted. Please upload an unlocked PDF.',
          },
          { status: 400 }
        );
      }
      if (/corrupt|invalid pdf|malformed pdf|failed to parse pdf/i.test(errMsg)) {
        return NextResponse.json(
          { success: false, error: 'This PDF appears to be corrupt or invalid. Please try another PDF.' },
          { status: 400 }
        );
      }
      if (errMsg === 'PDF_PAGE_LIMIT') {
        const countMessage =
          pageCount === null ? '' : ` The detected document contains ${pageCount} pages.`;
        return NextResponse.json(
          {
            success: false,
            pageCount,
            error: `This PDF exceeds the ${MAX_PDF_PAGES}-page processing limit.${countMessage} Please upload a shorter PDF.`,
          },
          { status: 422 }
        );
      }
      if (errMsg === '429' || errMsg.includes('429')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests, please wait a moment and try again.',
          },
          { status: 429 }
        );
      }
      if (errMsg === '503' || errMsg.includes('503') || errMsg.includes('high demand')) {
        return NextResponse.json(
          {
            success: false,
            error: 'The AI service is currently experiencing high demand. Please try again in a few seconds.',
          },
          { status: 503 }
        );
      }
      return NextResponse.json(
        { success: false, error: formatErrorMessage(geminiError) },
        { status: 500 }
      );
    }

    const title = file.name.replace(/\.pdf$/i, '');
    try {
      const { data: document, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title,
          source_filename: file.name,
          study_content: studyContent,
        })
        .select('id')
        .single();

      if (insertError || !document) {
        console.error('Failed to save processed document:', insertError);
        return NextResponse.json(
          { success: false, error: 'Study material was generated but could not be saved. Please try again.' },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, data: studyContent, documentId: document.id, pageCount },
        { status: 200 }
      );
    } catch (insertError: unknown) {
      console.error('Failed to save processed document:', insertError);
      return NextResponse.json(
        { success: false, error: 'Study material was generated but could not be saved. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Unhandled API route error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected internal server error occurred.' },
      { status: 500 }
    );
  }
}
