"use client";

import { useParams } from "next/navigation";
import { VercelConnect } from "@/components/connect/VercelConnect";
import { SupabaseConnect } from "@/components/connect/SupabaseConnect";
import { Network, Shield, Fingerprint } from "lucide-react";

export default function ProjectConnectPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-8">
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center">
                        <Network className="h-6 w-6 text-blue-500" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">External Integrations</h1>
                </div>
                <p className="text-slate-400 text-sm max-w-2xl">
                    Configure the cloud services where your application will be deployed and stored. These credentials are encrypted and stored securely.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SupabaseConnect />
                <VercelConnect />
            </div>

            <section className="p-6 rounded-2xl bg-slate-900 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-emerald-500" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Architectural Security</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        We use AES-256-GCM encryption for all third-party tokens. Our automation engine only accesses these tokens during active deployment or database migration tasks.
                    </p>
                </div>
            </section>
            
            <section className="p-6 rounded-2xl bg-slate-900 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Fingerprint className="h-5 w-5 text-blue-500" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white uppercase tracking-widest">Identity Mapping</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                        Your GitHub organization is automatically synchronized with your Vercel team to ensure seamless CI/CD pipeline creation for each project.
                    </p>
                </div>
            </section>
        </div>
    </div>
  );
}
