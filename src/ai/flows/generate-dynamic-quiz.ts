
'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'genkit';
import { GenerateDynamicQuizOutputSchema } from '@/ai/schemas/quiz-schemas';
import { ai } from '@/ai/genkit';

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
export type GenerateDynamicQuizInput = z.infer<typeof GenerateDynamicQuizInputSchema>;

export type GenerateDynamicQuizOutput = {
  quiz: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
};

export async function generateDynamicQuiz(
  input: GenerateDynamicQuizInput,
  apiKey?: string
) {
  const promptText = `You are an expert in wine and winemaking. Generate a quiz with ${input.numQuestions} questions of ${input.difficulty} difficulty on the topic of ${input.category}.

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

Ensure that the questions are relevant to the specified category and difficulty level. The questions should be challenging but not obscure for the given difficulty level.

Difficulty: ${input.difficulty}
Category: ${input.category}
Number of Questions: ${input.numQuestions}
`;

  try {
    const instance = apiKey
      ? genkit({ plugins: [googleAI({ apiKey })], model: 'googleai/gemini-2.5-flash' })
      : ai;

    const { output } = await instance.generate({
      prompt: promptText,
      output: { schema: GenerateDynamicQuizOutputSchema },
    });

    if (!output || !Array.isArray(output.quiz) || output.quiz.length === 0) {
      console.error('AI model returned invalid or empty quiz data.');
      return { quiz: [] };
    }
    return output;
  } catch (e: any) {
    console.error('Error in generateDynamicQuiz:', e);
    throw new Error(`Quiz generation failed: ${e.message}`);
  }
}
