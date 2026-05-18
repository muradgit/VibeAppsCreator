"use client";

import { CheckCircle2, AlertCircle, RefreshCw, GitCommit, ShieldCheck, Zap, ArrowRight, Loader2, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ReviewResult {
  score: number;
  completed_criteria: string[];
  issues: string[];
  verdict: "pass" | "fail";
  report: string;
}

export function ReviewPanel({ review, onCommit, onRegenerate, isCommitting }: { 
    review: ReviewResult, 
    onCommit: () => void, 
    onRegenerate: () => void,
    isCommitting: boolean
}) {
  const isPass = review.verdict === "pass";

  return (
    <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-8"
    >
        <div className="flex items-center gap-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] shrink-0">Logical Audit Report</h4>
            <div className="h-px bg-slate-100 flex-1" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className={cn(
                    "p-8 rounded-[2.5rem] border flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden shadow-xl shadow-purple-500/5",
                    isPass ? "bg-emerald-50/50 border-emerald-100" : "bg-red-50/50 border-red-100"
                )}>
                    <div className={cn(
                        "w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-lg relative z-10",
                        isPass ? "bg-white text-emerald-500" : "bg-white text-red-500"
                    )}>
                        {isPass ? <ShieldCheck className="h-10 w-10" /> : <AlertCircle className="h-10 w-10" />}
                    </div>
                    
                    <div className="space-y-1 relative z-10">
                        <div className="text-4xl font-black tracking-tighter text-slate-900">{review.score}%</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quality Index</p>
                    </div>

                    <div className={cn(
                        "px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border shadow-sm relative z-10",
                        isPass ? "bg-emerald-500 text-white border-emerald-400" : "bg-red-500 text-white border-red-400"
                    )}>
                        Audit {isPass ? "Validated" : "Flagged"}
                    </div>
                    
                    {/* Background decoration */}
                    <div className={cn(
                        "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20",
                        isPass ? "bg-emerald-400" : "bg-red-400"
                    )} />
                </div>

                <div className="p-6 rounded-[2rem] bg-slate-900 border border-white/5 space-y-6">
                    <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <Gauge className="h-3 w-3" /> System Metrics
                         </span>
                         <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,1)]" />
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-400">COGNITIVE LOAD</span>
                                <span className="text-white">LOW</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-1/4 rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="text-slate-400">TYPE SAFETY</span>
                                <span className="text-white">HIGH</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-full rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-8 bg-white p-6 md:p-10 rounded-[2.5rem] border border-purple-50 shadow-sm">
                <div className="space-y-6">
                    <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Zap className="h-4 w-4" /> Synthesis Report
                    </h5>
                    <p className="text-sm md:text-base font-medium text-slate-600 leading-relaxed pl-6 border-l-2 border-purple-100">
                        {review.report}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-4">
                        <h6 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Satisfied Vectors
                        </h6>
                        <ul className="space-y-3">
                            {review.completed_criteria.map((c, i) => (
                                <li key={i} className="text-[11px] md:text-[12px] font-bold text-slate-700 flex items-start gap-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50">
                                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                    {c}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h6 className={cn(
                            "text-[10px] font-black uppercase tracking-widest flex items-center gap-2",
                            review.issues.length > 0 ? "text-red-500" : "text-slate-400"
                        )}>
                            <AlertCircle className="h-3.5 w-3.5" /> Logical Conflicts
                        </h6>
                        {review.issues.length > 0 ? (
                            <ul className="space-y-3">
                                {review.issues.map((issue, i) => (
                                    <li key={i} className="text-[11px] md:text-[12px] font-bold text-slate-700 flex items-start gap-3 bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                                        <div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                                        {issue}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-10 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center opacity-40">
                                <ShieldCheck className="h-8 w-8 text-slate-300 mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Zero Flags Detected</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-purple-50 flex flex-col sm:flex-row items-center gap-4">
                    <Button 
                        onClick={onCommit} 
                        disabled={!isPass || isCommitting}
                        className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-slate-900/10 group"
                    >
                        {isCommitting ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <GitCommit className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                        )}
                        Commit to Branch
                    </Button>
                    <Button 
                        onClick={onRegenerate} 
                        variant="outline" 
                        className="w-full sm:w-auto h-14 px-8 rounded-2xl border-purple-100 hover:bg-purple-50 text-slate-600 font-bold uppercase tracking-widest text-[10px]"
                    >
                        <RefreshCw className="mr-2 h-3.5 w-3.5" />
                        Re-Synthesize Logic
                    </Button>
                </div>
            </div>
        </div>
    </motion.div>
  );
}
