import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getGeminiModel } from "@/lib/gemini/client";
import { CODE_GENERATOR_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { taskId, prompt } = await req.json();

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
        const files: Record<string, string> = {};
        const fileSections = fullText.split("### FILE:");
        for (const section of fileSections) {
            if (!section.trim()) continue;
            const lines = section.trim().split("\n");
            const path = lines[0].trim();
            const content = lines.slice(1).join("\n").trim();
            if (path && content) {
                files[path] = content;
            }
        }

        // Update task
        await (supabase as any).from("tasks").update({ 
            generated_code: files,
            status: "review" 
        }).eq("id", taskId);

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
