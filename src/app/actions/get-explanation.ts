
'use server';

import { provideLearningExplanation } from '@/ai/flows/provide-learning-explanations';

export async function getExplanation(topic: string, language: string, apiKey?: string) {
  try {
    const result = await provideLearningExplanation({ topic, language }, apiKey);
    return result.explanation;
  } catch (error) {
    console.error("Failed to get explanation:", error);
    throw new Error("Failed to get explanation.");
  }
}
