
'use client';

import { Leaderboard } from '@/components/leaderboard';
import { GameModeSelection } from '@/components/game-mode-selection';
import { ApiKeySettings } from '@/components/api-key-settings';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const backgroundImages = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
];

export default function Home() {
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    setBgImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="absolute inset-0 -z-10">
        {bgImage && (
            <Image
                src={bgImage}
                alt="Wine bottles and glasses"
                fill
                priority
                className="object-cover saturate-50 opacity-30"
                data-ai-hint="vineyard grapes"
            />
        )}
      </div>
      <div className="w-full max-w-2xl text-center rounded-2xl border border-white/20 bg-background/60 backdrop-blur-md px-8 py-10 shadow-xl">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary tracking-tight">
          WineWise
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80">
          Test your knowledge and elevate your expertise with our AI-powered wine quizzes.
        </p>
      </div>

      <GameModeSelection />

      <ApiKeySettings />

      <div className="w-full max-w-2xl mt-12">
        <Leaderboard />
      </div>
    </main>
  );
}
