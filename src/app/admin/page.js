import prisma from "@/lib/prisma";
import { ArrowUpRight, ArrowDownRight, Users, CreditCard, Package, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Analytics gathering
    const [totalUsers, totalOrders, totalProducts, orders] = await Promise.all([
        prisma.user.count(),
        prisma.order.count(),
        prisma.product.count(),
        prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: true }
        })
    ]);

    const revenue = await prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { not: "CANCELLED" } }
    });
    
    const formattedRevenue = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(revenue._sum.totalAmount || 0);

    const kpis = [
        { label: "Total Revenue", value: formattedRevenue, trend: "+12.5%", isUp: true, icon: TrendingUp },
        { label: "Total Orders", value: totalOrders.toString(), trend: "+5.2%", isUp: true, icon: CreditCard },
        { label: "Active Users", value: totalUsers.toString(), trend: "+18.1%", isUp: true, icon: Users },
        { label: "Active Items", value: totalProducts.toString(), trend: "-2.4%", isUp: false, icon: Package },
    ];

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-playfair text-white italic">Intelligence</h1>
                <p className="text-white/40 text-sm mt-1">Real-time commerce overview.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                    <div key={i} className="glass-effect p-6 rounded-2xl border border-white/5 bg-noir-surface/40 hover:bg-noir-surface transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-xl text-[#C6A972]">
                                <kpi.icon size={20} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-bold ${kpi.isUp ? "text-emerald-400" : "text-rose-400"}`}>
                                {kpi.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {kpi.trend}
                            </div>
                        </div>
                        <h3 className="text-white/40 text-[10px] uppercase tracking-widest font-bold mb-1">{kpi.label}</h3>
                        <p className="text-3xl font-inter font-semibold text-white tracking-tight">{kpi.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts & Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 glass-effect p-8 rounded-2xl border border-white/5 bg-noir-surface/40 overflow-hidden">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-6">Recent Transactions</h2>
                    
                    <div className="overflow-x-auto no-scrollbar">
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead>
                                <tr className="text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5">
                                    <th className="pb-4 font-semibold">Order ID</th>
                                    <th className="pb-4 font-semibold">Client</th>
                                    <th className="pb-4 font-semibold">Date</th>
                                    <th className="pb-4 font-semibold">Status</th>
                                    <th className="pb-4 font-semibold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {orders.length === 0 ? (
                                    <tr><td colSpan="5" className="py-8 text-center text-white/20 text-xs italic">No recent transactions.</td></tr>
                                ) : orders.map((order) => (
                                    <tr key={order.id} className="text-sm text-white-[#C6A972] hover:text-black hover:border-[#C6A972]/[0.02] transition-colors">
                                        <td className="py-4 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                                        <td className="py-4">{order.user?.name || "Client"}</td>
                                        <td className="py-4 text-white/40 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 text-[9px] uppercase tracking-widest rounded-md font-bold ${
                                                order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-400" :
                                                order.status === "PENDING" ? "bg-amber-500/10 text-amber-400" :
                                                order.status === "CANCELLED" ? "bg-rose-500/10 text-rose-400" :
                                                "bg-blue-500/10 text-blue-400"
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right font-medium text-[#C6A972]">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sales Visualizer (CSS driven) */}
                <div className="glass-effect p-8 rounded-2xl border border-white/5 bg-noir-surface/40">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-6">Revenue Velocity</h2>
                    
                    <div className="flex items-end justify-between h-48 gap-2 mt-4 pt-4 border-b border-white/5">
                        {/* Mock chart bars */}
                        {[30, 45, 25, 60, 50, 85, 75].map((height, idx) => (
                            <div key={idx} className="w-full flex flex-col items-center gap-3 group h-full justify-end">
                                <div 
                                    className="w-full bg-white/10 rounded-t group-hover:bg-[#C6A972] transition-colors relative"
                                    style={{ height: `${height}%` }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-[#C6A972] opacity-0 group-hover:opacity-100 transition-opacity">
                                        {height}k
                                    </span>
                                </div>
                                <span className="text-[9px] text-white/30 uppercase font-black">
                                    {['M','T','W','T','F','S','S'][idx]}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8">
                        <div className="flex justify-between text-xs text-white/40 mb-3 uppercase tracking-widest font-bold">
                            <span>Monthly Target</span>
                            <span className="text-[#C6A972]">75%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-transparent via-[#C6A972] to-[#C6A972] w-[75%] rounded-full shadow-[0_0_10px_#C6A972]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
