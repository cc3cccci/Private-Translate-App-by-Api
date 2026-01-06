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

        const systemPrompt = `You are a professional translator and language learning assistant.
Translate the following text from ${sourceLang || 'auto-detected language'} to ${targetLang}.
You must return the result in strictly valid JSON format, without markdown code blocks.
Structure:
{
  "translation": "The direct translation",
  "synonyms": ["word1", "word2"],
  "similar_expressions": ["phrase 1"],
  "definition": "A brief definition of the key term in the target language (if applicable)"
}
If the input is a sentence, provide similar sentences. If it is a word, provide synonyms and definitions.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text }
        ];

        // @ts-expect-error - library mismatch workaround
        const completion = await chatCompletion(selectedModel, messages);
        let content = completion.choices[0]?.message?.content?.trim() || '';

        // Clean up markdown code blocks if present (common issue with LLMs)
        content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        let parsedResult;
        try {
            parsedResult = JSON.parse(content);
        } catch {
            // Fallback for non-JSON response
            parsedResult = {
                translation: content,
                synonyms: [],
                similar_expressions: [],
                definition: ""
            };
        }

        const translatedText = parsedResult.translation || content;

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

        return NextResponse.json({
            result: translatedText,
            synonyms: parsedResult.synonyms || [],
            similar: parsedResult.similar_expressions || [],
            definition: parsedResult.definition || ""
        });

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json({ error: (error as Error).message || 'Internal Server Error' }, { status: 500 });
    }
}
