"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lightbulb, AlertTriangle, Search, ChevronRight, Loader2 } from 'lucide-react';

type AnalysisData = {
  summary: string;
  inconsistencies: string[];
  similarProducts: string[];
  questions: string[];
};

interface AnalysisChatProps {
  projectId: string;
  initialAnalysis: AnalysisData;
}

export function AnalysisChat({ projectId, initialAnalysis }: AnalysisChatProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const allQuestionsAnswered = Object.keys(answers).length === initialAnalysis.questions.length;

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'planning',
          conversationHistory: initialAnalysis.questions.map((q, i) => ({ question: q, answer: answers[i] }))
        })
      });

      if (!response.ok) throw new Error("Update failed.");
      router.push(`/project/${projectId}/plan`);
    } catch (error) {
      toast.error("Failed to proceed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center text-white"><Lightbulb className="mr-2 text-yellow-400" /> AI Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-300 leading-relaxed">{initialAnalysis.summary}</p>
        </CardContent>
      </Card>

      {initialAnalysis.inconsistencies.length > 0 && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/50">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Scope Concerns</AlertTitle>
          <AlertDescription>
            <ul className="list-disc pl-5 space-y-1 mt-2 text-red-200">
              {initialAnalysis.inconsistencies.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="font-semibold text-white flex items-center"><Search className="mr-2 h-5 w-5 text-blue-400" /> Market Context</h3>
        <div className="flex flex-wrap gap-2">
          {initialAnalysis.similarProducts.map((product, i) => (
            <span key={i} className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs">{product}</span>
          ))}
        </div>
      </div>

      <div className="space-y-8 mt-12 border-t border-slate-800 pt-8">
        <h3 className="text-xl font-bold text-white">Clarifying Questions</h3>
        <div className="space-y-6">
          {initialAnalysis.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <label className="font-medium text-slate-300 block">{index + 1}. {question}</label>
              <textarea
                className="w-full p-3 border border-slate-700 rounded-md bg-slate-800/50 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                rows={3}
                placeholder="Share your thoughts..."
                value={answers[index] || ""}
                onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end pt-8">
        <Button onClick={handleContinue} disabled={!allQuestionsAnswered || isLoading} size="lg" className="bg-blue-600 hover:bg-blue-700">
          {isLoading ? <Loader2 className="mr-2 animate-spin" /> : null}
          {isLoading ? "Generating Plan..." : "Continue to Development Plan"}
          {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
