"use client";

import { motion } from "framer-motion";
import {
    Search,
    Filter,
    User,
    Mail,
    Calendar,
    Award,
    Star,
    ArrowUpRight,
    MoreHorizontal,
    ShoppingBag
} from "lucide-react";

const MOCK_CUSTOMERS = [
    { name: "Alexander Sterling", email: "alex@sterling.com", orders: 12, spent: "₹8,45,000", joined: "Jan 2026", status: "GOLD", id: "u1" },
    { name: "Bianca Valesca", email: "b.valesca@maison.com", orders: 8, spent: "₹4,12,000", joined: "Feb 2026", status: "SILVER", id: "u2" },
    { name: "Julian Thorne", email: "j.thorne@noir.local", orders: 3, spent: "₹1,85,000", joined: "Mar 2026", status: "BRONZE", id: "u3" },
    { name: "Elena Rossi", email: "e.rossi@vogue.it", orders: 1, spent: "₹92,000", joined: "Mar 2026", status: "BRONZE", id: "u4" },
];

const TIER_COLORS = {
    "GOLD": "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
    "SILVER": "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
    "BRONZE": "text-amber-700 bg-amber-700/10 border-amber-700/20",
};

export default function AdminCustomers() {
    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h2 className="text-noir-gold uppercase tracking-[0.4em] text-[10px] font-bold">Collector Insights</h2>
                    <h1 className="text-4xl font-playfair text-white tracking-tight">Community Curation</h1>
                </div>
                <div className="flex gap-4">
                    <button className="glass-effect bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-noir-gold hover:text-noir-black transition-all flex items-center gap-2">
                        Export CRM Data
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </header>

            {/* Loyalty Distribution Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Total Collectors", value: "1,240", icon: User },
                    { label: "Elite Tier (Gold)", value: "128", icon: Award },
                    { label: "Silver Retainers", value: "342", icon: Star },
                    { label: "Active Engagement", value: "84%", icon: ShoppingBag },
                ].map((stat, i) => (
                    <div key={i} className="glass-effect bg-noir-surface/40 p-6 rounded-2xl border border-white/5 group hover:border-noir-gold/20 transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-white/30 group-hover:text-noir-gold transition-colors">
                                <stat.icon size={18} />
                            </div>
                            <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold">+12%</span>
                        </div>
                        <p className="text-[9px] uppercase tracking-widest text-white/20 mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-playfair text-white tracking-wider">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* Customers Data Table */}
            <div className="glass-effect bg-noir-surface/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="relative group w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Locate collector record..."
                            className="w-full bg-noir-black/40 border border-white/5 px-16 py-4 rounded-xl text-[11px] uppercase tracking-widest outline-none focus:border-noir-gold/20 transition-all font-inter text-white/60 placeholder:text-white/20"
                        />
                    </div>
                    <div className="flex gap-6">
                        <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                            <Filter size={16} />
                            Tier Distribution
                        </button>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Collector</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Contact</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Maison Tier</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">LTV (Lifetime Value)</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_CUSTOMERS.map((customer, i) => (
                            <motion.tr
                                key={customer.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/[0.03] transition-colors"
                            >
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-noir-gold/10 rounded-full flex items-center justify-center border border-noir-gold/20 text-noir-gold font-playfair font-black text-sm">
                                            {customer.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-playfair text-white tracking-wide">{customer.name}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1 flex items-center gap-2 lowercase italic">
                                                <Calendar size={10} /> Joined {customer.joined}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-[10px] font-inter text-white/40 group-hover:text-white transition-colors flex items-center gap-3">
                                        <Mail size={12} className="text-noir-gold/40" />
                                        {customer.email}
                                    </p>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`text-[8px] uppercase tracking-[0.2em] px-3 py-1.5 border rounded-lg font-black ${TIER_COLORS[customer.status]}`}>
                                        {customer.status} MEMBER
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-xs font-inter text-noir-gold font-bold tracking-widest">{customer.spent}</p>
                                    <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">{customer.orders} acquisitions</p>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center justify-end">
                                        <button className="p-3 bg-white/5 hover:bg-white/20 border border-white/5 rounded-xl text-white/20 hover:text-white transition-all">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-effect bg-noir-surface/40 p-10 rounded-3xl border border-white/5 border-dashed flex flex-col items-center text-center">
                    <h3 className="text-lg font-playfair text-white italic mb-4">Elite Segment Engagement</h3>
                    <p className="text-sm font-inter text-white/30 max-w-xs leading-relaxed uppercase tracking-widest text-[10px]">
                        The top 10% of collectors contribute to 64% of total Maison revenue. High priority service is recommended for Tier: Gold assets.
                    </p>
                </div>
                <div className="glass-effect bg-noir-surface/40 p-10 rounded-3xl border border-white/5 border-dashed flex flex-col items-center text-center">
                    <h3 className="text-lg font-playfair text-white italic mb-4">Acquisition Velocity</h3>
                    <p className="text-sm font-inter text-white/30 max-w-xs leading-relaxed uppercase tracking-widest text-[10px]">
                        Customer return rate has increased by <span className="text-noir-gold font-bold">14.2%</span> following the implementation of Phase 3 Conversion Engines.
                    </p>
                </div>
            </div>
        </div>
    );
}
