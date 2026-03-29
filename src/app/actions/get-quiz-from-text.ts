
'use server';

import { generateQuizFromText, type GenerateQuizFromTextInput, type GenerateQuizFromTextOutput } from '@/ai/flows/generate-quiz-from-text';

export async function getQuizFromText(context: string, numQuestions: number): Promise<GenerateQuizFromTextOutput> {
  try {
    const result = await generateQuizFromText({ context, numQuestions });
    return result;
  } catch (error) {
    console.error("Failed to get quiz from text:", error);
    // Returning an empty quiz array in case of an error for the client to handle
    return { quiz: [] };
  }
}
