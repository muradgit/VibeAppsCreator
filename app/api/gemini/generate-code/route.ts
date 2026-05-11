import { geminiModel } from '@/lib/gemini/client';
import { CODE_GENERATOR_SYSTEM_PROMPT } from '@/lib/gemini/prompts';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { prompt } = await req.json();
        const fullPrompt = `${CODE_GENERATOR_SYSTEM_PROMPT}\n\n**Task:**\n${prompt}`;
        const result = await geminiModel.generateContentStream(fullPrompt);

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    controller.enqueue(encoder.encode(chunk.text()));
                }
                controller.close();
            },
        });
        
        return new Response(stream, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}
