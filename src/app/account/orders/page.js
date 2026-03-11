"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ShoppingBag, Search, Package, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const MOCK_ORDERS = [
    { id: "NOIR-7192-X", date: "Jan 12, 2026", status: "Delivered", total: "₹92,400", items: 2 },
    { id: "NOIR-2810-Q", date: "Feb 04, 2026", status: "In Transit", total: "₹45,000", items: 1 },
];

export default function OrdersPage() {
    return (
        <DashboardLayout>
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="space-y-2">
                        <h2 className="text-gradient-gold uppercase tracking-[0.4em] text-[10px] md:text-xs font-inter mb-4">
                            Purchase History
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-playfair text-white tracking-tight">
                            The Archives
                        </h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-medium italic">
                            Tracking your global acquisitions
                        </p>
                    </div>
                    <div className="relative group min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Find Order Identifier..."
                            className="w-full bg-noir-surface/40 border border-white/5 px-12 py-4 rounded-xl text-[10px] uppercase tracking-widest outline-none focus:border-noir-gold/40 transition-all font-inter text-white/60"
                        />
                    </div>
                </header>

                {MOCK_ORDERS.length === 0 ? (
                    <div className="py-40 flex flex-col items-center text-center opacity-40">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
                            <Package size={32} strokeWidth={1} />
                        </div>
                        <p className="font-playfair text-xl text-white mb-2 italic">Awaits Your Commands</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/30">Your purchase history is currently unpopulated.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {MOCK_ORDERS.map((order, i) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-effect bg-noir-surface/40 p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 group hover:border-noir-gold/20 transition-all cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-noir-gold/0 via-transparent to-transparent group-hover:from-noir-gold/[0.02] transition-colors" />

                                <div className="flex items-center gap-6 relative z-10">
                                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border border-white/10 ${order.status === "Delivered" ? "bg-green-500/10 text-green-500" : "bg-noir-gold/10 text-noir-gold"
                                        } shadow-lg shadow-black/40`}>
                                        {order.status === "Delivered" ? <Package size={24} strokeWidth={1.5} /> : <Truck size={24} strokeWidth={1.5} />}
                                    </div>
                                    <div>
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1 font-bold">Identifer</h3>
                                        <p className="text-lg font-playfair text-white tracking-widest uppercase">{order.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 relative z-10">
                                    <div>
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1 font-bold">Acquisition Date</h3>
                                        <p className="text-xs font-inter text-white font-medium">{order.date}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1 font-bold">Investment</h3>
                                        <p className="text-xs font-inter text-noir-gold font-bold tracking-widest">{order.total}</p>
                                    </div>
                                    <div className="hidden md:block">
                                        <h3 className="text-[9px] uppercase tracking-[0.3em] text-white/30 mb-1 font-bold">Stage</h3>
                                        <span className={`text-[8px] uppercase tracking-widest px-3 py-1 border rounded-full font-black ${order.status === "Delivered" ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-noir-gold/20 text-noir-gold bg-noir-gold/5"
                                            }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>

                                <button className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/30 hover:text-white transition-all group/btn pl-4 border-l border-white/5 relative z-10 font-black">
                                    Details
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>

                                {/* Hover Glow Accent */}
                                <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-noir-gold scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-500" />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
