"use client";

import { IdeaForm } from "@/components/idea/IdeaForm";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="flex-1 flex flex-col bg-white text-slate-900 min-h-screen selection:bg-primary/20">
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 w-full space-y-16">
        <div className="space-y-8">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Workspace
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-4 duration-1000">
               <Sparkles className="h-4 w-4" /> System Initialization
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1] animate-in fade-in slide-in-from-top-6 duration-1000 delay-100">
              Transform your <br className="hidden sm:block" /> vision into logic.
            </h1>
            <p className="max-w-2xl text-slate-500 text-base md:text-xl font-medium leading-relaxed animate-in fade-in slide-in-from-top-8 duration-1000 delay-200">
              Describe your application in plain natural language. Our architectural engine will dissect the requirements and build the foundation.
            </p>
          </div>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300 bg-slate-50/50 p-6 md:p-12 rounded-[2.5rem] border border-purple-50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 -translate-y-32 translate-x-32 rounded-full blur-3xl pointer-events-none" />
          <IdeaForm />
        </div>
      </div>
    </div>
  );
}
