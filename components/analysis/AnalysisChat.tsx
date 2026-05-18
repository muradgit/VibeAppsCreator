"use client";

import { useState, useRef, useEffect } from "react";
import { User, BrainCircuit, Sparkles, Send, Loader2, Bot, ArrowRight, MessageSquare, ListTodo, Layers, RefreshCcw } from "lucide-react";
import { useProjectStore } from "@/store/project.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function AnalysisChat({ projectId }: { projectId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load project and initial system greeting
  useEffect(() => {
    const init = async () => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages([{
                role: 'assistant',
                content: "Initialization complete. I've begun analyzing the logical vectors of your project. To refine the architecture, I need to extract specific intent. What is the primary problem space this application aims to solve?"
            }]);
            setIsTyping(false);
        }, 1200);
    };
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
        const response = await fetch("/api/gemini/analyse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, input, history: messages })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.response,
            suggestedActions: data.isComplete ? ['Review Plan'] : []
        }]);

        if (data.isComplete) {
            toast.success("Requirement extraction successful");
            setTimeout(() => {
                 router.push(`/project/${projectId}/plan`);
            }, 2000);
        }
    } catch (error: any) {
        toast.error(error.message);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-124px)] md:h-[calc(100vh-60px)] bg-slate-50 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-24 space-y-12 pb-32 no-smooth-scroll relative">
            <div className="max-w-4xl mx-auto space-y-12">
            {messages.map((m, i) => (
                <div key={i} className={cn(
                    "flex gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700",
                    m.role === 'assistant' ? "items-start" : "items-start justify-end"
                )}>
                    {m.role === 'assistant' && (
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-purple-500/10 rotate-3">
                            <Bot className="h-5 w-5 md:h-7 md:w-7 text-white" />
                        </div>
                    )}
                    
                    <div className={cn(
                        "space-y-4 max-w-[85%] md:max-w-2xl",
                        m.role === 'assistant' ? "text-left" : "text-left"
                    )}>
                        <div className={cn(
                            "p-5 md:p-8 rounded-[2rem] text-sm md:text-base font-medium leading-relaxed shadow-sm",
                            m.role === 'assistant' 
                                ? "bg-white border border-purple-50 text-slate-800"
                                : "bg-primary text-white ml-auto"
                        )}>
                            {m.content}
                        </div>
                        
                        {m.suggestedActions?.length > 0 && (
                            <div className="flex flex-wrap gap-3 pt-2">
                                {m.suggestedActions.map((action: string) => (
                                    <Button key={action} variant="outline" className="h-10 px-6 rounded-xl border-emerald-100 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-black uppercase tracking-widest text-[10px]" asChild>
                                        <Link href={`/project/${projectId}/plan`}>
                                            <Sparkles className="mr-2 h-3.5 w-3.5" /> {action}
                                        </Link>
                                    </Button>
                                ))}
                            </div>
                        )}
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 px-4">
                            {m.role} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    {m.role === 'user' && (
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0 shadow-sm -rotate-3 overflow-hidden">
                             <User className="h-5 w-5 md:h-7 md:w-7 text-slate-400" />
                        </div>
                    )}
                </div>
            ))}
            
            {isTyping && (
                <div className="flex gap-4 md:gap-8 items-start">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-primary/20 rounded-2xl flex items-center justify-center animate-pulse rotate-3">
                        <Loader2 className="h-5 w-5 md:h-7 md:w-7 text-primary animate-spin" />
                    </div>
                    <div className="h-14 w-32 bg-white border border-purple-50 rounded-full flex items-center justify-center gap-1 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    </div>
                </div>
            )}
            </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent">
            <div className="max-w-4xl mx-auto relative group">
                <form onSubmit={handleSend} className="relative z-10">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your response here..."
                        className="w-full h-14 md:h-16 pl-6 pr-20 md:pr-40 bg-white border border-purple-100 rounded-2xl md:rounded-3xl shadow-xl shadow-purple-500/5 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm md:text-base font-medium"
                    />
                    <div className="absolute right-2 top-2 bottom-2 p-1.5 flex gap-2">
                        <Button type="button" variant="ghost" className="h-full px-4 rounded-xl text-slate-400 hover:text-primary hover:bg-purple-50 transition-colors hidden md:flex">
                             <Sparkles className="h-5 w-5" />
                        </Button>
                        <Button disabled={!input.trim() || isTyping} className="h-full px-6 md:px-8 rounded-xl md:rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] md:text-xs">
                            <Send className="w-4 h-4 mr-2" /> <span className="hidden sm:inline">Dispatch</span>
                        </Button>
                    </div>
                </form>
                <div className="absolute inset-0 bg-primary/20 blur-2xl -z-10 opacity-0 group-focus-within:opacity-30 transition-opacity" />
            </div>
        </div>
    </div>
  );
}
