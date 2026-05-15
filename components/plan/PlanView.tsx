"use client";

import { useEffect, useState, useRef } from "react";
import { PlanSection } from "./PlanSection";
import { TechStackCard } from "./TechStackCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Palette, Terminal, ShieldCheck, ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function PlanView({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const res = await fetch(`/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data);
      }
    };
    fetchProject();
  }, [projectId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
    if (isAtBottom) setHasScrolledToBottom(true);
  };

  const approvePlan = async () => {
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "building" })
      });
      if (!res.ok) throw new Error("Failed to approve plan");
      toast.success("Plan approved! Moving to build phase.");
      router.push(`/project/${projectId}/connect`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!project || !project.plan) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Compiling Architectural Blueprint...</p>
      </div>
    );
  }

  const { plan } = project;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
      <header className="h-auto min-h-20 px-4 md:px-8 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b bg-white dark:bg-slate-900 shadow-sm z-10 shrink-0">
         <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">{plan.projectName}</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Architectural Build Plan</p>
         </div>
         <Button 
            onClick={approvePlan}
            disabled={!hasScrolledToBottom}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black h-11 px-8 rounded-xl shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:grayscale transition-all"
         >
            Approve Plan <ArrowRight className="ml-2 h-5 w-5" />
         </Button>
      </header>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 md:space-y-12"
      >
        <section className="max-w-4xl mx-auto space-y-6 md:space-y-8">
            <div className="space-y-4">
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                    {plan.description}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <Card className="border-white/5 bg-slate-950 text-white overflow-hidden group">
                    <CardHeader className="bg-indigo-600 p-4">
                        <CardTitle className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                             <Palette className="h-4 w-4" /> Design System
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {plan.designGuide.colors.map((c: string) => (
                                <div key={c} className="w-8 h-8 rounded-full border border-white/20 shadow-inner" style={{ backgroundColor: c }} title={c} />
                            ))}
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase">Typography</p>
                            <p className="text-xs font-medium leading-relaxed opacity-80">{plan.designGuide.typography}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-indigo-400 uppercase">Tone</p>
                            <p className="text-xs font-medium leading-relaxed opacity-80">{plan.designGuide.tone}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/5 bg-slate-950 text-white overflow-hidden group">
                    <CardHeader className="bg-slate-800 p-4">
                        <CardTitle className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <BookOpen className="h-4 w-4" /> Developer Guide
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 space-y-4">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Coding Standards</p>
                            <p className="text-xs font-medium leading-relaxed opacity-80">{plan.developerGuide.conventions}</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Key Patterns</p>
                            <p className="text-xs font-medium leading-relaxed opacity-80">{plan.developerGuide.patterns}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-[10px] md:text-sm font-black text-slate-800 uppercase tracking-[0.3em] shrink-0">Selected Stack</h2>
                    <div className="h-px bg-slate-200 flex-1" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plan.techStack.map((tech: any, i: number) => (
                        <TechStackCard key={i} name={tech.name} rationale={tech.rationale} projectId={projectId} />
                    ))}
                </div>
            </div>

            <div className="space-y-8 md:space-y-12">
                {plan.phases.map((phase: any, i: number) => (
                    <div key={i} className="space-y-4 md:space-y-6">
                         <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-slate-900 flex items-center justify-center text-white font-black font-mono text-sm md:text-base">
                                {i + 1}
                            </div>
                            <h2 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">{phase.name}</h2>
                            <div className="h-px bg-slate-200 flex-1" />
                        </div>
                        <PlanSection title="Task Sequence" items={phase.tasks} type="tasks" projectId={projectId} />
                    </div>
                ))}
            </div>

            <PlanSection title="Constraints & Logic Rules" items={plan.constraints} type="constraints" projectId={projectId} />

            {!hasScrolledToBottom && (
                <div className="fixed bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 md:px-6 py-2 md:py-3 rounded-full border shadow-xl flex items-center gap-2 md:gap-3 animate-bounce z-20">
                    <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-400">Scroll to confirm review</span>
                    <ChevronDown className="h-3 w-3 md:h-4 md:w-4" />
                </div>
            )}
        </section>
      </div>
    </div>
  );
}
