import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { validatePdfFile } from '@/utils/validation';
import { extractTextFromPdf } from '@/lib/pdf';
import { generateStudyContent } from '@/lib/gemini';
import { withAuthenticatedApiUser } from '@/lib/supabase/api-auth';
import { formatErrorMessage } from '@/utils/formatError';
import type { StudyContent } from '@/types/study';

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

    // 2. Convert file to Buffer & Extract text
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';
    try {
      const pdfResult = await extractTextFromPdf(buffer);
      extractedText = pdfResult.text;
    } catch (pdfError: unknown) {
      const msg = pdfError instanceof Error ? pdfError.message : '';
      if (msg.includes('scanned/image-only') || msg.includes('readable text')) {
        return NextResponse.json(
          {
            success: false,
            error: "This PDF doesn't appear to contain readable text. Scanned/image-only PDFs aren't supported yet.",
          },
          { status: 422 }
        );
      }
      return NextResponse.json(
        { success: false, error: formatErrorMessage(pdfError) },
        { status: 400 }
      );
    }

    // 3. Process extracted text with Gemini
    let studyContent: StudyContent;
    try {
      studyContent = await generateStudyContent(extractedText);
    } catch (geminiError: unknown) {
      const errMsg = geminiError instanceof Error ? geminiError.message : '';
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
        { success: true, data: studyContent, documentId: document.id },
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
