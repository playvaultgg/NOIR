import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function POST(req) {
    console.log("POST /api/avatar")
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Authentication Required" }, { status: 401 });
        }

        const data = await req.json();
        const { bodyType, skinTone, modelURL, height, weight } = data;

        const avatar = await prisma.userAvatar.upsert({
            where: { userId: session.user.id },
            update: {
                bodyType,
                skinTone,
                modelURL,
                height,
                weight
            },
            create: {
                userId: session.user.id,
                bodyType,
                skinTone,
                modelURL,
                height,
                weight
            }
        });

        return NextResponse.json({ success: true, avatar });
    } catch (error) {
        console.error("AVATAR_ERROR:", error);
        return NextResponse.json({ error: "Internal Protocol Failure" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Authentication Required" }, { status: 401 });
        }

        const avatar = await prisma.userAvatar.findUnique({
            where: { userId: session.user.id }
        });

        return NextResponse.json({ avatar });
    } catch (error) {
        console.error("AVATAR_GET_ERROR:", error);
        return NextResponse.json({ error: "Internal Protocol Failure" }, { status: 500 });
    }
}
