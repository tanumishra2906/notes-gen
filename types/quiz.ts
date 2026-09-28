export type QuizDifficulty = 'easy' | 'medium' | 'hard';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index referring to options array
  explanation: string;
  topic?: string;
  difficulty?: QuizDifficulty;
}

export interface GenerateQuizRequest {
  studyContent?: any;
  text?: string;
}

export interface GenerateQuizSuccessResponse {
  success: true;
  data: {
    questions: QuizQuestion[];
  };
}

export interface GenerateQuizErrorResponse {
  success: false;
  error: string;
}

export type GenerateQuizResponse =
  | GenerateQuizSuccessResponse
  | GenerateQuizErrorResponse;

export type QuizStatus = 'idle' | 'loading' | 'success' | 'error';
