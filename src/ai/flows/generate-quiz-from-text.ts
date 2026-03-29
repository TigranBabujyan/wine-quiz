
'use server';

/**
 * @fileOverview Generates a quiz from a given text context.
 *
 * - generateQuizFromText - A function to generate a quiz from a block of text.
 * - GenerateQuizFromTextInput - The input type for the function.
 * - GenerateQuizFromTextOutput - The return type for the function (reusing from dynamic quiz).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateDynamicQuizOutputSchema, type GenerateDynamicQuizOutput } from '@/ai/schemas/quiz-schemas';


const GenerateQuizFromTextInputSchema = z.object({
  context: z.string().describe('The text content to generate the quiz from.'),
  numQuestions: z
    .number()
    .min(1)
    .max(25)
    .default(5)
    .describe('The number of questions to generate.'),
});
export type GenerateQuizFromTextInput = z.infer<
  typeof GenerateQuizFromTextInputSchema
>;

export type GenerateQuizFromTextOutput = GenerateDynamicQuizOutput;


export async function generateQuizFromText(
  input: GenerateQuizFromTextInput
): Promise<GenerateQuizFromTextOutput> {
  return generateQuizFromTextFlow(input);
}

const generateQuizFromTextPrompt = ai.definePrompt({
  name: 'generateQuizFromTextPrompt',
  input: {schema: GenerateQuizFromTextInputSchema},
  output: {schema: GenerateDynamicQuizOutputSchema},
  prompt: `You are an expert quiz creator. Your task is to generate a quiz with {{numQuestions}} questions based *only* on the provided context below. Do not use any external knowledge.

The quiz MUST be formatted as a JSON object with a "quiz" field that is an array of questions. Each question object in the array MUST have the following fields:

*   "question": The text of the question.
*   "options": An array of four strings representing the possible answers. One of these options MUST be the correct answer. The options should be plausible but clearly distinguishable based on the context.
*   "correctAnswer": The correct answer. This MUST be one of the options in the "options" array.

Example of the required JSON format:
\`\`\`json
{
  "quiz": [
    {
      "question": "What is the main grape mentioned in the text?",
      "options": ["Saperavi", "Areni", "Kangoun", "Voskehat"],
      "correctAnswer": "Areni"
    }
  ]
}
\`\`\`

Ensure that all questions and answers can be directly derived from the provided context.

Number of Questions to generate: {{numQuestions}}

Provided Context:
---
{{{context}}}
---
`,
});

const generateQuizFromTextFlow = ai.defineFlow(
  {
    name: 'generateQuizFromTextFlow',
    inputSchema: GenerateQuizFromTextInputSchema,
    outputSchema: GenerateDynamicQuizOutputSchema,
  },
  async input => {
    try {
      const {output} = await generateQuizFromTextPrompt(input);
      if (!output || !Array.isArray(output.quiz) || output.quiz.length === 0) {
        console.error('AI model returned invalid or empty quiz data. Output:', JSON.stringify(output));
        return { quiz: [] };
      }
      return output;
    } catch (e: any) {
      console.error("Error in generateQuizFromTextFlow:", e);
      throw new Error(`Quiz generation failed in flow: ${e.message}`);
    }
  }
);
