import { GoogleGenerativeAI } from "@google/generative-ai";

// AI Studio environment uses NEXT_PUBLIC_GEMINI_API_KEY
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
    console.warn("NEXT_PUBLIC_GEMINI_API_KEY is not set. AI features might fail.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});
