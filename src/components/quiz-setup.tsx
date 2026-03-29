
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { GlassWater } from 'lucide-react';
import { Slider } from "@/components/ui/slider"

const difficulties = ["Easy", "Normal", "Hard"];
const categories = [
  "Wine Varieties",
  "Winemaking Process",
  "Wine Regions",
  "Wine History",
  "Wine Industry",
  "Food Pairing"
];
const timeOptions = [15, 30, 60];

export function QuizSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || difficulties[1]);
  const [category, setCategory] = useState(searchParams.get('category') || categories[0]);
  const [numQuestions, setNumQuestions] = useState(parseInt(searchParams.get('numQuestions') as string) || 10);
  const [timePerQuestion, setTimePerQuestion] = useState(parseInt(searchParams.get('timePerQuestion') as string) || timeOptions[0]);

  const startQuiz = () => {
    const params = new URLSearchParams(searchParams);
    params.set('difficulty', difficulty);
    params.set('category', category);
    params.set('numQuestions', String(numQuestions));
    params.set('timePerQuestion', String(timePerQuestion));
    params.set('start', 'true');
    router.push(`/quiz?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-lg mt-8 shadow-2xl animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Single Player Quiz</CardTitle>
        <CardDescription>Select a category and difficulty to begin.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" aria-label="Select a category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty" aria-label="Select difficulty">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              {difficulties.map((diff) => (
                <SelectItem key={diff} value={diff}>{diff}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="numQuestions">Number of Questions: {numQuestions}</Label>
          <Slider
            id="numQuestions"
            min={5}
            max={25}
            step={1}
            value={[numQuestions]}
            onValueChange={(value) => setNumQuestions(value[0])}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="timePerQuestion">Time Per Question</Label>
          <Select value={String(timePerQuestion)} onValueChange={(val) => setTimePerQuestion(Number(val))}>
            <SelectTrigger id="timePerQuestion" aria-label="Select time">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={String(time)}>{time} seconds</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={startQuiz} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <GlassWater className="mr-2 h-4 w-4" />
          Start Quiz
        </Button>
      </CardFooter>
    </Card>
  );
}
