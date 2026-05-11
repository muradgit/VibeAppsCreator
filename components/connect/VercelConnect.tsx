"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CheckCircle2, KeyRound, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface VercelConnectProps {
  projectId: string;
  isConnected: boolean;
  onConnect: () => void;
}

export function VercelConnect({ projectId, isConnected, onConnect }: VercelConnectProps) {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = async () => {
    if (!token) {
      toast.error("Vercel token is required.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vercel_token: token, status: 'building' }),
      });

      if (!response.ok) throw new Error("Connection failed.");
      
      toast.success("Vercel automation active!");
      onConnect();
    } catch (error) {
      toast.error("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg text-blue-400 w-full">
        <CheckCircle2 className="h-5 w-5" />
        <span className="text-sm font-medium">Vercel Deployment Target Synced</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-500 uppercase">Vercel API Key</label>
        <a href="https://vercel.com/account/tokens" target="_blank" className="text-[10px] text-blue-500 hover:underline flex items-center">
            Get token <ExternalLink className="ml-1 h-2 w-2" />
        </a>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input 
                type="password" 
                placeholder="Paste Vercel token..." 
                className="pl-10 bg-black border-slate-700 text-white"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                disabled={isLoading}
            />
        </div>
        <Button onClick={handleConnect} disabled={isLoading} className="bg-white text-black hover:bg-slate-200">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
        </Button>
      </div>
    </div>
  );
}
