"use client";

/**
 * NOIR PillNav — ReactBits PillNav (Navigation-5) faithful adaptation
 * Same-to-same recreation using GSAP sliding pill, floating frosted container,
 * logo pill, nav items, and icon CTA — matching the exact ReactBits design.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import SmartSearch from "../ai/SmartSearch";

// ── Config ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    { label: "Archive",  href: "/collections" },
    { label: "Showroom", href: "/showroom"    },
    { label: "Runway",   href: "/runway"      },
];

// Brand tokens (matching PillNav's pillColor / baseColor API)
const BASE_COLOR      = "#0f0f0f";    // container + logo bg
const PILL_COLOR      = "#C6A972";    // active/hover pill fill
const PILL_TEXT_COLOR = "#0f0f0f";    // text when inside pill
const IDLE_TEXT_COLOR = "rgba(255,255,255,0.55)"; // text when not in pill

const EASE     = "power3.out";
const DURATION = 0.45;

// ── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const { toggleCart, getTotalItems } = useCartStore();

    const [mounted,      setMounted]      = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Text color per item (controlled imperatively like the original)
    const [textColors, setTextColors] = useState(
        NAV_ITEMS.map(() => IDLE_TEXT_COLOR)
    );

    // Refs — pill floats inside the <nav> wrapper
    const pillRef   = useRef(null);
    const itemRefs  = useRef([]);
    const navRef    = useRef(null);
    const logoRef   = useRef(null);
    const tweenRef  = useRef(null);

    useEffect(() => { 
        setMounted(true); 

        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const totalItemsCount = mounted ? getTotalItems() : 0;

    // Resolve active index from pathname
    const activeIndex = NAV_ITEMS.findIndex(
        (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );

    // ── GSAP pill mover ──────────────────────────────────────────────────────
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

    // On mount: snap pill to active item with no tween
    useEffect(() => {
        if (!mounted) return;
        if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
            movePillTo(itemRefs.current[activeIndex], true);
            setTextColors(NAV_ITEMS.map((_, i) =>
                i === activeIndex ? PILL_TEXT_COLOR : IDLE_TEXT_COLOR
            ));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    // ── Mouse handlers ───────────────────────────────────────────────────────
    const handleEnter = (index) => {
        movePillTo(itemRefs.current[index]);
        setTextColors(NAV_ITEMS.map((_, i) =>
            i === index ? PILL_TEXT_COLOR : IDLE_TEXT_COLOR
        ));
    };

    const handleLeave = () => {
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

    // If on auth or admin pages, don't show the floating navbar
    if (["/login", "/register", "/forgot-password"].includes(pathname) || pathname.startsWith("/admin")) {
        return null;
    }

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Desktop-only Floating PillNav ── */}
            <motion.header
                initial={{ y: -80, opacity: 0 }}
                animate={{ y: 0,   opacity: 1  }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] hidden lg:block"
            >
                {/*
                  Outer pill container — same design as ReactBits PillNav:
                  dark glass, border, subtle shadow, rounded-full, flex row
                */}
                <div
                    className="flex items-center rounded-full border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-colors duration-500"
                    style={{ 
                        background: scrolled ? "rgba(10,10,10,0.9)" : "rgba(10,10,10,0.4)", 
                        padding: "6px" 
                    }}
                >
                    {/* ── Logo pill (same square-pill as ReactBits) ── */}
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
                        aria-label="NOIR home"
                    >
                        <span className="font-playfair text-[11px] tracking-[0.22em] text-white/80 group-hover:text-[#C6A972] transition-colors duration-400 select-none">
                            N
                        </span>
                    </Link>

                    {/* ── Nav items with GSAP sliding pill ── */}
                    <nav
                        ref={navRef}
                        className="relative flex items-center"
                        onMouseLeave={handleLeave}
                    >
                        {/* The GSAP-controlled pill (sits behind items via z-index) */}
                        <div
                            ref={pillRef}
                            className="absolute top-0 left-0 rounded-full pointer-events-none"
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
                    </nav>

                    {/* ── Divider ── */}
                    <div className="w-px h-6 mx-2 shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />

                    {/* ── Icon actions (Search, Account, Cart) ── */}
                    <div className="flex items-center gap-1 pr-1">
                        {/* Search */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-[#C6A972] transition-all duration-300"
                            aria-label="Search"
                        >
                            <Search className="w-[16px] h-[16px]" strokeWidth={1.5} />
                        </button>

                        {/* Account */}
                        <Link
                            href={session ? "/account" : "/login"}
                            className={`w-[38px] h-[38px] rounded-full flex items-center justify-center hover:bg-white/5 transition-all duration-300 ${session ? "text-[#C6A972]" : "text-white/40 hover:text-[#C6A972]"}`}
                            aria-label="Account"
                        >
                            <User className="w-[16px] h-[16px]" strokeWidth={1.5} />
                        </Link>

                        {/* Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative w-[38px] h-[38px] rounded-full flex items-center justify-center text-white/40 hover:bg-white/5 hover:text-[#C6A972] transition-all duration-300"
                            aria-label="Cart"
                        >
                            <ShoppingBag className="w-[16px] h-[16px]" strokeWidth={1.5} />
                            {totalItemsCount > 0 && (
                                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#C6A972] text-[#0A0A0A] text-[8px] font-black flex items-center justify-center shadow-md pointer-events-none">
                                    {totalItemsCount}
                                </span>
                            )}
                        </button>

                        {/* Let's talk — ReactBits style CTA pill */}
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
                            aria-label="Contact"
                        >
                            Let&apos;s talk
                        </Link>
                    </div>
                </div>
            </motion.header>

            {/* ── SmartSearch overlay ── */}
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
