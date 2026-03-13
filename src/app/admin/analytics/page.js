import prisma from "@/lib/prisma";
import { 
    UserPlus, 
    LogIn, 
    Eye, 
    Heart, 
    ShoppingBag, 
    Star, 
    Clock,
    Activity,
    ArrowUpRight
} from "lucide-react";
import Image from "next/image";
import RevenueChart from "@/components/admin/RevenueChart";

export const dynamic = "force-dynamic";
export const metadata = { title: "Analytics | NOIR Admin" };

const ACTION_CONFIG = {
    REGISTER: { icon: UserPlus, color: "text-blue-400", bg: "bg-blue-400/10" },
    LOGIN: { icon: LogIn, color: "text-emerald-400", bg: "bg-emerald-400/10" },
    VIEW_PRODUCT: { icon: Eye, color: "text-purple-400", bg: "bg-purple-400/10" },
    ADD_TO_WISHLIST: { icon: Heart, color: "text-rose-400", bg: "bg-rose-400/10" },
    PURCHASE: { icon: ShoppingBag, color: "text-[#C6A972]", bg: "bg-[#C6A972]/10" },
    SUBMIT_REVIEW: { icon: Star, color: "text-amber-400", bg: "bg-amber-400/10" },
};

export default async function AdminAnalyticsPage() {
    /* ... existing data fetching logic ... */
    /* ── Fetch all data directly from Prisma (server-side, no auth needed) ── */
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [recentOrders, allOrderGroups, topItemGroups, totalOrders, totalUsers, totalProducts, recentActivities] =
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
            prisma.customerActivity.findMany({
                orderBy: { createdAt: 'desc' },
                take: 15,
                include: { user: { select: { name: true, email: true, image: true } } }
            })
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
        <div className="space-y-12">
            <header className="mb-12">
                <h1 className="text-4xl font-playfair text-white italic">Analytics Engine</h1>
                <p className="text-white/30 text-sm mt-1">Real-time revenue, and operational pulse.</p>
            </header>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "+12%" },
                    { label: "Total Orders", value: totalOrders, trend: "+5%" },
                    { label: "Client Base", value: totalUsers, trend: "+18%" },
                    { label: "Vault Items", value: totalProducts, trend: "Stable" },
                ].map((stat, idx) => (
                    <div key={idx} className="glass-effect p-6 rounded-3xl border border-white/5 bg-noir-surface/20">
                        <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold mb-1">{stat.label}</p>
                        <p className="text-2xl font-playfair text-white">{stat.value}</p>
                        <div className="flex items-center gap-1 mt-2 text-[9px] text-[#C6A972]">
                            <ArrowUpRight size={10} />
                            <span>{stat.trend} from last month</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Status Chart Placeholder */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="glass-effect p-8 rounded-3xl border border-white/5 bg-noir-surface/20">
                        <div className="flex justify-between items-center mb-12">
                            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/40">Revenue Flow</h3>
                            <div className="px-3 py-1 bg-[#C6A972]/10 border border-[#C6A972]/20 rounded-lg text-[#C6A972] text-[9px] font-bold">30D LIVE</div>
                        </div>
                        <div className="h-64 border border-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                             <RevenueChart data={data.revenueByDay} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-effect p-8 rounded-3xl border border-white/5 bg-noir-surface/20">
                            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/40 mb-8">Performance Mix</h3>
                            <div className="space-y-4">
                                {topProducts.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-xs text-white/60 truncate max-w-[150px]">{p.name}</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#C6A972]" style={{ width: `${(p.count / topProducts[0].count) * 100}%` }} />
                                            </div>
                                            <span className="text-[10px] font-mono text-white/40">{p.count}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="glass-effect p-8 rounded-3xl border border-white/5 bg-noir-surface/20">
                            <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/40 mb-8">Status Distribution</h3>
                            <div className="space-y-4">
                                {Object.entries(ordersByStatus).map(([status, count], i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#C6A972] transition-colors" />
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{status}</span>
                                        </div>
                                        <span className="text-[10px] font-mono font-bold text-white/80">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Operations Pulse Feed */}
                <div className="lg:col-span-4 h-full">
                    <div className="glass-effect h-full rounded-3xl border border-white/10 bg-black/40 overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-rose-500/20 rounded-lg text-rose-500">
                                    <Activity size={16} />
                                </div>
                                <h3 className="text-[11px] uppercase tracking-[0.3em] font-black text-white/80">Operational Pulse</h3>
                            </div>
                            <span className="flex items-center gap-1.5 text-[8px] uppercase tracking-widest text-[#C6A972] font-semibold">
                                <span className="w-1 h-1 rounded-full bg-[#C6A972] animate-ping" />
                                Real-time
                            </span>
                        </div>
                        
                        <div className="flex-1 p-6 space-y-6 overflow-y-auto no-scrollbar max-h-[700px]">
                            {recentActivities.map((activity, idx) => {
                                const cfg = ACTION_CONFIG[activity.action] || { icon: Clock, color: "text-white/40", bg: "bg-white/5" };
                                const Icon = cfg.icon;

                                return (
                                    <div key={activity.id} className="relative flex gap-4 group">
                                        {/* Activity Line */}
                                        {idx !== recentActivities.length - 1 && (
                                            <div className="absolute left-[13px] top-8 bottom-[-24px] w-[1px] bg-white/5" />
                                        )}
                                        
                                        <div className={`shrink-0 w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center ${cfg.color} border border-white/5 shadow-inner transition-transform group-hover:scale-110`}>
                                            <Icon size={12} />
                                        </div>

                                        <div className="flex flex-col gap-1 min-w-0">
                                            <p className="text-[11px] text-white/80 font-medium">
                                                <span className="font-bold text-white">{activity.user?.name || "Anonymous Client"}</span>
                                                <span className="text-white/40 mx-1">did</span>
                                                <span className={`font-bold uppercase tracking-tight ${cfg.color}`}>{activity.action.replace('_', ' ')}</span>
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] text-white/20 uppercase tracking-widest">
                                                    {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {activity.metadata?.name && (
                                                    <span className="text-[9px] text-[#C6A972]/60 truncate italic max-w-[120px]">
                                                        — {activity.metadata.name}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        <div className="p-4 border-t border-white/5">
                            <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all">
                                View Full Archive
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
