"use client";

import { useMemo } from "react";
import { Terminal, FileCode, Copy, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreamingCode({ codeFiles, isStreaming }: { codeFiles: Record<string, string>, isStreaming: boolean }) {
  const fileEntries = Object.entries(codeFiles);

  if (fileEntries.length === 0 && !isStreaming) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 min-h-[300px] flex items-center justify-center border-dashed">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Terminal className="h-6 w-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-widest">Awaiting Command</p>
                    <p className="text-xs text-slate-400">Click &apos;Run Next Task&apos; to start generation</p>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-[#0F172A] overflow-hidden flex flex-col min-h-[400px] shadow-2xl">
      <div className="h-10 bg-slate-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <Terminal className="h-3 w-3" /> Output Terminal
            </div>
        </div>
        <div className="flex items-center gap-3">
             <Copy className="h-3.5 w-3.5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
             <Maximize2 className="h-3.5 w-3.5 text-slate-500 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-48 bg-slate-900 border-r border-white/5 flex flex-col py-4 shrink-0 overflow-y-auto">
            <div className="px-4 mb-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest">Files</div>
            {fileEntries.map(([filename]) => (
                <div 
                    key={filename} 
                    className="flex items-center gap-2 px-4 py-2 text-[11px] font-mono text-blue-400 bg-blue-500/5 border-l-2 border-blue-500 cursor-pointer"
                >
                    <FileCode className="h-3 w-3" />
                    {filename.split('/').pop()}
                </div>
            ))}
        </div>
        
        <div className="flex-1 bg-slate-950 p-6 overflow-y-auto font-mono text-[13px] leading-relaxed relative">
            {fileEntries.map(([filename, code]) => (
                <pre key={filename} className="text-slate-300">
                    <code>{code}</code>
                </pre>
            ))}
            {isStreaming && (
                <div className="w-2 h-4 bg-blue-500 animate-pulse inline-block ml-1 align-middle" />
            )}
            
            <div className="sticky bottom-0 left-0 right-0 p-4 pointer-events-none">
                <div className="bg-blue-600/10 border border-blue-500/20 rounded-lg p-2 flex items-center justify-between backdrop-blur-sm">
                    <span className="text-[10px] text-blue-400 font-bold uppercase">Intelligence Processing...</span>
                    {isStreaming && <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={cn("animate-spin", className)}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    )
}
