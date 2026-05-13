import React from "react";
import { CheckCircle2, Circle, Loader2, ShieldCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskStatusProps {
  status: 'pending' | 'in_progress' | 'review' | 'done' | 'failed';
}

export function TaskStatus({ status }: TaskStatusProps) {
  const config = {
    pending: {
      label: "Pending",
      icon: Circle,
      color: "bg-slate-100 text-slate-500 border-slate-200",
      iconColor: "text-slate-400"
    },
    in_progress: {
      label: "In Progress",
      icon: Loader2,
      color: "bg-blue-50 text-blue-600 border-blue-100",
      iconColor: "text-blue-500 animate-spin"
    },
    review: {
      label: "In Review",
      icon: ShieldCheck,
      color: "bg-amber-50 text-amber-600 border-amber-100",
      iconColor: "text-amber-500"
    },
    done: {
      label: "Completed",
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
      iconColor: "text-emerald-500"
    },
    failed: {
      label: "Failed",
      icon: XCircle,
      color: "bg-rose-50 text-rose-600 border-rose-100",
      iconColor: "text-rose-500"
    }
  };

  const current = config[status] || config.pending;
  const Icon = current.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-colors duration-300",
      current.color
    )}>
      <Icon className={cn("h-3 w-3", current.iconColor)} />
      <span>{current.label}</span>
    </div>
  );
}
