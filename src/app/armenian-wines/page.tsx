
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HomeIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const backgroundImages = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
];

export default function ArmenianWinesPage() {
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
            alt="Vineyard in Armenia"
            fill
            priority
            className="object-cover opacity-20 saturate-50"
            data-ai-hint="armenian vineyard mountains"
          />
        )}
      </div>
      <div className="w-full max-w-3xl">
        <Card className="w-full max-w-2xl shadow-2xl animate-fade-in-up">
            <CardHeader className="text-center">
                <CardTitle className="text-4xl font-headline mt-4">Armenian Wines</CardTitle>
                <CardDescription className="text-lg">
                    This page is under construction.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">
                    Check back soon for a new game mode!
                </p>
                <div className="text-center mt-8">
                  <Link href="/" passHref>
                    <Button variant="outline"><HomeIcon className="mr-2" /> Back to Home</Button>
                  </Link>
                </div>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
