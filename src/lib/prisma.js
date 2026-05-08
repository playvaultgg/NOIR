import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

/**
 * Senior Developer Standard: Professional Prisma Client with Connection Pooling
 */
const prismaClientSingleton = () => {
    const pool = new pg.Pool({ 
        connectionString: process.env.DATABASE_URL,
        max: 20,              // High-performance pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
        console.error('CRITICAL: Unexpected error on idle client', err);
    });

    const adapter = new PrismaPg(pool);
    return new PrismaClient({ 
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
