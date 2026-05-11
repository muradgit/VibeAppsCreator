import { createSupabaseAdminClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import { geminiModel } from "@/lib/gemini/client";
import { PLAN_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { GeminiPlanSchema } from "@/lib/gemini/schema";
import { PlanView } from "@/components/plan/PlanView";

async function getProjectAndContext(id: string) {
    const supabase = createSupabaseAdminClient();
    const { data: project } = await supabase.from('projects').select('*').eq('id', id).single();
    // Fetch conversation history if available
    const { data: history } = await supabase.from('conversations').select('*').eq('project_id', id);
    return { project, history: history || [] };
}

async function generatePlan(idea: string, history: any) {
    const prompt = `${PLAN_SYSTEM_PROMPT}\n\n**User's Refined Idea:**\n${idea}\n\n**Context (History):**\n${JSON.stringify(history)}`;
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    return GeminiPlanSchema.parse(JSON.parse(cleanedJson));
}

export default async function PlanPage({ params }: { params: { id: string } }) {
    const { project, history } = await getProjectAndContext(params.id);
    if (!project) notFound();

    const plan = await generatePlan(project.idea_raw, history);

    return (
        <div className="space-y-8">
            <div className="space-y-1">
                <h1 className="text-3xl font-black text-white">Phase 3: Development Roadmap</h1>
                <p className="text-slate-500">A structured breakdown of your application architecture and tasks.</p>
            </div>
            <PlanView plan={plan} projectId={project.id} />
        </div>
    );
}
