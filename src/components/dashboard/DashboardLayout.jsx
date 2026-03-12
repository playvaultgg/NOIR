"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    ShoppingBag,
    Heart,
    MapPin,
    Settings,
    LogOut,
    LayoutDashboard
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const NAV_ITEMS = [
    { label: "Overview", icon: LayoutDashboard, href: "/account" },
    { label: "Purchases", icon: ShoppingBag, href: "/account/orders" },
    { label: "Collection", icon: Heart, href: "/account/wishlist" },
    { label: "Concierge Addresses", icon: MapPin, href: "/account/addresses" },
    { label: "Preferences", icon: Settings, href: "/account/settings" },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleLogout = () => {
        signOut({ callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen bg-noir-black flex flex-col lg:flex-row relative overflow-hidden selection:bg-noir-gold/20">
            {/* ATMOSPHERIC BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
                <motion.div 
                    animate={{ 
                        x: [0, 50, 0], 
                        y: [0, -30, 0],
                        opacity: [0.05, 0.1, 0.05] 
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-noir-gold/10 blur-[120px] rounded-full" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, -40, 0], 
                        y: [0, 60, 0],
                        opacity: [0.03, 0.08, 0.03] 
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[100px] rounded-full" 
                />
            </div>

            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 p-8 h-[calc(100vh-80px)] sticky top-20 bg-noir-surface/10 backdrop-blur-md relative z-10">
                <div className="mb-12 flex items-center gap-4 px-2">
                    <div className="relative">
                        <div className="absolute inset-0 bg-noir-gold/20 blur-md rounded-full animate-pulse" />
                        <div className="w-12 h-12 bg-noir-gold/10 rounded-full flex items-center justify-center border border-noir-gold/20 text-noir-gold shadow-lg shadow-noir-gold/10 relative z-10">
                            <User size={24} strokeWidth={1.5} />
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold mb-0.5">ID: {session?.user?.id?.slice(-8) || "8A2B9F0C"}</p>
                        <p className="text-sm font-playfair text-white tracking-wide truncate max-w-[140px]">
                            {session?.user?.name || "Refined Collector"}
                        </p>
                    </div>
                </div>

                <nav className="flex-1 space-y-2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[10px] uppercase tracking-[0.2em] font-medium transition-all group relative overflow-hidden ${isActive
                                        ? "text-noir-black bg-noir-gold shadow-lg shadow-noir-gold/20"
                                        : "text-white/40 hover:text-noir-gold hover:bg-white/5"
                                    }`}
                            >
                                {isActive && (
                                    <motion.div 
                                        layoutId="sidebarGlow"
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    />
                                )}
                                <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className="relative z-10" />
                                <span className="relative z-10">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[8px] uppercase tracking-widest text-white/30">Vault Integrity</span>
                            <span className="text-[8px] uppercase tracking-widest text-noir-gold font-bold">100%</span>
                        </div>
                        <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ width: ['0%', '100%'] }}
                                transition={{ duration: 2 }}
                                className="h-full bg-noir-gold" 
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-between px-4 py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
                    >
                        <span className="flex items-center gap-4">
                            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Terminate Session
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/40 animate-pulse" />
                    </button>
                </div>
            </aside>

            {/* Sidebar - Mobile Tab Bar (Under Header) */}
            <div className="lg:hidden w-full border-b border-white/5 bg-noir-surface/40 backdrop-blur-md sticky top-20 z-40 overflow-x-auto no-scrollbar relative z-20">
                <div className="flex px-4 items-center min-w-max">
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex flex-col items-center gap-2 px-6 py-4 transition-all relative ${isActive ? "text-noir-gold" : "text-white/40"
                                    }`}
                            >
                                <item.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                                <span className="text-[8px] uppercase tracking-widest font-black">{item.label.split(' ')[0]}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="mobileNavActive"
                                        className="absolute bottom-0 left-4 right-4 h-[2px] bg-noir-gold shadow-sm"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-[1400px] relative z-10">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
