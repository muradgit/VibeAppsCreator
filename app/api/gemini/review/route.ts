import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getGeminiModel } from "@/lib/gemini/client";
import { CODE_REVIEWER_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { ReviewResponseSchema } from "@/lib/gemini/schema";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { taskId, projectId } = await req.json();

    const { data: project } = await (supabase as any)
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", session.user.id)
      .single();
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { data: task } = await (supabase as any)
      .from("tasks")
      .select("*")
      .eq("id", taskId)
      .eq("project_id", projectId)
      .single();
    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const model = getGeminiModel();
    const input = `Task Checklist: ${task.acceptance_criteria.join(", ")}
Generated Code: ${JSON.stringify(task.generated_code)}`;

    const result = await model.generateContent([
      { text: CODE_REVIEWER_SYSTEM_PROMPT },
      { text: input }
    ]);

    const responseText = result.response.text();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
    
    const review = JSON.parse(cleanJson);
    const validated = ReviewResponseSchema.parse(review);

    const nextRetryCount = validated.score >= 90 ? task.retry_count : task.retry_count + 1;
    const nextStatus = nextRetryCount >= 3 && validated.score < 90 ? "failed" : "review";

    await (supabase as any)
      .from("tasks")
      .update({
        review_result: validated,
        status: nextStatus,
        retry_count: nextRetryCount
      })
      .eq("id", taskId)
      .eq("project_id", projectId);

    return NextResponse.json(validated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
