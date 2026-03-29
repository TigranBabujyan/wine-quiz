
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'WineWise Quizzes',
  description: 'Educational and competitive quiz-based games about wine and winemaking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
            <footer className="py-6 md:px-8 md:py-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container text-center md:h-24 flex items-center justify-center">
                    <p className="text-sm leading-loose text-muted-foreground">
                        © 2023 InVinoEVN LLC. All rights are reserved.
                    </p>
                </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
  );
}
