
'use server';

/**
 * @fileOverview Generates a dynamic wine quiz based on difficulty and category.
 *
 * - generateDynamicQuiz - A function to generate a quiz.
 * - GenerateDynamicQuizInput - The input type for the generateDynamicQuiz function.
 * - GenerateDynamicQuizOutput - The return type for the generateDynamicQuiz function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { GenerateDynamicQuizOutputSchema } from '@/ai/schemas/quiz-schemas';

const QuizDifficultySchema = z.enum(['Easy', 'Normal', 'Hard']);
const QuizCategorySchema = z.enum([
  'Wine Varieties',
  'Winemaking Process',
  'Wine Regions',
  'Wine History',
  'Wine Industry',
  'Food Pairing',
]);

const GenerateDynamicQuizInputSchema = z.object({
  difficulty: QuizDifficultySchema.describe('The difficulty level of the quiz.'),
  category: QuizCategorySchema.describe('The category of the quiz.'),
  numQuestions: z
    .number()
    .min(1)
    .max(50)
    .default(10)
    .describe('The number of questions in the quiz.'),
});
export type GenerateDynamicQuizInput = z.infer<
  typeof GenerateDynamicQuizInputSchema
>;

export async function generateDynamicQuiz(
  input: GenerateDynamicQuizInput
) {
  return generateDynamicQuizFlow(input);
}

const generateDynamicQuizPrompt = ai.definePrompt({
  name: 'generateDynamicQuizPrompt',
  input: {schema: GenerateDynamicQuizInputSchema},
  output: {schema: GenerateDynamicQuizOutputSchema},
  prompt: `You are an expert in wine and winemaking. Generate a quiz with {{numQuestions}} questions of {{difficulty}} difficulty on the topic of {{category}}.

The quiz MUST be formatted as a JSON object with a "quiz" field that is an array of questions. Each question object in the array MUST have the following fields:

*   "question": The text of the question.
*   "options": An array of strings representing the possible answers. One of these options MUST be the correct answer.
*   "correctAnswer": The correct answer. This MUST be one of the options in the "options" array.

Example of the required JSON format:
\`\`\`json
{
  "quiz": [
    {
      "question": "What is the main grape used in Barolo wine?",
      "options": ["Sangiovese", "Nebbiolo", "Barbera", "Merlot"],
      "correctAnswer": "Nebbiolo"
    },
    {
      "question": "Which country is the Loire Valley in?",
      "options": ["Spain", "Italy", "France", "Portugal"],
      "correctAnswer": "France"
    }
  ]
}
\`\`\`

Ensure that the questions are relevant to the specified category and difficulty level. The questions should be challenging but not overly obscure for the given difficulty level.

Difficulty: {{difficulty}}
Category: {{category}}
Number of Questions: {{numQuestions}}

`,
});

const generateDynamicQuizFlow = ai.defineFlow(
  {
    name: 'generateDynamicQuizFlow',
    inputSchema: GenerateDynamicQuizInputSchema,
    outputSchema: GenerateDynamicQuizOutputSchema,
  },
  async input => {
    try {
      const {output} = await generateDynamicQuizPrompt(input);
      if (!output || !Array.isArray(output.quiz) || output.quiz.length === 0) {
        console.error('AI model returned invalid or empty quiz data. Output:', JSON.stringify(output));
        // Return an empty quiz, the client will handle this as an error state.
        return { quiz: [] };
      }
      return output;
    } catch (e: any) {
      console.error("Error in generateDynamicQuizFlow:", e);
       // Let the client know something went wrong, and it can show an error.
      throw new Error(`Quiz generation failed in flow: ${e.message}`);
    }
  }
);
