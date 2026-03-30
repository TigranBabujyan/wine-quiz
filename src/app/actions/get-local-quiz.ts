'use server';

import quizData from '@/data/wine-quiz-data.json';

type Difficulty = 'Easy' | 'Normal' | 'Hard';
type Category =
  | 'Wine Varieties'
  | 'Winemaking Process'
  | 'Wine Regions'
  | 'Wine History'
  | 'Wine Industry'
  | 'Food Pairing';

export interface LocalQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getLocalQuiz(
  category: Category,
  difficulty: Difficulty,
  numQuestions: number
): Promise<LocalQuizQuestion[]> {
  const pool = quizData.questions.filter(
    (q) => q.category === category && q.difficulty === difficulty
  );

  const shuffled = shuffle(pool);
  const selected = shuffled.slice(0, Math.min(numQuestions, shuffled.length));

  return selected.map(({ question, options, correctAnswer }) => ({
    question,
    options: shuffle(options),
    correctAnswer,
  }));
}
