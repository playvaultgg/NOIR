const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        await prisma.$connect();
        console.log("✅ Database connection successful.");
        const userCount = await prisma.user.count();
        console.log(`📊 Total users in DB: ${userCount}`);
    } catch (error) {
        console.error("❌ Database connection failed.");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
