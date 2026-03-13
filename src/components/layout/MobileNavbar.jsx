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
                            className={`flex flex-col items-center gap-1.5 w-full min-w-[50px] transition-all duration-300 py-1 ${isActive ? "text-noir-gold scale-110" : "text-white/40 hover:text-white/80"
                                }`}
                        >
                            <div className="relative">
                                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.5 : 1.5} />
                                {item.label === "Cart" && totalItemsCount > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-noir-gold text-noir-black rounded-full text-[8px] flex justify-center items-center font-black">
                                        {totalItemsCount}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[8px] uppercase tracking-[0.2em] font-black ${isActive ? "opacity-100" : "opacity-40"}`}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </motion.div>
    );
}
