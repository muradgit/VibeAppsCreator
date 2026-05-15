"use client";

import { useEffect, useState } from "react";
import { AnalysisMessage } from "./AnalysisMessage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Wand2, BrainCircuit, AlertTriangle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Question {
  id: string;
  question: string;
  why: string;
}

interface AnalysisData {
  summary: string;
  inconsistencies: string[];
  similarProducts: {
    name: string;
    url: string;
    description: string;
  }[];
  questions: Question[];
}

export function AnalysisChat({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPlanning, setIsPlanning] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  useEffect(() => {
    const startAnalysis = async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        const project = await res.json();
        
        const analyzeRes = await fetch("/api/gemini/analyse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ideaRaw: project.idea_raw, projectId })
        });
        
        if (!analyzeRes.ok) throw new Error("Analysis failed");
        const data = await analyzeRes.json();
        setAnalysisData(data);
        setMessages([{ role: "assistant", content: data.summary }]);
        if (data.questions.length > 0) setActiveQuestionId(data.questions[0].id);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    startAnalysis();
  }, [projectId]);

  const generatePlan = async () => {
    setIsPlanning(true);
    try {
        const answersList = Object.entries(answers).map(([id, answer]) => ({ questionId: id, answer }));
        const res = await fetch("/api/gemini/plan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, answers: answersList })
        });
        if (!res.ok) throw new Error("Planning failed");
        router.push(`/project/${projectId}/plan`);
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsPlanning(false);
    }
  };

  if (isLoading) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 flex items-center justify-center animate-pulse">
                    <BrainCircuit className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="absolute -inset-1 rounded-2xl border border-indigo-600/20 animate-ping" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">Scanning idea architecture...</p>
        </div>
    );
  }

  const allAnswered = analysisData?.questions.length ? 
    Object.keys(answers).length === analysisData.questions.length && 
    Object.values(answers).every(a => a.trim().length > 0) : false;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((m, i) => (
          <div key={i} className="space-y-6">
            <AnalysisMessage role={m.role} content={m.content} timestamp={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
            
            {/* If it's the first assistant message (summary), show inconsistencies and competitors */}
            {i === 0 && m.role === "assistant" && analysisData && (
              <div className="space-y-8 ml-12 animate-in fade-in slide-in-from-left-4 duration-500">
                {analysisData.inconsistencies.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest pl-2">Detected Inconsistencies</h4>
                    <div className="space-y-2">
                      {analysisData.inconsistencies.map((inc, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs font-medium text-amber-900">
                          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                          {inc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {analysisData.similarProducts.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-widest pl-2">Market Landscape</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {analysisData.similarProducts.map((prod, idx) => (
                        <a 
                          key={idx} 
                          href={prod.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{prod.name}</span>
                            <ExternalLink className="h-3 w-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">{prod.description}</p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Questions Rendered Simultaneously */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Architectural Clarification</h4>
                  <div className="space-y-3">
                    {analysisData.questions.map((q, idx) => {
                      const isAnswered = !!answers[q.id]?.trim();
                      const isActive = activeQuestionId === q.id;

                      return (
                        <div key={q.id} className="space-y-2">
                          <button
                            onClick={() => setActiveQuestionId(isActive ? null : q.id)}
                            className={cn(
                              "w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between",
                              isActive 
                                ? "bg-white border-indigo-500 shadow-lg ring-4 ring-indigo-500/5" 
                                : "bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-300"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                                isAnswered ? "bg-emerald-500 text-white" : "bg-indigo-100 text-indigo-600"
                              )}>
                                {isAnswered ? "✓" : idx + 1}
                              </div>
                              <span className={cn(
                                "text-sm font-bold",
                                isActive ? "text-indigo-900" : "text-slate-700"
                              )}>
                                {q.question}
                              </span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 shrink-0">
                                {isAnswered ? "Answered" : "Needs Answer"}
                            </span>
                          </button>

                          {isActive && (
                            <div className="p-1 animate-in slide-in-from-top-2 duration-200">
                              <div className="relative group p-4 bg-white border border-indigo-200 rounded-2xl shadow-sm space-y-3">
                                <div className="flex items-start gap-2 text-[10px] text-slate-500 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  <BrainCircuit className="h-3 w-3 mt-0.5 text-indigo-400 shrink-0" />
                                  <span>Context: {q.why}</span>
                                </div>
                                <Textarea
                                  value={answers[q.id] || ""}
                                  onChange={(e) => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                                  placeholder="Define the technical logic..."
                                  className="w-full min-h-[100px] bg-transparent border-none focus:ring-0 outline-none resize-none text-sm p-0"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 border-t bg-slate-50 dark:bg-slate-900/50">
        {allAnswered && (
          <div className="flex justify-center animate-in fade-in zoom-in duration-300">
            <Button 
                onClick={generatePlan} 
                disabled={isPlanning}
                className="bg-[#0F172A] hover:bg-slate-800 text-white font-black h-14 px-12 rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
                {isPlanning ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Constructing Plan...</>
                ) : (
                    <><Wand2 className="mr-2 h-5 w-5 text-indigo-400" /> Finalize Build Plan</>
                )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
