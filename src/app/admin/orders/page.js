import prisma from "@/lib/prisma";
import { Search, Filter, MoreHorizontal, CheckCircle2, PackageSearch, XCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, _count: { select: { items: true } } }
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case "DELIVERED": return <CheckCircle2 size={14} className="text-emerald-400" />;
            case "PENDING": return <Clock size={14} className="text-amber-400" />;
            case "CANCELLED": return <XCircle size={14} className="text-rose-400" />;
            default: return <PackageSearch size={14} className="text-blue-400" />;
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-white italic">Order Registry</h1>
                    <p className="text-white/40 text-sm mt-1">Review transactions and fulfillment status.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C6A972] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="bg-noir-surface/40 border border-white/5 focus:border-[#C6A972] outline-none text-white text-sm pl-12 pr-4 py-2.5 rounded-xl transition-all"
                        />
                    </div>
                    <button className="bg-white/5 text-white/70 hover:bg-[#C6A972] hover:text-black hover:border-[#C6A972] transition-colors duration-300 px-5 py-2.5 rounded-xl border border-white/10 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </header>

            <div className="glass-effect rounded-2xl border border-white/5 bg-noir-surface/40 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 bg-black/20">
                                <th className="px-6 py-5 font-semibold">Order Hash</th>
                                <th className="px-6 py-5 font-semibold">Client Identity</th>
                                <th className="px-6 py-5 font-semibold">Date</th>
                                <th className="px-6 py-5 font-semibold">Status</th>
                                <th className="px-6 py-5 font-semibold">Total</th>
                                <th className="px-6 py-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-white/20 text-sm italic">
                                        No orders discovered in the system.
                                    </td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="text-sm text-white/70 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-white/50">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium group-hover:text-[#C6A972] transition-colors">{order.user?.name || "Guest Client"}</div>
                                        <div className="text-[10px] text-white/30 truncate max-w-[150px]">{order.user?.email || "Unknown"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs tracking-wider uppercase text-white/40">
                                        {new Date(order.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md w-fit border ${
                                            order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            order.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            order.status === "CANCELLED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        }`}>
                                            {getStatusIcon(order.status)}
                                            <span className="text-[9px] uppercase tracking-widest font-bold">{order.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#C6A972]">₹{order.totalAmount.toLocaleString('en-IN')} <span className="text-[10px] text-white/30 uppercase">({order._count.items} items)</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-[#C6A972] hover:text-black hover:border-transparent transition-colors text-[10px] uppercase font-bold tracking-widest">
                                                Update
                                            </button>
                                            <button className="p-2 hover:bg-[#C6A972] hover:text-black hover:border-transparent transition-colors" title="More">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
