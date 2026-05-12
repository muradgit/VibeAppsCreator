"use client";

import { useState } from "react";
import { Copy, Check, Send, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PromptViewerProps {
  prompt: string;
  onSend: (editedPrompt: string) => void;
  isGenerating: boolean;
}

export function PromptViewer({ prompt, onSend, isGenerating }: PromptViewerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrompt, setEditedPrompt] = useState(prompt);

  const handleCopy = () => {
    navigator.clipboard.writeText(editedPrompt);
    setIsCopied(true);
    toast.success("Prompt copied to clipboard");
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-4 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden flex flex-col h-full">
      <header className="px-4 py-3 bg-slate-950 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Constructed AI Prompt</span>
            {isEditing && <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-0.5 rounded">Editing mode</span>}
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={() => setIsEditing(!isEditing)}>
                <Edit2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white" onClick={handleCopy}>
                {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </Button>
        </div>
      </header>
      
      <div className="flex-1 p-4 overflow-y-auto">
        {isEditing ? (
            <Textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="w-full h-full min-h-[300px] bg-transparent border-none text-slate-300 font-mono text-xs leading-relaxed focus:ring-0 p-0 resize-none"
            />
        ) : (
            <div className="text-slate-300 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                {editedPrompt}
            </div>
        )}
      </div>

      <footer className="p-4 bg-slate-950 border-t border-white/5 flex justify-end">
        <Button 
            onClick={() => onSend(editedPrompt)}
            disabled={isGenerating}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-11 px-8 rounded-xl shadow-lg shadow-indigo-600/20"
        >
            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Send className="h-5 w-5 mr-2" />}
            Transmit to Logic Engine
        </Button>
      </footer>
    </div>
  );
}
