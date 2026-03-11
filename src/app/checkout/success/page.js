"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    Package,
    Mail,
    ArrowRight,
    ShieldCheck,
    Award,
    Compass
} from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { useCart } from "@/store/useCart";

export default function SuccessPage() {
    const { clearCart } = useCart();
    const containerRef = useRef(null);

    useEffect(() => {
        // Clear the cart upon successful order landing
        clearCart();

        // GSAP Cinematic Activation
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(".success-icon", {
                scale: 0.2,
                opacity: 0,
                duration: 1.2,
                ease: "back.out(1.7)"
            })
                .from(".success-text", {
                    y: 30,
                    opacity: 0,
                    stagger: 0.2,
                    duration: 1,
                    ease: "power3.out"
                }, "-=0.5")
                .from(".success-card", {
                    y: 40,
                    opacity: 0,
                    stagger: 0.15,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.4")
                .from(".success-cta", {
                    y: 20,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.2");
        }, containerRef);

        return () => ctx.revert();
    }, [clearCart]);

    return (
        <main ref={containerRef} className="min-h-screen bg-black text-white flex items-center justify-center p-8 overflow-hidden">

            {/* AMBIENT BACKGROUND GLOW */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-2xl w-full text-center space-y-12 relative z-10">

                {/* SUCCESS ICON */}
                <div className="success-icon flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gold/20 blur-[40px] rounded-full animate-pulse" />
                        <CheckCircle2 size={88} strokeWidth={1} className="text-gold relative z-10" />
                    </div>
                </div>

                {/* MESSAGES */}
                <div className="space-y-4">
                    <h2 className="success-text text-sm uppercase tracking-[0.5em] text-gold font-inter font-medium leading-none">
                        Order Confirmed
                    </h2>
                    <h1 className="success-text text-5xl md:text-7xl font-playfair tracking-tight text-white mb-6">
                        Welcome to NOIR.
                    </h1>
                    <p className="success-text text-[11px] md:text-xs uppercase tracking-[0.3em] text-white/40 leading-relaxed font-light max-w-sm mx-auto italic">
                        "Your acquisition is being curated with the
                        utmost precision in our Paris atelier."
                    </p>
                </div>

                {/* ORDER INFO CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                    <div className="success-card glass-effect rounded-[24px] p-8 text-left space-y-4 border border-white/5 bg-white/5">
                        <div className="flex items-center gap-4 text-gold/60">
                            <Package size={18} />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Acquisition ID</span>
                        </div>
                        <div>
                            <p className="text-xl font-playfair text-white">#NIR-2025-08194</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">Order timestamped: {new Date().toLocaleTimeString()}</p>
                        </div>
                    </div>

                    <div className="success-card glass-effect rounded-[24px] p-8 text-left space-y-4 border border-white/5 bg-white/5">
                        <div className="flex items-center gap-4 text-gold/60">
                            <Mail size={18} />
                            <span className="text-[10px] uppercase tracking-widest font-bold">Digital Receipt</span>
                        </div>
                        <div>
                            <p className="text-xl font-playfair text-white">Check Inbox</p>
                            <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">Sent to: alex@sterling.com</p>
                        </div>
                    </div>
                </div>

                {/* CTAs */}
                <div className="success-cta pt-12 flex flex-col items-center gap-8">
                    <Link
                        href="/dashboard"
                        className="w-full md:w-auto px-16 py-6 bg-gold text-black text-[11px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-4 group hover:bg-white transition-all duration-500 shadow-2xl shadow-gold/20"
                    >
                        Go to Dashboard
                        <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <div className="flex gap-12 pt-4">
                        <div className="flex items-center gap-3 opacity-30">
                            <ShieldCheck size={14} />
                            <span className="text-[8px] uppercase tracking-widest font-medium">Verified Client</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-30">
                            <Compass size={14} />
                            <span className="text-[8px] uppercase tracking-widest font-medium">Tracking Map Live</span>
                        </div>
                        <div className="flex items-center gap-3 opacity-30">
                            <Award size={14} />
                            <span className="text-[8px] uppercase tracking-widest font-medium">Priority Tier</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
