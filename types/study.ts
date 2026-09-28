export interface KeyConcept {
  title: string;
  explanation: string;
}

export interface Definition {
  term: string;
  definition: string;
}

export interface Formula {
  name: string;
  formula: string;
  description: string;
}

export interface StudyContent {
  summary: string;
  keyConcepts: KeyConcept[];
  definitions: Definition[];
  importantFacts: string[];
  formulas: Formula[];
}

export interface ProcessPdfSuccessResponse {
  success: true;
  data: StudyContent;
}

export interface ProcessPdfErrorResponse {
  success: false;
  error: string;
}

export type ProcessPdfResponse = ProcessPdfSuccessResponse | ProcessPdfErrorResponse;

export type ProcessingStatus = 'idle' | 'extracting' | 'analyzing' | 'success' | 'error';
