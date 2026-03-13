import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { nanoid } from "nanoid";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const { eventType, metadata } = await req.json();

        if (!eventType) {
            return NextResponse.json({ error: "Event type required" }, { status: 400 });
        }

        await prisma.behavioralevent.create({
            data: {
                id: nanoid(),
                userId: session?.user?.id || null,
                eventType,
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Analytics tracking failure:", error);
        return NextResponse.json({ error: "Tracking protocol interruption" }, { status: 500 });
    }
}
