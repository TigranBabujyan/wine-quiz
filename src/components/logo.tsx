
import { InVino_Logo } from './InVino_Logo';

export function Logo({className}: {className?: string}) {
  return (
    <div className={className}>
      <InVino_Logo className="h-36 w-36 text-primary/30" />
    </div>
  );
}
