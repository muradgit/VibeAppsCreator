"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Folder, Clock, CheckCircle2, ChevronRight, LayoutGrid, List, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto bg-slate-50/50">
      <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
        
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
            <div className="space-y-3">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-left-4 duration-700">
                    <Sparkles className="h-3 w-3" /> Mission Control
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">Active Builds</h1>
                </div>
                <p className="text-slate-500 text-sm md:text-base font-medium pl-5 border-l border-purple-100 ml-0.5 max-w-xl">
                    Manage your intelligence-driven applications and monitor the logic evolution in real-time.
                </p>
            </div>
            <Link href="/project/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-12 md:h-14 px-8 md:px-10 font-black shadow-2xl shadow-purple-500/25 transition-all hover:scale-105 active:scale-95 group rounded-2xl overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-500" /> New Architecture
                </Button>
            </Link>
        </header>

        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse bg-white border-purple-50 h-56 rounded-3xl" />
                ))}
            </div>
        ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 md:p-32 bg-white rounded-[2.5rem] border-2 border-dashed border-purple-100/50 text-center shadow-sm space-y-8">
                <div className="w-24 h-24 rounded-[2rem] bg-purple-50 flex items-center justify-center shadow-inner relative">
                    <Folder className="h-10 w-10 text-primary/30" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg border border-purple-50 flex items-center justify-center animate-bounce">
                        <Plus className="h-5 w-5 text-primary" />
                    </div>
                </div>
                <div className="space-y-3">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">System Idle</h3>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">
                        No active logic streams detected. Initialize your first project to awaken the AI synthesis core.
                    </p>
                </div>
                <Link href="/project/new">
                    <Button variant="outline" className="h-12 px-8 rounded-xl border-purple-100 hover:bg-purple-50 text-primary font-black uppercase tracking-widest text-[10px]">
                        Initialize Primary Sequence
                    </Button>
                </Link>
            </div>
        ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {projects.map(project => (
                    <Link href={`/project/${project.id}`} key={project.id}>
                        <Card className="group relative overflow-hidden transition-all duration-500 cursor-pointer bg-white border-purple-100/50 shadow-sm hover:shadow-3xl hover:shadow-purple-500/10 hover:-translate-y-2 active:scale-[0.98] rounded-[2rem]">
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent -translate-y-12 translate-x-12 rotate-45 group-hover:bg-primary/20 transition-all duration-500" />
                            <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            <CardHeader className="pb-4 relative pt-8 px-8">
                                <div className="flex items-start justify-between">
                                    <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner group-hover:shadow-xl group-hover:shadow-purple-500/20">
                                        <Folder className="h-7 w-7 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <div className={cn(
                                        "px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm transition-all duration-500",
                                        project.status === 'done' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white' 
                                            : 'bg-purple-50 text-primary border-purple-100 group-hover:bg-primary group-hover:text-white'
                                    )}>
                                        {project.status.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="mt-8 space-y-2">
                                    <CardTitle className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-tight">
                                        {project.name}
                                    </CardTitle>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1 group-hover:text-slate-500 transition-colors">
                                        {project.idea_raw || "AI Architectural Suite"}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-8 relative pb-8 px-8">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synthesis Index</span>
                                        <span className="text-[11px] font-black text-primary bg-primary/5 px-2.5 py-1 rounded-xl">
                                            {project.status === 'done' ? '100' : project.status === 'building' ? '64' : '18'}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2.5 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-1500 shadow-[0_0_15px_rgba(168,85,247,0.4)] relative overflow-hidden" 
                                            style={{ width: project.status === 'done' ? '100%' : project.status === 'building' ? '64%' : '18%' }} 
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/40 to-white/0 animate-shimmer" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-purple-50/70">
                                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-700 transition-colors">
                                        <Clock className="w-3.5 h-3.5 mr-2 opacity-50" />
                                        {new Date(project.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                        Enter Hub <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                <Link href="/project/new">
                    <Card className="group border-2 border-dashed border-purple-100/50 flex flex-col items-center justify-center p-12 bg-transparent hover:bg-white hover:border-primary/40 transition-all duration-500 cursor-pointer h-full min-h-[300px] relative overflow-hidden rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-purple-500/5">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="w-20 h-20 rounded-[2rem] border-2 border-dashed border-purple-200 flex items-center justify-center mb-6 group-hover:border-primary group-hover:bg-purple-50/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm relative z-10">
                            <Plus className="h-10 w-10 text-purple-200 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="text-center space-y-2 relative z-10">
                            <p className="text-[12px] font-black text-purple-300 group-hover:text-primary uppercase tracking-[0.3em] transition-colors">Awaken Core</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">Deploy New Workspace</p>
                        </div>
                    </Card>
                </Link>
            </section>
        )}
      </div>
    </div>
  );
}
