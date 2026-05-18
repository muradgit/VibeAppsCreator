"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FlaskConical, ListChecks, Network, GitBranch, LayoutPanelLeft, Settings, ArrowLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/types";

const navItems = [
    { href: "analysis", icon: FlaskConical, label: "AI Analysis", step: "01" },
    { href: "plan", icon: ListChecks, label: "Plan Gen", step: "02" },
    { href: "connect", icon: Network, label: "Integrations", step: "03" },
    { href: "tasks", icon: GitBranch, label: "Automation", step: "04" },
];

import { useProjectStore } from "@/store/project.store";

export function Sidebar() {
    const params = useParams();
    const pathname = usePathname();
    const { isSidebarOpen, setSidebarOpen } = useProjectStore();
    const [tasks, setTasks] = useState<Task[]>([]);
    const projectId = params.id as string;

    useEffect(() => {
        if (!projectId) return;
        const fetchProgress = async () => {
            const res = await fetch(`/api/projects/${projectId}/tasks`);
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        };
        fetchProgress();
    }, [projectId]);

    const handleLinkClick = () => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    };

    if (!projectId) return null;

    const completedCount = tasks.filter(t => t.status === 'done').length;
    const totalCount = tasks.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const sidebarContent = (
        <aside className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-purple-100 flex flex-col justify-between py-8 transition-all duration-300 md:static md:translate-x-0 md:h-[calc(100vh-60px)] no-scrollbar overflow-y-auto",
            isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        )}>
            <div className="space-y-6">
                <div className="px-8 flex flex-col gap-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Core Workflow</span>
                    <h3 className="text-sm font-black text-slate-800 tracking-tight">Logical Sequence</h3>
                </div>
                
                <div className="space-y-1">
                    {navItems.map(item => {
                        const href = `/project/${projectId}/${item.href}`;
                        const isActive = pathname.startsWith(href);
                        return (
                            <Link href={href} key={item.label} onClick={handleLinkClick} className="block px-4">
                                <div className={cn(
                                    "flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all group overflow-hidden relative",
                                    isActive 
                                        ? "text-primary bg-purple-50 shadow-sm" 
                                        : "text-slate-500 hover:text-primary hover:bg-slate-50"
                                )}>
                                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
                                    <span className={cn("text-[9px] font-mono font-black", isActive ? "text-primary" : "text-slate-300 group-hover:text-primary/50")}>{item.step}</span>
                                    <item.icon className={cn("h-4.5 w-4.5", isActive ? "text-primary" : "text-slate-400 group-hover:text-primary transition-colors")} />
                                    <span className={cn("text-xs tracking-tight uppercase", isActive ? "font-black" : "font-bold")}>{item.label}</span>
                                    {isActive && <ChevronRight className="ml-auto h-4 w-4 animate-in slide-in-from-left-2 duration-300" />}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </div>

            <div className="px-8 space-y-8">
                <div className="p-6 rounded-[2rem] bg-slate-50 border border-purple-50 shadow-inner space-y-5">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Build Status</span>
                            <span className="text-[11px] font-black text-slate-900 uppercase">Synchronized</span>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <div className="flex items-end justify-between">
                            <span className="text-2xl font-black text-slate-900 tracking-tighter">{progressPercent}%</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase">Nodes: {completedCount}/{totalCount}</span>
                        </div>
                        <div className="w-full h-2.5 bg-white rounded-full p-0.5 border border-slate-100 shadow-inner overflow-hidden">
                            <div 
                                className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(168,85,247,0.3)]" 
                                style={{ width: `${progressPercent}%` }} 
                            />
                        </div>
                    </div>
                </div>

                <Link href="/dashboard" className="flex items-center gap-2.5 px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-primary transition-colors group" onClick={handleLinkClick}>
                    <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Projects</span>
                </Link>
            </div>
        </aside>
    );

    return (
        <>
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {sidebarContent}
        </>
    )
}
