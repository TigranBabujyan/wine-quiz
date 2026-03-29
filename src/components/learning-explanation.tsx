
'use client';

import { useState } from 'react';
import { getExplanation } from '@/app/actions/get-explanation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Sparkles } from 'lucide-react';

type LearningExplanationProps = {
  topic: string;
};

export function LearningExplanation({ topic }: LearningExplanationProps) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFetchExplanation = async () => {
    if (explanation) {
      setIsOpen(true);
      return;
    }

    setIsOpen(true);
    setIsLoading(true);
    try {
        // Hardcoding 'en' for now since i18n is removed
        const result = await getExplanation(topic, 'en');
        setExplanation(result);
    } catch (e) {
        setExplanation("Sorry, we couldn't generate an explanation at this time. Please try again later.");
        console.error("Failed to get explanation:", e);
    }
    finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={handleFetchExplanation}>
            <Sparkles className="mr-2 h-4 w-4" />
            Learn More
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-headline text-primary">Explanation</DialogTitle>
          <DialogDescription>{topic}</DialogDescription>
        </DialogHeader>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Generating explanation...</p>
            </div>
          ) : (
            <p className="text-base text-foreground/90 whitespace-pre-wrap leading-relaxed">{explanation}</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
