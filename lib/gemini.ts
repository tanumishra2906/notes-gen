import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { StudyContent } from '@/types/study';
import { Flashcard } from '@/types/flashcards';
import { QuizQuestion } from '@/types/quiz';

export async function generateStudyContent(extractedText: string): Promise<StudyContent> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please set it in your .env.local file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const studyContentSchema: any = {
    type: SchemaType.OBJECT,
    properties: {
      summary: {
        type: SchemaType.STRING,
        description: 'A comprehensive summary of the study material in roughly 150-250 words.',
      },
      keyConcepts: {
        type: SchemaType.ARRAY,
        description: 'Key concepts with detailed explanations.',
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            explanation: { type: SchemaType.STRING },
          },
          required: ['title', 'explanation'],
        },
      },
      definitions: {
        type: SchemaType.ARRAY,
        description: 'Important terms and their definitions.',
        items: {
          type: SchemaType.OBJECT,
          properties: {
            term: { type: SchemaType.STRING },
            definition: { type: SchemaType.STRING },
          },
          required: ['term', 'definition'],
        },
      },
      importantFacts: {
        type: SchemaType.ARRAY,
        description: 'Crucial facts, stats, or key takeaways mentioned in the text.',
        items: { type: SchemaType.STRING },
      },
      formulas: {
        type: SchemaType.ARRAY,
        description: 'Formulas, equations, or symbolic rules. Return empty array if none are found in the text.',
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING },
            formula: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING },
          },
          required: ['name', 'formula', 'description'],
        },
      },
    },
    required: ['summary', 'keyConcepts', 'definitions', 'importantFacts', 'formulas'],
  };

  // Active Gemini models (prioritizing high-speed & schema-compliant flash models)
  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash-lite',
    'gemini-flash-latest',
  ];

  const prompt = `You are an expert AI Study Assistant.
Analyze the following text extracted from a study guide or textbook chapter.
Create a structured study guide based STRICTLY on the text provided below. Do NOT hallucinate or add facts from outside sources.

Text content:
"""
${extractedText}
"""

Instructions:
1. "summary": Provide a clear, structured summary of roughly 150-250 words capturing the primary topic and themes.
2. "keyConcepts": Extract 3-7 core concepts with titles and clear explanations.
3. "definitions": Extract key technical terms or vocabulary words and their exact definitions based on the text.
4. "importantFacts": List 5-10 key facts, bullet points, or takeaways.
5. "formulas": Extract any formulas, equations, or scientific laws. If the material does not contain any formulas (e.g. history, literature, humanities), return an empty array [].

Return strictly JSON format matching the schema.`;

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: studyContentSchema,
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Clean up potential markdown code block wrappers if any
      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      const parsedData: StudyContent = JSON.parse(cleanedText);

      // Defensive fallback validation
      return {
        summary: parsedData.summary || 'No summary available.',
        keyConcepts: Array.isArray(parsedData.keyConcepts) ? parsedData.keyConcepts : [],
        definitions: Array.isArray(parsedData.definitions) ? parsedData.definitions : [],
        importantFacts: Array.isArray(parsedData.importantFacts) ? parsedData.importantFacts : [],
        formulas: Array.isArray(parsedData.formulas) ? parsedData.formulas : [],
      };
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message || '';
      if (
        errorMsg.includes('404') ||
        errorMsg.includes('not found') ||
        errorMsg.includes('503') ||
        errorMsg.includes('high demand')
      ) {
        console.warn(`Gemini model '${modelName}' returned transient error (${errorMsg.substring(0, 80)}...). Retrying with fallback model...`);
        continue;
      }
      if (error.status === 429 || errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
        throw new Error('429');
      }
      console.warn(`Gemini model '${modelName}' failed with: ${errorMsg.substring(0, 100)}`);
    }
  }

  console.error('All Gemini models failed:', lastError);
  const finalMsg = lastError?.message || '';
  if (finalMsg.includes('503') || finalMsg.includes('high demand')) {
    throw new Error('503');
  }
  if (finalMsg.includes('429') || finalMsg.toLowerCase().includes('quota')) {
    throw new Error('429');
  }
  throw new Error(`Failed to generate study guide: ${lastError?.message || 'Invalid AI response format'}`);
}

