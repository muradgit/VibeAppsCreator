import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getGeminiModel } from "@/lib/gemini/client";
import { PROMPT_GENERATOR_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskId, projectId } = await req.json();

    // Fetch task and project
    const { data: task } = await (supabase as any).from("tasks").select("*").eq("id", taskId).single();
    const { data: project } = await (supabase as any).from("projects").select("*").eq("id", projectId).single();

    if (!task || !project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Fetch previously done tasks for context
    const { data: doneTasks } = await (supabase as any)
      .from("tasks")
      .select("title, generated_code")
      .eq("project_id", projectId)
      .eq("status", "done");

    const codeSummary = doneTasks?.map((t: any) => `Task: ${t.title}\nCode: ${JSON.stringify(t.generated_code)}`).join("\n\n") || "No code generated yet.";

    const model = getGeminiModel();
    const input = `Task Details:
Title: ${task.title}
Description: ${task.description}
Acceptance Criteria: ${task.acceptance_criteria.join(", ")}
File Paths: ${task.file_paths.join(", ")}

Project Context:
Tech Stack: ${JSON.stringify(project.tech_stack)}
Code Summary of existing files:
${codeSummary}`;

    const result = await model.generateContent([
      { text: PROMPT_GENERATOR_SYSTEM_PROMPT },
      { text: input }
    ]);

    const prompt = result.response.text();

    await (supabase as any).from("tasks").update({ generated_prompt: prompt }).eq("id", taskId);

    return NextResponse.json({ prompt });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
