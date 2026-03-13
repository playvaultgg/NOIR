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

        await prisma.wishlist.deleteMany({
            where: {
                userId: session.user.id,
                productId: productId
            }
        });

        return NextResponse.json({ success: true, wishlisted: false });
    } catch (err) {
        console.error("Wishlist Remove Error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
