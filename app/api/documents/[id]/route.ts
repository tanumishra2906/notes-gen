import { NextRequest, NextResponse } from 'next/server';
import type { Flashcard } from '@/types/flashcards';
import type { QuizQuestion } from '@/types/quiz';
import { withAuthenticatedApiUser } from '@/lib/supabase/api-auth';

interface DocumentRouteContext {
  params: Promise<{ id: string }>;
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(request: NextRequest, { params }: DocumentRouteContext) {
  const { id } = await params;

  return withAuthenticatedApiUser(request, async (user, supabase) => {
    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json(
        { success: false, error: 'Document id must be a valid UUID.' },
        { status: 400 }
      );
    }

    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('id, title, source_filename, created_at, study_content')
      .eq('id', id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (documentError) {
      console.error('Failed to load study document:', documentError);
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

    const [flashcardsResult, quizQuestionsResult] = await Promise.all([
      supabase
        .from('flashcards')
        .select('id, question, answer, topic, difficulty')
        .eq('document_id', id)
        .eq('user_id', user.id)
        .order('position', { ascending: true }),
      supabase
        .from('quiz_questions')
        .select(
          'id, question, options, correct_answer, explanation, topic, difficulty'
        )
        .eq('document_id', id)
        .eq('user_id', user.id)
        .order('position', { ascending: true }),
    ]);

    if (flashcardsResult.error || quizQuestionsResult.error) {
      console.error(
        'Failed to load generated study material:',
        flashcardsResult.error || quizQuestionsResult.error
      );
      return NextResponse.json(
        { success: false, error: 'Could not load the document’s generated study material.' },
        { status: 500 }
      );
    }

    const flashcards: Flashcard[] = flashcardsResult.data.map((row) => ({
      id: row.id,
      question: row.question,
      answer: row.answer,
      ...(row.topic !== null ? { topic: row.topic } : {}),
      ...(row.difficulty !== null
        ? { difficulty: row.difficulty as Flashcard['difficulty'] }
        : {}),
    }));

    const quizQuestions: QuizQuestion[] = quizQuestionsResult.data.map((row) => ({
      id: row.id,
      question: row.question,
      options: row.options as string[],
      correctAnswer: row.correct_answer,
      explanation: row.explanation,
      ...(row.topic !== null ? { topic: row.topic } : {}),
      ...(row.difficulty !== null
        ? { difficulty: row.difficulty as QuizQuestion['difficulty'] }
        : {}),
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          id: document.id,
          title: document.title,
          source_filename: document.source_filename,
          created_at: document.created_at,
          study_content: document.study_content,
          flashcards,
          quizQuestions,
        },
      },
      { status: 200 }
    );
  });
}
