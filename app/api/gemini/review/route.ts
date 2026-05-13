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
    const { taskId } = await req.json();

    const { data: task } = await supabase.from("tasks").select("*").eq("id", taskId).single();
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

    const isDone = validated.score >= 90;
    
    await supabase.from("tasks").update({ 
        review_result: validated,
        status: isDone ? "done" : "pending",
        retry_count: isDone ? task.retry_count : task.retry_count + 1
    }).eq("id", taskId);

    return NextResponse.json(validated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
