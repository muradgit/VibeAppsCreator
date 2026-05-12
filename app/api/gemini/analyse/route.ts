import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getGeminiModel } from "@/lib/gemini/client";
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/gemini/prompts";
import { AnalysisResponseSchema } from "@/lib/gemini/schema";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { ideaRaw, projectId } = await req.json();

    const model = getGeminiModel();
    const result = await model.generateContent([
      { text: ANALYSIS_SYSTEM_PROMPT },
      { text: `User Idea: ${ideaRaw}` }
    ]);

    const responseText = result.response.text();
    // Clean JSON if needed (Gemini sometimes adds markdown blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : responseText;
    
    const analysis = JSON.parse(cleanJson);
    const validated = AnalysisResponseSchema.parse(analysis);

    // Save to conversations table
    await supabase.from("conversations").insert([
      {
        project_id: projectId,
        phase: "analysis",
        role: "assistant",
        content: cleanJson
      }
    ]);

    return NextResponse.json(validated);
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
