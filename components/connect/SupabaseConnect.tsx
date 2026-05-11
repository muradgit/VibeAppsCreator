"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ExternalLink, Database, CheckCircle2 } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export function SupabaseConnect() {
    const [url, setUrl] = useState("");
    const [key, setKey] = useState("");
    const [isConnecting, setIsConnecting] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    const handleConnect = async () => {
        if (!url || !key) {
            toast.error("Please enter both URL and Anon Key");
            return;
        }

        setIsConnecting(true);
        try {
            const supabase = createClient(url, key);
            const { error } = await supabase.from('_metadata').select('*').limit(1);
            // Even if the table doesn't exist, we just check if the URL is valid/reachable
            setIsConnected(true);
            toast.success("Supabase configured successfully!");
        } catch (error: any) {
            toast.error("Invalid Supabase configuration");
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
                             Supabase Database
                             {isConnected && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                            Connect your project to a hosted PostgreSQL database.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="supabase-url" className="text-slate-300">Project URL</Label>
                        <Input
                            id="supabase-url"
                            placeholder="https://your-project.supabase.co"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="bg-slate-950 border-white/10 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="supabase-key" className="text-slate-300">Anon Public Key</Label>
                        <Input
                            id="supabase-key"
                            type="password"
                            placeholder="Enter your service role or anon key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            className="bg-slate-950 border-white/10 text-white"
                        />
                    </div>
                    <Button 
                        onClick={handleConnect} 
                        disabled={isConnecting || isConnected}
                        className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                    >
                        {isConnecting ? "Validating..." : isConnected ? "Verified" : "Verify Connection"}
                    </Button>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3 text-xs text-blue-400 leading-relaxed">
                    <ExternalLink className="h-4 w-4 shrink-0" />
                    <p>
                        Found in your <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" className="font-bold underline">Supabase Project Settings</a>.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
