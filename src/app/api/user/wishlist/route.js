import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const wishlistItems = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    select: { id: true, name: true, price: true, imageUrls: true, category: true, brand: true, slug: true }
                }
            }
        });

        // Map to return just the products
        return NextResponse.json(wishlistItems.map(item => item.product));
    } catch (err) {
        console.error("Wishlist GET Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();
        if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

        // Check if already wishlisted
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId
                }
            }
        });

        if (existing) {
            // Remove
            await prisma.wishlist.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ wishlisted: false });
        } else {
            // Add and log activity
            await prisma.$transaction([
                prisma.wishlist.create({
                    data: {
                        userId: session.user.id,
                        productId: productId
                    }
                }),
                prisma.customerActivity.create({
                    data: {
                        userId: session.user.id,
                        action: "ADD_TO_WISHLIST",
                        metadata: { productId }
                    }
                })
            ]);
            return NextResponse.json({ wishlisted: true });
        }
    } catch (err) {
        console.error("Wishlist POST Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
