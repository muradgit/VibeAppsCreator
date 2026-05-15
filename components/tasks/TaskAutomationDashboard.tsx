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
import { CheckCircle2, FileCode, Check, Loader2, ArrowRight, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
  }, [initialTasks, initialProject, activeTaskId, setActiveTask, setProject, setTasks]);

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

  const handleSync = async () => {
    setIsSyncing(true);
    try {
        const res = await fetch("/api/github/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId: initialProject.id })
        });
        
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Sync failed");
        
        toast.success(`Successfully synced ${data.fileCount} files from GitHub`);
        onRefresh();
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsSyncing(false);
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
    <div className="flex flex-col min-h-screen bg-purple-50/20">
        <header className="h-auto min-h-20 px-4 md:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b bg-white shrink-0 sticky top-0 md:top-[60px] z-30 shadow-sm">
            <div className="flex items-center gap-6">
                <div className="space-y-1">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight text-primary">Logic Automation Hub</h2>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>Context: <span className="text-slate-600 underline decoration-primary/20">{initialProject.name}</span></span>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-purple-200" />
                        <span className="hidden sm:inline text-slate-500">Repo: {initialProject.github_repo || 'Not linked'}</span>
                        {initialProject.github_repo && (
                            <>
                                <div className="w-1 h-1 rounded-full bg-purple-200" />
                                <button 
                                    onClick={handleSync}
                                    disabled={isSyncing}
                                    className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-50"
                                >
                                    <RefreshCcw className={cn("h-2.5 w-2.5", isSyncing && "animate-spin")} />
                                    <span>Sync</span>
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="w-full lg:w-1/2 max-w-lg">
                <AutomationControls 
                    projectId={initialProject.id} 
                    nextTask={nextTask} 
                    onRefresh={onRefresh} 
                />
            </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1 relative">
            {/* Task list sidebar */}
            <div className="hidden xl:block md:w-[380px] shrink-0 border-r border-purple-50 bg-white sticky top-[140px] h-[calc(100vh-140px)] overflow-y-auto">
                <TaskList tasks={tasks} />
            </div>

            <main className="flex-1 p-4 md:p-8 space-y-6 md:space-y-8 bg-white min-h-screen">
                {/* Mobile Task Switcher */}
                <div className="xl:hidden mb-4 overflow-x-auto pb-2 flex gap-2 no-scrollbar">
                    {tasks.map(t => (
                        <button 
                            key={t.id}
                            onClick={() => setActiveTask(t.id)}
                            className={cn(
                                "shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all",
                                activeTaskId === t.id ? "bg-primary text-white border-primary shadow-md shadow-purple-500/20" : "bg-purple-50 text-slate-400 border-purple-100"
                            )}
                        >
                            #{t.sequence_number} {t.title.split(' ').slice(0, 2).join(' ')}...
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                {activeTask ? (
                    <motion.div 
                        key={activeTaskId}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 md:mb-8">
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
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{activeTask.title}</h3>
                                <p className="text-slate-500 text-sm max-w-3xl leading-relaxed font-medium">{activeTask.description}</p>
                            </div>
                            <Link href={`/project/${initialProject.id}/task/${activeTask.id}`} className="w-full sm:w-auto">
                                <Button variant="outline" size="sm" className="w-full sm:w-auto h-9 px-4 text-xs font-bold font-mono">
                                    Full Details <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="p-4 md:p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <FileCode className="h-4 w-4" /> Affected Workspace
                                </h4>
                                <div className="grid gap-2">
                                    {activeTask.file_paths.map((f: string) => (
                                        <div key={f} className="text-[10px] md:text-[11px] font-bold text-slate-600 font-mono flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-100">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                            <span className="truncate">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 md:p-6 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4" /> Acceptance Scorecard
                                </h4>
                                <div className="grid gap-2">
                                    {activeTask.acceptance_criteria.map((c: string) => (
                                        <div key={c} className="text-[10px] md:text-[11px] flex items-center gap-3 text-slate-600 font-bold bg-white p-2 rounded-lg border border-slate-100">
                                            <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                            <span className="line-clamp-1">{c}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-8">
                            {activeTask.generated_prompt && activeTask.status === 'pending' && !isRunning && (
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Constructing Blueprint</h4>
                                <PromptViewer 
                                  prompt={activeTask.generated_prompt} 
                                  onSend={(prompt) => triggerCodeGeneration(activeTask.id, prompt)} 
                                  isGenerating={isRunning}
                                />
                              </div>
                            )}

                            {(isRunning || Object.keys(streamingCode).length > 0) && activeTask.status !== 'pending' ? (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Logic Streaming Output</h4>
                                    <div className="min-h-[300px]">
                                        <StreamingCode codeFiles={streamingCode} isStreaming={isRunning} />
                                    </div>
                                </div>
                            ) : activeTask.generated_code && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Constructed Payload</h4>
                                    <div className="h-auto min-h-[300px]">
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
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center flex-1 text-center py-20 md:py-40 space-y-6 opacity-40"
                    >
                        <div className="w-16 h-16 md:w-24 md:h-24 bg-slate-100 rounded-3xl flex items-center justify-center rotate-3 border border-slate-200">
                            <CheckCircle2 className="h-8 w-8 md:h-12 md:w-12 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">Queue Optimized</h3>
                            <p className="text-sm text-slate-500 font-medium px-4">All pending logic tasks have been finalized for this phase.</p>
                        </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </main>
        </div>
    </div>
  )
}
