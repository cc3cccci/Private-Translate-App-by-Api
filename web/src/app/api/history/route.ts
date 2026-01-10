import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const history = await prisma.translationHistory.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 50, // Limit to last 50
        });
        return NextResponse.json(history);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        await prisma.translationHistory.deleteMany({});
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete history' }, { status: 500 });
    }
}
