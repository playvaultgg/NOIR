"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, Sparkles, Compass, ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";

export default function MobileNavbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { getTotalItems } = useCartStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const totalItemsCount = mounted ? getTotalItems() : 0;

    const NAV_ITEMS = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Sparkles, label: "Showroom", href: "/showroom" },
        { icon: Compass, label: "Styler", href: "/styler" },
        { icon: User, label: "Avatar", href: "/avatar" },
        { icon: ShoppingBag, label: "Cart", href: "/cart" },
    ];

    if (["/login", "/register", "/forgot-password"].includes(pathname) || pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <motion.div
            initial={{ y: 150 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 z-50 lg:hidden"
        >
            <nav className="glass-effect rounded-2xl w-full px-4 py-3 flex items-center justify-between pb-safe shadow-2xl">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 w-12 transition-colors duration-300 ${isActive ? "text-noir-gold" : "text-white/50 hover:text-white/80"
                                }`}
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                                {item.label === "Cart" && totalItemsCount > 0 && (
                                    <span className="absolute -top-1 -right-1.5 w-3 h-3 bg-noir-gold text-noir-black rounded-full text-[8px] flex justify-center items-center font-bold">
                                        {totalItemsCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[9px] uppercase tracking-wider ${isActive ? "font-semibold" : "font-normal"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </motion.div>
    );
}
