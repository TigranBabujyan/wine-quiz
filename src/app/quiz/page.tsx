

'use client';

import { Suspense, useState, useEffect, useMemo, Key } from 'react';
import { useSearchParams } from 'next/navigation';
import { generateDynamicQuiz, type GenerateDynamicQuizInput } from '@/ai/flows/generate-dynamic-quiz';
import { getLocalQuiz } from '@/app/actions/get-local-quiz';
import type { GenerateDynamicQuizOutput } from '@/ai/schemas/quiz-schemas';
import { QuizClient } from './quiz-client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, PlayCircle, Wand2, BookCopy } from 'lucide-react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LoadingSlideshow } from '@/components/loading-slideshow';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const backgroundImages = [
    '/backgrounds/1.jpg',
    '/backgrounds/2.jpg',
    '/backgrounds/3.jpg',
    '/backgrounds/4.jpg',
    '/backgrounds/5.jpg',
    '/backgrounds/6.jpg'
];


function QuizFlowController() {
    const searchParams = useSearchParams();
    const [quizData, setQuizData] = useState<GenerateDynamicQuizOutput['quiz'] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isGenerated, setIsGenerated] = useState(false);
    const [isStarted, setIsStarted] = useState(false);
    const [key, setKey] = useState<Key | null>(null); // State to force re-renders

    // When searchParams change (i.e. on "Play Again"), reset the state
    useEffect(() => {
        const newKey = searchParams.get('key');
        if (newKey !== key) {
            setKey(newKey);
            setIsStarted(false);
            setIsGenerated(false);
            setQuizData(null);
            setError(null);
        }
    }, [searchParams, key]);


    // useMemo will prevent re-calculation on every render unless searchParams changes.
    const quizConfig = useMemo(() => {
        const mode = (searchParams.get('mode') as 'single' | 'multiplayer' | 'arcade') || 'single';
        const difficulty = searchParams.get('difficulty') || 'Normal';
        const category = searchParams.get('category') || 'Wine Varieties';
        const player1 = (searchParams.get('player1') as string) || 'Player 1';
        const player2 = (searchParams.get('player2') as string) || 'Player 2';
        const numQuestions = parseInt(searchParams.get('numQuestions') as string) || (mode === 'multiplayer' ? 20 : 10);
        const timePerQuestion = parseInt(searchParams.get('timePerQuestion') as string) || 15;
        const source = (searchParams.get('source') as 'ai' | 'local') || 'ai';

        const validDifficulties = ['Easy', 'Normal', 'Hard'];
        const validCategories = ["Wine Varieties", "Winemaking Process", "Wine Regions", "Wine History", "Wine Industry", "Food Pairing"];

        const validatedDifficulty = validDifficulties.includes(difficulty as string) ? difficulty : 'Normal';
        const validatedCategory = validCategories.includes(decodeURIComponent(category as string)) ? decodeURIComponent(category as string) : 'Wine Varieties';

        return {
            mode,
            difficulty: validatedDifficulty,
            category: validatedCategory,
            player1,
            player2,
            numQuestions,
            timePerQuestion,
            source
        };
    }, [searchParams]);

    useEffect(() => {
        if (isGenerated) return;

        async function fetchQuiz() {
            try {
                if (quizConfig.source === 'local') {
                    const questions = await getLocalQuiz(
                        quizConfig.category as any,
                        quizConfig.difficulty as any,
                        quizConfig.numQuestions
                    );
                    if (!questions || questions.length === 0) {
                        throw new Error("No local questions found for the selected category and difficulty.");
                    }
                    setQuizData(questions);
                } else {
                    const apiKey = localStorage.getItem('gemini_api_key') ?? undefined;
                    const quizParams: GenerateDynamicQuizInput = {
                        difficulty: quizConfig.difficulty as any,
                        category: quizConfig.category as any,
                        numQuestions: quizConfig.numQuestions,
                    };
                    const result = await generateDynamicQuiz(quizParams, apiKey);
                    if (!result || !result.quiz || result.quiz.length === 0) {
                        throw new Error("Failed to generate quiz content. The AI may have returned an empty or invalid quiz.");
                    }
                    setQuizData(result.quiz);
                }
            } catch (error: any) {
                console.error("Quiz generation failed:", error);
                const isOverloaded = error.message?.includes('503') || error.message?.includes('overloaded') || error.message?.includes('rate limit');
                setError(isOverloaded
                    ? "The AI model is currently overloaded. Please wait a moment and try again."
                    : error.message || "We couldn't generate the quiz at this moment. Please try again.");
            } finally {
                setIsGenerated(true);
            }
        }
        fetchQuiz();
    }, [quizConfig, isGenerated]);

    if (error) {
        return (
            <div className="w-full max-w-2xl mx-auto text-center">
                <Alert variant="destructive" className="text-left">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error Generating Quiz</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Link href="/" passHref>
                    <Button variant="outline" className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>
        );
    }
    
    if (!isGenerated || !quizData) {
        return <LoadingSlideshow />;
    }

    if (isStarted) {
        return <QuizClient quizData={quizData} mode={quizConfig.mode} player1={quizConfig.player1} player2={quizConfig.player2} timePerQuestion={quizConfig.timePerQuestion} searchParams={searchParams.toString()} />;
    }

    
      return (
          <Card className="w-full max-w-2xl text-center shadow-2xl animate-fade-in-up">
              <CardHeader>
                  <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                      <PlayCircle className="h-12 w-12 text-primary" />
                  </div>
                  <CardTitle className="text-4xl font-headline mt-4">Quiz is Ready!</CardTitle>
                  <CardDescription className="text-xl">Your challenge awaits.</CardDescription>
                  <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground mt-1">
                    {quizConfig.source === 'ai'
                      ? <><Wand2 className="h-3.5 w-3.5" /> AI-generated</>
                      : <><BookCopy className="h-3.5 w-3.5" /> Local question bank</>}
                  </div>
                  {quizConfig.mode === 'multiplayer' && (
                    <p className="text-lg">{quizConfig.player1}, you're up first!</p>
                  )}
              </CardHeader>
              <CardFooter>
                  <Button onClick={() => setIsStarted(true)} size="lg" className="w-full">
                      Start Quiz
                  </Button>
              </CardFooter>
          </Card>
      );
    

    
}

function QuizPageWrapper() {
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    // This effect now correctly uses a local variable for Math.random to avoid hydration issues.
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    setBgImage(randomImage);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
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
      <QuizFlowController />
    </main>
  );
}


export default function QuizPage() {
    return (
        <Suspense fallback={<LoadingSlideshow />}>
            <QuizPageWrapper />
        </Suspense>
    );
}
