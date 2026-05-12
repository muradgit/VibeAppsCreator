"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ExternalLink, CheckCircle2, Github, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function GithubConnect({ projectId }: { projectId: string }) {
    const [token, setToken] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [repos, setRepos] = useState<any[]>([]);
    const [selectedRepo, setSelectedRepo] = useState("");
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);

    const handleConnect = async () => {
        if (!token) {
            toast.error("Please enter a GitHub Personal Access Token");
            return;
        }

        setIsConnecting(true);
        try {
            const res = await fetch("/api/github/connect", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, projectId })
            });

            if (!res.ok) throw new Error("Failed to validate GitHub token");
            setIsConnected(true);
            toast.success("Successfully connected to GitHub!");
            fetchRepos();
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsConnecting(false);
        }
    };

    const fetchRepos = async () => {
        setIsLoadingRepos(true);
        try {
            const res = await fetch(`/api/github/repos?projectId=${projectId}`);
            if (!res.ok) throw new Error("Failed to fetch repositories");
            const data = await res.json();
            setRepos(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoadingRepos(false);
        }
    };

    const handleRepoSelect = async (repoName: string) => {
        try {
            setSelectedRepo(repoName);
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ github_repo: repoName })
            });
            if (!res.ok) throw new Error("Failed to link repository");
            toast.success("Repository linked successfully!");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Card className="border-white/5 bg-slate-900/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                             <Github className="h-5 w-5" /> GitHub Repository
                             {isConnected && selectedRepo && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Connect your GitHub account to enable automated code commits and deployments.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {!isConnected ? (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="github-token" className="text-slate-300">Personal Access Token (classic)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="github-token"
                                    type="password"
                                    placeholder="ghp_xxxxxxxxxxxx"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                    className="bg-slate-950 border-white/10 text-white"
                                />
                                <Button 
                                    onClick={handleConnect} 
                                    disabled={isConnecting}
                                    className="bg-blue-600 hover:bg-blue-700 font-bold"
                                >
                                    {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Connect"}
                                </Button>
                            </div>
                        </div>
                        <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3 text-[10px] text-blue-400 leading-relaxed uppercase font-bold tracking-widest">
                            <ExternalLink className="h-4 w-4 shrink-0" />
                            <p>
                                Generate a token with <code className="text-blue-300">repo</code> scopes in <a href="https://github.com/settings/tokens" target="_blank" className="underline">Settings</a>.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Target Repository</Label>
                            {isLoadingRepos ? (
                                <div className="h-10 bg-slate-950 border border-white/10 rounded-md flex items-center justify-center">
                                    <Loader2 className="h-4 w-4 animate-spin text-slate-500" />
                                </div>
                            ) : (
                                <div className="relative">
                                    <select
                                        value={selectedRepo}
                                        onChange={(e) => handleRepoSelect(e.target.value)}
                                        className="w-full bg-slate-950 border border-white/10 rounded-md p-2 text-sm text-white outline-none focus:ring-1 focus:ring-blue-500 appearance-none pr-10"
                                    >
                                        <option value="">Select a repository</option>
                                        {repos.map((repo) => (
                                            <option key={repo.id} value={repo.full_name}>
                                                {repo.full_name} {repo.private ? '(Private)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                                </div>
                            )}
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full h-8 text-[10px] font-black uppercase tracking-tighter"
                            onClick={fetchRepos}
                        >
                            Refresh Repositories
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
