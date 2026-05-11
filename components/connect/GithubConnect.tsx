"use client";

import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Github, Loader2 } from "lucide-react";

export function GithubConnect({ isConnected }: { isConnected: boolean }) {
  const { data: session, status } = useSession();

  if (isConnected || session) {
    return (
      <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-emerald-400 w-full">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-medium">GitHub Repository Access Granted</span>
      </div>
    );
  }

  return (
    <Button 
        onClick={() => signIn('github')} 
        className="w-full bg-slate-950 border border-slate-700 hover:bg-slate-900 h-14"
        disabled={status === 'loading'}
    >
        {status === 'loading' ? <Loader2 className="animate-spin mr-2" /> : <Github className="mr-2 h-5 w-5" />}
        {status === 'loading' ? "Authorizing..." : "Link GitHub Account"}
    </Button>
  );
}
