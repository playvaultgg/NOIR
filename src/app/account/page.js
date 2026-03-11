"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import {
    ShoppingBag,
    Heart,
    Clock,
    ArrowUpRight,
    TrendingUp,
    CreditCard,
    Target,
    User,
    Zap
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AccountOverview() {
    const { data: session } = useSession();
    const { items: cartItems } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();

    const STATS = [
        { label: "Active Selection", value: cartItems.length, icon: ShoppingBag, color: "text-noir-gold" },
        { label: "Wishlist Collection", value: wishlistItems.length, icon: Heart, color: "text-red-500/60" },
        { label: "Completed Orders", value: 0, icon: Clock, color: "text-white/40" },
        { label: "Loyalty Level", value: "BRONZE", icon: Target, color: "text-noir-gold" },
    ];

    return (
        <DashboardLayout>
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="space-y-2">
                        <h2 className="text-gradient-gold uppercase tracking-[0.4em] text-[10px] md:text-xs font-inter mb-4">
                            Collector Dashboard
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-playfair text-white tracking-tight">
                            Greetings, {session?.user?.name?.split(' ')[0] || "Collector"}
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/collections">
                            <button className="glass-effect bg-white/5 border border-white/10 text-white/70 px-6 py-4 rounded-xl text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center gap-2">
                                Discover New Arrivals
                                <ArrowUpRight size={14} />
                            </button>
                        </Link>
                    </div>
                </header>

                {/* Dynamic Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-effect bg-noir-surface/40 p-8 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group"
                        >
                            <div className="absolute right-[-20%] bottom-[-20%] opacity-[0.02] group-hover:opacity-[0.05] transition-opacity">
                                <stat.icon size={160} strokeWidth={0.5} />
                            </div>

                            <div className={`p-3 bg-white/5 rounded-xl w-max mb-6 border border-white/10 ${stat.color} shadow-lg shadow-black/40`}>
                                <stat.icon size={22} strokeWidth={1.5} />
                            </div>

                            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-medium mb-1">
                                {stat.label}
                            </p>
                            <h3 className="text-3xl font-playfair text-white tracking-wider flex items-center gap-3">
                                {stat.value}
                                {stat.label === "Loyalty Level" && (
                                    <span className="text-[8px] px-2 py-0.5 border border-noir-gold/30 rounded-full text-noir-gold font-bold align-middle">
                                        MEMBERS ONLY
                                    </span>
                                )}
                            </h3>
                        </motion.div>
                    ))}
                </div>

                {/* Feature Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Phase 8.6: Digital Identity / Avatar Synthesis */}
                    <Link href="/avatar" className="glass-effect bg-noir-surface/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col justify-between group hover:border-noir-gold/20 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-noir-gold/5 blur-[80px] rounded-full pointer-events-none" />
                        <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                            <User size={240} strokeWidth={1} />
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.4em] font-black italic">
                                <Zap size={16} />
                                Phase 8.6 / Synthesis Engine
                            </div>
                            <h3 className="text-3xl md:text-5xl font-playfair text-white italic tracking-tight">Digital Persona</h3>
                            <p className="text-white/40 text-[11px] uppercase tracking-[0.3em] leading-relaxed max-w-sm">
                                Synchronize your physical silhouette with the digital void. Your virtual twin enables high-fidelity try-ons and personalized fit predictions.
                            </p>
                        </div>
                        
                        <div className="mt-12 group/btn flex items-center justify-between pb-4 border-b border-white/10 group-hover:border-noir-gold transition-colors duration-700">
                             <span className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black group-hover:text-white transition-all">Launch Identity Protocol</span>
                             <ArrowUpRight className="text-white/10 group-hover:text-noir-gold transition-all" size={20} />
                        </div>
                    </Link>

                    {/* Recent Orders Snapshot */}
                    <div className="glass-effect bg-noir-surface/20 rounded-3xl p-10 border border-white/5 border-dashed">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-playfair text-white italic">Recent Orders</h3>
                            <Link href="/account/orders" className="text-[10px] uppercase tracking-widest text-noir-gold hover:text-white transition-colors">
                                View Full History
                            </Link>
                        </div>

                        <div className="py-20 flex flex-col items-center text-center opacity-40">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-white/10">
                                <Clock size={32} strokeWidth={1} />
                            </div>
                            <p className="font-playfair text-lg text-white mb-2 italic">Awaits Your Commands</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/30">Your purchase history is currently unpopulated.</p>
                        </div>
                    </div>

                    {/* Security / Subscription Insight */}
                    <div className="space-y-8">
                        <div className="glass-effect bg-gradient-to-br from-noir-gold/20 via-transparent to-transparent bg-noir-surface/40 rounded-3xl p-10 border border-noir-gold/10 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <TrendingUp className="text-noir-gold" size={24} />
                                    <h3 className="text-xl font-playfair text-white tracking-tight">Concierge Benefits</h3>
                                </div>
                                <ul className="space-y-4 mb-8">
                                    {["Priority Delivery Lane", "Direct Designer Concierge", "Reserved Drop Early-Access", "Exclusive Invitations"].map((benefit) => (
                                        <li key={benefit} className="flex items-center gap-3 text-white/50 text-[10px] uppercase tracking-[0.15em] font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-noir-gold" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                                <button className="text-[10px] uppercase tracking-[0.3em] font-black text-noir-gold border-b border-noir-gold/40 hover:text-white transition-colors pb-1">
                                    Explore Loyalty Program
                                </button>
                            </div>
                        </div>

                        <div className="glass-effect bg-noir-surface/40 rounded-3xl p-10 border border-white/5 flex items-center gap-6 group hover:border-noir-gold/20 transition-all cursor-pointer">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:text-noir-gold transition-colors border border-white/10">
                                <CreditCard size={28} strokeWidth={1} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-playfair text-white tracking-tight">Financial Profile</h3>
                                <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">Manage stored cards and billing defaults</p>
                            </div>
                            <ArrowUpRight className="text-white/20 group-hover:text-white transition-colors" size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
