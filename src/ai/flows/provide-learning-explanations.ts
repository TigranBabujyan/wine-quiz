
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing learning explanations when a user answers a quiz question incorrectly.
 *
 * - provideLearningExplanation - A function that generates an explanation for a given topic.
 * - ProvideLearningExplanationInput - The input type for the provideLearningExplanation function.
 * - ProvideLearningExplanationOutput - The return type for the provideLearningExplanation function.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideLearningExplanationInputSchema = z.object({
  topic: z.string().describe('The topic for which to provide an explanation.'),
  language: z.string().optional().default('en').describe('The language for the explanation.'),
});
export type ProvideLearningExplanationInput = z.infer<typeof ProvideLearningExplanationInputSchema>;

const ProvideLearningExplanationOutputSchema = z.object({
  explanation: z.string().describe('The generated explanation for the topic.'),
});
export type ProvideLearningExplanationOutput = z.infer<typeof ProvideLearningExplanationOutputSchema>;

export async function provideLearningExplanation(input: ProvideLearningExplanationInput, apiKey?: string): Promise<ProvideLearningExplanationOutput> {
  const promptText = `You are an expert wine educator. Provide a clear and concise explanation of the following topic related to wine, in the specified language.

Language: ${input.language || 'en'}
Topic: ${input.topic}

Explanation:`;

  try {
    const instance = apiKey
      ? genkit({ plugins: [googleAI({ apiKey })], model: 'googleai/gemini-2.5-flash' })
      : ai;

    const { output } = await instance.generate({
      prompt: promptText,
      output: { schema: ProvideLearningExplanationOutputSchema },
    });

    return output!;
  } catch (e: any) {
    console.error('Error in provideLearningExplanation:', e);
    throw new Error(`Explanation generation failed: ${e.message}`);
  }
}
