"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ShoppingBag, Search, Package, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const MOCK_ORDERS = [
    { id: "NOIR-7192-X", date: "Jan 12, 2026", status: "Delivered", total: "₹92,400", items: 2 },
    { id: "NOIR-2810-Q", date: "Feb 04, 2026", status: "In Transit", total: "₹45,000", items: 1 },
];export default function OrdersPage() {
    return (
        <DashboardLayout>
            <div className="space-y-16">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-10 pb-12 border-b border-white/5 relative">
                    <div className="absolute -left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-noir-gold/0 via-noir-gold/20 to-noir-gold/0" />
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="flex h-2 w-2 rounded-full bg-noir-gold animate-pulse" />
                            <h2 className="text-noir-gold uppercase tracking-[0.6em] text-[10px] font-black italic">
                                Asset Registry / Global Tracking
                            </h2>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-playfair text-white tracking-tight leading-tight">
                            The Sovereign <br />
                            <span className="italic text-white/90">Registry</span>
                        </h1>
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black max-w-md leading-relaxed">
                            A historical ledger of your acquired artifacts, permanently synchronized with the Maison's private archive.
                        </p>
                    </div>
                    
                    <div className="relative group min-w-[320px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors duration-500" size={18} />
                        <input
                            type="text"
                            placeholder="Find Asset Identifier..."
                            className="w-full bg-white/5 border border-white/5 px-16 py-6 rounded-2xl text-[10px] uppercase tracking-[0.3em] outline-none focus:border-noir-gold/30 transition-all font-inter text-white/60 backdrop-blur-xl"
                        />
                    </div>
                </header>

                {MOCK_ORDERS.length === 0 ? (
                    <div className="py-40 flex flex-col items-center text-center opacity-40">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                            <Package size={36} strokeWidth={1} />
                        </div>
                        <p className="font-playfair text-2xl text-white mb-3 italic tracking-tight">Archives Unpopulated</p>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 max-w-xs leading-relaxed">Permanent records will manifest here upon successful acquisition.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-10">
                        {MOCK_ORDERS.map((order, i) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="group relative"
                            >
                                {/* GLITCH OVERLAY BACKGROUND */}
                                <div className="absolute inset-0 bg-noir-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[2.5rem] -inline-flex" />
                                
                                <div className="glass-effect bg-noir-surface/40 p-10 md:p-14 rounded-[2.5rem] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-12 group hover:border-noir-gold/20 transition-all duration-700 relative overflow-hidden backdrop-blur-sm">
                                    
                                    {/* ASSET PREVIEW PIN */}
                                    <div className="flex items-center gap-10 relative z-10 w-full lg:w-auto">
                                        <div className="relative flex-shrink-0">
                                            <div className="absolute inset-0 bg-noir-gold/20 blur-2xl rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-1000" />
                                            <div className={`w-24 h-24 rounded-[2rem] flex items-center justify-center border border-white/10 ${order.status === "Delivered" ? "bg-green-500/5 text-green-500/60" : "bg-noir-gold/5 text-noir-gold/60"
                                                } relative z-10 group-hover:rotate-6 transition-transform duration-700`}>
                                                {order.status === "Delivered" ? <Package size={40} strokeWidth={0.5} /> : <Truck size={40} strokeWidth={0.5} />}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-noir-black border border-white/10 rounded-full flex items-center justify-center text-white/20 text-[6px] font-black italic">
                                                NFT
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-[9px] uppercase tracking-[0.4em] text-white/30 font-black">Archive ID</h3>
                                                <div className="h-[1px] w-8 bg-noir-gold/20" />
                                            </div>
                                            <p className="text-3xl font-playfair text-white tracking-[0.2em] uppercase leading-none">{order.id}</p>
                                            <div className="flex items-center gap-6">
                                                <span className={`text-[8px] uppercase tracking-widest px-4 py-1.5 border rounded-full font-black ${order.status === "Delivered" ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-noir-gold/20 text-noir-gold bg-noir-gold/5"
                                                    }`}>
                                                    {order.status}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-widest text-white/20 font-medium">Synced: 0.2ms</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* METADATA CLUSTER */}
                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-12 lg:gap-20 border-l border-white/5 lg:px-16 relative z-10">
                                        <div className="space-y-3">
                                            <h3 className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-black">Registered</h3>
                                            <p className="text-[11px] font-inter text-white/80 font-medium tracking-widest uppercase">{order.date}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <h3 className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-black">Capital Investment</h3>
                                            <p className="text-[11px] font-inter text-noir-gold font-black tracking-[0.2em]">{order.total}</p>
                                        </div>
                                        <div className="hidden md:block space-y-3">
                                            <h3 className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-black">Authenticity</h3>
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-1 rounded-full bg-green-500" />
                                                <p className="text-[10px] font-inter text-white/40 font-bold tracking-widest uppercase">Verified Ledger</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="flex flex-row lg:flex-col gap-4 relative z-10 w-full lg:w-auto mt-4 lg:mt-0 pt-8 lg:pt-0 lg:border-l border-white/5 lg:pl-12">
                                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-4 bg-white/5 border border-white/5 hover:border-noir-gold/30 hover:bg-noir-gold hover:text-noir-black px-8 py-4 rounded-xl text-[9px] uppercase tracking-[0.3em] font-black transition-all duration-500 group/btn">
                                            Asset Details
                                            <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                        </button>
                                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-4 bg-transparent border border-white/10 hover:border-white/30 text-white/40 hover:text-white px-8 py-4 rounded-xl text-[9px] uppercase tracking-[0.3em] font-black transition-all duration-500">
                                            Certificate
                                        </button>
                                    </div>

                                    {/* HOVER GLOSS EFFECT */}
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-noir-gold/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-1000" />
                                    <div className="absolute bottom-[-10%] right-[-10%] opacity-0 group-hover:opacity-[0.03] transition-opacity duration-1000 rotate-12">
                                        <Package size={240} strokeWidth={0.2} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
