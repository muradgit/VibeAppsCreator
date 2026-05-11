import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';
import { createSupabaseAdminClient } from '@/lib/supabase/client';
import { GeminiPlanSchema } from '@/lib/gemini/schema';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = await req.json();
  const supabase = createSupabaseAdminClient();

  const { error: projectUpdateError } = await supabase.from('projects').update({
        plan: plan as any,
        tech_stack: plan.techStack as any,
        constraints: plan.constraints as any,
        status: 'planning_complete',
  }).eq('id', params.id);

  if (projectUpdateError) return NextResponse.json({ error: projectUpdateError.message }, { status: 500 });

  let sequence = 1;
  const tasksToInsert = (plan as any).phases.flatMap((phase: any) => 
    phase.tasks.map((task: any) => ({
      project_id: params.id,
      sequence_number: sequence++,
      title: task.title,
      description: task.description,
      acceptance_criteria: task.acceptanceCriteria,
      file_paths: task.filePaths,
      dependencies: task.dependsOn.length > 0 ? task.dependsOn : null,
      status: 'pending',
    }))
  );
  
  const { error: tasksInsertError } = await supabase.from('tasks').insert(tasksToInsert);
  if (tasksInsertError) return NextResponse.json({ error: tasksInsertError.message }, { status: 500 });

  return NextResponse.json({ message: 'Tasks created successfully.' });
}
