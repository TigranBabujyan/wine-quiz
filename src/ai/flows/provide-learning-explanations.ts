
'use server';
/**
 * @fileOverview This file defines a Genkit flow for providing learning explanations when a user answers a quiz question incorrectly.
 *
 * - provideLearningExplanation - A function that generates an explanation for a given topic.
 * - ProvideLearningExplanationInput - The input type for the provideLearningExplanation function.
 * - ProvideLearningExplanationOutput - The return type for the provideLearningExplanation function.
 */

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

export async function provideLearningExplanation(input: ProvideLearningExplanationInput): Promise<ProvideLearningExplanationOutput> {
  return provideLearningExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideLearningExplanationPrompt',
  input: {schema: ProvideLearningExplanationInputSchema},
  output: {schema: ProvideLearningExplanationOutputSchema},
  prompt: `You are an expert wine educator. Provide a clear and concise explanation of the following topic related to wine, in the specified language.

Language: {{language}}
Topic: {{{topic}}}

Explanation:`,
});

const provideLearningExplanationFlow = ai.defineFlow(
  {
    name: 'provideLearningExplanationFlow',
    inputSchema: ProvideLearningExplanationInputSchema,
    outputSchema: ProvideLearningExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