export async function generateFlashcards(
  sourceContent: StudyContent | string
): Promise<Flashcard[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please set it in your .env.local file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  let formattedText = '';
  if (typeof sourceContent === 'string') {
    formattedText = sourceContent;
  } else {
    formattedText = `
SUMMARY:
${sourceContent.summary}

KEY CONCEPTS:
${sourceContent.keyConcepts?.map((c) => `- ${c.title}: ${c.explanation}`).join('\n') || ''}

DEFINITIONS:
${sourceContent.definitions?.map((d) => `- ${d.term}: ${d.definition}`).join('\n') || ''}

IMPORTANT FACTS:
${sourceContent.importantFacts?.map((f) => `- ${f}`).join('\n') || ''}

FORMULAS:
${sourceContent.formulas?.map((f) => `- ${f.name}: ${f.formula} (${f.description})`).join('\n') || ''}
`.trim();
  }

  const flashcardsSchema: any = {
    type: SchemaType.OBJECT,
    properties: {
      flashcards: {
        type: SchemaType.ARRAY,
        description: 'A collection of educational study flashcards.',
        items: {
          type: SchemaType.OBJECT,
          properties: {
            question: {
              type: SchemaType.STRING,
              description: 'The study question or prompt displayed on the front of the flashcard.',
            },
            answer: {
              type: SchemaType.STRING,
              description: 'The concise, accurate explanation or answer on the back of the flashcard.',
            },
            topic: {
              type: SchemaType.STRING,
              description: 'The relevant category or subtopic name.',
            },
            difficulty: {
              type: SchemaType.STRING,
              description: 'Difficulty rating: easy, medium, or hard.',
            },
          },
          required: ['question', 'answer'],
        },
      },
    },
    required: ['flashcards'],
  };

  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash-lite',
    'gemini-flash-latest',
  ];

  const prompt = `You are an expert AI Study Assistant specializing in flashcard creation for rapid memorization and deep understanding.
Create 6-12 high-quality, educational flashcards based STRICTLY on the study material provided below.
Do NOT invent information or draw from outside knowledge.

Study Material:
"""
${formattedText}
"""

Guidelines for Flashcards:
1. Cover core concepts, definitions, key facts, and formulas present in the text.
2. Formulate clear, focused questions for the front of each card.
3. Provide concise, clear, and comprehensive answers for the back of each card.
4. Assign a category/topic name based on the section of material.
5. Assign a difficulty rating ("easy", "medium", or "hard").
6. Ensure questions are distinct and avoid duplicate questions.

Return strictly JSON matching the required schema.`;

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: flashcardsSchema,
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanedText);

      const rawCards = Array.isArray(parsedData.flashcards) ? parsedData.flashcards : [];

      const flashcards: Flashcard[] = rawCards.map((card: any, idx: number) => ({
        id: `card-${Date.now()}-${idx + 1}`,
        question: card.question || 'Untitled Question',
        answer: card.answer || 'No answer provided.',
        topic: card.topic || 'General',
        difficulty: ['easy', 'medium', 'hard'].includes(card.difficulty?.toLowerCase())
          ? (card.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard')
          : 'medium',
      }));

      if (flashcards.length === 0) {
        throw new Error('No flashcards generated from text.');
      }

      return flashcards;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message || '';
      if (
        errorMsg.includes('404') ||
        errorMsg.includes('not found') ||
        errorMsg.includes('503') ||
        errorMsg.includes('high demand')
      ) {
        console.warn(`Gemini model '${modelName}' returned transient error (${errorMsg.substring(0, 80)}...). Retrying fallback model...`);
        continue;
      }
      if (error.status === 429 || errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
        throw new Error('429');
      }
      console.warn(`Gemini model '${modelName}' failed: ${errorMsg.substring(0, 100)}`);
    }
  }

  console.error('All Gemini models failed for flashcards:', lastError);
  const finalMsg = lastError?.message || '';
  if (finalMsg.includes('503') || finalMsg.includes('high demand')) {
    throw new Error('503');
  }
  if (finalMsg.includes('429') || finalMsg.toLowerCase().includes('quota')) {
    throw new Error('429');
  }
  throw new Error(`Failed to generate flashcards: ${lastError?.message || 'Invalid AI response'}`);
}

