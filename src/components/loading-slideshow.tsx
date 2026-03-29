
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"


const images = [
  { src: '/backgrounds/1.jpg', hint: 'vineyard landscape' },
  { src: '/backgrounds/2.jpg', hint: 'bunch of grapes' },
  { src: '/backgrounds/3.jpg', hint: 'wine bottle label' },
  { src: '/backgrounds/4.jpg', hint: 'inside a winery' },
  { src: '/backgrounds/5.jpg', hint: 'wine cellar barrels' },
  { src: '/backgrounds/6.jpg', hint: 'wine tasting event' },
];

export function LoadingSlideshow() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
      <h2 className="text-3xl font-headline text-primary mb-4 animate-pulse">Generating your quiz...</h2>
      <p className="text-lg text-foreground/80 mb-8">Please wait while we uncork some questions for you.</p>
      <Card className="w-full overflow-hidden shadow-2xl">
        <Carousel 
            opts={{
                loop: true,
            }}
            plugins={[plugin.current]}
            className="w-full"
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-video relative">
                  <Image
                    src={image.src}
                    alt={image.hint}
                    fill
                    className="object-cover"
                    data-ai-hint={image.hint}
                    priority={index === 0}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </Card>
    </div>
  );
}
