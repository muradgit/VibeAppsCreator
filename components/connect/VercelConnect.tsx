"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ExternalLink, CheckCircle2, Loader2, Search, Triangle } from "lucide-react";

export function VercelConnect({ 
    projectId,
    initialIsConnected = false,
    initialProjectId = ""
}: { 
    projectId: string;
    initialIsConnected?: boolean;
    initialProjectId?: string;
}) {
    const [token, setToken] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(initialIsConnected);
    const [projects, setProjects] = useState<any[]>([]);
    const [selectedProject, setSelectedProject] = useState(initialProjectId);
    const [isLoadingProjects, setIsLoadingProjects] = useState(false);

    useEffect(() => {
        setIsConnected(initialIsConnected);
    }, [initialIsConnected]);

    useEffect(() => {
        setSelectedProject(initialProjectId);
    }, [initialProjectId]);

    const fetchVercelProjects = useCallback(async () => {
        setIsLoadingProjects(true);
        try {
            const res = await fetch(`/api/vercel/projects?projectId=${projectId}`);
            if (!res.ok) throw new Error("Failed to fetch Vercel projects");
            const data = await res.json();
            setProjects(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoadingProjects(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (isConnected) {
            fetchVercelProjects();
        }
    }, [isConnected, fetchVercelProjects]);

    const handleConnect = async () => {
        if (!token) {
            toast.error("Please enter a Vercel API token");
            return;
        }

        setIsConnecting(true);
        try {
            const trimmedToken = token.trim();
            const res = await fetch("/api/vercel/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: trimmedToken, projectId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to validate Vercel token");
            setIsConnected(true);
            toast.success("Successfully connected to Vercel!");
            fetchVercelProjects();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const handleProjectSelect = async (vercelId: string) => {
        try {
            setSelectedProject(vercelId);
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vercel_project_id: vercelId })
            });
            if (!res.ok) throw new Error("Failed to link Vercel project");
            toast.success("Vercel project linked successfully!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Card className="border-purple-100 bg-white shadow-lg shadow-purple-500/5">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-slate-900 flex items-center gap-2">
                             <Triangle className="h-5 w-5 fill-slate-900" /> Vercel Deployment
                             {isConnected && selectedProject && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                             Automate deployments and preview environments.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {!isConnected ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-700">API Token</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="password"
                                    placeholder="Enter your Vercel token"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="bg-purple-50/30 border-purple-100 text-slate-900"
                                />
                                <Button 
                                    onClick={handleConnect} 
                                    disabled={isConnecting}
                                    className="bg-primary hover:bg-primary/90 font-bold"
                                >
                                    {isConnecting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Connect"}
                                </Button>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10 flex gap-3 text-[10px] text-primary leading-relaxed font-bold uppercase tracking-widest">
                            <ExternalLink className="h-4 w-4 shrink-0" />
                            <p>
                                Generate a token in your <a href="https://vercel.com/account/tokens" target="_blank" className="underline hover:text-primary/80 transition-colors">Vercel Settings</a>.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-700">Target Project</Label>
                            {isLoadingProjects ? (
                                <div className="h-10 bg-purple-50/30 border border-purple-100 rounded-md flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        value={selectedProject}
                                        onChange={(e) => handleProjectSelect(e.target.value)}
                                        className="w-full bg-purple-50/30 border border-purple-100 rounded-md p-2 text-sm text-slate-900 outline-none focus:ring-1 focus:ring-primary appearance-none pr-10 font-medium"
                                    >
                                        <option value="">Select a Vercel project</option>
                                        {projects.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                </div>
                            )}
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-8 text-[10px] font-black uppercase tracking-tighter border-purple-100 text-slate-600 hover:bg-purple-50"
                            onClick={fetchVercelProjects}
                        >
                            Refresh Project List
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
