"use client";

import { useProjectStore } from "@/store/project.store";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, ChevronRight, Circle, Loader2 } from "lucide-react";

export function TaskList({ tasks }: { tasks: Task[] }) {
  const { activeTaskId, setActiveTask } = useProjectStore();

  return (
    <div className="w-[380px] border-r bg-slate-50 flex flex-col overflow-hidden shrink-0">
      <div className="p-4 border-b bg-white">
        <input 
            type="text" 
            placeholder="Search tasks..." 
            className="w-full px-3 py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.map((task, idx) => {
          const isActive = activeTaskId === task.id;
          const isDone = task.status === 'done';
          const isInProgress = task.status === 'in_progress';

          return (
            <button
              key={task.id}
              onClick={() => setActiveTask(task.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl border-l-4 transition-all flex items-start justify-between group",
                isActive 
                    ? "bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10" 
                    : isDone
                        ? "bg-white border-emerald-500 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              )}
            >
              <div className="space-y-1">
                <div className={cn(
                    "text-[10px] font-bold uppercase",
                    isActive ? "text-blue-500" : "text-slate-400"
                )}>
                    Task #{idx + 1} {isInProgress && "— In Progress"}
                </div>
                <h4 className={cn("text-sm font-bold", isActive ? "text-slate-900" : "text-slate-700")}>
                    {task.title}
                </h4>
              </div>
              
              {isDone ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : isInProgress ? (
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
