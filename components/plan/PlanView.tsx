"use client";

import { Button } from "@/components/ui/button";
import { Check, Loader2, Sparkles, Layout, Palette, Code, Boxes, ArrowRight, Layers, FileCode } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PlanView({ plan, projectId }: { plan: any, projectId: string }) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
        const res = await fetch("/api/gemini/plan", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ projectId, approved: true })
        });
        
        if (res.ok) {
            toast.success("Evolutionary plan finalized");
            router.push(`/project/${projectId}/connect`);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsApproving(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const progress = (target.scrollTop / (target.scrollHeight - target.clientHeight)) * 100;
    setScrollProgress(progress);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-124px)] md:h-[calc(100vh-60px)] bg-slate-50 relative overflow-hidden">
        {/* Dynamic Nav Header */}
        <header className="h-16 px-4 md:px-8 bg-white border-b flex items-center justify-between shrink-0 sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-800">Architectural Manifest</h3>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Analysis Depth</span>
                    <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: '88%' }} />
                    </div>
                </div>
                <Button 
                    onClick={handleApprove} 
                    disabled={isApproving}
                    className="h-10 px-6 rounded-xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 transition-all hover:scale-105"
                >
                    {isApproving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" /> : <Check className="h-3.5 w-3.5 mr-2" />}
                    Finalize Core
                </Button>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto no-smooth-scroll" onScroll={handleScroll}>
            <div className="max-w-5xl mx-auto p-4 md:p-12 lg:p-24 space-y-16 md:space-y-32">
                
                {/* Intro Section */}
                <section className="space-y-8 text-center md:text-left">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                            {plan.title || "Foundational Masterplan"}
                        </h2>
                        <p className="text-lg md:text-2xl text-slate-500 font-medium max-w-3xl leading-relaxed">
                            {plan.summary}
                        </p>
                    </motion.div>
                </section>

                {/* Grid Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                    <PlanSection 
                        icon={Layout} 
                        title="Experience Layer" 
                        color="text-blue-500" 
                        items={plan.ui_ux} 
                    />
                    <PlanSection 
                        icon={Code} 
                        title="Logic Framework" 
                        color="text-primary" 
                        items={plan.technology_stack} 
                    />
                </div>

                {/* Phase Sequence */}
                <section className="space-y-12">
                    <div className="flex items-center gap-4">
                        <h4 className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.4em] shrink-0">Expansion Phases</h4>
                        <div className="h-px bg-slate-100 flex-1" />
                    </div>

                    <div className="grid gap-6 md:gap-10">
                        {plan.phases?.map((phase: any, i: number) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="group flex gap-4 md:gap-8"
                            >
                                <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center text-xs md:text-sm font-black text-slate-300 group-hover:border-primary group-hover:text-primary transition-all shadow-sm">
                                        0{i + 1}
                                    </div>
                                    <div className="w-0.5 flex-1 bg-slate-100 mt-4 group-last:hidden" />
                                </div>
                                <div className="flex-1 pb-12 md:pb-20 space-y-4 pt-2">
                                    <h5 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight group-hover:text-primary transition-colors">{phase.title}</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {phase.objective.map((obj: string) => (
                                            <div key={obj} className="flex items-start gap-3 text-xs md:text-sm font-medium text-slate-500 bg-white p-3 md:p-4 rounded-2xl border border-slate-50 shadow-sm transition-all hover:bg-white hover:border-purple-100">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                {obj}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
                
                {/* Approval Area */}
                <section className="py-24 border-t border-purple-50 text-center space-y-8">
                     <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-[2rem] bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <Check className="h-10 w-10 text-emerald-500" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Strategy Finalized?</h3>
                        <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm md:text-base px-6">Review the architecture. Once confirmed, we move to integration setup.</p>
                     </div>
                     <Button 
                        size="lg" 
                        onClick={handleApprove} 
                        disabled={isApproving}
                        className="h-14 md:h-16 px-10 md:px-16 rounded-[1.5rem] md:rounded-[2rem] bg-primary hover:bg-primary/90 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                    >
                         {isApproving ? <Loader2 className="mr-3 h-4 w-4 animate-spin" /> : <Sparkles className="mr-3 h-4 w-4" />}
                         Execute Construction
                     </Button>
                </section>
            </div>
        </div>
        
        {/* Progress Indicator */}
        <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-6 items-center">
            <span className="text-[9px] font-black uppercase text-slate-300 vertical-text tracking-widest">Document Integrity</span>
            <div className="h-48 w-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div className="w-full bg-primary rounded-full transition-all duration-300" style={{ height: `${scrollProgress}%` }} />
            </div>
        </div>
    </div>
  );
}

function PlanSection({ icon: Icon, title, color, items }: { icon: any, title: string, color: string, items: string[] }) {
    return (
        <div className="space-y-6">
            <div className={cn("flex items-center gap-3 px-1", color)}>
                <Icon className="h-5 w-5" />
                <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em]">{title}</h4>
            </div>
            <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-purple-50 shadow-sm space-y-4">
                {items?.map((item: string) => (
                   <div key={item} className="flex items-start gap-4 animate-in fade-in slide-in-from-left-4 duration-1000">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2 shrink-0 group-hover:bg-primary" />
                      <p className="text-sm md:text-base font-medium text-slate-600 leading-relaxed">{item}</p>
                   </div>
                ))}
            </div>
        </div>
    );
}
