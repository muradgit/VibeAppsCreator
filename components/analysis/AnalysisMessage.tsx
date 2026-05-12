import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalysisMessageProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export function AnalysisMessage({ role, content, timestamp }: AnalysisMessageProps) {
  const isAssistant = role === "assistant";

  return (
    <div className={cn("flex gap-4", isAssistant ? "flex-row" : "flex-row-reverse")}>
      <div className={cn(
        "shrink-0 w-9 h-9 rounded-full flex items-center justify-center",
        isAssistant ? "bg-slate-100" : "bg-indigo-600 shadow-lg shadow-indigo-500/20"
      )}>
        {isAssistant ? (
          <Sparkles className="h-5 w-5 text-indigo-600" />
        ) : (
          <span className="text-white text-xs font-bold font-mono">YOU</span>
        )}
      </div>
      <div className={cn("flex flex-col space-y-2 max-w-[80%]", !isAssistant && "items-end")}>
        <div className={cn(
          "p-4 rounded-2xl text-sm leading-relaxed",
          isAssistant 
            ? "bg-slate-50 border border-slate-100 text-slate-700" 
            : "bg-indigo-600 text-white shadow-xl shadow-indigo-500/10"
        )}>
          {content}
        </div>
        {timestamp && (
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
            {isAssistant ? "Intelligent Assistant" : "You"} • {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
