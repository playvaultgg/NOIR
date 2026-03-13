import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    // Hardcoding the connection string as a fallback to bypass Railway amnesia
    const dbUrl = process.env.DATABASE_URL || "mysql://root:vnMfEVqkmpyjkwWmkfGpjeThVefvMHmZ@gondola.proxy.rlwy.net:57086/railway";

    if (!dbUrl) {
        // Fallback for Next.js build phase if env vars are missing
        console.warn("Prisma initializing without explicit DATABASE_URL. Build environments may ignore this.");
        return new PrismaClient();
    }

    return new PrismaClient({
        datasources: {
            db: {
                url: dbUrl,
            },
        },
    });
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
