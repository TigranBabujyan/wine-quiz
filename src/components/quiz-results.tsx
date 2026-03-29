
'use client';

import type { GenerateDynamicQuizOutput } from '@/ai/flows/generate-dynamic-quiz';
import type { Answer } from '@/app/quiz/quiz-client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningExplanation } from '@/components/learning-explanation';
import { CheckCircle2, XCircle, Award, Trophy, HomeIcon, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const backgroundImages = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
];

type QuizResultsProps = {
  answers: Answer[];
  quizData: GenerateDynamicQuizOutput['quiz'];
  mode?: 'single' | 'multiplayer' | 'arcade';
  scores?: { [key: string]: number };
  player1?: string;
  player2?: string;
  searchParams?: string;
};

function SinglePlayerResults({ answers, quizData, searchParams }: QuizResultsProps) {
    const score = answers.filter(a => a.isCorrect).length;
    const total = quizData.length;
    const scorePercentage = total > 0 ? (score / total) * 100 : 0;
    const isCustomQuiz = searchParams?.includes('Custom+Quiz');

    return (
        <Card className="text-center shadow-2xl mb-8 bg-card/90 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
                <div className="mx-auto bg-accent/20 rounded-full p-4 w-fit">
                    {isCustomQuiz ? <Wand2 className="h-12 w-12 text-accent" /> : <Award className="h-12 w-12 text-accent" />}
                </div>
                <CardTitle className="text-4xl font-headline mt-4">Quiz Complete!</CardTitle>
                <CardDescription className="text-xl">You scored</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-7xl font-bold text-primary">{score} / {total}</p>
                <p className="text-2xl text-foreground/80 mt-2">({scorePercentage.toFixed(0)}%)</p>
            </CardContent>
        </Card>
    )
}

function MultiplayerResults({ scores, player1, player2 }: QuizResultsProps) {
    if (!scores || !player1 || !player2) return null;
    const winner = scores[player1] > scores[player2] ? player1 : (scores[player2] > scores[player1] ? player2 : 'Draw');
    const winnerText = winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`;
    return (
        <Card className="text-center shadow-2xl mb-8 bg-card/90 backdrop-blur-sm animate-fade-in-up">
            <CardHeader>
                <div className="mx-auto bg-accent/20 rounded-full p-4 w-fit">
                    <Trophy className="h-12 w-12 text-accent" />
                </div>
                <CardTitle className="text-4xl font-headline mt-4">
                    {winnerText}
                </CardTitle>
                <CardDescription className="text-xl">Final Scores</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-around items-center">
                <div className="text-center">
                    <p className="text-2xl font-semibold">{player1}</p>
                    <p className="text-5xl font-bold text-primary">{scores[player1]}</p>
                </div>
                <div className="text-center">
                     <p className="text-2xl font-semibold">{player2}</p>
                    <p className="text-5xl font-bold text-primary">{scores[player2]}</p>
                </div>
            </CardContent>
        </Card>
    )
}


export function QuizResults({ answers, quizData, mode, scores, player1, player2, searchParams }: QuizResultsProps) {
  const [bgImage, setBgImage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBgImage(randomImage);
  }, []);

  const handlePlayAgain = () => {
    const isCustomQuiz = searchParams?.includes('Custom+Quiz');
    if (isCustomQuiz) {
      router.push('/quiz-generator');
      return;
    }
    if (mode === 'arcade') {
      window.location.reload();
    } else if (searchParams) {
      const params = new URLSearchParams(searchParams);
      params.set('key', Date.now().toString());
      router.push(`/quiz?${params.toString()}`);
    }
  };
  
  const isCustomQuiz = searchParams?.includes('Custom+Quiz');

  return (
    <div className="relative flex flex-col items-center justify-center w-full">
       <div className="absolute inset-0 -z-10">
        {bgImage && (
            <Image
                src={bgImage}
                alt="Wine background"
                fill
                priority
                className="object-cover saturate-50 opacity-20"
                data-ai-hint="vineyard grapes"
            />
        )}
      </div>
      <div className="w-full max-w-3xl">
          {mode === 'multiplayer' 
              ? <MultiplayerResults scores={scores} player1={player1} player2={player2} answers={answers} quizData={quizData} /> 
              : <SinglePlayerResults answers={answers} quizData={quizData} searchParams={searchParams} />
          }
          
          <div className="flex justify-center mb-8 gap-4 animate-fade-in-up animation-delay-300">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={handlePlayAgain}>
                {isCustomQuiz ? "Create New Quiz" : "Play Again"}
                </Button>
              <Link href="/" passHref>
                <Button size="lg" variant="outline"><HomeIcon className="mr-2" /> Home</Button>
              </Link>
          </div>
          
          <h2 className="text-3xl font-headline mb-4 text-center text-primary">Review Your Answers</h2>
          <div className="space-y-4">
              {quizData.map((question, index) => {
                  const answer = answers.find(a => a.question === question.question);
                  if (!answer) {
                      return null;
                  }
                  return (
                      <Card key={index} className={cn(!answer.isCorrect && 'border-destructive bg-destructive/5', 'bg-card/90 backdrop-blur-sm animate-fade-in-up')} style={{animationDelay: `${300 + (index * 100)}ms`}}>
                          <CardHeader>
                              <CardTitle className="flex items-start gap-4 text-xl">
                                  {answer.isCorrect ? (
                                      <CheckCircle2 className="h-6 w-6 text-green-600 mt-1 shrink-0" />
                                  ) : (
                                      <XCircle className="h-6 w-6 text-destructive mt-1 shrink-0" />
                                  )}
                                  <div className="flex-1">
                                      <span>{question.question}</span>
                                      {mode === 'multiplayer' && answer.player && <p className="text-sm font-normal text-muted-foreground mt-1">Answered by {answer.player}</p>}
                                  </div>
                              </CardTitle>
                          </CardHeader>
                          <CardContent className="pl-14">
                              <p className="text-base">Your answer: {answer.selectedAnswer}</p>
                              {!answer.isCorrect && (
                                  <p className="text-base">Correct answer: {answer.correctAnswer}</p>
                              )}
                          </CardContent>
                          {!answer.isCorrect && (
                              <CardFooter className="pl-14">
                                  <LearningExplanation topic={question.question} />
                              </CardFooter>
                          )}
                      </Card>
                  );
              })}
          </div>
      </div>
    </div>
  );
}
