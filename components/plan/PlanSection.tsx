"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle2, Clock, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineQuestion } from "./InlineQuestion";

interface PlanSectionProps {
  title: string;
  items: any[];
  type: "tasks" | "constraints" | "techStack";
  projectId: string;
}

export function PlanSection({ title, items, type, projectId }: PlanSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="space-y-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 group w-full text-left"
      >
        <div className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 group-hover:bg-slate-200 transition-colors">
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
        <div className="flex-1 h-px bg-slate-100 ml-2" />
        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase">{items.length} units</span>
      </button>

      {isExpanded && (
        <div className="grid gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {items.map((item, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all relative group">
              <div className="absolute top-4 right-4">
                 <InlineQuestion itemText={type === 'tasks' ? item.description : item.item || item.name} projectId={projectId} />
              </div>
              
              {type === "tasks" ? (
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-black font-mono text-indigo-600 bg-indigo-50 w-6 h-6 rounded flex items-center justify-center">
                            {i+1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <span className={cn(
                            "text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded",
                            item.estimatedComplexity === 'easy' ? 'bg-emerald-100 text-emerald-700' :
                            item.estimatedComplexity === 'hard' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        )}>
                            {item.estimatedComplexity}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                    {item.filePaths && item.filePaths.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {item.filePaths.map((p: string) => (
                                <div key={p} className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                    <FileCode className="h-3 w-3" /> {p}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              ) : (
                <div className="space-y-1 pr-8">
                    <h4 className="text-xs font-bold text-slate-900">{item.item || item.name}</h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{item.reason || item.rationale}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
