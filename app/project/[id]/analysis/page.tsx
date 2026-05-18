"use client";

import { useParams } from "next/navigation";
import { AnalysisChat } from "@/components/analysis/AnalysisChat";
import { BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function ProjectAnalysisPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-white"
    >
        <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b bg-white shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-purple-500/10">
                    <BrainCircuit className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-xs md:text-sm font-black text-slate-800 uppercase tracking-widest truncate">AI Requirements Analysis</h2>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest bg-purple-50 px-3 py-1 rounded-full border border-purple-100 italic">
                    Logical Synthesis Mode
                </span>
            </div>
        </header>

        <div className="flex-1">
            <ErrorBoundary>
                <AnalysisChat projectId={id} />
            </ErrorBoundary>
        </div>
    </motion.div>
  );
}
