"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProjectStore } from "@/store/project.store";
import { Loader2, Zap, PlayCircle, ShieldCheck, Github, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AutomationControlsProps {
    projectId: string;
    nextTask: any | null;
    onRefresh: () => void;
}

export function AutomationControls({ projectId, nextTask, onRefresh }: AutomationControlsProps) {
    const { setRawStreamingText, clearStreamingCode, startAutomation, pauseAutomation } = useProjectStore();
    const [status, setStatus] = useState<"idle" | "prompting" | "coding" | "reviewing" | "committing">("idle");
    const [automationMode, setAutomationMode] = useState<"manual" | "semi" | "full">("semi");

    const runSequence = async (resumeFromStep?: number, resumePrompt?: string) => {
        if (!nextTask) {
            toast.info("All tasks completed");
            return;
        }

        const step = resumeFromStep || 1;

        if (step === 1) {
            // BUG 6: Check dependencies are all done
            if (nextTask.dependencies && nextTask.dependencies.length > 0) {
                const allTasks = useProjectStore.getState().tasks;
                const unmetDeps = nextTask.dependencies.filter((depId: string) => {
                    const depTask = allTasks.find((t: any) => t.id === depId);
                    return !depTask || depTask.status !== 'done';
                });
                if (unmetDeps.length > 0) {
                    toast.warning(`Task "${nextTask.title}" is waiting for ${unmetDeps.length} dependency/dependencies to complete first.`);
                    pauseAutomation();
                    setStatus("idle");
                    return;
                }
            }
        }
        
        try {
            startAutomation();
            
            let prompt = resumePrompt || "";

            if (step <= 1) {
                // 1. Generate Prompt
                setStatus("prompting");
                const promptRes = await fetch("/api/gemini/generate-prompt", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ taskId: nextTask.id, projectId })
                });
                if (!promptRes.ok) throw new Error("Prompt generation failed");
                const data = await promptRes.json();
                prompt = data.prompt;
                
                // BUG 6: Pause after prompt generation
                toast.info("Task prompt generated. Review needed before construction.");
                setStatus("idle");
                pauseAutomation();
                onRefresh();
                return;
            }

            // 2. Generate Code (Streaming)
            clearStreamingCode();
            setStatus("coding");
            const codeRes = await fetch("/api/gemini/generate-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId: nextTask.id, prompt, projectId })
            });
            
            if (!codeRes.ok) throw new Error("Code generation failed");
            
            const reader = codeRes.body?.getReader();
            const decoder = new TextDecoder();
            let fullStreamed = "";
            
            if (reader) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    const chunk = decoder.decode(value);
                    fullStreamed += chunk;
                    setRawStreamingText(fullStreamed);
                }
            }

            // 3. Review
            setStatus("reviewing");
            const reviewRes = await fetch("/api/gemini/review", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ taskId: nextTask.id, projectId })
            });
            if (!reviewRes.ok) throw new Error("Review failed");
            const review = await reviewRes.json();

            // BUG 7: Retry Limit Not Enforced
            const MAX_RETRIES = 3;
            if (review.score < 90 && nextTask.retry_count >= MAX_RETRIES) {
                pauseAutomation();
                setStatus("idle");
                toast.error(
                    `Task "${nextTask.title}" has failed review ${MAX_RETRIES} times. Please manually review the prompt or edit the code before continuing.`,
                    { duration: 8000 }
                );
                onRefresh();
                return;
            }

            // BUG 5: Manual/Semi mode pausing
            if (automationMode === 'manual' || automationMode === 'semi') {
                pauseAutomation();
                setStatus("idle");
                onRefresh();
                toast.success("Review complete — approve to commit");
                return;
            }

            if (review.score >= 90 && automationMode === "full") {
                // 4. Auto-commit
                setStatus("committing");
                const commitRes = await fetch("/api/github/commit", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ taskId: nextTask.id, projectId })
                });
                if (!commitRes.ok) throw new Error("Auto-commit failed");
                toast.success("Task completed and committed!");
                onRefresh();
                
                // If full auto, continue to next task
                setTimeout(() => runSequence(), 2000);
            } else {
                onRefresh();
                toast.success("Task execution finished. Please review code.");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setStatus("idle");
            pauseAutomation();
        }
    };

    // Resuming from dashboard via prompt submission
    (window as any).resumeAutomation = (taskId: string, prompt: string) => {
        if (nextTask?.id === taskId) {
            runSequence(2, prompt);
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-3 md:p-4 bg-white border border-purple-100 rounded-xl md:rounded-2xl shadow-lg shadow-purple-500/5">
            <div className="flex gap-1 p-1 bg-purple-50 rounded-lg md:rounded-xl border border-purple-50 overflow-x-auto shrink-0 no-scrollbar">
                {(["manual", "semi", "full"] as const).map((m) => (
                    <button
                        key={m}
                        onClick={() => setAutomationMode(m)}
                        className={cn(
                            "px-3 py-1.5 rounded-md md:rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                            automationMode === m ? "bg-primary text-white shadow-lg shadow-purple-500/20" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {m}
                    </button>
                ))}
            </div>

            <div className="hidden sm:block h-8 w-px bg-purple-50" />

            <Button
                onClick={() => runSequence()}
                disabled={status !== "idle" || !nextTask}
                className={cn(
                    "flex-1 h-10 md:h-11 font-black transition-all text-xs md:text-sm truncate",
                    status === "idle" ? "bg-primary hover:bg-primary/90 text-white shadow-xl shadow-purple-500/20" : "bg-slate-100 text-slate-400"
                )}
            >
                {status === "idle" ? (
                    <><PlayCircle className="mr-2 h-4 w-4 md:h-5 md:w-5 shrink-0" /> <span className="truncate">Next: {nextTask?.title || "End"}</span></>
                ) : (
                    <><Loader2 className="mr-2 h-4 w-4 md:h-5 md:w-5 animate-spin shrink-0" /> {status.toUpperCase()}...</>
                )}
            </Button>

            {status !== "idle" && (
                <div className="flex items-center justify-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full animate-pulse">
                    <Zap className="h-3 w-3 text-primary fill-current" />
                    <span className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-widest">{status}</span>
                </div>
            )}
        </div>
    );
}
