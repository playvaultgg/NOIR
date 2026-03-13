import prisma from "@/lib/prisma";
import { Search, ShieldAlert, ShieldCheck, UserMinus, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminUsers() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: { 
            _count: { select: { orders: true, wishlist: true } },
            activities: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-white italic">Client Ledger</h1>
                    <p className="text-white/40 text-sm mt-1">Manage the Maison Noir clientele network.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C6A972] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Find client..."
                            className="bg-noir-surface/40 border border-white/5 focus:border-[#C6A972] outline-none text-white text-sm pl-12 pr-4 py-2.5 rounded-xl transition-all"
                        />
                    </div>
                </div>
            </header>

            <div className="glass-effect rounded-2xl border border-white/5 bg-noir-surface/40 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 bg-black/20">
                                <th className="px-6 py-5 font-semibold">Identity</th>
                                <th className="px-6 py-5 font-semibold">Role</th>
                                <th className="px-6 py-5 font-semibold">Joined Date</th>
                                <th className="px-6 py-5 font-semibold">Orders Issued</th>
                                <th className="px-6 py-5 font-semibold">Wishlisted</th>
                                <th className="px-6 py-5 font-semibold">Recent Pulse</th>
                                <th className="px-6 py-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="text-sm text-white/70 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-10 h-10 bg-white/5 rounded-full overflow-hidden shrink-0 border border-white/10 flex items-center justify-center font-bold font-playfair text-[#C6A972]">
                                                {user.image ? (
                                                    <Image src={user.image} alt={user.name || "User"} fill className="object-cover" />
                                                ) : (
                                                    user.name?.charAt(0) || "U"
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-white font-medium group-hover:text-[#C6A972] transition-colors">{user.name || "Anonymous Client"}</div>
                                                <div className="text-[10px] text-white/30 tracking-widest">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md w-fit border ${
                                            user.role === "ADMIN" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-white/50 border-white/10"
                                        }`}>
                                            {user.role === "ADMIN" ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                                            <span className="text-[9px] uppercase tracking-widest font-bold">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs tracking-wider uppercase text-white/40">
                                        {new Date(user.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-white/50">{user._count.orders}</td>
                                    <td className="px-6 py-4 font-mono text-[#C6A972]">{user._count.wishlist} Items</td>
                                    <td className="px-6 py-4">
                                        {user.activities?.[0] ? (
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-white font-bold uppercase tracking-wider">{user.activities[0].action}</span>
                                                <span className="text-[8px] text-white/30 uppercase">{new Date(user.activities[0].createdAt).toLocaleDateString()}</span>
                                            </div>
                                        ) : (
                                            <span className="text-[9px] text-white/10 uppercase tracking-widest italic">Dormant</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors" title="Deactivate">
                                                <UserMinus size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-[#C6A972] hover:text-black transition-colors rounded-lg text-white/60" title="More">
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
