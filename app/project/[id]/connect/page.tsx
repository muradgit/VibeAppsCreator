"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Github, Globe, Key, Check, Loader2, Sparkles, Database, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ConnectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [isLoading, setIsLoading] = useState(false);

  const [connected, setConnected] = useState({
    github: false,
    vercel: false,
    gemini: false
  });

  const handleConnect = async (type: 'github' | 'vercel' | 'gemini') => {
    setIsLoading(true);
    // Simulate connection for flow
    setTimeout(() => {
        setConnected(prev => ({ ...prev, [type]: true }));
        setIsLoading(false);
        toast.success(`${type.toUpperCase()} link activated`);
    }, 1500);
  };

  const allConnected = Object.values(connected).every(v => v);

  return (
    <div className="flex-1 bg-slate-50 relative overflow-y-auto h-[calc(100vh-60px)] no-smooth-scroll">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-[500px] bg-gradient-to-bl from-primary/5 via-primary/0 to-transparent -z-10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-16">
            <header className="space-y-6 text-center md:text-left">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] animate-in fade-in slide-in-from-top-4 duration-1000">
                    <Sparkles className="h-4 w-4" /> Core Integration
                </div>
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9]">
                    Connect your <br /> Pipeline.
                </h1>
                <p className="text-base md:text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                    Link your development environment and deployment targets. ABBA requires direct access to your infrastructure to execute logic synthesis.
                </p>
            </header>

            <div className="grid gap-6 md:gap-8">
                {/* Integration Cards */}
                <IntegrationCard 
                    title="GitHub Repository" 
                    description="Provide write access to your codebase for automated commits."
                    icon={Github}
                    isConnected={connected.github}
                    onConnect={() => handleConnect('github')}
                    isLoading={isLoading && !connected.github}
                />
                
                <IntegrationCard 
                    title="Vercel Infrastructure" 
                    description="Deploy live previews of generated code for immediate audit."
                    icon={Globe}
                    isConnected={connected.vercel}
                    onConnect={() => handleConnect('vercel')}
                    isLoading={isLoading && !connected.vercel}
                />

                <IntegrationCard 
                    title="Gemini Intelligence Core" 
                    description="Activate the secondary logic engine for massive scale tasks."
                    icon={Key}
                    isConnected={connected.gemini}
                    onConnect={() => handleConnect('gemini')}
                    isLoading={isLoading && !connected.gemini}
                />
            </div>

            <div className="pt-8">
                <Button 
                    size="lg"
                    disabled={!allConnected || isLoading}
                    onClick={() => router.push(`/project/${projectId}/tasks`)}
                    className="w-full h-16 md:h-20 rounded-[2rem] bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-[0.2em] text-xs md:text-sm shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative z-10 flex items-center justify-center">
                        Commence Production Cycle <ArrowRight className="ml-4 w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </span>
                </Button>
                
                {!allConnected && (
                    <p className="text-center mt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                        Awaiting Infrastructure Verification...
                    </p>
                )}
            </div>

            {/* Bottom Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12 border-t border-purple-100">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                        <ShieldCheck className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Zero-Trust Access</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Encrypted keys strictly stored in environment secrets. No database persistence for tokens.
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Database className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900">Logic State Sync</h4>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                            Continuous data synchronization between your local dev and the synthesis engine.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}

function IntegrationCard({ title, description, icon: Icon, isConnected, onConnect, isLoading }: any) {
    return (
        <motion.div 
            whileHover={{ scale: 1.01 }}
            className={cn(
                "p-6 md:p-10 rounded-[2.5rem] border transition-all relative overflow-hidden group",
                isConnected ? "bg-white border-emerald-100 shadow-xl shadow-emerald-500/5 px-10" : "bg-white border-purple-50 hover:border-primary/40 shadow-sm"
            )}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="flex gap-6 items-center">
                    <div className={cn(
                        "w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center shadow-inner transition-all",
                        isConnected ? "bg-emerald-500 text-white rotate-6" : "bg-slate-50 text-slate-400 group-hover:bg-primary/5 group-hover:text-primary group-hover:-rotate-3"
                    )}>
                        <Icon className="h-6 w-6 md:h-10 md:w-10" />
                    </div>
                    <div className="space-y-1.5 md:space-y-3">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
                            {isConnected && <Check className="h-5 w-5 text-emerald-500 animate-in zoom-in" />}
                        </div>
                        <p className="text-[12px] md:text-sm text-slate-500 font-medium max-w-sm leading-relaxed">{description}</p>
                    </div>
                </div>
                
                <Button 
                    onClick={onConnect}
                    variant={isConnected ? "ghost" : "default"}
                    disabled={isLoading || isConnected}
                    className={cn(
                        "h-12 md:h-14 px-8 md:px-10 rounded-2xl md:rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] md:text-xs transition-all",
                        isConnected 
                            ? "text-emerald-500 bg-emerald-50 cursor-default" 
                            : "bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/10"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : isConnected ? (
                        <>Active Connection</>
                    ) : (
                        <>Initialize Link <ExternalLink className="ml-2 h-3.5 w-3.5" /></>
                    )}
                </Button>
            </div>

            {/* Background Accent */}
            <div className={cn(
                "absolute top-0 right-0 w-32 h-32 -translate-y-16 translate-x-16 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity",
                isConnected ? "bg-emerald-400/20" : "bg-primary/10"
            )} />
        </motion.div>
    );
}
