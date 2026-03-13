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
                    select: { 
                        id: true, 
                        name: true, 
                        price: true, 
                        imageUrls: true, 
                        category: true, 
                        brand: true, 
                        slug: true,
                        stock: true,
                        isFeatured: true
                    }
                }
            }
        });

        return NextResponse.json(wishlistItems.map(item => item.product));
    } catch (err) {
        console.error("Wishlist GET Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
