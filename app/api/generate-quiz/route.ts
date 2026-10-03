import { NextRequest, NextResponse } from 'next/server';
import { generateQuiz } from '@/lib/gemini';
import { withAuthenticatedApiUser } from '@/lib/supabase/api-auth';
import { formatErrorMessage } from '@/utils/formatError';
import type { StudyContent } from '@/types/study';

interface GenerateQuizRequestBody {
  studyContent?: StudyContent;
  text?: string;
}

export async function POST(request: NextRequest) {
  return withAuthenticatedApiUser(request, () => handleGenerateQuiz(request));
}

async function handleGenerateQuiz(request: NextRequest) {
  try {
    let body: GenerateQuizRequestBody;
    try {
      const parsedBody: unknown = await request.json();
      body =
        parsedBody && typeof parsedBody === 'object'
          ? (parsedBody as GenerateQuizRequestBody)
          : {};
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload in request.' },
        { status: 400 }
      );
    }

    const { studyContent, text } = body;
    const sourceContent =
      studyContent || (text && text.trim().length > 0 ? text : undefined);

    if (!sourceContent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing study content context. Please process a document first.',
        },
        { status: 400 }
      );
    }

    try {
      const questions = await generateQuiz(sourceContent);
      return NextResponse.json(
        {
          success: true,
          data: {
            questions,
          },
        },
        { status: 200 }
      );
    } catch (geminiError: unknown) {
      const errMsg = geminiError instanceof Error ? geminiError.message : '';
      if (errMsg === '429' || errMsg.includes('429')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many requests. Please wait a moment and try again.',
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
  } catch (error: unknown) {
    console.error('Unhandled generate-quiz route error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while generating the quiz.' },
      { status: 500 }
    );
  }
}
