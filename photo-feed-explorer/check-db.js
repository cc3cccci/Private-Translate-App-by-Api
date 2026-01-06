const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const photos = await prisma.photo.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5
        });
        console.log(JSON.stringify(photos, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
