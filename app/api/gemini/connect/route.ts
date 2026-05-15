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
      // Try with gemini-1.5-flash first
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
      await model.generateContent("test");
    } catch (err: any) {
      const msg = err.message || "";
      const isQuotaError = msg.includes("Quota exceeded") || msg.includes("429");
      const isInvalidKey = msg.includes("API_KEY_INVALID") || msg.includes("401") || msg.includes("403");
      const isModelNotFoundError = msg.includes("404") || msg.includes("not found");
      
      // If the key is invalid, we MUST stop.
      if (isInvalidKey) {
        return NextResponse.json({ error: "Invalid Gemini API Key" }, { status: 400 });
      }
      
      // If it's a quota error OR model not found error, it's NOT an "invalid key" per se.
      // It's a system/limit error. We allow saving because the user's key might be right.
      if (isQuotaError || isModelNotFoundError) {
          console.log("Gemini validation bypassed due to quota or model mismatch:", msg);
      } else {
        // For other errors, return the actual error
        return NextResponse.json({ error: "Gemini Validation Error: " + msg }, { status: 400 });
      }
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
