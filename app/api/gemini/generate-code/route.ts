import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getProjectGeminiModel } from "@/lib/gemini/client";
import { CODE_GENERATOR_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { supabase } from "@/lib/supabase/client";

const MAX_RETRIES = 3;
const TIMEOUT_MS = 60000;

async function fetchWithRetry(model: any, promptParts: any[], retries = 0): Promise<any> {
    try {
        const resultPromise = model.generateContentStream(promptParts);
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Gemini Request Timeout")), TIMEOUT_MS));
        
        return await Promise.race([resultPromise, timeoutPromise]);
    } catch (error: any) {
        if (retries < MAX_RETRIES && (error.message?.includes("503") || error.message?.includes("Timeout"))) {
            const delay = Math.pow(2, retries) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
            return fetchWithRetry(model, promptParts, retries + 1);
        }
        throw error;
    }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { taskId, prompt, projectId } = await req.json();

    const model = await getProjectGeminiModel(projectId);
    const result = await fetchWithRetry(model, [
      { text: CODE_GENERATOR_SYSTEM_PROMPT },
      { text: prompt }
    ]);

    const stream = new ReadableStream({
      async start(controller) {
        let fullText = "";
        try {
            for await (const chunk of result.stream) {
              const text = chunk.text();
              fullText += text;
              controller.enqueue(new TextEncoder().encode(text));
            }

            // Detection for partial code outputs (ending with unterminated code blocks)
            if (fullText.includes("### FILE:") && !fullText.trim().endsWith("```") && fullText.split("### FILE:").length > 1) {
                const lastFileSection = fullText.split("### FILE:").pop();
                if (lastFileSection && !lastFileSection.includes("```")) {
                   // Append termination if likely chopped off
                   fullText += "\n```";
                }
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
        } catch (streamError: any) {
            console.error("Stream error:", streamError);
            // Even if stream fails halfway, try to update if we have some files
            if (fullText.includes("### FILE:")) {
                // partial update logic
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
                await (supabase as any).from("tasks").update({ 
                    generated_code: files,
                    status: "review" 
                }).eq("id", taskId);
            }
        } finally {
            controller.close();
        }
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
