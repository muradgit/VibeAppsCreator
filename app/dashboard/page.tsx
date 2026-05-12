"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Folder, Clock, CheckCircle2, ChevronRight, LayoutGrid, List, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

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
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Dashboard</h1>
                <p className="text-slate-500 text-sm">Manage your AI-powered builds and monitor progress.</p>
            </div>
            <Link href="/project/new">
                <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-6 font-bold shadow-lg shadow-blue-500/20">
                    <Plus className="mr-2 h-5 w-5" /> New Project
                </Button>
            </Link>
        </header>

        {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 h-48" />
                ))}
            </div>
        ) : projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border border-dashed border-slate-200">
                <Folder className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">No projects yet</h3>
                <p className="text-slate-500 mb-6">Start your first AI-guided build today.</p>
                <Link href="/project/new">
                    <Button variant="outline">Initialize First Project</Button>
                </Link>
            </div>
        ) : (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <Link href={`/project/${project.id}`} key={project.id}>
                        <Card className="group hover:border-blue-500/50 transition-all cursor-pointer bg-white dark:bg-slate-900 border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl">
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                                        <Folder className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                                        project.status === 'done' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                                    }`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <CardTitle className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors line-clamp-1">
                                    {project.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                        <span>STATUS</span>
                                        <span className="uppercase">{project.status}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 transition-all duration-1000" 
                                            style={{ width: project.status === 'done' ? '100%' : project.status === 'building' ? '60%' : '20%' }} 
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                                    <div className="flex items-center text-[11px] text-slate-400 font-medium">
                                        <Clock className="w-3.5 h-3.5 mr-1" /> {formatDistanceToNow(new Date(project.updated_at))} ago
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                <Link href="/project/new">
                    <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 bg-transparent hover:bg-slate-100/50 transition-all cursor-pointer opacity-50 hover:opacity-100 h-full">
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                            <Plus className="h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm font-bold text-slate-500">Create New Project</p>
                    </Card>
                </Link>
            </section>
        )}
      </div>
    </div>
  );
}
