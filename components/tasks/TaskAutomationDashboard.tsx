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
import { CheckCircle2, FileCode, Check, Loader2, ArrowRight, RefreshCcw, LayoutPanelLeft, List, Code2 } from "lucide-react";
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
  const [mobileView, setMobileView] = useState<"tasks" | "editor">("tasks");

  useEffect(() => {
    setTasks(initialTasks);
    setProject(initialProject);
    if (!activeTaskId && initialTasks.length > 0) {
        const firstPending = initialTasks.find(t => t.status !== 'done');
        if (firstPending) {
            setActiveTask(firstPending.id);
            setMobileView("editor");
        }
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
        
        toast.success(`Synced ${data.fileCount} files`);
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
        if (!res.ok) throw new Error(data.error || "Commit failed");
        
        toast.success("Committed to GitHub");
        onRefresh();
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsSyncing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
        <header className="h-auto px-4 md:px-8 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b bg-white shrink-0 sticky top-0 md:top-[60px] z-[40] shadow-sm">
            <div className="flex items-center gap-4">
                <div className="w-1.5 h-10 bg-primary rounded-full hidden sm:block" />
                <div className="space-y-1">
                    <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tighter uppercase">Logic Automation</h2>
                    <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <span className="text-primary/70">{initialProject.name}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        <button onClick={handleSync} disabled={isSyncing} className="hover:text-primary transition-all flex items-center gap-1">
                            <RefreshCcw className={cn("h-2 w-2", isSyncing && "animate-spin")} /> Sync
                        </button>
                    </div>
                </div>
            </div>
            
            <div className="w-full lg:w-1/2">
                <AutomationControls 
                    projectId={initialProject.id} 
                    nextTask={nextTask} 
                    onRefresh={onRefresh} 
                />
            </div>
        </header>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden border-b bg-slate-50 sticky top-[136px] z-30">
            <button 
                onClick={() => setMobileView("tasks")}
                className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all", mobileView === "tasks" ? "border-primary text-primary bg-white" : "border-transparent text-slate-400")}
            >
                <List className="h-4 w-4" /> Task List
            </button>
            <button 
                onClick={() => setMobileView("editor")}
                className={cn("flex-1 py-3 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border-b-2 transition-all", mobileView === "editor" ? "border-primary text-primary bg-white" : "border-transparent text-slate-400")}
            >
                <Code2 className="h-4 w-4" /> Logic Console
            </button>
        </div>

        <div className="flex flex-1 relative overflow-hidden">
            {/* Task list sidebar */}
            <div className={cn(
                "w-full md:w-[380px] shrink-0 border-r border-purple-50 bg-white md:sticky md:top-[140px] md:h-[calc(100vh-140px)] overflow-y-auto transition-transform duration-300",
                mobileView === "tasks" ? "translate-x-0" : "-translate-x-full absolute md:static md:translate-x-0"
            )}>
                <TaskList tasks={tasks} />
            </div>

            <main className={cn(
                "flex-1 bg-white min-h-screen transition-transform duration-300",
                mobileView === "editor" ? "translate-x-0" : "translate-x-full md:translate-x-0 hidden md:block"
            )}>
                <div className="p-4 md:p-8 lg:p-12 space-y-8 max-w-5xl mx-auto">
                    <AnimatePresence mode="wait">
                    {activeTask ? (
                        <motion.div 
                            key={activeTaskId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full tracking-[0.2em] uppercase">
                                            Phase Sequence #{activeTask.sequence_number}
                                        </span>
                                        <span className={cn(
                                            "text-[10px] font-black px-3 py-1 rounded-full tracking-[0.2em] uppercase border shadow-sm",
                                            activeTask.status === 'done' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                        )}>
                                            {activeTask.status}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">{activeTask.title}</h3>
                                    <p className="text-slate-500 text-sm md:text-base max-w-3xl leading-relaxed font-medium">{activeTask.description}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                                        <FileCode className="h-4 w-4" /> Modified Files
                                    </h4>
                                    <div className="grid gap-2.5">
                                        {activeTask.file_paths.map((f: string) => (
                                            <div key={f} className="text-[11px] font-bold text-slate-600 font-mono flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-primary/20">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 opacity-40" />
                                                <span className="truncate">{f}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50/30 space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 px-1">
                                        <CheckCircle2 className="h-4 w-4" /> Quality Benchmarks
                                    </h4>
                                    <div className="grid gap-2.5">
                                        {activeTask.acceptance_criteria.map((c: string) => (
                                            <div key={c} className="text-[11px] flex items-center gap-4 text-slate-600 font-bold bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-all hover:border-emerald-100">
                                                <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                                                <span className="line-clamp-1">{c}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-12 pt-4">
                                {activeTask.generated_prompt && activeTask.status === 'pending' && !isRunning && (
                                  <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] shrink-0">Architectural Prompt</h4>
                                        <div className="h-px bg-slate-100 flex-1" />
                                    </div>
                                    <PromptViewer 
                                      prompt={activeTask.generated_prompt} 
                                      onSend={(prompt) => triggerCodeGeneration(activeTask.id, prompt)} 
                                      isGenerating={isRunning}
                                    />
                                  </div>
                                )}

                                {(isRunning || Object.keys(streamingCode).length > 0) && activeTask.status !== 'pending' ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] shrink-0">Synthesis Output</h4>
                                            <div className="h-px bg-slate-100 flex-1" />
                                        </div>
                                        <div className="min-h-[400px]">
                                            <StreamingCode codeFiles={streamingCode} isStreaming={isRunning} />
                                        </div>
                                    </div>
                                ) : activeTask.generated_code && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] shrink-0">Constructed Files</h4>
                                            <div className="h-px bg-slate-100 flex-1" />
                                        </div>
                                        <div className="min-h-[400px]">
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
                        <div className="flex flex-col items-center justify-center flex-1 text-center py-20 md:py-40 space-y-8 opacity-60">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex items-center justify-center rotate-6 shadow-sm">
                                <CheckCircle2 className="h-12 w-12 text-slate-200" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">System Optimized</h3>
                                <p className="text-slate-500 font-medium px-8 max-w-sm">All pending logic nodes have been successfully finalized for this session.</p>
                            </div>
                        </div>
                    )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    </div>
  )
}
