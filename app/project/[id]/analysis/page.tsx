"use client";

import { useParams } from "next/navigation";
import { AnalysisChat } from "@/components/analysis/AnalysisChat";
import { BrainCircuit } from "lucide-react";

export default function ProjectAnalysisPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-slate-950">
        <header className="h-16 px-6 flex items-center justify-between border-b bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-widest">AI Requirements Analysis</h2>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
                    Logical Synthesis Mode
                </span>
            </div>
        </header>

        <div className="flex-1 overflow-hidden">
            <AnalysisChat projectId={id} />
        </div>
    </div>
  );
}
