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
    <html lang="en" className={cn("dark", inter.variable)}>
      <body suppressHydrationWarning className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 min-h-screen flex flex-col overflow-hidden">
        <AuthProvider>
            <TooltipProvider>
                <Navbar />
                <div className="flex-1 flex overflow-hidden">
                    {children}
                </div>
            </TooltipProvider>
            <Toaster position="bottom-right" theme="dark" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