export async function generateQuiz(
  sourceContent: StudyContent | string
): Promise<QuizQuestion[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing. Please set it in your .env.local file.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  let formattedText = '';
  if (typeof sourceContent === 'string') {
    formattedText = sourceContent;
  } else {
    formattedText = `
SUMMARY:
${sourceContent.summary}

KEY CONCEPTS:
${sourceContent.keyConcepts?.map((c) => `- ${c.title}: ${c.explanation}`).join('\n') || ''}

DEFINITIONS:
${sourceContent.definitions?.map((d) => `- ${d.term}: ${d.definition}`).join('\n') || ''}

IMPORTANT FACTS:
${sourceContent.importantFacts?.map((f) => `- ${f}`).join('\n') || ''}

FORMULAS:
${sourceContent.formulas?.map((f) => `- ${f.name}: ${f.formula} (${f.description})`).join('\n') || ''}
`.trim();
  }

  const quizSchema: any = {
    type: SchemaType.OBJECT,
    properties: {
      questions: {
        type: SchemaType.ARRAY,
        description: 'A list of multiple choice quiz questions derived from the study material.',
        items: {
          type: SchemaType.OBJECT,
          properties: {
            question: {
              type: SchemaType.STRING,
              description: 'Clear, meaningful multiple choice question string.',
            },
            options: {
              type: SchemaType.ARRAY,
              description: 'Array of exactly 4 distinct multiple choice option strings.',
              items: { type: SchemaType.STRING },
            },
            correctAnswer: {
              type: SchemaType.INTEGER,
              description: '0-based index (0, 1, 2, or 3) indicating the correct answer option in the options array.',
            },
            explanation: {
              type: SchemaType.STRING,
              description: 'Clear, educational explanation explaining why the correct answer is right.',
            },
            topic: {
              type: SchemaType.STRING,
              description: 'Category or subtopic name derived from the material.',
            },
            difficulty: {
              type: SchemaType.STRING,
              description: 'Difficulty rating: easy, medium, or hard.',
            },
          },
          required: ['question', 'options', 'correctAnswer', 'explanation'],
        },
      },
    },
    required: ['questions'],
  };

  const candidateModels = [
    'gemini-3.6-flash',
    'gemini-3.5-flash',
    'gemini-3-flash-preview',
    'gemini-2.5-flash-lite',
    'gemini-flash-latest',
  ];

  const prompt = `You are an expert AI Study Assistant specializing in creating educational multiple-choice quizzes.
Analyze the following study material carefully and generate 5-10 multiple-choice questions.
Do NOT invent information or draw from outside knowledge.

Study Material:
"""
${formattedText}
"""

Guidelines for Quiz Questions:
1. Base every question STRICTLY on the facts, concepts, definitions, and formulas provided above.
2. Provide exactly 4 plausible option choices for every question.
3. Set "correctAnswer" to a 0-based integer index (0, 1, 2, or 3) matching the correct choice in the options array.
4. Ensure distractor options are realistic and relevant.
5. Provide a concise, clear explanation for the correct answer.
6. Assign a category/topic name and difficulty rating ("easy", "medium", or "hard").
7. Ensure questions test understanding and key facts, avoiding duplicate questions.

Return strictly JSON matching the required schema.`;

  let lastError: any = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: quizSchema,
        },
      });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      const cleanedText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsedData = JSON.parse(cleanedText);

      const rawQuestions = Array.isArray(parsedData.questions) ? parsedData.questions : [];

      const questions: QuizQuestion[] = rawQuestions
        .filter((q: any) => q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length >= 2)
        .map((q: any, idx: number) => {
          const validOptions = q.options.map((opt: any) => String(opt).trim());
          let correctIdx = typeof q.correctAnswer === 'number' ? Math.floor(q.correctAnswer) : 0;
          if (correctIdx < 0 || correctIdx >= validOptions.length) {
            correctIdx = 0;
          }

          return {
            id: `quiz-q-${Date.now()}-${idx + 1}`,
            question: q.question.trim(),
            options: validOptions,
            correctAnswer: correctIdx,
            explanation: q.explanation ? String(q.explanation).trim() : 'Correct based on study material.',
            topic: q.topic || 'General',
            difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty?.toLowerCase())
              ? (q.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard')
              : 'medium',
          };
        });

      if (questions.length === 0) {
        throw new Error('No valid quiz questions generated from text.');
      }

      return questions;
    } catch (error: any) {
      lastError = error;
      const errorMsg = error.message || '';
      if (
        errorMsg.includes('404') ||
        errorMsg.includes('not found') ||
        errorMsg.includes('503') ||
        errorMsg.includes('high demand')
      ) {
        console.warn(`Gemini model '${modelName}' returned transient error (${errorMsg.substring(0, 80)}...). Retrying fallback model...`);
        continue;
      }
      if (error.status === 429 || errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota')) {
        throw new Error('429');
      }
      console.warn(`Gemini model '${modelName}' failed for quiz: ${errorMsg.substring(0, 100)}`);
    }
  }

  console.error('All Gemini models failed for quiz:', lastError);
  const finalMsg = lastError?.message || '';
  if (finalMsg.includes('503') || finalMsg.includes('high demand')) {
    throw new Error('503');
  }
  if (finalMsg.includes('429') || finalMsg.toLowerCase().includes('quota')) {
    throw new Error('429');
  }
  throw new Error(`Failed to generate quiz: ${lastError?.message || 'Invalid AI response'}`);
}
