"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Package, 
    ShoppingCart, 
    Users, 
    BarChart3, 
    Boxes, 
    UserCircle2, 
    Settings, 
    LogOut,
    Menu,
    X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_ITEMS = [
    { label: "Intelligence", href: "/admin", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Inventory", href: "/admin/inventory", icon: Boxes },
    { label: "Avatars", href: "/admin/avatars", icon: UserCircle2 },
    { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Mobile Sidebar Toggle */}
            <button 
                className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-noir-surface rounded-xl border border-white/10 text-white/70 hover:text-white backdrop-blur-md"
                onClick={() => setSidebarOpen(!sidebarOpen)}
            >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0A0A0A] border-r border-white/5 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 lg:static lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex flex-col pt-20 lg:pt-10">
                    <div className="px-8 mb-12">
                        <Link href="/" className="font-playfair text-3xl tracking-[0.2em] italic hover:text-[#C6A972] transition-colors inline-block">
                            NOIR 
                            <span className="text-[9px] uppercase font-inter font-black tracking-[0.4em] text-[#C6A972]/80 block mt-3 not-italic">
                                Command Center
                            </span>
                        </Link>
                    </div>

                    <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
                        {SIDEBAR_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link 
                                    key={item.href} 
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3.5 px-5 py-3.5 rounded-2xl transition-all duration-300 text-sm font-medium ${
                                        isActive 
                                        ? "bg-[#C6A972]/10 text-[#C6A972] border border-[#C6A972]/20" 
                                        : "text-white-[#C6A972] hover:text-black hover:border-[#C6A972]/5 border border-transparent"
                                    }`}
                                >
                                    <Icon size={18} className={isActive ? "text-[#C6A972]" : "text-white/40"} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 mt-auto border-t border-white/5">
                        <button 
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl w-full text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300 text-sm font-medium group"
                        >
                            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                            End Session
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-x-hidden pt-16 lg:pt-0 bg-[#0A0A0A]">
                {/* Cinematics / Atmosphere */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#C6A972]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                
                <div className="p-6 md:p-8 lg:p-12 relative z-10 min-h-screen">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Overlay for mobile sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
