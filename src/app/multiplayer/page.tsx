
'use client';

import { MultiplayerSetup } from '@/components/multiplayer-setup';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { HomeIcon } from 'lucide-react';

const backgroundImages = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
];

export default function MultiplayerPage() {
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    setBgImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
  }, []);

  return (
    <main className="relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 lg:p-24">
       <div className="absolute inset-0 -z-10">
        {bgImage && (
          <Image
            src={bgImage}
            alt="Two people toasting wine glasses"
            fill
            priority
            className="object-cover opacity-20 saturate-50"
            data-ai-hint="wine glasses cheers"
          />
        )}
      </div>
      <div className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tight">
          Multiplayer PvP
        </h1>
        <p className="mt-4 text-lg md:text-xl text-foreground/80">
          Enter your names and get ready to battle!
        </p>
      </div>
      <MultiplayerSetup />
        <div className="mt-8">
            <Link href="/" passHref>
                <Button variant="outline"><HomeIcon className="mr-2" /> Back to Home</Button>
            </Link>
        </div>
    </main>
  );
}
