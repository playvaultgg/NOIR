import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { encryptionExtension } from "./crypto/prisma-encryption-middleware";

/**
 * Senior Developer Standard: Professional Prisma Client with Connection Pooling
 */
const prismaClientSingleton = () => {
    const pool = new pg.Pool({ 
        connectionString: process.env.DATABASE_URL,
        max: 20,              // High-performance pool size
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // Increased to 10s for remote DB stability
    });

    pool.on('error', (err) => {
        console.error('CRITICAL: Unexpected error on idle client', err);
    });

    const adapter = new PrismaPg(pool);
    const client = new PrismaClient({ 
        adapter,
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

    // Apply security extension (Field-level encryption + Soft delete functionality)
    return client.$extends(encryptionExtension);
}

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
