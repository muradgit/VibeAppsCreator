import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/client";

// Router for the project root based on status
export default async function ProjectPage({ params }: { params: { id: string } }) {
    const supabase = createSupabaseAdminClient();
    const { data: project } = await supabase.from('projects').select('status').eq('id', params.id).single();
    
    if (!project) redirect('/dashboard');

    if (project.status === 'idea') redirect(`/project/${params.id}/analysis`);
    if (project.status === 'planning') redirect(`/project/${params.id}/plan`);
    if (project.status === 'planning_complete') redirect(`/project/${params.id}/connect`);
    
    // Default to tasks (building or complete)
    redirect(`/project/${params.id}/tasks`);
}
