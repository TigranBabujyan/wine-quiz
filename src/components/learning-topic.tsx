'use client';

import { LearningExplanation } from '@/components/learning-explanation';

export function LearningTopic({ topic }: { topic: string }) {
  return (
    <div className="p-4 border rounded-lg flex items-center justify-between">
      <p className="font-semibold">{topic}</p>
      <LearningExplanation topic={topic} />
    </div>
  );
}
