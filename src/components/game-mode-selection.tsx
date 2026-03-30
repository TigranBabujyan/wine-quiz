
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, User, BookOpen, Zap, Wand2 } from 'lucide-react';

export function GameModeSelection() {
  const gameModes = [
    { href: '/single-player', icon: User, label: 'Single Player' },
    { href: '/multiplayer', icon: Users, label: 'Multiplayer' },
    { href: '/arcade', icon: Zap, label: 'Arcade Mode' },
    { href: '/learning', icon: BookOpen, label: 'Learning Mode' },
    { href: '/quiz-generator', icon: Wand2, label: 'Custom Quiz' },
  ];

  return (
    <Card className="w-full max-w-2xl mt-8 shadow-2xl animate-fade-in-up">
        <CardContent className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {gameModes.map(mode => (
                 <Link href={mode.href} passHref key={mode.href}>
                    <Button className="w-full h-24 flex-col" variant="outline">
                        <mode.icon className="h-8 w-8 mb-2" />
                        <span>{mode.label}</span>
                    </Button>
                </Link>
            ))}
        </CardContent>
    </Card>
  );
}
