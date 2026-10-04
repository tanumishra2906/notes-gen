import { NextRequest, NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateFlashcards } from '@/lib/gemini';
import { withAuthenticatedApiUser } from '@/lib/supabase/api-auth';
import { formatErrorMessage } from '@/utils/formatError';
import type { Flashcard } from '@/types/flashcards';

interface GenerateFlashcardsRequestBody {
  documentId?: string;
}

export async function POST(request: NextRequest) {
  return withAuthenticatedApiUser(request, (user, supabase) =>
    handleGenerateFlashcards(request, user.id, supabase)
  );
}

async function handleGenerateFlashcards(
  request: NextRequest,
  userId: string,
  supabase: SupabaseClient
) {
  try {
    let body: GenerateFlashcardsRequestBody;
    try {
      const parsedBody: unknown = await request.json();
      body =
        parsedBody && typeof parsedBody === 'object'
          ? (parsedBody as GenerateFlashcardsRequestBody)
          : {};
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload in request.' },
        { status: 400 }
      );
    }

    if (typeof body.documentId !== 'string' || !body.documentId.trim()) {
      return NextResponse.json(
        { success: false, error: 'A documentId is required to generate flashcards.' },
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
      console.error('Failed to load document for flashcard generation:', documentError);
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

    let flashcards: Flashcard[];
    try {
      flashcards = await generateFlashcards(document.study_content);
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

    const { error: saveError } = await supabase.rpc('replace_flashcards', {
      p_document_id: body.documentId,
      p_cards: flashcards.map(({ question, answer, topic, difficulty }) => ({
        question,
        answer,
        topic: topic ?? null,
        difficulty: difficulty ?? null,
      })),
    });

    if (saveError) {
      console.error('Failed to save generated flashcards:', saveError);
      return NextResponse.json(
        { success: false, error: 'Flashcards were generated but could not be saved.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          flashcards,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Unhandled generate-flashcards route error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred while generating flashcards.' },
      { status: 500 }
    );
  }
}
