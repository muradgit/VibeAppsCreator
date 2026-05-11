"use client";

import { z } from "zod";
import { GeminiPlanSchema } from "@/lib/gemini/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Cpu, Palette, Code, Milestone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Plan = z.infer<typeof GeminiPlanSchema>;

export function PlanView({ plan, projectId }: { plan: Plan; projectId: string }) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);

  const handleApprovePlan = async () => {
    setIsApproving(true);
    try {
        const response = await fetch(`/api/projects/${projectId}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan }),
        });

        if (!response.ok) throw new Error("Failed to approve plan.");
        toast.success("Build roadmap initialized!");
        router.push(`/project/${projectId}/connect`);
    } catch (error: any) {
        toast.error(error.message);
        setIsApproving(false);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">{plan.projectName}</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">{plan.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="flex items-center text-white text-sm"><Cpu className="mr-2 h-4 w-4 text-blue-500" /> Technology Foundation</CardTitle></CardHeader>
          <CardContent>
            <ul className="space-y-4 text-sm">
              {plan.techStack.map(item => (
                <li key={item.name} className="space-y-1">
                    <p className="font-bold text-slate-200">{item.name}</p>
                    <p className="text-slate-500 text-xs">{item.rationale}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="flex items-center text-white text-sm"><Palette className="mr-2 h-4 w-4 text-pink-500" /> Visual Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
             <div className="p-3 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Color Palette</p>
                <p className="text-slate-200">{plan.designGuide.colors}</p>
             </div>
             <div className="p-3 bg-slate-800 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Typography</p>
                <p className="text-slate-200">{plan.designGuide.typography}</p>
             </div>
          </CardContent>
        </Card>

         <Card className="bg-slate-900 border-slate-800">
          <CardHeader><CardTitle className="flex items-center text-white text-sm"><Code className="mr-2 h-4 w-4 text-emerald-500" /> Engineering Protocol</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
             <p className="text-slate-400 italic">&quot;{plan.developerGuide.patterns}&quot;</p>
             <p className="text-slate-500 text-xs">Architecture: {plan.developerGuide.folderStructure}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white flex items-center"><Milestone className="mr-2 h-6 w-6 text-blue-500" /> Implementation Roadmap</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.phases.map((phase, idx) => (
                <div key={idx} className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-px before:bg-slate-800 last:before:hidden">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {idx + 1}
                    </div>
                    <div className="space-y-4 pb-8">
                        <h3 className="font-bold text-slate-300">{phase.name}</h3>
                        <div className="space-y-2">
                             {phase.tasks.map(task => (
                                <div key={task.id} className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg group">
                                    <p className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">{task.title}</p>
                                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{task.description}</p>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
      
      <div className="sticky bottom-8 flex justify-center">
        <Button size="lg" onClick={handleApprovePlan} disabled={isApproving} className="bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 px-12 h-14 text-lg">
            {isApproving ? <Loader2 className="mr-2 animate-spin" /> : <Check className="mr-2 h-5 w-5" />}
            {isApproving ? "Initializing Source Control..." : "Lock In Plan & Start Building"}
        </Button>
      </div>
    </div>
  );
}
