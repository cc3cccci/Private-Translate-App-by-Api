import { NextRequest, NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/llm-adapter';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { text, sourceLang, targetLang, model } = await req.json();

        if (!text || !targetLang) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const selectedModel = model || process.env.DEFAULT_MODEL || 'gpt-3.5-turbo';

        const systemPrompt = `You are a high-contrast, minimalist translator. Translate the following text from ${sourceLang || 'auto-detected language'} to ${targetLang}. Return ONLY the translated text. Do not include explanations, quotes, or markdown unless necessary for the translation itself.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
        ];

        // @ts-expect-error - library mismatch workaround
        const completion = await chatCompletion(selectedModel, messages);
        const translatedText = completion.choices[0]?.message?.content?.trim() || '';

        // Async save to history (fire and forget logic, or await if strict)
        // We'll await to ensure basic data integrity for MVP, but catch errors to not block response
        try {
            await prisma.translationHistory.create({
                data: {
                    sourceText: text,
                    translatedText: translatedText,
                    sourceLang: sourceLang || 'auto',
                    targetLang: targetLang,
                    modelUsed: selectedModel,
                },
            });
        } catch (dbError) {
            console.error('Failed to save history:', dbError);
        }

        return NextResponse.json({ result: translatedText });

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
    }
}
