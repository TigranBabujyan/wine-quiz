
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { generateDynamicQuiz, type GenerateDynamicQuizInput, type GenerateDynamicQuizOutput } from '@/ai/flows/generate-dynamic-quiz';
import { QuizClient } from '../quiz/quiz-client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Zap, Timer, PlayCircle, HomeIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { LoadingSlideshow } from '@/components/loading-slideshow';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

const ARCADE_DURATION = 5 * 60; // 5 minutes in seconds
const LEADERBOARD_KEY = 'wineWiseLeaderboard';
const backgroundImages = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
];

function ArcadeContent() {
  const [gameState, setGameState] = useState<'ready' | 'loading' | 'loaded' | 'playing' | 'finished' | 'error'>('ready');
  const [quizData, setQuizData] = useState<GenerateDynamicQuizOutput['quiz'] | null>(null);
  const [timeLeft, setTimeLeft] = useState(ARCADE_DURATION);
  const [finalScore, setFinalScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setBgImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
  }, []);

  const fetchQuiz = useCallback(async () => {
      setGameState('loading');
      setError(null);
      const quizParams: GenerateDynamicQuizInput = {
        difficulty: 'Normal',
        category: 'Wine Varieties',
        numQuestions: 50,
      };
      try {
        const result = await generateDynamicQuiz(quizParams);
        if (!result || !result.quiz || result.quiz.length === 0) {
          // This case is now handled more gracefully in the flow, but we keep client-side validation as a backup.
          throw new Error("The AI failed to generate a valid quiz. Please try again.");
        }
        setQuizData(result.quiz);
        setGameState('loaded');
      } catch (err: any) {
        console.error("Arcade quiz generation failed:", err);
        const isOverloaded = err.message?.includes('503') || err.message?.includes('overloaded') || err.message?.includes('rate limit');
        setError(isOverloaded
            ? "The AI model is currently overloaded. Please wait a moment and try again."
            : "Could not load the quiz. The AI model might be temporarily unavailable. Please try again later.");
        setGameState('error');
      }
  }, []);
  
  const startGame = () => {
    setGameState('playing');
    setTimeLeft(ARCADE_DURATION);
  }

  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
        const container = document.getElementById('arcade-quiz-container');
        const currentScore = container?.dataset.score || '0';
        handleQuizFinish(parseInt(currentScore, 10)); 
        return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleQuizFinish = useCallback((score: number) => {
    setFinalScore(score);
    setGameState('finished');
  }, []);
  
  const submitScore = () => {
    try {
      const existingLeaderboard = localStorage.getItem(LEADERBOARD_KEY);
      const leaderboard = existingLeaderboard ? JSON.parse(existingLeaderboard) : [];
      
      const newEntry = { name: playerName, score: finalScore };
      leaderboard.push(newEntry);
      
      leaderboard.sort((a: {score: number}, b: {score: number}) => b.score - a.score);
      
      const rankedLeaderboard = leaderboard.map((entry: any, index: number) => ({
        ...entry,
        rank: index + 1
      }));

      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(rankedLeaderboard));
    } catch (e) {
      console.error("Failed to save score to leaderboard:", e);
    }
    router.push('/');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const renderContent = () => {
    switch (gameState) {
      case 'ready':
        return (
          <Card className="w-full max-w-md text-center shadow-2xl animate-fade-in-up mx-auto">
            <CardHeader>
              <div className="mx-auto bg-accent/20 rounded-full p-4 w-fit">
                <Zap className="h-12 w-12 text-accent" />
              </div>
              <CardTitle className="text-4xl font-headline mt-4">Arcade Mode</CardTitle>
              <CardDescription className="text-lg">Answer as many questions as you can in 5 minutes!</CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-2">
              <Button onClick={fetchQuiz} size="lg" className="w-full">
                Start Playing
              </Button>
               <Link href="/" passHref>
                <Button variant="outline"><HomeIcon className="mr-2" /> Back to Home</Button>
              </Link>
            </CardFooter>
          </Card>
        );
      case 'loading':
        return <LoadingSlideshow />;
      case 'loaded':
        return (
          <Card className="w-full max-w-2xl text-center shadow-2xl animate-fade-in-up">
            <CardHeader>
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <PlayCircle className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-4xl font-headline mt-4">Quiz is Ready!</CardTitle>
              <CardDescription className="text-xl">Your 5-minute challenge is about to begin.</CardDescription>
            </CardHeader>
            <CardFooter className="flex-col gap-2">
              <Button onClick={startGame} size="lg" className="w-full">
                Start Quiz
              </Button>
            </CardFooter>
          </Card>
        );
      case 'error':
        return (
             <Alert variant="destructive" className="text-center max-w-md mx-auto">
                <AlertCircle className="h-4 w-4 mx-auto mb-2" />
                <AlertTitle>Error Loading Quiz</AlertTitle>
                <AlertDescription>
                  {error || "Something went wrong. Please try again."}
                </AlertDescription>
                <Button onClick={() => setGameState('ready')} variant="outline" className="mt-4">Try Again</Button>
              </Alert>
        );
      case 'playing':
        return (
          <>
            <div className="bg-card/90 backdrop-blur-sm rounded-lg shadow-lg p-4 mb-8 flex justify-between items-center sticky top-4 z-10">
              <h2 className="text-2xl font-headline text-primary">Arcade Mode</h2>
              <div className="flex items-center gap-2 text-2xl font-bold text-accent">
                <Timer className="h-6 w-6"/>
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div id="arcade-quiz-container">
             {quizData ? (
                <QuizClient quizData={quizData} mode="arcade" onArcadeFinish={handleQuizFinish} searchParams={searchParams.toString()} />
             ) : (
                <Skeleton className="h-96 w-full" />
             )}
            </div>
          </>
        );
      case 'finished':
        return (
          <Card className="w-full max-w-md text-center shadow-2xl animate-fade-in-up">
            <CardHeader>
              <CardTitle className="text-4xl font-headline">Time's Up!</CardTitle>
              <CardDescription className="text-xl">Your final score is:</CardDescription>
              <p className="text-7xl font-bold text-primary">{finalScore}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-left">
                <Label htmlFor="playerName">Enter Your Name</Label>
                <Input 
                  id="playerName" 
                  placeholder="Wine Master" 
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button onClick={submitScore} disabled={!playerName} className="w-full">Submit Score & Go Home</Button>
              <Button onClick={() => window.location.reload()} variant="outline" className="w-full">Play Again</Button>
            </CardFooter>
          </Card>
        );
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="absolute inset-0 -z-10">
        {bgImage && (
          <Image
            src={bgImage}
            alt="Arcade background"
            fill
            priority
            className="object-cover opacity-20 saturate-50"
            data-ai-hint="wine bar neon"
          />
        )}
      </div>
      <div className="w-full max-w-2xl">
        {renderContent()}
      </div>
    </main>
  );
}

export default function ArcadePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ArcadeContent />
    </Suspense>
  );
}
