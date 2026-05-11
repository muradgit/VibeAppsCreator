import { NextRequest, NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini/client';
import { PLAN_SYSTEM_PROMPT } from '@/lib/gemini/prompts';
import { GeminiPlanSchema } from '@/lib/gemini/schema';

export async function POST(req: NextRequest) {
  try {
    const { idea, conversationHistory } = await req.json();

    const prompt = `${PLAN_SYSTEM_PROMPT}\n\n**User's Refined Idea:**\n${idea}\n\n**Clarification Q&A:**\n${JSON.stringify(conversationHistory, null, 2)}`;
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    const parsedPlan = GeminiPlanSchema.parse(JSON.parse(cleanedJson));

    return NextResponse.json(parsedPlan);
  } catch (error: any) {
    console.error('Planning error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate plan.' }, { status: 500 });
  }
}
