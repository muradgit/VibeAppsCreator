"use client";

import React from "react";
import { Task } from "@/types";
import { cn } from "@/lib/utils";
import { TaskStatus } from "./TaskStatus";
import { Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  onClick: () => void;
}

export function TaskCard({ task, isActive, onClick }: TaskCardProps) {
  const isDone = task.status === 'done';
  const isInProgress = task.status === 'in_progress';
  const isFailed = task.status === 'failed';

  const borderColor = isActive 
    ? "border-blue-500" 
    : isDone 
      ? "border-emerald-500" 
      : isFailed 
        ? "border-rose-500" 
        : "border-slate-200";

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-xl border-l-4 transition-all flex items-start justify-between group",
        isActive 
          ? "bg-white shadow-md ring-2 ring-blue-500/10" 
          : "bg-white/60 hover:bg-white shadow-sm border-y border-r border-slate-100 grayscale-[0.5] hover:grayscale-0",
        borderColor
      )}
    >
      <div className="space-y-2 flex-1 pr-4">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-black tracking-tighter opacity-40",
            isActive && "text-blue-600 opacity-100"
          )}>
            #{String(task.sequence_number).padStart(2, '0')}
          </span>
          <TaskStatus status={task.status as any} />
        </div>
        <h4 className={cn(
          "text-sm font-bold leading-tight line-clamp-2",
          isActive ? "text-slate-900" : "text-slate-700"
        )}>
          {task.title}
        </h4>
      </div>
      
      <div className="shrink-0 pt-1">
        {isDone ? (
          <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="h-3 w-3 text-white stroke-[3]" />
          </div>
        ) : isInProgress ? (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        ) : (
          <div className={cn(
            "w-5 h-5 rounded-full border-2 transition-colors",
            isActive ? "border-blue-200 bg-blue-50" : "border-slate-100 group-hover:border-slate-200"
          )} />
        )}
      </div>
    </motion.button>
  );
}
