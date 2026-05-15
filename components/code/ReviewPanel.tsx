"use client";

import { CodeReview } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, XCircle, Github, RefreshCw, Trophy, Target, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function ReviewPanel({ review, onCommit, onRegenerate, isCommitting }: { 
  review: CodeReview, 
  onCommit?: () => void, 
  onRegenerate?: () => void,
  isCommitting?: boolean
}) {
  const isHealthy = review.score >= 90;

  return (
    <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white mt-8">
      <CardHeader className="bg-slate-50 border-b p-8">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3" /> Security & Quality Audit
                </CardDescription>
                <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">AI Code Review Report</CardTitle>
            </div>
            <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="40"
                        cy="40"
                        r="28"
                        fill="transparent"
                        stroke="#f1f5f9"
                        strokeWidth="6"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r="28"
                        fill="transparent"
                        stroke={review.score >= 90 ? "#10B981" : review.score >= 70 ? "#F59E0B" : "#EF4444"}
                        strokeWidth="6"
                        strokeDasharray={175.9}
                        strokeDashoffset={175.9 * (1 - review.score / 100)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-black text-slate-800">{review.score}</span>
                </div>
            </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4" /> Passed Requirements
                </div>
                <div className="space-y-3">
                    {review.completedCriteria.map((item, idx) => (
                        <div key={idx} className="flex gap-3 text-sm font-medium text-slate-700 group">
                            <div className="shrink-0 w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                            </div>
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {review.issues.length > 0 && (
                <div className="space-y-4">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4" /> Improvement Points
                    </div>
                    <div className="space-y-4">
                        {review.issues.map((issue, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-200/50 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                        {issue.severity} Severity
                                    </span>
                                    <span className="text-[10px] font-mono text-amber-600">{issue.location}</span>
                                </div>
                                <p className="text-sm font-bold text-amber-900">{issue.problem}</p>
                                <p className="text-xs text-amber-700 leading-relaxed italic">{issue.fix}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="pt-6 border-t flex items-center justify-between">
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Final Verdict</span>
                <p className="text-sm font-medium text-slate-800 italic">&quot;{review.verdict || "The implementation matches architectural specifications with minor polish needed."}&quot;</p>
            </div>
            {(onCommit || onRegenerate) && (
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4">
                    {onRegenerate && (
                      <Button variant="outline" onClick={onRegenerate} className="h-10 px-6 font-bold border-slate-200 hover:bg-slate-50 transition-all">
                          <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                      </Button>
                    )}
                    {onCommit && (
                      <Button onClick={onCommit} disabled={isCommitting} className="h-10 px-6 font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all">
                          {isCommitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Github className="mr-2 h-4 w-4" />}
                          Deploy to GitHub
                      </Button>
                    )}
                </div>
                {review.score < 90 && onCommit && (
                  <button
                    onClick={() => {
                      if (window.confirm(
                        `Score is ${review.score}/100. The code has quality issues. Are you sure you want to commit it anyway?`
                      )) {
                        onCommit();
                      }
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 underline"
                  >
                    Commit anyway (override)
                  </button>
                )}
              </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
