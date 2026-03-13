"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User, ArrowRight, Sparkles } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import SmartSearch from "../ai/SmartSearch";
import CurrencySwitcher from "@/components/layout/CurrencySwitcher";
import Image from "next/image";

// ── Config ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { label: "Archive",  href: "/collections"     },
    { label: "Showroom", href: "/showroom"         },
    { label: "Runway",   href: "/runway"           },
    { label: "Perfume",  href: "/custom-perfume"   },
];

const MEGA_MENU_DATA = {
    categories: [
        {
            title: "Menswear",
            items: [
                { name: "Outerwear", href: "/collections?category=MENS&type=JACKETS" },
                { name: "Sartorial", href: "/collections?category=MENS&type=SHIRTS" },
                { name: "Essentials", href: "/collections?category=MENS&type=PANTS" },
                { name: "Footwear", href: "/collections?category=MENS&type=SHOES" }
            ],
            image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=600&auto=format&fit=crop"
        },
        {
            title: "Womenswear",
            items: [
                { name: "Archive Dresses", href: "/collections?category=WOMENS&type=DRESSES" },
                { name: "Silken Blouses", href: "/collections?category=WOMENS&type=SHIRTS" },
                { name: "Tailored Skirts", href: "/collections?category=WOMENS&type=SKIRTS" },
                { name: "Jewelry", href: "/collections?category=WOMENS&type=ACCESSORIES" }
            ],
            image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=600&auto=format&fit=crop"
        },
        {
            title: "Archival Series",
            items: [
                { name: "Limited Edition", href: "/collections?tag=LIMITED" },
                { name: "Runway Drops", href: "/collections?tag=RUNWAY" },
                { name: "Maison Heritage", href: "/collections?tag=HERITAGE" },
                { name: "Neural Drops", href: "/collections?tag=AI" }
            ],
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop"
        }
    ],
    featured: {
        title: "Liquid Gold Silhouette",
        description: "The peak of olfactive and visual synthesis.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
        link: "/collections"
    }
};

const BASE_COLOR      = "#0f0f0f";
const PILL_COLOR      = "#C6A972";
const PILL_TEXT_COLOR = "#0f0f0f";
const IDLE_TEXT_COLOR = "rgba(255,255,255,0.55)";

const EASE     = "power3.out";
const DURATION = 0.45;

