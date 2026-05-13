import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

export function getGeminiModel() {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  // Using gemini-2.5-pro as requested
  return genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
}
