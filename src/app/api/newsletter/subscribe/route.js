import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendNewsletterWelcome } from "@/lib/email";
import { nanoid } from "nanoid";

export async function POST(req) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ error: "Invalid digital address" }, { status: 400 });
        }

        // Check if already subscribed
        const existing = await prisma.newslettersubscriber.findUnique({
            where: { email },
        });

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json({ message: "Already part of the Circle" }, { status: 200 });
            }
            // Reactivate
            await prisma.newslettersubscriber.update({
                where: { email },
                data: { isActive: true },
            });
        } else {
            // Create new subscriber
            await prisma.newslettersubscriber.create({
                data: {
                    id: nanoid(),
                    email,
                    isActive: true,
                },
            });
        }

        // Send welcome email (fail-safe)
        try {
            await sendNewsletterWelcome({ to: email });
        } catch (err) {
            console.error("Welcome email failed:", err);
        }

        return NextResponse.json({ success: true, message: "Welcome to the Inner Circle" });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json({ error: "System interruption in subscription protocol" }, { status: 500 });
    }
}
