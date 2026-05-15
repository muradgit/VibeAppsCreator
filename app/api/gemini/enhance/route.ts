import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getProjectGeminiModel } from "@/lib/gemini/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { ideaRaw, projectId } = await req.json();
    if (!ideaRaw) return NextResponse.json({ error: "Idea is required" }, { status: 400 });

    const model = await getProjectGeminiModel(projectId);
    const prompt = `Expand and enhance the following raw application idea into a more professional and detailed project summary. 
    Focus on clarity, scope, and technical depth. Return ONLY the enhanced text.
    
    Raw Idea: ${ideaRaw}`;

    const result = await model.generateContent(prompt);
    const enhanced = result.response.text();

    return NextResponse.json({ enhanced });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
