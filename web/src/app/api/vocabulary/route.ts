import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
    try {
        const { word, definition, contextSentence, sourceLang, targetLang } = await req.json();

        const vocab = await prisma.vocabulary.create({
            data: {
                word,
                definition,
                contextSentence,
                sourceLang,
                targetLang,
            },
        });
        return NextResponse.json(vocab);
    } catch {
        return NextResponse.json({ error: 'Failed to add vocabulary' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const exportFormat = searchParams.get('export');

    try {
        const vocab = await prisma.vocabulary.findMany({
            orderBy: { createdAt: 'desc' }
        });

        if (exportFormat === 'anki') {
            // Generate TSV for Anki
            // Format: Word <tab> Definition <tab> Context
            const tsv = vocab.map((v: { word: string; definition: string; contextSentence: string | null }) =>
                `${v.word}\t${v.definition}\t${v.contextSentence || ''}`
            ).join('\n');

            return new NextResponse(tsv, {
                headers: {
                    'Content-Type': 'text/tab-separated-values',
                    'Content-Disposition': 'attachment; filename="vocabulary_anki.txt"',
                },
            });
        }

        return NextResponse.json(vocab);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 });
    }
}
