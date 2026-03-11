"use client";

import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Truck,
    Package,
    MoreHorizontal,
    ArrowUpRight,
    SearchCheck,
    Calendar,
    Clock,
    DollarSign,
    ExternalLink
} from "lucide-react";

const MOCK_ADMIN_ORDERS = [
    { id: "NOIR-7192-X", customer: "Alexander Sterling", date: "Mar 10, 2026", status: "Paid", total: "₹92,400", items: 2, email: "alex@sterling.com" },
    { id: "NOIR-2810-Q", customer: "Bianca Valesca", date: "Mar 09, 2026", status: "In Transit", total: "₹45,000", items: 1, email: "b.valesca@maison.com" },
    { id: "NOIR-9021-P", customer: "Guest Client (9021)", date: "Mar 08, 2026", status: "Pending", total: "₹1,24,000", items: 3, email: "guest_291@noir.local" },
    { id: "NOIR-4412-Z", customer: "Lucien Noir", date: "Mar 07, 2026", status: "Delivered", total: "₹68,500", items: 1, email: "l.noir@exclusive.com" },
];

const STATUS_COLORS = {
    "Paid": "text-green-500 border-green-500/20 bg-green-500/5",
    "In Transit": "text-noir-gold border-noir-gold/20 bg-noir-gold/5",
    "Pending": "text-white/40 border-white/5 bg-white/[0.02]",
    "Delivered": "text-blue-500 border-blue-500/20 bg-blue-500/5",
};

export default function AdminOrders() {
    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h2 className="text-noir-gold uppercase tracking-[0.4em] text-[10px] font-bold">Acquisition Insight</h2>
                    <h1 className="text-4xl font-playfair text-white tracking-tight">Financial Archives</h1>
                </div>
                <div className="flex gap-4">
                    <button className="glass-effect bg-white/5 border border-white/5 px-6 py-4 rounded-xl text-[10px] uppercase tracking-widest text-white/70 hover:text-white transition-all flex items-center gap-2">
                        Export Report
                        <ArrowUpRight size={14} />
                    </button>
                </div>
            </header>

            {/* Financial Overview Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Daily Transactions", value: "₹2,61,400", icon: DollarSign },
                    { label: "Pending Fulfillment", value: "14 Orders", icon: Package },
                    { label: "Transit Logistics", value: "08 Consignments", icon: Truck },
                ].map((tile, i) => (
                    <div key={i} className="glass-effect bg-noir-surface/40 p-6 rounded-2xl border border-white/5 flex items-center gap-6 group hover:border-noir-gold/20 transition-all">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-noir-gold shadow-lg shadow-black/40">
                            <tile.icon size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{tile.label}</p>
                            <h3 className="text-xl font-playfair text-white tracking-wider">{tile.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orders Management Table */}
            <div className="glass-effect bg-noir-surface/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="relative group w-96">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Locate acquisition record..."
                            className="w-full bg-noir-black/40 border border-white/5 px-16 py-4 rounded-xl text-[11px] uppercase tracking-widest outline-none focus:border-noir-gold/20 transition-all font-inter text-white/60 placeholder:text-white/20"
                        />
                    </div>
                    <button className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2">
                        <Filter size={16} />
                        Sort by Acquisition Date
                    </button>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Order Identifier</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Acquirer</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Stage</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Investment</th>
                            <th className="px-10 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30 text-right">Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {MOCK_ADMIN_ORDERS.map((order, i) => (
                            <motion.tr
                                key={order.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group hover:bg-white/[0.03] transition-colors"
                            >
                                <td className="px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-white/5 rounded-lg border border-white/10 text-white/40 group-hover:text-noir-gold transition-colors">
                                            <SearchCheck size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-playfair text-white tracking-widest uppercase">{order.id}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1 flex items-center gap-2">
                                                <Calendar size={10} /> {order.date}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-sm text-white font-medium">{order.customer}</p>
                                    <p className="text-[9px] lowercase tracking-widest text-white/20 mt-1 font-inter">{order.email}</p>
                                </td>
                                <td className="px-10 py-8">
                                    <span className={`text-[9px] uppercase tracking-widest px-3 py-1.5 border rounded-full font-black ${STATUS_COLORS[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-10 py-8">
                                    <p className="text-xs font-inter text-noir-gold font-bold tracking-widest">{order.total}</p>
                                    <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">{order.items} items acquired</p>
                                </td>
                                <td className="px-10 py-8">
                                    <div className="flex items-center justify-end">
                                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white/40 hover:text-white transition-all shadow-lg flex items-center justify-center">
                                            <ExternalLink size={14} />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="p-10 bg-noir-gold/5 border border-noir-gold/10 rounded-3xl flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-noir-gold/10 rounded-full flex items-center justify-center text-noir-gold shadow-2xl shadow-noir-gold/20">
                        <Clock size={32} strokeWidth={1} />
                    </div>
                    <div>
                        <h3 className="text-xl font-playfair text-white tracking-tight italic">Fulfillment Cadence</h3>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mt-1 font-medium">Average processing duration for recent acquisitions: <span className="text-noir-gold font-bold">14.2 Hours</span></p>
                    </div>
                </div>
                <button className="text-[10px] uppercase tracking-[0.3em] font-black text-noir-gold hover:text-white transition-colors flex items-center gap-3 pr-4 group">
                    Audit Logistics
                    <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
