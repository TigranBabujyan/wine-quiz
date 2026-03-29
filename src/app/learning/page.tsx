
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { LearningTopic } from '@/components/learning-topic';
import { BookOpen, HomeIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const topicsByCategory: Record<string, string[]> = {
  'Wine Varieties': ['Chardonnay', 'Pinot Noir', 'Cabernet Sauvignon', 'Sauvignon Blanc', 'Merlot'],
  'Winemaking Process': ['Fermentation', 'Aging in Oak', 'Malolactic Fermentation', 'Blending'],
  'Wine Regions': ['Bordeaux, France', 'Napa Valley, USA', 'Tuscany, Italy', 'Rioja, Spain'],
  'Wine History': ['Origins of Winemaking', 'Phylloxera Epidemic', 'The Judgment of Paris'],
  'Food Pairing': ['Pairing with Steak', 'Pairing with Seafood', 'Cheese and Wine Pairing'],
};

const backgroundImages = [
  '/backgrounds/1.jpg',
  '/backgrounds/2.jpg',
  '/backgrounds/3.jpg',
  '/backgrounds/4.jpg',
  '/backgrounds/5.jpg',
  '/backgrounds/6.jpg',
];

export default function LearningPage() {
  const categories = Object.keys(topicsByCategory);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    setBgImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
  }, []);

  return (
    <main className="relative flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
       <div className="absolute inset-0 -z-10">
        {bgImage && (
          <Image
            src={bgImage}
            alt="A book about wine"
            fill
            priority
            className="object-cover opacity-20 saturate-50"
            data-ai-hint="library wine book"
          />
        )}
      </div>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
            <BookOpen className="h-16 w-16 mx-auto text-primary mb-4" />
          <h1 className="text-4xl md:text-6xl font-headline font-bold text-primary tracking-tight">
            Learning Mode
          </h1>
          <p className="mt-4 text-lg md:text-xl text-foreground/80">
            Explore wine topics at your own pace. Click any topic to get an AI-powered explanation.
          </p>
        </div>

        <Accordion type="multiple" className="w-full">
          {categories.map((category) => (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="text-xl font-headline">{category}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {topicsByCategory[category].map(topic => (
                        <LearningTopic key={topic} topic={topic} />
                    ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="text-center mt-8">
          <Link href="/" passHref>
            <Button variant="outline"><HomeIcon className="mr-2" /> Back to Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
