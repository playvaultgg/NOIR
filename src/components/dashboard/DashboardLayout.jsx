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
        <div className="min-h-screen bg-noir-black flex flex-col lg:flex-row">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:flex w-72 flex-col border-r border-white/5 p-8 h-[calc(100vh-80px)] sticky top-20 bg-noir-surface/20">
                <div className="mb-12 flex items-center gap-4 px-2">
                    <div className="w-12 h-12 bg-noir-gold/10 rounded-full flex items-center justify-center border border-noir-gold/20 text-noir-gold shadow-lg shadow-noir-gold/10">
                        <User size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">Welcome,</p>
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
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[10px] uppercase tracking-[0.2em] font-medium transition-all group ${isActive
                                        ? "bg-noir-gold text-noir-black shadow-lg shadow-noir-gold/20"
                                        : "text-white-[#C6A972] hover:text-black hover:border-[#C6A972]/5"
                                    }`}
                            >
                                <item.icon size={16} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? "text-noir-black" : "group-hover:text-noir-gold transition-colors"} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-4 px-4 py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Terminate Session
                </button>
            </aside>

            {/* Sidebar - Mobile Tab Bar (Under Header) */}
            <div className="lg:hidden w-full border-b border-white/5 bg-noir-surface/40 backdrop-blur-md sticky top-20 z-40 overflow-x-auto no-scrollbar">
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
            <main className="flex-1 p-6 md:p-12 lg:p-16 max-w-[1400px]">
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
