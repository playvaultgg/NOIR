import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
    const dbUrl = process.env.DATABASE_URL;

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
