import { GoogleGenerativeAI } from "@google/generative-ai";

import { supabase } from "@/lib/supabase/client";
import { decryptToken } from "@/lib/utils";

const apiKey = process.env.GEMINI_API_KEY;

export function getGeminiModel(customApiKey?: string) {
  const key = customApiKey || apiKey;
  if (!key) {
    throw new Error("Gemini API key is required. Please set GEMINI_API_KEY env or configure it in the project settings.");
  }
  const genAI = new GoogleGenerativeAI(key);
  // Using gemini-2.0-flash
  return genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
}

export async function getProjectGeminiModel(projectId?: string) {
    if (!projectId) return getGeminiModel();
    
    const { data: project, error } = await (supabase as any)
        .from("projects")
        .select("gemini_token_encrypted, tech_stack")
        .eq("id", projectId)
        .single();
    
    if (error) throw new Error("Failed to fetch project for Gemini integration: " + error.message);
    
    const token = project.gemini_token_encrypted || project.tech_stack?.gemini_token_backup;
    
    if (token) {
        try {
            const decryptedKey = decryptToken(token);
            return getGeminiModel(decryptedKey);
        } catch (e) {
            console.error("Failed to decrypt Gemini token, falling back to env key", e);
        }
    }
    
    return getGeminiModel();
}
