import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { encryptToken } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { apiKey, projectId } = await req.json();

    if (!apiKey || !projectId) {
      return NextResponse.json({ error: "API Key and Project ID are required" }, { status: 400 });
    }

    // 1. Validate the key with a small test call
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use a stable model for validation
      await model.generateContent("test");
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid Gemini API Key: " + err.message }, { status: 400 });
    }

    // 2. Encrypt the key
    const encryptedToken = encryptToken(apiKey);

    // 3. Store in Supabase
    const { error } = await (supabase as any)
      .from("projects")
      .update({ gemini_token_encrypted: encryptedToken })
      .eq("id", projectId)
      .eq("user_id", session.user.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
