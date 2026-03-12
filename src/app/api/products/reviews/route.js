import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

// GET reviews for a product
export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

        const reviews = await prisma.review.findMany({
            where: { productId },
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" },
        });

        const avgRating = reviews.length
            ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
            : 0;

        return NextResponse.json({ reviews, avgRating: +avgRating.toFixed(1), count: reviews.length });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST create / update review (one per user per product)
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId, rating, title, body } = await req.json();
        if (!productId || !rating || !body) {
            return NextResponse.json({ error: "productId, rating, and body are required" }, { status: 400 });
        }
        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
        }

        // Check verified purchase
        const purchased = await prisma.orderItem.findFirst({
            where: {
                productId,
                order: { userId: session.user.id, status: { in: ["DELIVERED", "SHIPPED"] } }
            }
        });

        const review = await prisma.review.upsert({
            where: { productId_userId: { productId, userId: session.user.id } },
            update: { rating, title, body },
            create: {
                productId,
                userId: session.user.id,
                rating,
                title,
                body,
                verifiedPurchase: !!purchased,
            },
            include: { user: { select: { name: true, image: true } } },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
