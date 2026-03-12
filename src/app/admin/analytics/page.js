import prisma from "@/lib/prisma";
import AnalyticsCharts from "./AnalyticsCharts";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics | NOIR Admin" };

export default async function AdminAnalyticsPage() {
    /* ── Fetch all data directly from Prisma (server-side, no auth needed) ── */
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [recentOrders, allOrderGroups, topItemGroups, totalOrders, totalUsers, totalProducts] =
        await Promise.all([
            prisma.order.findMany({
                where: { createdAt: { gte: since }, status: { not: "CANCELLED" } },
                select: { totalAmount: true, createdAt: true },
            }),
            prisma.order.groupBy({
                by: ["status"],
                _count: { status: true },
            }),
            prisma.orderItem.groupBy({
                by: ["productId"],
                _sum: { quantity: true },
                orderBy: { _sum: { quantity: "desc" } },
                take: 8,
            }),
            prisma.order.count(),
            prisma.user.count(),
            prisma.product.count(),
        ]);

    /* Revenue by day */
    const revenueMap = {};
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        revenueMap[d.toISOString().split("T")[0]] = 0;
    }
    recentOrders.forEach((o) => {
        const key = o.createdAt.toISOString().split("T")[0];
        if (revenueMap[key] !== undefined) revenueMap[key] += o.totalAmount;
    });
    const revenueByDay = Object.entries(revenueMap).map(([date, revenue]) => ({ date, revenue }));

    /* Order status counts */
    const ordersByStatus = {};
    allOrderGroups.forEach((g) => { ordersByStatus[g.status] = g._count.status; });

    /* Top products */
    const productIds = topItemGroups.map((i) => i.productId);
    const productDetails = await prisma.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true },
    });
    const topProducts = topItemGroups.map((item) => ({
        name: productDetails.find((p) => p.id === item.productId)?.name ?? "Unknown",
        count: item._sum.quantity ?? 0,
    }));

    const totalRevenue = recentOrders.reduce((s, o) => s + o.totalAmount, 0);

    const data = {
        revenueByDay,
        ordersByStatus,
        topProducts,
        summary: { totalRevenue, totalOrders, totalUsers, totalProducts },
    };

    return (
        <div className="space-y-4">
            <header className="mb-8">
                <h1 className="text-3xl font-playfair text-white italic">Analytics Engine</h1>
                <p className="text-white/30 text-sm mt-1">Real-time revenue, orders, and product performance.</p>
            </header>
            <AnalyticsCharts data={data} />
        </div>
    );
}
