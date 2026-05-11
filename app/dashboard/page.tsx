import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Folder, Clock, CheckCircle2, ChevronRight, LayoutGrid, List } from "lucide-react";
import Link from "next/link";

// Mock data for initial render
const MOCK_PROJECTS = [
    {
        id: "1",
        name: "E-Commerce Multi-Vendor Platform",
        status: "in_progress",
        last_updated: "2 hours ago",
        progress: 42
    },
    {
        id: "2",
        name: "AI Portfolio Generator",
        status: "done",
        last_updated: "3 days ago",
        progress: 100
    }
];

export default function Dashboard() {
  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Project Dashboard</h1>
                <p className="text-slate-500 text-sm">Manage your AI-powered builds and monitor progress.</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 h-11 px-6 font-bold shadow-lg shadow-blue-500/20">
                <Plus className="mr-2 h-5 w-5" /> New Project
            </Button>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_PROJECTS.map(project => (
                <Link href={`/project/${project.id}/analysis`} key={project.id}>
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
                            <CardTitle className="mt-4 text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
                                {project.name}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                    <span>PROGRESS</span>
                                    <span>{project.progress}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-blue-500 transition-all duration-1000" 
                                        style={{ width: `${project.progress}%` }} 
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-center text-[11px] text-slate-400 font-medium">
                                    <Clock className="w-3.5 h-3.5 mr-1" /> {project.last_updated}
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                </Link>
            ))}

            {/* Placeholder for "Add New" */}
            <Card className="border-dashed border-2 flex flex-col items-center justify-center p-8 bg-transparent hover:bg-slate-100/50 transition-all cursor-pointer opacity-50 hover:opacity-100">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-500">Create New Project</p>
            </Card>
        </section>

      </div>
    </div>
  );
}
