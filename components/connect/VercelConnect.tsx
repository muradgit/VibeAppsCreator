"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VercelClient } from "@/lib/vercel/client";
import { toast } from "sonner";
import { ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

export function VercelConnect() {
    const [token, setToken] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = async () => {
        if (!token) {
            toast.error("Please enter a Vercel API token");
            return;
        }

        setIsConnecting(true);
        try {
            const client = new VercelClient(token);
            await client.getProjects(); // Validate token
            setIsConnected(true);
            toast.success("Successfully connected to Vercel!");
            // In a real app, we'd save this encrypted in Supabase
        } catch (error: any) {
            toast.error(error.message || "Failed to connect to Vercel");
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <Card className="border-white/5 bg-slate-900/50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-white flex items-center gap-2">
                             Vercel Deployment
                             {isConnected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Automate deployments and preview environments.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="vercel-token" className="text-slate-300">API Token</Label>
                    <div className="flex gap-2">
                        <Input
                            id="vercel-token"
                            type="password"
                            placeholder="Enter your Vercel token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            className="bg-slate-950 border-white/10 text-white"
                        />
                        <Button 
                            onClick={handleConnect} 
                            disabled={isConnecting || isConnected}
                            className="bg-blue-600 hover:bg-blue-700 font-bold"
                        >
                            {isConnecting ? "Validating..." : isConnected ? "Connected" : "Connect"}
                        </Button>
                    </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3 text-xs text-blue-400 leading-relaxed">
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <p>
                        You can generate a token in your <a href="https://vercel.com/account/tokens" target="_blank" className="font-bold underline">Vercel Account Settings</a>.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
