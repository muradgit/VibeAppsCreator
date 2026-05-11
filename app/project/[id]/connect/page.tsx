import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { GithubConnect } from "@/components/connect/GithubConnect";
import { VercelConnect } from "@/components/connect/VercelConnect";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Globe } from "lucide-react";

async function getProject(id: string) {
    const supabase = createSupabaseAdminClient();
    const { data } = await supabase.from('projects').select('*').eq('id', id).single();
    return data;
}

export default async function ConnectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) notFound();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
        <div className="space-y-2 text-center mb-10">
            <h1 className="text-3xl font-black text-white">Phase 4: Integrations</h1>
            <p className="text-slate-500">Enable cloud access to allow the AI to commit code and deploy.</p>
        </div>
      
        <div className="space-y-6">
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <CardTitle className="text-white text-base">Source Control</CardTitle>
                            <CardDescription className="text-xs">Required for file generation and persistence.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <GithubConnect isConnected={!!project.github_token_encrypted} />
                </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-800 rounded-lg">
                            <Globe className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                            <CardTitle className="text-white text-base">Cloud Deployment</CardTitle>
                            <CardDescription className="text-xs">Optional: Direct-to-Vercel hosting automation.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <VercelConnect 
                      projectId={params.id}
                      isConnected={!!project.vercel_token_encrypted}
                      onConnect={() => {}} // Client-side handled
                    />
                </CardContent>
            </Card>
        </div>

        <div className="flex items-center justify-between p-4 bg-blue-600/5 border border-blue-600/20 rounded-xl mt-12">
            <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium text-blue-200">Gemini Pro 1.5 Active</span>
            </div>
            <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">Global Secret Found</span>
        </div>
    </div>
  );
}
