
'use server';

import { generateQuizFromText, type GenerateQuizFromTextInput, type GenerateQuizFromTextOutput } from '@/ai/flows/generate-quiz-from-text';

export async function getQuizFromText(context: string, numQuestions: number, apiKey?: string): Promise<GenerateQuizFromTextOutput> {
  try {
    const result = await generateQuizFromText({ context, numQuestions }, apiKey);
    return result;
  } catch (error) {
    console.error("Failed to get quiz from text:", error);
    return { quiz: [] };
  }
}
