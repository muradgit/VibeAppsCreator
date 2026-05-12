"use client";

import { useState } from "react";
import { MessageSquare, Send, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { AnalysisMessage } from "../analysis/AnalysisMessage";

interface InlineQuestionProps {
  itemText: string;
  projectId: string;
}

export function InlineQuestion({ itemText, projectId }: InlineQuestionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setIsAsking(true);
    try {
        const res = await fetch("/api/gemini/analyse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                ideaRaw: `Regarding this plan item: "${itemText}", I have a question: ${question}`, 
                projectId 
            })
        });
        if (!res.ok) throw new Error("Contextual analysis failed");
        const data = await res.json();
        setResponse(data.summary);
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsAsking(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded bg-slate-100 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 transition-colors"
      >
        <MessageSquare className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between mb-3 border-b pb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ask AI about this item</span>
            <button onClick={() => { setIsOpen(false); setResponse(null); setQuestion(""); }} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
            </button>
          </div>
          
          {response ? (
            <div className="space-y-4">
               <AnalysisMessage role="assistant" content={response} />
               <Button variant="outline" size="sm" className="w-full text-xs font-bold h-8" onClick={() => setResponse(null)}>
                  Ask another question
               </Button>
            </div>
          ) : (
            <div className="space-y-3">
                <Textarea 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Why this choice? How will it work?"
                    className="min-h-[80px] text-xs"
                />
                <Button 
                    onClick={handleAsk}
                    disabled={isAsking || !question.trim()}
                    size="sm" 
                    className="w-full bg-indigo-600 hover:bg-indigo-700 h-8 font-bold"
                >
                    {isAsking ? <Loader2 className="h-3 w-3 animate-spin" /> : "Send question"}
                </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
