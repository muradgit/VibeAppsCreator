"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { FlaskConical, ListChecks, Network, GitBranch, LayoutPanelLeft, Settings, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Task } from "@/types";

const navItems = [
    { href: "analysis", icon: FlaskConical, label: "AI Analysis", step: "02" },
    { href: "plan", icon: ListChecks, label: "Plan Gen", step: "03" },
    { href: "connect", icon: Network, label: "Integrations", step: "04" },
    { href: "tasks", icon: GitBranch, label: "Automation", step: "05" },
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

    // Close sidebar on link click (mobile)
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
            "fixed inset-y-0 left-0 z-40 w-64 bg-[#0F172A] border-r border-white/5 flex flex-col justify-between py-6 transition-transform duration-300 md:static md:translate-x-0 md:h-[calc(100vh-60px)]",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            <div className="space-y-1">
                <div className="px-6 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Main Workflow</div>
                
                {navItems.map(item => {
                    const href = `/project/${projectId}/${item.href}`;
                    const isActive = pathname.startsWith(href);
                    return (
                        <Link href={href} key={item.label} onClick={handleLinkClick}>
                            <div className={cn(
                                "flex items-center gap-3 px-6 py-3 md:py-2.5 transition-all group border-r-4",
                                isActive 
                                    ? "text-white bg-blue-600/10 border-blue-500" 
                                    : "text-slate-400 hover:text-white border-transparent"
                            )}>
                                <span className={cn("text-[10px] font-mono", isActive ? "text-blue-400" : "text-slate-600")}>{item.step}</span>
                                <item.icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300")} />
                                <span className={cn("text-sm", isActive ? "font-semibold" : "font-medium")}>{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </div>

            <div className="px-6 space-y-6">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-2 tracking-tighter">Build Progress</div>
                    <div className="flex items-end justify-between mb-1">
                        <span className="text-xl font-bold text-white">{progressPercent}%</span>
                        <span className="text-[10px] text-slate-400">Task {completedCount}/{totalCount}</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5 bg-slate-700" />
                </div>

                <Link href="/dashboard" className="flex items-center gap-2 px-6 py-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white transition-colors" onClick={handleLinkClick}>
                    <ArrowLeft className="h-4 w-4" />
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
                    className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
            {sidebarContent}
        </>
    )
}

