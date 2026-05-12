"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PromptViewer } from "@/components/code/PromptViewer";
import { CodeViewer } from "@/components/code/CodeViewer";
import { ReviewPanel } from "@/components/tasks/ReviewPanel";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TaskPage() {
  const { id, taskId } = useParams();
  const [task, setTask] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const fetchTask = async () => {
    const res = await fetch(`/api/projects/${id}/tasks/${taskId}`);
    if (res.ok) {
        setTask(await res.json());
    }
    setIsLoading(false);
  };

  useEffect(() => { fetchTask(); }, [taskId]);

  if (isLoading) {
    return (
        <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
        </div>
    );
  }

  if (!task) return <div>Task not found</div>;

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-950">
      <header className="px-8 py-6 border-b flex items-center gap-6">
        <Link href={`/project/${id}/tasks`}>
            <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
            </Button>
        </Link>
        <div className="space-y-1">
            <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{task.title}</h1>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-600">
                    Task {task.sequence_number}
                </span>
                {task.status === 'done' && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
            </div>
            <p className="text-xs font-bold text-slate-400 border-l border-slate-200 pl-3 ml-3">@{id}</p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="border-r overflow-y-auto p-8 space-y-8">
            <section className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Context & Objectives</h2>
                <p className="text-sm font-medium leading-relaxed text-slate-700">{task.description}</p>
            </section>

            <section className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Acceptance Criteria</h2>
                <div className="grid gap-2">
                    {task.acceptance_criteria.map((c: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600">
                            <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                            {c}
                        </div>
                    ))}
                </div>
            </section>

            {task.review_result && (
                <section className="space-y-4">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Logic Audit Result</h2>
                    <ReviewPanel review={task.review_result} />
                </section>
            )}
        </div>

        <div className="bg-slate-900 flex flex-col h-full overflow-hidden">
            <Tabs defaultValue="prompt" className="flex-1 flex flex-col overflow-hidden">
                <header className="px-6 border-b border-white/5 flex items-center justify-between">
                    <TabsList className="bg-transparent border-none">
                        <TabsTrigger value="prompt" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-500">Prompting</TabsTrigger>
                        <TabsTrigger value="code" className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-slate-500">Generated Code</TabsTrigger>
                    </TabsList>
                </header>
                <div className="flex-1 overflow-hidden p-6">
                    <TabsContent value="prompt" className="h-full m-0">
                        <PromptViewer 
                            prompt={task.generated_prompt || "No prompt available."} 
                            onSend={() => {}} 
                            isGenerating={false} 
                        />
                    </TabsContent>
                    <TabsContent value="code" className="h-full m-0">
                        <CodeViewer files={task.generated_code || {}} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
