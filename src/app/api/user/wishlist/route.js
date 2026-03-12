import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                wishlist: {
                    select: { id: true, name: true, price: true, imageUrls: true, category: true, brand: true }
                }
            }
        });

        return NextResponse.json(user?.wishlist ?? []);
    } catch (err) {
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
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { wishlist: { where: { id: productId }, select: { id: true } } }
        });

        const isWishlisted = user?.wishlist?.length > 0;

        // Toggle
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                wishlist: isWishlisted
                    ? { disconnect: { id: productId } }
                    : { connect: { id: productId } }
            }
        });

        return NextResponse.json({ wishlisted: !isWishlisted });
    } catch (err) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
