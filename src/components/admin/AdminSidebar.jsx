"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings,
    LogOut,
    ExternalLink
} from "lucide-react";
import { signOut } from "next-auth/react";

const ADMIN_NAV = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
    { label: "Products", icon: Package, href: "/admin/products" },
    { label: "Orders", icon: ShoppingBag, href: "/admin/orders" },
    { label: "Customers", icon: Users, href: "/admin/customers" },
    { label: "Analytics", icon: BarChart3, href: "/admin/analytics" },
    { label: "Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-72 bg-noir-black border-r border-white/5 h-screen sticky top-0 flex flex-col p-8 z-50">
            <div className="mb-12">
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="font-playfair text-2xl tracking-[0.2em] text-white group-hover:text-noir-gold transition-colors">NOIR</span>
                    <span className="text-[10px] uppercase tracking-widest text-noir-gold font-bold bg-noir-gold/10 px-2 py-0.5 rounded">Admin</span>
                </Link>
            </div>

            <nav className="flex-1 space-y-2">
                {ADMIN_NAV.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-[11px] uppercase tracking-[0.2em] font-medium transition-all group ${isActive
                                    ? "bg-noir-gold text-noir-black shadow-lg shadow-noir-gold/20"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                                }`}
                        >
                            <item.icon size={18} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? "text-noir-black" : "group-hover:text-noir-gold transition-colors"} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto pt-8 border-t border-white/5 space-y-4">
                <Link
                    href="/"
                    target="_blank"
                    className="flex items-center gap-4 px-4 text-[10px] uppercase tracking-widest text-white/30 hover:text-white transition-colors group"
                >
                    <ExternalLink size={14} />
                    View Boutique
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-all group"
                >
                    <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
