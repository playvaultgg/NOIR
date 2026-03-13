"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useState, useEffect } from "react";
import {
    ShoppingBag,
    Heart,
    Clock,
    ArrowUpRight,
    TrendingUp,
    CreditCard,
    Target,
    User,
    Zap,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountOverview() {
    const { data: session } = useSession();
    const { items: cartItems } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();
    const [stats, setStats] = useState({
        orderCount: 0,
        wishlistCount: 0,
        lastOrders: [],
        avatarStatus: "AWAITING_SCAN",
        loyaltyLevel: "BRONZE"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/user/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Failed to synchronize telemetry:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const DISPLAY_STATS = [
        { label: "Active Selection", value: cartItems.length, icon: ShoppingBag, color: "text-noir-gold" },
        { label: "Wishlist Collection", value: stats.wishlistCount, icon: Heart, color: "text-red-500/60" },
        { label: "Completed Orders", value: stats.orderCount, icon: Clock, color: "text-white/40" },
        { label: "Loyalty Level", value: stats.loyaltyLevel, icon: Target, color: "text-noir-gold" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-16">
                <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pb-12 border-b border-white/5 relative">
                    <div className="absolute -left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-noir-gold/0 via-noir-gold/20 to-noir-gold/0" />
                    
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="flex h-2 w-2 rounded-full bg-noir-gold animate-ping" />
                            <h2 className="text-noir-gold uppercase tracking-[0.6em] text-[10px] font-black italic">
                                Identity Protocol / Synchronized
                            </h2>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-playfair text-white tracking-tight leading-tight">
                            Status Overview: <br />
                            <span className="italic text-white/90">{session?.user?.name || "Refined Collector"}</span>
                        </h1>
                    </div>
                    
                    <div className="flex flex-col items-end gap-6">
                        <div className="bg-white/5 border border-white/10 px-8 py-6 rounded-2xl backdrop-blur-xl group hover:border-noir-gold/30 transition-all duration-500">
                            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-3">Sovereign Clearance</p>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-playfair text-noir-gold tracking-widest uppercase">
                                    {stats.loyaltyLevel === "GOLD" ? "Level IX" : stats.loyaltyLevel === "SILVER" ? "Level VI" : "Level III"}
                                </span>
                                <div className="flex gap-1">
                                    {Array.from({ length: stats.loyaltyLevel === "GOLD" ? 9 : stats.loyaltyLevel === "SILVER" ? 6 : 3 }).map((_, i) => (
                                        <div key={i} className="w-1 h-4 bg-noir-gold rounded-full" />
                                    ))}
                                    {Array.from({ length: 9 - (stats.loyaltyLevel === "GOLD" ? 9 : stats.loyaltyLevel === "SILVER" ? 6 : 3) }).map((_, i) => (
                                        <div key={i} className="w-1 h-4 bg-white/10 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* DYNAMIC METRIC ARRAY */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {DISPLAY_STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1, duration: 0.8 }}
                            className="relative group cursor-default"
                        >
                            <div className="absolute inset-0 bg-noir-gold/0 group-hover:bg-noir-gold/[0.02] transition-colors rounded-3xl" />
                            <div className="bg-white/5 border border-white/5 p-10 rounded-3xl relative overflow-hidden backdrop-blur-sm">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-30 transition-all group-hover:scale-110 duration-700">
                                    <stat.icon size={80} strokeWidth={0.5} />
                                </div>
                                <p className="text-[9px] uppercase tracking-[0.5em] text-white/30 font-black mb-10">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <h3 className="text-5xl font-playfair text-white tracking-tighter leading-none">
                                        {loading ? "..." : stat.value}
                                    </h3>
                                    <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${stat.color}`}>
                                        <stat.icon size={18} />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ARCHIVAL PORTALS */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* DIGITAL PERSONA - SCANNER EFFECT */}
                    <Link href="/avatar" className="lg:col-span-2 group relative overflow-hidden rounded-[3rem] bg-noir-surface/40 border border-white/5 p-10 md:p-16 transition-all duration-700 hover:border-noir-gold/20">
                        {/* SCANNER LINE */}
                        <motion.div 
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-noir-gold/40 to-transparent z-20 pointer-events-none" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-noir-gold/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        
                        <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                            <div className="w-64 h-80 bg-white/5 rounded-[2rem] border border-white/10 relative overflow-hidden flex items-center justify-center group-hover:border-noir-gold/30 transition-colors duration-500">
                                <div className="absolute inset-x-8 top-12 bottom-12 border border-noir-gold/20 rounded-xl opacity-20" />
                                <User size={120} strokeWidth={0.5} className="text-white/10 group-hover:text-noir-gold/40 transition-colors duration-1000" />
                                <div className="absolute bottom-4 left-0 right-0 text-center uppercase tracking-[0.4em] text-[8px] text-white/20 font-black">Biometric Sync</div>
                            </div>
                            
                            <div className="flex-1 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-4xl md:text-6xl font-playfair text-white italic tracking-tight">Identity Synthesis</h3>
                                    <p className="text-white/40 text-[11px] uppercase tracking-[0.3em] leading-relaxed max-w-lg">
                                        Synchronize your physical silhouette with the digital void. Your virtual twin enables high-fidelity try-ons and personalized fit predictions within the Maison's private atelier.
                                    </p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="h-12 w-[2px] bg-noir-gold opacity-40" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-noir-gold font-black mb-1">Status</p>
                                        <p className="text-[9px] uppercase tracking-widest text-white/60">
                                            {stats.avatarStatus === "SYNCHRONIZED" ? "High-Res Scan Verified" : "Awaiting Biometric Scan"}
                                        </p>
                                    </div>
                                </div>
                                <div className="pt-8 flex items-center gap-4 text-white/20 group-hover:text-white transition-colors duration-500">
                                    <span className="text-[10px] uppercase tracking-[0.6em] font-black">Initialize Protocol</span>
                                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-500" />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* RECENT ACQUISITIONS TILE */}
                    <div className="bg-noir-surface/20 rounded-[3rem] p-10 border border-white/5 flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-playfair text-white italic">Registry</h3>
                                <div className="flex gap-1">
                                    <div className="w-1 h-1 rounded-full bg-noir-gold animate-pulse" />
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                    <div className="w-1 h-1 rounded-full bg-white/20" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                {stats.lastOrders.length > 0 ? (
                                    stats.lastOrders.map(order => (
                                        <div key={order.id} className="flex gap-4 items-center">
                                            <div className="w-12 h-16 bg-white/5 rounded-lg border border-white/10 overflow-hidden">
                                                <img 
                                                    src={order.orderitem[0]?.product?.imageUrls ? JSON.parse(order.orderitem[0].product.imageUrls)[0] : "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=200&fit=crop"} 
                                                    className="w-full h-full object-cover opacity-60"
                                                    alt="Order Item"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <div className="text-[10px] text-white/80 font-inter font-semibold tracking-tight">MN-{order.id.slice(-6).toUpperCase()}</div>
                                                <div className="text-[8px] text-white/30 uppercase tracking-widest">
                                                    {new Date(order.createdAt).toLocaleDateString()} · ₹{order.totalAmount.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="space-y-8 opacity-40 group-hover:opacity-60 transition-opacity">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-12 h-16 bg-white/5 rounded-lg border border-white/10" />
                                            <div className="space-y-2">
                                                <div className="w-24 h-2 bg-white/10 rounded-full" />
                                                <div className="w-16 h-2 bg-white/5 rounded-full" />
                                            </div>
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-white/30 italic text-center py-4">No Recent Acquisitions Tracked</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Link href="/account/orders" className="pt-8 border-t border-white/5 text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-white transition-all flex items-center justify-between group/link">
                            Expand Registry 
                            <ArrowRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                        </Link>
                    </div>
                </div>

                {/* GLOBAL NETWORK STATUS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8">
                    <div className="glass-effect bg-noir-surface/40 p-10 rounded-[2.5rem] border border-white/5 relative group">
                        <div className="flex items-center gap-6 mb-8">
                            <TrendingUp className="text-noir-gold" size={24} />
                            <h3 className="text-xl font-playfair text-white tracking-tight">Privilege Network</h3>
                        </div>
                        <div className="space-y-6">
                            {["Global Priority Lane", "Designer Direct-Link", "Digital Certificate Vault"].map((benefit, i) => (
                                <div key={benefit} className="flex items-center justify-between group/item">
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover/item:text-white transition-colors">{benefit}</span>
                                    <div className="w-2 h-2 rounded-full border border-noir-gold/40 group-hover/item:bg-noir-gold transition-all" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-effect bg-noir-surface/40 p-10 rounded-[2.5rem] border border-white/5 flex items-center gap-8 group hover:border-noir-gold/20 transition-all cursor-pointer">
                        <div className="w-20 h-20 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-white/20 group-hover:text-noir-gold transition-all duration-700 border border-white/5 group-hover:border-noir-gold/20 rotate-45 group-hover:rotate-0">
                            <CreditCard size={32} strokeWidth={1} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-playfair text-white tracking-tight">Ledger Profile</h3>
                            <p className="text-[10px] uppercase tracking-widest text-noir-gold font-black mt-2">Verified Payment Protocol</p>
                        </div>
                        <ArrowRight className="text-white/10 group-hover:text-white transition-colors" size={24} />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
