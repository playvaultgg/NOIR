import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

/**
 * GET /api/admin/analytics
 * Returns revenue by day (30d), order counts by status, and top products.
 * Requires ADMIN role.
 */
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const since = new Date();
        since.setDate(since.getDate() - 30);

        /* ── Revenue by day (last 30 days) ── */
        const orders = await prisma.order.findMany({
            where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
            select: { totalAmount: true, createdAt: true, status: true },
        });

        // Aggregate revenue by day
        const revenueMap = {};
        for (let i = 29; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split("T")[0];
            revenueMap[key] = 0;
        }
        orders.forEach((o) => {
            const key = o.createdAt.toISOString().split("T")[0];
            if (revenueMap[key] !== undefined) revenueMap[key] += o.totalAmount;
        });
        const revenueByDay = Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue }));

        /* ── Orders by status ── */
        const allOrders = await prisma.order.groupBy({
            by: ["status"],
            _count: { status: true },
        });
        const ordersByStatus = {};
        allOrders.forEach((o) => {
            ordersByStatus[o.status] = o._count.status;
        });

        /* ── Top products by quantity sold ── */
        const topProductItems = await prisma.orderItem.groupBy({
            by: ["productId"],
            _sum: { quantity: true },
            orderBy: { _sum: { quantity: "desc" } },
            take: 8,
        });
        const topProductIds = topProductItems.map((i) => i.productId);
        const topProductDetails = await prisma.product.findMany({
            where: { id: { in: topProductIds } },
            select: { id: true, name: true },
        });
        const topProducts = topProductItems.map((item) => ({
            name: topProductDetails.find((p) => p.id === item.productId)?.name || "Unknown",
            count: item._sum.quantity || 0,
        }));

        /* ── Summary totals ── */
        const totalRevenue = orders.reduce((s, o) => s + o.totalAmount, 0);
        const totalOrders = await prisma.order.count();
        const totalUsers = await prisma.user.count();
        const totalProducts = await prisma.product.count();

        return NextResponse.json({
            revenueByDay,
            ordersByStatus,
            topProducts,
            summary: { totalRevenue, totalOrders, totalUsers, totalProducts },
        });
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
