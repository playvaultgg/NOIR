import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const start = Date.now();
    
    try {
        // 1. Check Database Health
        await prisma.$queryRaw`SELECT 1`;
        
        const uptime = process.uptime();
        const latency = Date.now() - start;

        return NextResponse.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            service: "MAISON NOIR API",
            latency: `${latency}ms`,
            uptime: `${Math.floor(uptime)}s`,
            checks: {
                database: "connected",
                cache: "standby" // Redis placeholder
            },
            version: "1.2.0-SOVEREIGN"
        }, { status: 200 });

    } catch (error) {
        console.error("Health Check Failure:", error);
        return NextResponse.json({
            status: "unhealthy",
            timestamp: new Date().toISOString(),
            error: "DATABASE_CONNECTION_FAILURE",
            details: error.message
        }, { status: 503 });
    }
}
