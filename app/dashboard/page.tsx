"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Folder, Clock, CheckCircle2, ChevronRight, LayoutGrid, List, Loader2 } from "lucide-react";
import Link from "next/link";

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
        
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Project Dashboard</h1>
                <p className="text-slate-500 text-sm font-medium">Manage your AI-powered builds and monitor progress.</p>
            </div>
            <Link href="/project/new" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 h-11 px-6 font-black shadow-lg shadow-purple-500/20">
                    <Plus className="mr-2 h-5 w-5" /> New Project
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
                        <Card className="group hover:border-primary/50 transition-all cursor-pointer bg-white border-purple-50 shadow-sm hover:shadow-xl hover:shadow-purple-500/5">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Folder className="h-5 w-5 text-primary" />
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                                        project.status === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-primary'
                                    }`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <CardTitle className="mt-4 text-base font-black text-slate-800 group-hover:text-primary transition-colors line-clamp-1">
                                    {project.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <span>STATUS</span>
                                        <span className="text-primary">{project.status}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-purple-50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-primary transition-all duration-1000 shadow-[0_0_8px_rgba(168,85,247,0.4)]" 
                                            style={{ width: project.status === 'done' ? '100%' : project.status === 'building' ? '60%' : '20%' }} 
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-purple-50">
                                    <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-300" /> {new Date(project.updated_at).toLocaleDateString()}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                <Link href="/project/new">
                    <Card className="border-dashed border-2 border-purple-100 flex flex-col items-center justify-center p-8 bg-transparent hover:bg-purple-50/50 transition-all cursor-pointer opacity-50 hover:opacity-100 h-full min-h-[180px]">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-purple-200 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-purple-300" />
                        </div>
                        <p className="text-sm font-black text-purple-400 uppercase tracking-widest">Create New Project</p>
                    </Card>
                </Link>
            </section>
        )}
      </div>
    </div>
  );
}
