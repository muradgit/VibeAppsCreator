"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, MessageSquare, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectAnalysisPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="flex-1 overflow-hidden flex bg-white">
        {/* Chat / Refinement Area */}
        <div className="flex-1 flex flex-col border-r">
            <header className="h-16 px-6 flex items-center justify-between border-b bg-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <BrainCircuit className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">AI Requirements Analysis</h2>
                </div>
            </header>

            <div className="flex-1 p-6 overflow-y-auto space-y-6">
                <div className="flex gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 space-y-3">
                        <div className="p-4 rounded-2xl bg-slate-50 border text-sm text-slate-700 leading-relaxed max-w-2xl">
                            Hello! I've analyzed your initial idea. To build a robust plan, I need a bit more detail about the vendor commission structure. How should that be handled?
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Intelligent Assistant • 10:42 AM</span>
                    </div>
                </div>

                <div className="flex gap-4 flex-row-reverse">
                    <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                        MK
                    </div>
                    <div className="flex-1 flex flex-col items-end space-y-3">
                        <div className="p-4 rounded-2xl bg-indigo-600 text-white text-sm leading-relaxed max-w-2xl shadow-lg shadow-indigo-500/20">
                            Let's go with a flat 10% fee for now, with a minimum of $0.50 per transaction. Standard Stripe Connect usage.
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">You • 10:44 AM</span>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t bg-slate-50">
                <div className="relative group">
                    <textarea 
                        placeholder="Refine your requirements..."
                        className="w-full min-h-[100px] p-4 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all pr-12 text-sm"
                    />
                    <Button size="icon" className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 h-9 w-9 rounded-lg shadow-lg shadow-indigo-500/20">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>

        {/* Status / Findings Panel */}
        <div className="w-[380px] bg-slate-50 flex flex-col">
            <header className="h-16 px-6 flex items-center border-b bg-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Extracted Entities</h3>
            </header>
            <div className="p-6 space-y-6 overflow-y-auto">
                <Card className="border-none shadow-sm ring-1 ring-slate-200">
                    <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-indigo-500" /> Core Tech Stack
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <div className="flex flex-wrap gap-2">
                            {['Next.js 15', 'Stripe Connect', 'Supabase Auth', 'PostgreSQL', 'Tailwind'].map(tech => (
                                <span key={tech} className="px-2 py-1 bg-white border rounded text-[10px] font-bold text-slate-600 uppercase">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Detected Risks</div>
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-xs">!</div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-amber-900">High Token Usage</p>
                            <p className="text-[10px] text-amber-700 leading-normal">The complexity of the vendor dashboard might exceed standard build patterns. Suggesting split tasks.</p>
                        </div>
                    </div>
                </div>

                <Button className="w-full bg-[#0F172A] text-white hover:bg-slate-800 transition-colors h-11 font-bold" asChild>
                    <Link href={`/project/${id}/tasks`}>Generate Build Plan</Link>
                </Button>
            </div>
        </div>
    </div>
  );
}
