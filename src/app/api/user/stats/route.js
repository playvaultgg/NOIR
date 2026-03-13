import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Fetch metrics in parallel
        const [orderCount, wishlistCount, lastOrders, avatar] = await Promise.all([
            prisma.order.count({ where: { userId } }),
            prisma.wishlist.count({ where: { userId } }),
            prisma.order.findMany({
                where: { userId },
                take: 2,
                orderBy: { createdAt: "desc" },
                include: {
                    orderitem: {
                        include: {
                            product: true
                        }
                    }
                }
            }),
            prisma.useravatar.findUnique({ where: { userId } })
        ]);

        return NextResponse.json({
            orderCount,
            wishlistCount,
            lastOrders,
            avatarStatus: avatar ? "SYNCHRONIZED" : "AWAITING_SCAN",
            loyaltyLevel: orderCount > 5 ? "GOLD" : orderCount > 2 ? "SILVER" : "BRONZE"
        });

    } catch (error) {
        console.error("Dashboard telemetry error:", error);
        return NextResponse.json({ error: "System interruption in telemetry protocol" }, { status: 500 });
    }
}
