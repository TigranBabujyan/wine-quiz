
'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { GenerateDynamicQuizOutput } from '@/ai/flows/generate-dynamic-quiz';
import { QuizResults } from '@/components/quiz-results';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, User, HomeIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type QuizQuestion = GenerateDynamicQuizOutput['quiz'][0];

export type Answer = {
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  player?: string;
};

type QuizClientProps = {
  quizData: QuizQuestion[];
  mode?: 'single' | 'multiplayer' | 'arcade';
  player1?: string;
  player2?: string;
  timePerQuestion?: number;
  onArcadeFinish?: (score: number) => void;
  searchParams?: string;
};

export function QuizClient({ quizData, mode = 'single', player1 = 'Player 1', player2 = 'Player 2', timePerQuestion = 15, onArcadeFinish, searchParams }: QuizClientProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  // Multiplayer state
  const [currentPlayer, setCurrentPlayer] = useState(player1);
  const [scores, setScores] = useState({ [player1]: 0, [player2]: 0 });
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);

  const currentQuestion = useMemo(() => quizData[currentQuestionIndex], [quizData, currentQuestionIndex]);

  const handleFinish = useCallback(() => {
    if(mode === 'arcade' && onArcadeFinish) {
      const score = answers.filter(a => a.isCorrect).length;
      onArcadeFinish(score);
    }
    setIsFinished(true);
  }, [mode, answers, onArcadeFinish]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        if (mode === 'multiplayer') {
            setCurrentPlayer(currentPlayer === player1 ? player2 : player1);
        }
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(timePerQuestion);
    } else {
        handleFinish();
    }
  }, [currentQuestionIndex, quizData.length, mode, currentPlayer, player1, player2, timePerQuestion, handleFinish]);


  const handleAnswer = useCallback((selected: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(selected);
    const isCorrect = selected === currentQuestion.correctAnswer;
    const newAnswer: Answer = {
      question: currentQuestion.question,
      selectedAnswer: selected,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: isCorrect,
      player: mode === 'multiplayer' ? currentPlayer : undefined,
    };
    
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (mode === 'multiplayer' && isCorrect) {
      setScores(prev => ({...prev, [currentPlayer]: prev[currentPlayer] + 1}));
    } else if (mode === 'arcade') {
      const currentScore = updatedAnswers.filter(a => a.isCorrect).length;
      // This is a way to pass the score up to the parent arcade page
      const container = document.getElementById('arcade-quiz-container');
      if (container) {
          container.dataset.score = String(currentScore);
      }
    }


    setTimeout(() => {
        handleNext();
    }, 1500); // Wait 1.5 seconds before moving to the next question
  }, [isAnswered, currentQuestion, answers, mode, currentPlayer, handleNext]);
  
  useEffect(() => {
    // No timer for arcade mode questions
    if (isFinished || isAnswered || !currentQuestion || mode === 'arcade') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer('Time Ran Out'); // Force answer if time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, isAnswered, handleAnswer, currentQuestion, mode]);

  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

  if (isFinished) {
    return <QuizResults answers={answers} quizData={quizData} mode={mode} scores={scores} player1={player1} player2={player2} searchParams={searchParams} />;
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl shadow-2xl animate-slide-in-from-right" key={currentQuestionIndex}>
      <CardHeader>
        {mode !== 'arcade' && <Progress value={progress} className="mb-4" />}
        <div className="flex justify-between items-center">
            <CardDescription>
                {mode !== 'arcade' ? `Question ${currentQuestionIndex + 1} of ${quizData.length}` : `Question ${currentQuestionIndex + 1}`}
            </CardDescription>
          <div className="flex items-center gap-4">
              {mode === 'multiplayer' && (
                <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{currentPlayer}'s Turn</span>
                </div>
              )}
              {mode !== 'arcade' && (
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Timer className="h-4 w-4" />
                    <span>{timeLeft}s</span>
                </div>
              )}
            </div>
        </div>
        <CardTitle className="font-headline text-2xl mt-2">{currentQuestion.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedOption === option;
            const isCorrect = currentQuestion.correctAnswer === option;
            
            return (
              <Button 
                key={index}
                variant="outline"
                size="lg"
                className={cn("w-full justify-start h-auto py-4 text-base", 
                    isAnswered && isCorrect && "bg-green-100 border-green-500 text-green-800 hover:bg-green-200",
                    isAnswered && isSelected && !isCorrect && "bg-red-100 border-red-500 text-red-800 hover:bg-red-200",
                    isAnswered && !isSelected && "disabled:opacity-50"
                )}
                onClick={() => handleAnswer(option)}
                disabled={isAnswered}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
