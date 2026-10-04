import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateQuiz } from '@/lib/gemini';
import { withAuthenticatedApiUser } from '@/lib/supabase/api-auth';
import { formatErrorMessage } from '@/utils/formatError';
import type { QuizQuestion } from '@/types/quiz';

interface GenerateQuizRequestBody {
  documentId?: string;
}

export async function POST(request: NextRequest) {
  return withAuthenticatedApiUser(request, (user, supabase) =>
    handleGenerateQuiz(request, user.id, supabase)
  );
}

async function handleGenerateQuiz(
  request: NextRequest,
  userId: string,
  supabase: SupabaseClient
) {
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

    if (typeof body.documentId !== 'string' || !body.documentId.trim()) {
      return NextResponse.json(
        { success: false, error: 'A documentId is required to generate a quiz.' },
        { status: 400 }
      );
    }

    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(body.documentId)) {
      return NextResponse.json(
        { success: false, error: 'Study document not found.' },
        { status: 404 }
      );
    }

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('study_content')
      .eq('id', body.documentId)
      .eq('user_id', userId)
      .maybeSingle();

    if (documentError) {
      console.error('Failed to load document for quiz generation:', documentError);
      return NextResponse.json(
        { success: false, error: 'Could not load the requested study document.' },
        { status: 500 }
      );
    }

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Study document not found.' },
        { status: 404 }
      );
    }

    let questions: QuizQuestion[];
    try {
      questions = await generateQuiz(document.study_content);
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

    const { error: saveError } = await supabase.rpc('replace_quiz_questions', {
      p_document_id: body.documentId,
      p_questions: questions.map(
        ({ question, options, correctAnswer, explanation, topic, difficulty }) => ({
          question,
          options,
          correctAnswer,
          explanation,
          topic: topic ?? null,
          difficulty: difficulty ?? null,
        })
      ),
    });

    if (saveError) {
      console.error('Failed to save generated quiz questions:', saveError);
      return NextResponse.json(
        { success: false, error: 'Quiz questions were generated but could not be saved.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          questions,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Unhandled generate-quiz route error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while generating the quiz.' },
      { status: 500 }
    );
  }
}
