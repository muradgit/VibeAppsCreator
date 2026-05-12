"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileCode, Folder, Copy, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface CodeViewerProps {
  files: Record<string, string>;
}

export function CodeViewer({ files }: CodeViewerProps) {
  const fileList = Object.keys(files);
  const [activeFile, setActiveFile] = useState(fileList[0] || "");
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(files[activeFile]);
    setIsCopied(true);
    toast.success(`${activeFile} copied!`);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (fileList.length === 0) {
    return (
        <div className="flex-1 flex items-center justify-center text-slate-500 font-bold uppercase tracking-widest text-xs">
            No code generated yet
        </div>
    );
  }

  return (
    <div className="flex-1 flex overflow-hidden rounded-2xl border border-white/5 bg-slate-950 shadow-2xl h-full">
      {/* Sidebar - File Tree */}
      <div className="w-64 border-r border-white/5 bg-slate-900 overflow-y-auto flex flex-col h-full">
        <header className="p-4 border-b border-white/5">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Workspace</span>
        </header>
        <div className="p-2 space-y-1">
            {fileList.map((file) => (
                <button
                    key={file}
                    onClick={() => setActiveFile(file)}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group",
                        activeFile === file 
                            ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                    )}
                >
                    <FileCode className={cn("h-4 w-4 shrink-0", activeFile === file ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                    <span className="truncate flex-1 text-left">{file}</span>
                    {activeFile === file && <ChevronRight className="h-3 w-3" />}
                </button>
            ))}
        </div>
      </div>

      {/* Main Content - Code Editor */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="px-6 py-3 bg-slate-950 border-b border-white/5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
                <Folder className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-mono text-slate-300">{activeFile}</span>
            </div>
            <button 
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all text-[10px] font-bold uppercase tracking-widest"
            >
                {isCopied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                {isCopied ? "Copied" : "Copy Code"}
            </button>
        </header>
        <div className="flex-1 overflow-auto bg-[#1e1e1e]">
            <SyntaxHighlighter
                language="typescript"
                style={vscDarkPlus}
                customStyle={{
                    margin: 0,
                    padding: "24px",
                    fontSize: "13px",
                    lineHeight: "1.6",
                    background: "transparent"
                }}
                showLineNumbers
            >
                {files[activeFile] || ""}
            </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
}
