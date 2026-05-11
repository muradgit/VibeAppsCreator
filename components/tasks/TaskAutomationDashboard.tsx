"use client";

import { useEffect, useState } from "react";
import { useProjectStore } from "@/store/project.store";
import { Task, Project } from "@/types";
import { TaskList } from "@/components/tasks/TaskList";
import { StreamingCode } from "@/components/code/StreamingCode";
import { ReviewPanel } from "@/components/code/ReviewPanel";
import { Card, CardContent } from "@/components/ui/card";
import { Play, BrainCircuit, Terminal, CheckCircle, FileCode, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TaskAutomationDashboard({ initialTasks, initialProject }: { initialTasks: Task[], initialProject: Project }) {
  const { 
    tasks, 
    setTasks, 
    setProject, 
    activeTaskId, 
    setActiveTask,
    streamingCode,
    isRunning,
    automationMode
  } = useProjectStore();

  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setTasks(initialTasks);
    setProject(initialProject);
    const firstPending = initialTasks.find(t => t.status !== 'done');
    if (firstPending) setActiveTask(firstPending.id);
  }, [initialTasks, initialProject, setTasks, setProject, setActiveTask]);

  const activeTask = tasks.find(t => t.id === activeTaskId);

  return (
    <>
        <header className="h-16 px-8 flex items-center justify-between border-b bg-white shrink-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Task Automation</h2>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">
                    {automationMode === 'semi' ? 'Semi-Auto Mode' : automationMode === 'full' ? 'Full-Auto Mode' : 'Manual Mode'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <Button className="bg-[#0F172A] text-white hover:bg-slate-800 transition-colors h-9 px-4 text-xs font-semibold">
                    <Play className="w-3.5 h-3.5 mr-2 fill-current" />
                    Run Next Task
                </Button>
            </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
            <TaskList tasks={tasks} />

            <section className="flex-1 p-8 overflow-y-auto bg-white flex flex-col gap-6">
                {activeTask ? (
                    <>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded tracking-widest">
                                        PHASE {activeTask.sequence_number}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono tracking-tighter">
                                        ID: {activeTask.id.slice(0, 8).toUpperCase()}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{activeTask.title}</h3>
                                <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">{activeTask.description}</p>
                            </div>
                            <div className="text-right space-y-1">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Complexity</div>
                                <div className="text-lg font-bold text-slate-800 uppercase tracking-tighter">High</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <FileCode className="h-3 w-3" /> Files to Create
                                </div>
                                <ul className="space-y-3">
                                    {activeTask.file_paths.map(f => (
                                        <li key={f} className="text-xs font-medium text-slate-600 font-mono flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Check className="h-3.5 w-3.5" /> Acceptance Criteria
                                </div>
                                <ul className="space-y-3">
                                    {activeTask.acceptance_criteria.map(c => (
                                        <li key={c} className="text-xs flex items-center gap-2 text-slate-600 font-medium">
                                            <div className="shrink-0 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                                            </div>
                                            {c}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="flex-1 mt-4">
                             <StreamingCode codeFiles={streamingCode} isStreaming={isRunning} />
                        </div>
                        
                        {activeTask.review_result && (
                            <ReviewPanel 
                                review={activeTask.review_result as any} 
                                onCommit={() => toast.success("Committing changes...")} 
                                onRegenerate={() => {}}
                                isCommitting={isSyncing}
                            />
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center flex-1 text-center space-y-6 opacity-40">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="h-10 w-10 text-slate-300" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-slate-900">Queue Satisfied</p>
                            <p className="text-sm text-slate-500">All tasks for the current phase have been processed.</p>
                        </div>
                    </div>
                )}
            </section>
        </div>
    </>
  )
}
