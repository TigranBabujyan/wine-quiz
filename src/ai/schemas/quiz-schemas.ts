/**
 * @fileOverview Shared Zod schemas for quiz generation.
 * This file does not contain 'use server' and can be safely imported by both
 * server and client components.
 */

import { z } from 'genkit';

export const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).describe('The possible answers to the question.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});

export const GenerateDynamicQuizOutputSchema = z.object({
  quiz: z.array(QuizQuestionSchema).describe('The generated quiz questions.'),
});

export type GenerateDynamicQuizOutput = z.infer<
  typeof GenerateDynamicQuizOutputSchema
>;
