import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function POST(req) {
    try {
        const body = await req.json();
        const { name, email, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Create the contact message in the database
        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                subject,
                message,
                status: "OPEN"
            }
        });

        // 2. Log activity if user is logged in
        const session = await getServerSession(authOptions);
        if (session?.user?.id) {
            await prisma.customerActivity.create({
                data: {
                    userId: session.user.id,
                    action: "CONTACT_FORM_SUBMISSION",
                    metadata: {
                        messageId: contactMessage.id,
                        subject: subject
                    }
                }
            });
        }

        return NextResponse.json({ 
            success: true, 
            message: "Inquiry received by the Maison Concierge.",
            id: contactMessage.id 
        });

    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
