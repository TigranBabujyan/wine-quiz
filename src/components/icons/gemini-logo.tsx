export function GeminiLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Gemini"
    >
      <defs>
        <linearGradient id="gemini-grad-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="100%" stopColor="#0F52BA" />
        </linearGradient>
        <linearGradient id="gemini-grad-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8AB4F8" />
          <stop offset="100%" stopColor="#4285F4" />
        </linearGradient>
      </defs>
      {/* 4-pointed star — the Gemini icon shape */}
      <path
        d="M14 2
           C14 2 14.6 9.2 17.6 11.8
           C20.6 14.4 28 14 28 14
           C28 14 20.6 13.6 17.6 16.2
           C14.6 18.8 14 26 14 26
           C14 26 13.4 18.8 10.4 16.2
           C7.4 13.6 0 14 0 14
           C0 14 7.4 14.4 10.4 11.8
           C13.4 9.2 14 2 14 2Z"
        fill="url(#gemini-grad-a)"
      />
    </svg>
  );
}
