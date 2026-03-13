import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();
        if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });

        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId: productId
                }
            }
        });

        if (!existing) {
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
                        metadata: JSON.stringify({ productId })
                    }
                })
            ]);
        }

        return NextResponse.json({ success: true, wishlisted: true });
    } catch (err) {
        console.error("Wishlist Add Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
