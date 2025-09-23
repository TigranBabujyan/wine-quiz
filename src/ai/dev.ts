import { config } from 'dotenv';
config();

import '@/ai/schemas/quiz-schemas.ts';
import '@/ai/flows/provide-learning-explanations.ts';
import '@/ai/flows/generate-dynamic-quiz.ts';
import '@/ai/flows/generate-quiz-from-text.ts';
