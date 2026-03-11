"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Instagram, Youtube, Music2, Share2, ArrowUpRight } from "lucide-react";

/**
 * Maison NOIR Global Footer
 * Powered by ReactBits footer-1 block logic.
 * Features:
 * - Luxury Dark Noir Aesthetic
 * - Global Boutique Navigation Matrix
 * - Cinematic Social Discovery
 */
export default function Footer() {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    if (["/login", "/register", "/forgot-password"].includes(pathname) || pathname.startsWith("/admin")) {
        return null;
    }

    const footerSections = [
        {
            title: "Collections",
            links: [
                { name: "Menswear", href: "/collections" },
                { name: "Womenswear", href: "/collections" },
                { name: "Accessories", href: "/collections" },
                { name: "The Archive", href: "/archive" }
            ]
        },
        {
            title: "Immersion",
            links: [
                { name: "Virtual Showroom", href: "/showroom" },
                { name: "Runway Experience", href: "/runway" },
                { name: "AI Stylist Hub", href: "/styler" },
                { name: "Identity Synthesis", href: "/avatar" }
            ]
        },
        {
            title: "Concierge",
            links: [
                { name: "Our Story", href: "/about" },
                { name: "Support Center", href: "/contact" },
                { name: "Privacy Protocol", href: "/privacy" },
                { name: "Terms of Requisition", href: "/terms" }
            ]
        }
    ];

    return (
        <footer className="bg-[#0A0A0A] border-t border-white/5 pt-32 pb-16 px-6 lg:px-24 relative overflow-hidden">
            {/* The 'Noor' Illuminated Background Architecture */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Refined Monolithic Watermark (Surgical Scaling) */}
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[15rem] lg:text-[25rem] font-playfair font-black text-white/[0.015] tracking-[0.1em] select-none leading-none">
                    NOIR
                </span>
                
                {/* Atmospheric 'Noor' Glow Orbs (Subtle calibration) */}
                <div className="absolute top-0 left-1/3 w-[30vw] h-[30vh] bg-noir-gold/[0.02] blur-[120px] rounded-full animate-float-slow" />
                <div className="absolute bottom-0 right-1/3 w-[25vw] h-[25vh] bg-noir-gold/[0.01] blur-[80px] rounded-full animate-pulse-slow" />
                
                {/* Cinematic Noise Layer */}
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-b border-white/5 bg-noir-black/40 backdrop-blur-md rounded-[40px] overflow-hidden">
                    
                    {/* Brand Identifier column (Large Statement) */}
                    <div className="p-8 lg:p-12 space-y-12">
                         <div className="space-y-6">
                            <Link href="/" className="font-playfair text-5xl tracking-widest text-white italic">
                                NOIR
                            </Link>
                            <p className="text-white font-inter text-2xl lg:text-3xl tracking-tighter italic leading-none max-w-xs">
                                Transform your digital presence into <span className="text-noir-gold">couture excellence.</span>
                            </p>
                         </div>
                         <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black italic">
                             Est. 1995 / Sovereign Archive
                         </p>
                    </div>

                    {/* Navigation Clusters with Vertical Borders */}
                    {footerSections.map((section, idx) => (
                        <div key={idx} className={`p-8 lg:p-12 border-l border-white/5 space-y-12`}>
                            <h4 className="text-[10px] uppercase tracking-[0.6em] text-white/40 font-black italic">
                                {section.title}
                            </h4>
                            <ul className="space-y-6">
                                {section.links.map((link, lIdx) => (
                                    <li key={lIdx}>
                                        <Link 
                                            href={link.href}
                                            className="text-white text-md lg:text-lg font-playfair italic hover:text-noir-gold transition-all duration-300 flex items-center gap-2 group"
                                        >
                                            {link.name}
                                            <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Integrated Social Layer & Bottom Metadata */}
                <div className="pt-16 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex items-center gap-12">
                        {[
                            { icon: Instagram, href: "#" },
                            { icon: Music2, href: "#" },
                            { icon: Youtube, href: "#" },
                            { icon: Share2, href: "#" }
                        ].map((social, i) => (
                            <Link 
                                key={i} 
                                href={social.href} 
                                className="text-white/20 hover:text-noir-gold transition-all duration-500 hover:scale-110"
                            >
                                <social.icon size={20} strokeWidth={1} />
                            </Link>
                        ))}
                    </div>

                    <div className="text-[9px] uppercase tracking-[0.8em] text-white/10 font-black">
                        © {currentYear} Maison NOIR. Digital Couture Protocol Verified.
                    </div>
                </div>
            </div>
        </footer>
    );
}
