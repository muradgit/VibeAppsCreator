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
    const result = await model.generateContentStream([
      { text: CODE_GENERATOR_SYSTEM_PROMPT },
      { text: prompt }
    ]);

    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";
        for await (const chunk of result.stream) {
          const text = chunk.text();
          fullText += text;
          controller.enqueue(new TextEncoder().encode(text));
        }

        // Post-processing to parse files
        const files = parseGeneratedFiles(fullText);

        if (Object.keys(files).length === 0) {
          await (supabase as any)
            .from("tasks")
            .update({ status: "failed", retry_count: task.retry_count + 1 })
            .eq("id", taskId)
            .eq("project_id", projectId);

          controller.enqueue(
            new TextEncoder().encode(`\n${NO_FILES_GENERATED_SIGNAL}`)
          );
          controller.close();
          return;
        }

        // Update task
        await (supabase as any).from("tasks").update({ 
            generated_code: files,
            status: "review" 
        }).eq("id", taskId).eq("project_id", projectId);

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
