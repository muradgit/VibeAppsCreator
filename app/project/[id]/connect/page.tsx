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

export default function ProjectConnectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [project, setProject] = useState<any>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [isSavingKey, setIsSavingKey] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) setProject(await res.json());
    };
    fetchProject();
    
    const savedKey = localStorage.getItem("GEMINI_API_KEY");
    if (savedKey) setGeminiKey(savedKey);
  }, [id]);

  const saveGeminiKey = () => {
    setIsSavingKey(true);
    localStorage.setItem("GEMINI_API_KEY", geminiKey);
    setTimeout(() => {
        setIsSavingKey(false);
        toast.success("Gemini API key saved to local storage");
    }, 500);
  };

  const isGithubDone = !!project?.github_repo;
  const isVercelDone = !!project?.vercel_project_id;
  const isGeminiDone = geminiKey.length > 20;

  const canStartBuilding = isGithubDone && isVercelDone && isGeminiDone;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <div className="max-w-4xl mx-auto space-y-12">
            <header className="space-y-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <Network className="h-3 w-3" /> System Integration
                </div>
                <h1 className="text-4xl font-black text-white tracking-tight">Connect External Logic</h1>
                <p className="text-slate-400 text-sm max-w-xl mx-auto">
                    ABBA requires access to these services to automate your build. Tokens are encrypted server-side (GitHub/Vercel) or stored locally (Gemini).
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <GithubConnect projectId={id} />
                </div>
                <div className="md:col-span-1">
                    <VercelConnect projectId={id} />
                </div>
                <Card className="border-white/5 bg-slate-900/50">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                             <Key className="h-5 w-5" /> Gemini API Core
                             {isGeminiDone && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Required for AI logic generation and automated code reviews.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">API Key</Label>
                            <Input 
                                type="password" 
                                value={geminiKey} 
                                onChange={(e) => setGeminiKey(e.target.value)} 
                                placeholder="AIzaSy..." 
                                className="bg-slate-950 border-white/10 text-white"
                            />
                        </div>
                        <Button 
                            variant="secondary" 
                            className="w-full h-9 font-bold" 
                            onClick={saveGeminiKey}
                            disabled={isSavingKey}
                        >
                            {isSavingKey ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Locally"}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-col items-center gap-6 pt-12 border-t border-white/5">
                <Button 
                    size="lg"
                    disabled={!canStartBuilding}
                    onClick={() => router.push(`/project/${id}/tasks`)}
                    className={cn(
                        "h-14 px-12 rounded-2xl font-black text-lg transition-all",
                        canStartBuilding 
                            ? "bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-500/40 hover:scale-105" 
                            : "bg-slate-800 text-slate-500 cursor-not-allowed grayscale"
                    )}
                >
                    <Rocket className="mr-3 h-6 w-6" /> Start Automation Loop
                </Button>
                
                <div className="flex gap-8 text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isGithubDone ? "bg-emerald-500" : "bg-slate-700")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">GitHub</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isVercelDone ? "bg-emerald-500" : "bg-slate-700")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Vercel</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isGeminiDone ? "bg-emerald-500" : "bg-slate-700")} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Gemini</span>
                    </div>
                </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">End-to-End Encryption</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                        ABBA uses AES-256-GCM encryption for transmission. Your Gemini API key never leaves your browser's local storage and is only used to fulfill AI requests initiated by your active session.
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