export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { toggleCart, getTotalItems } = useCartStore();

    const [mounted,      setMounted]      = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [megaMenuOpen, setMegaMenuOpen] = useState(false);

    const [textColors, setTextColors] = useState(
        NAV_ITEMS.map(() => IDLE_TEXT_COLOR)
    );

    const pillRef   = useRef(null);
    const itemRefs  = useRef([]);
    const navRef    = useRef(null);
    const logoRef   = useRef(null);
    const tweenRef  = useRef(null);

    useEffect(() => { 
        setMounted(true); 
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const totalItemsCount = mounted ? getTotalItems() : 0;

    const activeIndex = NAV_ITEMS.findIndex(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );

    const movePillTo = useCallback((targetEl, instant = false) => {
        if (!pillRef.current || !navRef.current || !targetEl) return;
        const navRect    = navRef.current.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        if (tweenRef.current) tweenRef.current.kill();
        gsap.set(pillRef.current, { opacity: 1 });

        if (instant) {
            gsap.set(pillRef.current, {
                x: targetRect.left - navRect.left,
                width: targetRect.width,
                height: targetRect.height,
            });
        } else {
            tweenRef.current = gsap.to(pillRef.current, {
                duration: DURATION,
                ease: EASE,
                x: targetRect.left - navRect.left,
                width: targetRect.width,
                height: targetRect.height,
            });
        }
    }, []);

    const hidePill = useCallback(() => {
        if (tweenRef.current) tweenRef.current.kill();
        gsap.to(pillRef.current, {
            duration: 0.25,
            ease: "power2.in",
            opacity: 0,
        });
    }, []);

    useEffect(() => {
        if (!mounted) return;
        if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
            movePillTo(itemRefs.current[activeIndex], true);
            setTextColors(NAV_ITEMS.map((_, i) =>
                i === activeIndex ? PILL_TEXT_COLOR : IDLE_TEXT_COLOR
            ));
        }
    }, [mounted, activeIndex, movePillTo]);

    const handleEnter = (index) => {
        movePillTo(itemRefs.current[index]);
        setTextColors(NAV_ITEMS.map((_, i) =>
            i === index ? PILL_TEXT_COLOR : IDLE_TEXT_COLOR
        ));
        if (NAV_ITEMS[index].label === "Archive") setMegaMenuOpen(true);
        else setMegaMenuOpen(false);
    };

    const handleLeave = () => {
        setMegaMenuOpen(false);
        if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
            movePillTo(itemRefs.current[activeIndex]);
            setTextColors(NAV_ITEMS.map((_, i) =>
                i === activeIndex ? PILL_TEXT_COLOR : IDLE_TEXT_COLOR
            ));
        } else {
            hidePill();
            setTextColors(NAV_ITEMS.map(() => IDLE_TEXT_COLOR));
        }
    };

    if (["/login", "/register", "/forgot-password"].includes(pathname) || pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <>
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0,   opacity: 1  }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className={`fixed top-0 left-0 right-0 z-[100] hidden lg:block transition-all duration-500 ${
                    scrolled 
                    ? "bg-[#0A0A0A]/90 border-b border-white/10 backdrop-blur-none" 
                    : "bg-transparent backdrop-blur-md border-b border-transparent"
                }`}
            >
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between px-12 py-6">
                    <div className="flex-1 flex items-center justify-start">
                        <Link
                            href="/"
                            ref={logoRef}
                            className="rounded-full flex items-center justify-center shrink-0 mr-1 group"
                            style={{
                                background: BASE_COLOR,
                                width: 44,
                                height: 44,
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            <span className="font-playfair text-[11px] tracking-[0.22em] text-white/80 group-hover:text-[#C6A972] transition-colors duration-400 select-none">
                                N
                            </span>
                        </Link>
                    </div>

                    <nav
                        ref={navRef}
                        className="relative flex items-center bg-[#0F0F0F] rounded-full p-1.5 border border-white/5"
                        onMouseLeave={handleLeave}
                    >
                        <div
                            ref={pillRef}
                            className="absolute top-0 left-0 rounded-full pointer-events-none mt-1.5 ml-1.5"
                            style={{
                                background: PILL_COLOR,
                                opacity: 0,
                                zIndex: 0,
                                height: 38,
                                width: 80,
                            }}
                        />

                        {NAV_ITEMS.map((item, index) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                ref={(el) => { itemRefs.current[index] = el; }}
                                onMouseEnter={() => handleEnter(index)}
                                className="relative px-6 py-2.5 text-[10px] uppercase tracking-[0.32em] font-semibold select-none transition-colors duration-150 whitespace-nowrap"
                                style={{
                                    color: textColors[index],
                                    zIndex: 1,
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}

                        {/* Mega Menu Portal */}
                        <AnimatePresence>
                            {megaMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[900px] bg-noir-surface border border-white/10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden flex z-[200] backdrop-blur-3xl"
                                >
                                    <div className="flex-1 p-12 grid grid-cols-3 gap-12">
                                        {MEGA_MENU_DATA.categories.map((cat, idx) => (
                                            <div key={idx} className="space-y-8">
                                                <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-white/5 group/cat">
                                                    <Image 
                                                        src={cat.image} 
                                                        alt={cat.title} 
                                                        fill 
                                                        className="object-cover transition-transform duration-700 group-hover/cat:scale-110 grayscale brightness-50" 
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-noir-black/80 to-transparent" />
                                                    <h4 className="absolute bottom-4 left-6 text-white font-playfair text-xl italic">{cat.title}</h4>
                                                </div>
                                                <ul className="space-y-4">
                                                    {cat.items.map((sub, i) => (
                                                        <li key={i}>
                                                            <Link href={sub.href} className="text-[9px] uppercase tracking-[0.3em] text-white/40 hover:text-noir-gold transition-colors block">
                                                                {sub.name}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="w-[320px] bg-noir-black/50 border-l border-white/5 p-12 flex flex-col justify-between">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 text-noir-gold text-[8px] uppercase tracking-[0.5em] font-black">
                                                <Sparkles size={12} />
                                                Featured Drop
                                            </div>
                                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 group/featured">
                                                <Image 
                                                    src={MEGA_MENU_DATA.featured.image} 
                                                    alt="Featured" 
                                                    fill 
                                                    className="object-cover group-hover/featured:scale-105 transition-transform duration-1000" 
                                                />
                                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-noir-black to-transparent">
                                                    <p className="text-white font-playfair text-lg italic">{MEGA_MENU_DATA.featured.title}</p>
                                                    <Link href={MEGA_MENU_DATA.featured.link} className="text-[8px] uppercase tracking-widest text-noir-gold flex items-center gap-2 mt-2 group/btn">
                                                        Discover <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </nav>

                    <div className="flex-1 flex items-center justify-end gap-1">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-[#C6A972] transition-all duration-300"
                        >
                            <Search className="w-[16px] h-[16px]" strokeWidth={1.5} />
                        </button>

                        <CurrencySwitcher />

                        <Link
                            href={session ? "/account" : "/login"}
                            className={`w-[38px] h-[38px] rounded-full flex items-center justify-center hover:bg-white/5 transition-all duration-300 ${session ? "text-[#C6A972]" : "text-white/40 hover:text-[#C6A972]"}`}
                        >
                            <User className="w-[16px] h-[16px]" strokeWidth={1.5} />
                        </Link>

                        <button
                            onClick={toggleCart}
                            className="relative w-[38px] h-[38px] rounded-full flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-[#C6A972] transition-all duration-300"
                        >
                            <ShoppingBag className="w-[16px] h-[16px]" strokeWidth={1.5} />
                            {totalItemsCount > 0 && (
                                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#C6A972] text-[#0A0A0A] text-[8px] font-black flex items-center justify-center shadow-md pointer-events-none">
                                    {totalItemsCount}
                                </span>
                            )}
                        </button>

                        <div className="w-px h-6 mx-2 shrink-0 bg-white/10" />

                        <Link
                            href="/contact"
                            className="ml-1 px-5 h-[38px] rounded-full flex items-center text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-300 group"
                            style={{
                                background: BASE_COLOR,
                                color: "rgba(255,255,255,0.7)",
                                border: "1px solid rgba(255,255,255,0.08)",
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = PILL_COLOR;
                                e.currentTarget.style.color = PILL_TEXT_COLOR;
                                e.currentTarget.style.border = `1px solid ${PILL_COLOR}`;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = BASE_COLOR;
                                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                            }}
                        >
                            Let&apos;s talk
                        </Link>
                    </div>
                </div>
            </motion.header>

            <AnimatePresence>
                {isSearchOpen && (
                    <SmartSearch
                        isOpen={isSearchOpen}
                        onClose={() => setIsSearchOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
