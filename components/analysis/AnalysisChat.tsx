"use client";

import { useEffect, useState } from "react";
import { AnalysisMessage } from "./AnalysisMessage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Wand2, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Question {
  id: string;
  question: string;
  why: string;
}

interface AnalysisData {
  summary: string;
  inconsistencies: string[];
  questions: Question[];
}

export function AnalysisChat({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isPlanning, setIsPlanning] = useState(false);

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
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    startAnalysis();
  }, [projectId]);

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    const question = analysisData?.questions[currentQuestionIdx];
    if (!question) return;

    const newMessages = [
        ...messages,
        { role: "user" as const, content: currentAnswer }
    ];
    setMessages(newMessages);
    
    const newAnswers = { ...answers, [question.id]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIdx < (analysisData?.questions.length || 0) - 1) {
        setCurrentQuestionIdx(currentQuestionIdx + 1);
        const nextQ = analysisData?.questions[currentQuestionIdx + 1].question;
        setMessages([...newMessages, { role: "assistant", content: nextQ! }]);
    } else {
        setMessages([...newMessages, { role: "assistant", content: "Great! I have everything I need to generate the build plan." }]);
    }
  };

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

  const allAnswered = Object.keys(answers).length === analysisData?.questions.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950">
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {messages.map((m, i) => (
          <AnalysisMessage key={i} role={m.role} content={m.content} timestamp={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
        ))}
        {!allAnswered && analysisData && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-sm font-bold text-indigo-900 flex items-center gap-3">
               <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white">
                    {currentQuestionIdx + 1}
               </div>
               {analysisData.questions[currentQuestionIdx].question}
            </div>
          </div>
        )}
      </div>

      <div className="p-6 border-t bg-slate-50 dark:bg-slate-900/50">
        {!allAnswered ? (
          <div className="relative group max-w-3xl mx-auto">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Your answer..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitAnswer();
                }
              }}
              className="w-full min-h-[100px] p-4 rounded-2xl bg-white dark:bg-slate-950 border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all pr-12 text-sm shadow-sm"
            />
            <Button 
                onClick={submitAnswer}
                disabled={!currentAnswer.trim()}
                size="icon" 
                className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 h-9 w-9 rounded-xl shadow-lg shadow-indigo-500/20"
            >
                <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex justify-center">
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
