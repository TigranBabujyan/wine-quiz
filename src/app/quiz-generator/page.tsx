
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { HomeIcon, Loader2, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { getQuizFromText } from '../actions/get-quiz-from-text';
import { type GenerateDynamicQuizOutput } from '@/ai/flows/generate-dynamic-quiz';
import { QuizClient } from '../quiz/quiz-client';
import { LoadingSlideshow } from '@/components/loading-slideshow';


const backgroundImages = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
];

export default function QuizGeneratorPage() {
  const [bgImage, setBgImage] = useState('');
  const [context, setContext] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [gameState, setGameState] = useState<'setup' | 'loading' | 'quiz' | 'error'>('setup');
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<GenerateDynamicQuizOutput['quiz'] | null>(null);

  useEffect(() => {
    setBgImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
  }, []);

  const handleGenerateQuiz = async () => {
    if (!context.trim()) {
      setError("Please paste some text before generating a quiz.");
      setGameState('error');
      return;
    }
    setGameState('loading');
    setError(null);
    try {
      const apiKey = localStorage.getItem('gemini_api_key') ?? undefined;
      const result = await getQuizFromText(context, numQuestions, apiKey);
      if (!result || !result.quiz || result.quiz.length === 0) {
        throw new Error("The AI failed to generate a quiz from the provided text. Please try adjusting the text or the number of questions.");
      }
      setQuizData(result.quiz);
      setGameState('quiz');
    } catch (err: any) {
      console.error("Custom quiz generation failed:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setGameState('error');
    }
  };

  const renderContent = () => {
    switch (gameState) {
      case 'setup':
        return (
          <Card className="w-full max-w-2xl shadow-2xl animate-fade-in-up">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <Wand2 className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-4xl font-headline mt-4">Custom Quiz Generator</CardTitle>
              <CardDescription className="text-lg">
                Paste any text below, and our AI will create a custom quiz for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quiz-context" className="text-lg">Your Text Content</Label>
                <Textarea
                  id="quiz-context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Paste your text content here..."
                  className="min-h-[200px] mt-2"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="numQuestions">Number of Questions: {numQuestions}</Label>
                <Slider
                  id="numQuestions"
                  min={1}
                  max={25}
                  step={1}
                  value={[numQuestions]}
                  onValueChange={(value) => setNumQuestions(value[0])}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button onClick={handleGenerateQuiz} size="lg" className="w-full" disabled={!context.trim()}>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Quiz
              </Button>
              <Link href="/" passHref>
                  <Button variant="outline" size="sm" className="mt-2"><HomeIcon className="mr-2 h-4 w-4" /> Back to Home</Button>
              </Link>
            </CardFooter>
          </Card>
        );
      case 'loading':
        return <LoadingSlideshow />;
      case 'error':
        return (
          <div className="w-full max-w-md mx-auto">
            <Alert variant="destructive" className="text-center">
              <AlertCircle className="h-4 w-4 mx-auto mb-2" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error}
              </AlertDescription>
              <Button onClick={() => setGameState('setup')} variant="outline" className="mt-4">
                Try Again
              </Button>
            </Alert>
          </div>
        );
      case 'quiz':
        if (quizData) {
            // Using a hardcoded search param string as this mode is simple
            const searchParams = `mode=single&difficulty=Normal&category=Custom Quiz&numQuestions=${numQuestions}&timePerQuestion=15`;
            return <QuizClient quizData={quizData} mode="single" searchParams={searchParams} />;
        }
        return null;
    }
  };


  return (
    <main className="relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="absolute inset-0 -z-10">
        {bgImage && (
          <Image
            src={bgImage}
            alt="Abstract background"
            fill
            priority
            className="object-cover opacity-20 saturate-50"
            data-ai-hint="library books"
          />
        )}
      </div>
      <div className="w-full max-w-3xl">
        {renderContent()}
      </div>
    </main>
  );
}
