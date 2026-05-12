import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getGeminiModel } from "@/lib/gemini/client";
import { PLAN_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { PlanResponseSchema } from "@/lib/gemini/schema";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId, answers } = await req.json();

    // Fetch project
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

    // Fetch analysis conversations
    const { data: conversations } = await supabase
      .from("conversations")
      .select("*")
      .eq("project_id", projectId)
      .eq("phase", "analysis")
      .order("created_at", { ascending: true });

    const context = conversations?.map(c => `${c.role.toUpperCase()}: ${c.content}`).join("\n") || "";
    const answersText = answers.map((a: any) => `Question ID ${a.questionId}: ${a.answer}`).join("\n");

    const model = getGeminiModel();
    const prompt = `Application Idea: ${project.idea_raw}\n\nPrevious Analysis Context:\n${context}\n\nUser Answers:\n${answersText}`;
    
    const result = await model.generateContent([
      { text: PLAN_SYSTEM_PROMPT },
      { text: prompt }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
    
    const plan = JSON.parse(cleanJson);
    const validated = PlanResponseSchema.parse(plan);

    // Update project
    await supabase.from("projects").update({
      plan: validated,
      tech_stack: validated.techStack,
      constraints: validated.constraints,
      status: "planning"
    }).eq("id", projectId);

    // Create tasks
    const allTasks = [];
    let sequence = 1;
    for (const phase of validated.phases) {
      for (const task of phase.tasks) {
        allTasks.push({
          project_id: projectId,
          sequence_number: sequence++,
          title: task.title,
          description: task.description,
          acceptance_criteria: task.acceptanceCriteria,
          file_paths: task.filePaths,
          dependencies: task.dependsOn || [],
          status: "pending"
        });
      }
    }

    const { data: createdTasks } = await supabase.from("tasks").insert(allTasks).select();

    return NextResponse.json({ plan: validated, tasks: createdTasks });
  } catch (error: any) {
    console.error("Gemini Planning Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
