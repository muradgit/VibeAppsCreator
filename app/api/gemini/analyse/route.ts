import { NextRequest, NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini/client';
import { ANALYSIS_SYSTEM_PROMPT } from '@/lib/gemini/prompts';
import { GeminiAnalysisSchema } from '@/lib/gemini/schema';

export async function POST(req: NextRequest) {
  try {
    const { idea } = await req.json();

    if (!idea || idea.length < 50) {
      return NextResponse.json({ error: 'Idea must be at least 50 characters long.' }, { status: 400 });
    }

    const prompt = `${ANALYSIS_SYSTEM_PROMPT}\n\nUser Idea: "${idea}"`;
    const result = await geminiModel.generateContent(prompt);
    const responseText = result.response.text();
    const cleanedJson = responseText.replace(/```json|```/g, '').trim();
    const parsedAnalysis = GeminiAnalysisSchema.parse(JSON.parse(cleanedJson));

    return NextResponse.json(parsedAnalysis);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Failed to analyze idea.' }, { status: 500 });
  }
}
