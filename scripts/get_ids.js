const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const products = await prisma.product.findMany({
            take: 10,
            select: { id: true, name: true }
        });
        console.log("Current Product IDs in DB:");
        console.log(JSON.stringify(products, null, 2));
    } catch (e) {
        console.error("Error fetching IDs:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
