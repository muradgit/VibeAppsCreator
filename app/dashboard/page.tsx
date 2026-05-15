"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Folder, Clock, CheckCircle2, ChevronRight, LayoutGrid, List, Loader2 } from "lucide-react";
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
    <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-purple-50/30">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-8 bg-primary rounded-full" />
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Dashboard</h1>
                </div>
                <p className="text-slate-500 text-sm font-medium pl-4 border-l border-purple-100 ml-1">
                    Manage your AI-powered builds and monitor system progress.
                </p>
            </div>
            <Link href="/project/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-12 px-8 font-black shadow-xl shadow-purple-500/20 transition-all hover:scale-105 active:scale-95 group">
                    <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" /> New Project
                </Button>
            </Link>
        </header>

        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse bg-white border-purple-50 h-48" />
                ))}
            </div>
        ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-white rounded-3xl border border-dashed border-purple-100 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6">
                    <Folder className="h-8 w-8 text-primary/40" />
                </div>
                <h3 className="text-lg font-black text-slate-900">No projects yet</h3>
                <p className="text-slate-500 mb-6 max-w-xs font-medium">Start your first AI-guided build today and see the logic flow.</p>
                <Link href="/project/new">
                    <Button variant="outline" className="border-purple-100 hover:bg-purple-50 font-bold">Initialize First Project</Button>
                </Link>
            </div>
        ) : (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {projects.map(project => (
                    <Link href={`/project/${project.id}`} key={project.id}>
                        <Card className="group relative overflow-hidden transition-all duration-300 cursor-pointer bg-white border-purple-100/50 shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-1.5 active:scale-[0.98]">
                            {/* Decorative gradient corner */}
                            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary/5 to-transparent -translate-y-8 translate-x-8 rotate-45 group-hover:bg-primary/10 transition-colors" />
                            
                            <CardHeader className="pb-4 relative">
                                <div className="flex items-start justify-between">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                                        <Folder className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                                    </div>
                                    <div className={cn(
                                        "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                        project.status === 'done' 
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                                            : 'bg-purple-50 text-primary border-purple-100'
                                    )}>
                                        {project.status.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="mt-5 space-y-1">
                                    <CardTitle className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight leading-tight">
                                        {project.name}
                                    </CardTitle>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1">
                                        {project.idea_raw || "AI Architectural Suite"}
                                    </p>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6 relative">
                                <div className="space-y-2.5">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Build Progress</span>
                                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2 py-0.5 rounded-lg">
                                            {project.status === 'done' ? '100%' : project.status === 'building' ? '60%' : '20%'}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden p-0.5">
                                        <div 
                                            className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_12px_rgba(168,85,247,0.3)] relative overflow-hidden" 
                                            style={{ width: project.status === 'done' ? '100%' : project.status === 'building' ? '60%' : '20%' }} 
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-shimmer" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-purple-50/50">
                                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-tight group-hover:text-slate-600 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                        Updated {new Date(project.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                                        Open <ChevronRight className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                <Link href="/project/new">
                    <Card className="group border-dashed border-2 border-purple-100 flex flex-col items-center justify-center p-8 bg-transparent hover:bg-purple-50 hover:border-primary/50 transition-all duration-300 cursor-pointer h-full min-h-[240px] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-purple-200 flex items-center justify-center mb-4 group-hover:border-primary group-hover:bg-white group-hover:scale-110 transition-all duration-300 shadow-sm relative z-10">
                            <Plus className="h-7 w-7 text-purple-300 group-hover:text-primary transition-colors" />
                        </div>
                        <p className="text-[11px] font-black text-purple-400 group-hover:text-primary uppercase tracking-[0.2em] transition-colors relative z-10">Initialize Project</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 relative z-10">Start a new AI workflow</p>
                    </Card>
                </Link>
            </section>
        )}
      </div>
    </div>
  );
}
