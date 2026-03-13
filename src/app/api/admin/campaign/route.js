import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendCampaignEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        
        // Admin check
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized access detected" }, { status: 403 });
        }

        const { subject, title, body, ctaLabel, ctaUrl, imageUrl } = await req.json();

        if (!subject || !title || !body) {
            return NextResponse.json({ error: "Campaign data incomplete" }, { status: 400 });
        }

        // Get all active subscribers
        const subscribers = await prisma.newslettersubscriber.findMany({
            where: { isActive: true },
            select: { email: true },
        });

        if (subscribers.length === 0) {
            return NextResponse.json({ message: "No active subscribers found" });
        }

        // Trigger campaign (In a real scenario, this should be a background job)
        const sendPromises = subscribers.map(s => 
            sendCampaignEmail({
                to: s.email,
                subject,
                title,
                body,
                ctaLabel,
                ctaUrl,
                imageUrl
            }).catch(err => console.error(`Failed to send to ${s.email}:`, err))
        );

        await Promise.all(sendPromises);

        return NextResponse.json({ 
            success: true, 
            message: `Campaign liberated to ${subscribers.length} patrons` 
        });
    } catch (error) {
        console.error("Campaign liberation error:", error);
        return NextResponse.json({ error: "Campaign protocol failure" }, { status: 500 });
    }
}
