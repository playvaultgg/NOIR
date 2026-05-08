import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const { eventType, metadata } = await req.json();

        if (!eventType) {
            return NextResponse.json({ error: "Event type required" }, { status: 400 });
        }

        // Robustly determine if we have a valid userId to avoid P2003 Foreign Key errors
        const userId = (session?.user?.id && typeof session.user.id === 'string' && session.user.id.trim() !== "") 
            ? session.user.id 
            : null;

        await prisma.behavioralevent.create({
            data: {
                userId,
                eventType,
                metadata: metadata || null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        // Log the full error metadata for Prisma P2003 debugging
        console.error("Analytics tracking failure [PRISMA ERROR]:", {
            message: error.message,
            code: error.code,
            meta: error.meta,
            stack: error.stack
        });
        
        return NextResponse.json({ error: "Tracking protocol interruption" }, { status: 500 });
    }
}
