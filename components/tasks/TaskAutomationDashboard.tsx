"use client";

import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/project.store";
import { Task, Project } from "@/types";
import { TaskList } from "@/components/tasks/TaskList";
import { StreamingCode } from "@/components/code/StreamingCode";
import { ReviewPanel } from "@/components/code/ReviewPanel";
import { PromptViewer } from "@/components/code/PromptViewer";
import { AutomationControls } from "@/components/tasks/AutomationControls";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, FileCode, Check, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { CompletionScreen } from "@/components/tasks/CompletionScreen";

export function TaskAutomationDashboard({ initialTasks, initialProject, onRefresh }: { 
    initialTasks: any[], 
    initialProject: any,
    onRefresh: () => void
}) {
  const { 
    tasks, 
    setTasks, 
    setProject, 
    activeTaskId, 
    setActiveTask,
    streamingCode,
    isRunning
  } = useProjectStore();

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setTasks(initialTasks);
    setProject(initialProject);
    if (!activeTaskId && initialTasks.length > 0) {
        const firstPending = initialTasks.find(t => t.status !== 'done');
        if (firstPending) setActiveTask(firstPending.id);
    }
  }, [initialTasks, initialProject]);

  const activeTask = tasks.find(t => t.id === activeTaskId);
  const nextTask = tasks.find(t => t.status === 'pending');
  const allDone = tasks.length > 0 && tasks.every(t => t.status === 'done');

  if (allDone) {
    return <CompletionScreen project={initialProject} tasks={tasks} />;
  }

  const triggerCodeGeneration = (taskId: string, prompt: string) => {
    if ((window as any).resumeAutomation) {
      (window as any).resumeAutomation(taskId, prompt);
    }
  };

  const handleCommit = async () => {
    if (!activeTask) return;
    setIsSyncing(true);
    try {
        const res = await fetch("/api/github/commit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId: activeTask.id, projectId: initialProject.id })
        });
        
        const data = await res.json();
        
        if (!res.ok) {
          if (data.rateLimited) {
            let timeLeft = 60;
            const toastId = toast.error(`GitHub rate limit reached. Retrying in ${timeLeft}s...`, { duration: 61000 });
            
            const interval = setInterval(() => {
              timeLeft -= 1;
              if (timeLeft <= 0) {
                clearInterval(interval);
                toast.dismiss(toastId);
                handleCommit(); // Auto-retry when countdown ends
              } else {
                toast.error(`GitHub rate limit reached. Retrying in ${timeLeft}s...`, { id: toastId });
              }
            }, 1000);
            return;
          }
          throw new Error(data.error || "Commit failed");
        }
        
        toast.success("Changes committed to GitHub");
        onRefresh();
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <header className="h-20 px-8 flex items-center justify-between border-b bg-white dark:bg-slate-900 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Logic Automation Hub</h2>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Project Context: {initialProject.name}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>Repo: {initialProject.github_repo || 'Not linked'}</span>
                    </div>
                </div>
            </div>
            
            <div className="w-1/2 max-w-lg">
                <AutomationControls 
                    projectId={initialProject.id} 
                    nextTask={nextTask} 
                    onRefresh={onRefresh} 
                />
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            <TaskList tasks={tasks} />

            <main className="flex-1 overflow-y-auto p-8 space-y-8 bg-white dark:bg-slate-950">
                {activeTask ? (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-start justify-between mb-8">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg tracking-widest uppercase">
                                        Sequence #{activeTask.sequence_number}
                                    </span>
                                    <span className={cn(
                                        "text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest uppercase",
                                        activeTask.status === 'done' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
                                    )}>
                                        {activeTask.status}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{activeTask.title}</h3>
                                <p className="text-slate-500 text-sm max-w-3xl leading-relaxed font-medium">{activeTask.description}</p>
                            </div>
                            <Link href={`/project/${initialProject.id}/task/${activeTask.id}`}>
                                <Button variant="outline" size="sm" className="h-9 px-4 text-xs font-bold font-mono">
                                    Full Details <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileCode className="h-4 w-4" /> Affected Workspace
                                </h4>
                                <div className="grid gap-2">
                                    {activeTask.file_paths.map((f: string) => (
                                        <div key={f} className="text-[11px] font-bold text-slate-600 font-mono flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                            {f}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Acceptance Scorecard
                                </h4>
                                <div className="grid gap-2">
                                    {activeTask.acceptance_criteria.map((c: string) => (
                                        <div key={c} className="text-[11px] flex items-center gap-3 text-slate-600 font-bold bg-white p-2 rounded-lg border border-slate-100">
                                            <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            {c}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-8">
                            {activeTask.generated_prompt && activeTask.status === 'pending' && !isRunning && (
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constructing Blueprint</h4>
                                <PromptViewer 
                                  prompt={activeTask.generated_prompt} 
                                  onSend={(prompt) => triggerCodeGeneration(activeTask.id, prompt)} 
                                  isGenerating={isRunning}
                                />
                              </div>
                            )}

                            {(isRunning || Object.keys(streamingCode).length > 0) && activeTask.status !== 'pending' ? (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic Streaming Output</h4>
                                    <StreamingCode codeFiles={streamingCode} isStreaming={isRunning} />
                                </div>
                            ) : activeTask.generated_code && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constructed Payload</h4>
                                    <div className="h-[400px]">
                                        <StreamingCode codeFiles={activeTask.generated_code as any} isStreaming={false} />
                                    </div>
                                </div>
                            )}
                            
                            {activeTask.review_result && (
                                <ReviewPanel 
                                    review={activeTask.review_result as any} 
                                    onCommit={handleCommit} 
                                    onRegenerate={() => {}}
                                    isCommitting={isSyncing}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-center py-40 space-y-6 opacity-40">
                        <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center rotate-3 border border-slate-200">
                            <CheckCircle2 className="h-12 w-12 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Queue Optimized</h3>
                            <p className="text-sm text-slate-500 font-medium">All pending logic tasks have been finalized for this phase.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    </div>
  )
}
