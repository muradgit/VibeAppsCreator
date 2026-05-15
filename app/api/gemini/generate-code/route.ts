import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getGeminiModel } from "@/lib/gemini/client";
import { CODE_GENERATOR_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { parseGeneratedFiles } from "@/lib/gemini/parseGeneratedFiles";
import { supabase } from "@/lib/supabase/client";

const NO_FILES_GENERATED_SIGNAL = "__VIBE_ERROR__:NO_FILES_GENERATED";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { taskId, prompt, projectId } = await req.json();

    const { data: project } = await (supabase as any)
      .from("projects")
      .select("id")
      .eq("id", projectId)
      .eq("user_id", session.user.id)
      .single();

    if (!project) return new Response("Not found", { status: 404 });

    const { data: task } = await (supabase as any)
      .from("tasks")
      .select("id, retry_count")
      .eq("id", taskId)
      .eq("project_id", projectId)
      .single();

    if (!task) return new Response("Not found", { status: 404 });

    const model = getGeminiModel();
    const result = await model.generateContent([
      { text: CODE_GENERATOR_SYSTEM_PROMPT },
      { text: prompt }
    ]);

    const fullText = result.response.text();
    const files = parseGeneratedFiles(fullText);

    if (Object.keys(files).length === 0) {
      await (supabase as any)
        .from("tasks")
        .update({ status: "failed", retry_count: task.retry_count + 1 })
        .eq("id", taskId)
        .eq("project_id", projectId);

      return new Response(NO_FILES_GENERATED_SIGNAL, { status: 422 });
    }

    await (supabase as any)
      .from("tasks")
      .update({
        generated_code: files,
        status: "review"
      })
      .eq("id", taskId)
      .eq("project_id", projectId);

    return new Response(fullText, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
