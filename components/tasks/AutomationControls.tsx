"use client";

import { useProjectStore } from "@/store/project.store";
import { Button } from "@/components/ui/button";
import { Play, Pause, FastForward, Loader2, Command, Zap, PlayCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function AutomationControls({ projectId, nextTask, onRefresh }: { 
    projectId: string, 
    nextTask: any,
    onRefresh: () => void
}) {
  const { 
    isRunning, 
    startAutomation,
    pauseAutomation,
    appendStreamingCode,
    clearStreamingCode,
    automationMode, 
    setAutomationMode,
    activeTaskId,
    setActiveTask,
    tasks
  } = useProjectStore();

  const runSequence = async (taskId: string, prompt: string) => {
    startAutomation();
    clearStreamingCode();
    
    try {
        const response = await fetch("/api/gemini/generate-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId, prompt, projectId })
        });

        if (!response.ok) throw new Error("Generation failed");

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader!.read();
            if (done) break;
            const chunk = decoder.decode(value);
            appendStreamingCode(chunk);
        }

        toast.success("Code expansion complete");
        onRefresh();

        // If full automation is on, proceed to review and next task
        if (automationMode === 'full') {
            // Logic for auto-review and commit could be triggered here
            // For now, it pauses for user to see the result
        }
        
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        pauseAutomation();
    }
  };

  // Expose to window for TaskAutomationDashboard to call
  if (typeof window !== 'undefined') {
    (window as any).resumeAutomation = runSequence;
  }

  const handleStartNext = () => {
    if (!nextTask) return;
    setActiveTask(nextTask.id);
    if (nextTask.generated_prompt) {
        runSequence(nextTask.id, nextTask.generated_prompt);
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-slate-900 rounded-2xl shadow-xl shadow-purple-500/10 border border-white/5 w-full">
        <div className="flex bg-slate-800 rounded-xl p-1 shrink-0">
            {[
                { id: 'manual', icon: Command, label: 'Standard' },
                { id: 'semi', icon: Zap, label: 'Assistant' },
                { id: 'full', icon: PlayCircle, label: 'Auto' }
            ].map((mode) => (
                <Tooltip key={mode.id}>
                    <TooltipTrigger asChild>
                        <button
                            onClick={() => setAutomationMode(mode.id as any)}
                            className={cn(
                                "p-2 !px-3 md:px-4 rounded-lg flex items-center gap-2 transition-all duration-300",
                                automationMode === mode.id 
                                    ? "bg-primary text-white shadow-lg shadow-purple-500/30" 
                                    : "text-slate-400 hover:text-white"
                            )}
                        >
                            <mode.icon className="h-4 w-4" />
                            <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">{mode.label}</span>
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-[10px] font-black uppercase tracking-widest bg-slate-900 border-white/10">
                        {mode.id} Synthesis Mode
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
        
        <div className="h-8 w-px bg-white/10 mx-1 shrink-0" />

        <Button 
            onClick={handleStartNext}
            disabled={isRunning || !nextTask}
            className={cn(
                "flex-1 h-11 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-xs transition-all duration-500 overflow-hidden relative group",
                isRunning ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" : "bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isRunning ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Synthesizing Logic...
                </>
            ) : (
                <>
                    <Play className="mr-2 h-4 w-4 fill-current" />
                    Process Next Step
                </>
            )}
        </Button>
    </div>
  );
}
