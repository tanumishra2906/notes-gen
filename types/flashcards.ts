export type FlashcardDifficulty = 'easy' | 'medium' | 'hard';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic?: string;
  difficulty?: FlashcardDifficulty;
}

export interface GenerateFlashcardsRequest {
  studyContent?: any;
  text?: string;
}

export interface GenerateFlashcardsSuccessResponse {
  success: true;
  data: {
    flashcards: Flashcard[];
  };
}

export interface GenerateFlashcardsErrorResponse {
  success: false;
  error: string;
}

export type GenerateFlashcardsResponse =
  | GenerateFlashcardsSuccessResponse
  | GenerateFlashcardsErrorResponse;

export type FlashcardStatus = 'idle' | 'loading' | 'success' | 'error';
