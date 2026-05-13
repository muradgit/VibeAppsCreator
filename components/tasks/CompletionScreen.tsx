"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Github, Rocket, ArrowLeft, Trophy, Calendar, Zap } from "lucide-react";
import Link from "next/link";
import { Project, Task } from "@/types";

interface CompletionScreenProps {
  project: Project;
  tasks: Task[];
}

export function CompletionScreen({ project, tasks }: CompletionScreenProps) {
  useEffect(() => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const githubPushes = tasks.filter(t => t.github_commit_sha).length;
  const completedDate = new Date().toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="max-w-2xl w-full space-y-12 text-center relative z-10">
        <div className="space-y-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/20 animate-bounce">
            <Trophy className="h-12 w-12 text-emerald-500" />
          </div>
          <div className="space-y-3">
            <h1 className="text-6xl font-black text-white tracking-tighter">🎉 Build Complete!</h1>
            <p className="text-slate-400 text-lg font-medium">Your application logic has been fully architected and deployed.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
            <div className="text-2xl font-black text-white">{tasks.length}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tasks Finalized</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Github className="h-5 w-5 text-blue-500 mx-auto" />
            <div className="text-2xl font-black text-white">{githubPushes}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Commits Pushed</div>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <Calendar className="h-5 w-5 text-amber-500 mx-auto" />
            <div className="text-sm font-black text-white">{completedDate}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Project Sealed</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            size="lg" 
            className="h-14 px-10 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg shadow-xl shadow-emerald-600/20 w-full sm:w-auto"
            onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
          >
            <Rocket className="mr-3 h-5 w-5" /> View on Vercel
          </Button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="h-14 px-10 rounded-2xl border-white/10 text-white hover:bg-white/5 font-black text-lg w-full sm:w-auto">
              <ArrowLeft className="mr-3 h-5 w-5" /> Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
