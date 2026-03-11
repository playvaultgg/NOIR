"use client";

import { motion } from "framer-motion";
import {
    TrendingUp,
    ArrowUpRight,
    ShoppingBag,
    Users,
    DollarSign,
    Package,
    ArrowDownRight,
    Activity
} from "lucide-react";

const STATS = [
    { label: "Gross Revenue", value: "₹1,24,000", change: "+12.5%", trand: "up", icon: DollarSign, color: "text-green-500" },
    { label: "Active Orders", value: "12", change: "+4", trand: "up", icon: ShoppingBag, color: "text-noir-gold" },
    { label: "New Customers", value: "48", change: "+18%", trand: "up", icon: Users, color: "text-blue-500" },
    { label: "Inventory Levels", value: "94%", change: "-2%", trand: "down", icon: Package, color: "text-noir-gold" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-12">
            <header className="flex flex-col gap-2">
                <h2 className="text-noir-gold uppercase tracking-[0.4em] text-[10px] font-bold">Commerce Intelligence</h2>
                <h1 className="text-4xl font-playfair text-white tracking-tight">Executive Overview</h1>
            </header>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {STATS.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-effect bg-noir-surface/40 p-8 rounded-2xl border border-white/5 relative overflow-hidden group hover:border-noir-gold/20 transition-all shadow-2xl"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`p-3 bg-white/5 rounded-xl border border-white/10 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest font-black flex items-center gap-1 ${stat.trand === "up" ? "text-green-500" : "text-red-500"
                                }`}>
                                {stat.change}
                                {stat.trand === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </span>
                        </div>

                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-playfair text-white">{stat.value}</h3>

                        <div className="absolute right-[-10%] bottom-[-10%] opacity-0 group-hover:opacity-[0.03] transition-opacity">
                            <stat.icon size={120} strokeWidth={1} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Revenue Visualization Placeholder */}
                <div className="xl:col-span-2 glass-effect bg-noir-surface/20 rounded-3xl p-10 border border-white/5 border-dashed min-h-[450px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center gap-4">
                            <Activity className="text-noir-gold" size={20} />
                            <h3 className="text-xl font-playfair text-white italic">Sales Trajectory</h3>
                        </div>
                        <div className="flex gap-4">
                            {["7D", "1M", "1Y"].map(period => (
                                <button key={period} className="text-[9px] uppercase tracking-widest text-white/30 hover:text-white px-3 py-1 rounded-full border border-white/5 hover:border-white/20 transition-all">
                                    {period}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center text-center opacity-20">
                        <div className="space-y-4">
                            <TrendingUp size={48} strokeWidth={1} className="mx-auto" />
                            <p className="text-[10px] uppercase tracking-[0.3em]">Ingesting Real-time Market Data...</p>
                        </div>
                    </div>
                </div>

                {/* Recent Inventory Alerts */}
                <div className="glass-effect bg-noir-surface/40 rounded-3xl p-8 border border-white/5 flex flex-col">
                    <h3 className="text-xl font-playfair text-white italic mb-8">Stock Sentinel</h3>
                    <div className="space-y-6">
                        {[
                            { item: "Onyx Silk Trench", status: "Low Stock", qty: 2, color: "text-red-500" },
                            { item: "Elite Calfskin Boots", status: "Critical", qty: 1, color: "text-red-600 font-bold" },
                            { item: "Noir Cashmere Sweater", status: "Optimized", qty: 12, color: "text-green-500/60" },
                        ].map((alert, i) => (
                            <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                                <div>
                                    <p className="text-sm text-white font-medium">{alert.item}</p>
                                    <p className={`text-[9px] uppercase tracking-widest mt-1 ${alert.color}`}>{alert.status}</p>
                                </div>
                                <span className="text-xs font-inter text-white/40">Qty: {alert.qty}</span>
                            </div>
                        ))}
                    </div>
                    <button className="mt-auto w-full py-4 text-[10px] uppercase tracking-[0.3em] font-black text-noir-gold border border-noir-gold/20 rounded-xl hover:bg-noir-gold hover:text-noir-black transition-all">
                        Inventory Audit
                    </button>
                </div>
            </div>
        </div>
    );
}
