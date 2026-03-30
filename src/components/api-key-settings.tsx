'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Trash2, ExternalLink, KeyRound } from 'lucide-react';
import { saveApiKey, getApiKey } from '@/app/actions/api-key';
import { useToast } from '@/hooks/use-toast';
import { GeminiLogo } from '@/components/icons/gemini-logo';
import { cn } from '@/lib/utils';

const AI_STUDIO_URL = 'https://aistudio.google.com/app/apikey';

function isValidGeminiKey(key: string) {
  return key.startsWith('AIza') && key.length > 20;
}

export function ApiKeySettings() {
  const [savedKey, setSavedKey] = useState('');
  const [status, setStatus] = useState<'idle' | 'reading' | 'saving' | 'saved' | 'error'>('idle');
  const [showManual, setShowManual] = useState(false);
  const [manualKey, setManualKey] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getApiKey().then((key) => {
      if (key) setSavedKey(key);
    });
  }, []);

  const persist = async (key: string) => {
    setStatus('saving');
    const result = await saveApiKey(key);
    if (result.success) {
      setSavedKey(key);
      setShowManual(false);
      setManualKey('');
      setStatus('saved');
      toast({ title: 'Gemini API key saved', description: 'AI mode is now active.' });
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('error');
      toast({ title: 'Failed to save key', description: result.error, variant: 'destructive' });
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const handleGeminiClick = async () => {
    // If clipboard API is unavailable (non-HTTPS, blocked), go straight to manual
    if (!navigator?.clipboard?.readText) {
      setShowManual(true);
      return;
    }

    setStatus('reading');
    try {
      const text = (await navigator.clipboard.readText()).trim();

      if (!text) {
        toast({
          title: 'Clipboard is empty',
          description: 'Copy your API key from Google AI Studio, then click again.',
          variant: 'destructive',
        });
        setStatus('idle');
        return;
      }

      if (!isValidGeminiKey(text)) {
        toast({
          title: 'Not a valid Gemini API key',
          description: 'Keys start with "AIza…". Copy yours from Google AI Studio first.',
          variant: 'destructive',
        });
        setStatus('idle');
        return;
      }

      await persist(text);
    } catch {
      // Permission denied or any other clipboard error — fall back to manual
      setShowManual(true);
      setStatus('idle');
      toast({
        title: 'Clipboard access denied',
        description: 'Paste your key manually below.',
      });
    }
  };

  const handleManualSave = async () => {
    if (!isValidGeminiKey(manualKey.trim())) {
      toast({
        title: 'Invalid key',
        description: 'Gemini keys start with "AIza" and are at least 20 characters.',
        variant: 'destructive',
      });
      return;
    }
    await persist(manualKey.trim());
  };

  const handleClear = async () => {
    await saveApiKey('');
    setSavedKey('');
    setStatus('idle');
    toast({ title: 'API key removed', description: 'Switched to local quiz mode.' });
  };

  const isBusy = status === 'reading' || status === 'saving';

  /* ── State B: key is saved ─────────────────────────────────────────── */
  if (savedKey && !showManual) {
    return (
      <div className="w-full max-w-2xl mt-6">
        <div className="rounded-xl border border-border bg-card/80 backdrop-blur px-5 py-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <GeminiLogo className="h-6 w-6 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-card-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                AI Mode active
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {savedKey.slice(0, 8)}{'•'.repeat(12)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground"
              onClick={() => setShowManual(true)}
            >
              Change key
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClear}
              className="text-muted-foreground hover:text-destructive"
              aria-label="Remove API key"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ── State A: no key / change mode ────────────────────────────────── */
  return (
    <div className="w-full max-w-2xl mt-6">
      <div className="rounded-xl border border-border bg-card/80 backdrop-blur p-6 shadow-sm space-y-5 text-center">
        {/* Gemini button */}
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleGeminiClick}
            disabled={isBusy}
            aria-label="Paste Gemini API key from clipboard"
            className={cn(
              'group relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 transition-all duration-200',
              'border-blue-300 bg-white shadow-md',
              'hover:scale-105 hover:shadow-blue-200 hover:shadow-lg',
              'active:scale-95',
              isBusy && 'cursor-wait opacity-70',
              status === 'saved' && 'border-green-400 bg-green-50'
            )}
          >
            {isBusy ? (
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            ) : (
              <GeminiLogo className="h-10 w-10 transition-transform group-hover:scale-110" />
            )}
          </button>

          <div>
            <p className="text-sm font-medium text-card-foreground">
              {status === 'reading' ? 'Reading clipboard…' : 'Click to paste your Gemini API key'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Copy your key from Google AI Studio first, then click the button above.
            </p>
          </div>

          <a
            href={AI_STUDIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 hover:underline"
          >
            Get API Key from Google AI Studio
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Divider + manual fallback */}
        {!showManual ? (
          <button
            type="button"
            onClick={() => setShowManual(true)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Or enter key manually
          </button>
        ) : (
          <div className="space-y-2 text-left">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  type="password"
                  value={manualKey}
                  onChange={(e) => setManualKey(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualSave()}
                  placeholder="AIza…"
                  className="pl-8 font-mono text-sm"
                  autoFocus
                />
              </div>
              <Button onClick={handleManualSave} disabled={isBusy}>
                {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </Button>
            </div>
            {savedKey && (
              <button
                type="button"
                onClick={() => setShowManual(false)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          No key? You can still play using the built-in local question bank.
        </p>
      </div>
    </div>
  );
}
