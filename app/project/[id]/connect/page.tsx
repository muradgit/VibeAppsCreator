"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { GithubConnect } from "@/components/connect/GithubConnect";
import { VercelConnect } from "@/components/connect/VercelConnect";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Network, Shield, Key, CheckCircle2, Rocket, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProjectConnectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [project, setProject] = useState<any>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);

  const fetchProject = useCallback(async () => {
    const res = await fetch(`/api/projects/${id}`);
    if (res.ok) setProject(await res.json());
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [id, fetchProject]);

  const saveGeminiKey = async () => {
    setIsSavingKey(true);
    try {
      const res = await fetch("/api/gemini/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey: geminiKey, projectId: id })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to save Gemini key");
      }

      toast.success("Gemini API key verified and saved securely");
      
      // Refresh project to get updated isGeminiDone status
      const pRes = await fetch(`/api/projects/${id}`);
      if (pRes.ok) setProject(await pRes.json());
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSavingKey(false);
    }
  };

  const isGithubDone = !!project?.github_repo || !!project?.github_token_encrypted;
  const isVercelDone = !!project?.vercel_project_id || !!project?.vercel_token_encrypted;
  const isGeminiDone = !!project?.gemini_token_encrypted || !!project?.tech_stack?.gemini_token_backup;

  const canStartBuilding = isGithubDone && isVercelDone && isGeminiDone;

  return (
    <div className="flex-1 overflow-y-auto bg-white p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                    <Network className="h-3 w-3" /> System Integration
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Connect External Logic</h1>
                <p className="text-slate-500 text-sm max-w-xl mx-auto font-medium">
                    ABBA requires access to these services to automate your build. Tokens are encrypted server-side (GitHub/Vercel) or stored locally (Gemini).
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <GithubConnect 
                        projectId={id} 
                        initialIsConnected={!!project?.github_token_encrypted}
                        initialRepoName={project?.github_repo}
                        onConnect={fetchProject}
                    />
                </div>
                <div className="md:col-span-1">
                    <VercelConnect 
                        projectId={id} 
                        initialIsConnected={!!project?.vercel_token_encrypted}
                        initialProjectId={project?.vercel_project_id}
                        onConnect={fetchProject}
                    />
                </div>
                <Card className="border-purple-100 bg-white shadow-lg shadow-purple-500/5">
                    <CardHeader>
                        <CardTitle className="text-slate-900 flex items-center gap-2">
                             <Key className="h-5 w-5" /> Gemini API Core
                             {isGeminiDone && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                            Required for AI logic generation and automated code reviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-700">API Key</Label>
                            <Input 
                                type="password" 
                                value={geminiKey} 
                                onChange={(e) => setGeminiKey(e.target.value)} 
                                placeholder="AIzaSy..." 
                                className="bg-purple-50/30 border-purple-100 text-slate-900"
                            />
                        </div>
                        <Button 
                            variant="secondary" 
                            className="w-full h-9 font-bold bg-slate-100 hover:bg-slate-200" 
                            onClick={saveGeminiKey}
                            disabled={isSavingKey}
                        >
                            {isSavingKey ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {isGeminiDone ? "Update & Verify" : "Verify & Save"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col items-center gap-6 pt-12 border-t border-purple-50">
                <Button 
                    size="lg"
                    disabled={!canStartBuilding}
                    onClick={() => router.push(`/project/${id}/tasks`)}
                    className={cn(
                        "h-14 px-12 rounded-2xl font-black text-lg transition-all",
                        canStartBuilding 
                            ? "bg-primary hover:bg-primary/90 shadow-2xl shadow-purple-500/40 hover:scale-105" 
                            : "bg-slate-100 text-slate-400 cursor-not-allowed grayscale"
                    )}
                >
                    <Rocket className="mr-3 h-6 w-6 text-white" /> Start Automation Loop
                </Button>
                
                <div className="flex gap-8 text-slate-500 overflow-x-auto w-full justify-center no-scrollbar">
                    <div className="flex items-center gap-2 shrink-0">
                        <div className={cn("w-2 h-2 rounded-full", isGithubDone ? "bg-emerald-500" : "bg-slate-200")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">GitHub</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className={cn("w-2 h-2 rounded-full", isVercelDone ? "bg-emerald-500" : "bg-slate-200")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Vercel</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className={cn("w-2 h-2 rounded-full", isGeminiDone ? "bg-emerald-500" : "bg-slate-200")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest leading-none">Gemini</span>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest">End-to-End Encryption</h4>
                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                        ABBA uses AES-256-GCM encryption for transmission and storage. Your Gemini API key is encrypted server-side and is only used to fulfill AI requests initiated by your active session.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
