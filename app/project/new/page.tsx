"use client";

import { IdeaForm } from "@/components/idea/IdeaForm";
import { Sparkles } from "lucide-react";

export default function NewProjectPage() {
  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-20 w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-1000">
             <Sparkles className="h-3 w-3" /> Initialization Sequence
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-6 duration-1000 delay-100">
            Tell us about your next big idea.
          </h1>
          <p className="max-w-xl mx-auto text-slate-400 font-medium leading-relaxed animate-in fade-in slide-in-from-top-8 duration-1000 delay-200">
            Provide a raw description of what you want to build. Our AI logic core will handle the analysis, planning, and code generation.
          </p>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <IdeaForm />
        </div>
      </div>
    </div>
  );
}
