import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from '@/components/layout/AuthProvider';
import { Navbar } from '@/components/layout/Navbar';
import { Toaster } from 'sonner';
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Apps Built By Apps',
  description: 'AI-guided workflow for shipping full-stack applications.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={cn(inter.variable)}>
      <body suppressHydrationWarning className="bg-background text-foreground min-h-screen flex flex-col">
        <AuthProvider>
            <TooltipProvider>
                <Navbar />
                <div className="flex-1 flex flex-col md:flex-row">
                    {children}
                </div>
            </TooltipProvider>
            <Toaster position="bottom-right" theme="light" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
