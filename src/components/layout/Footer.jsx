"use client";

import Link from "next/link";
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
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Maison",
            links: [
                { name: "Our Story", href: "/about" },
                { name: "Atelier", href: "/atelier" },
                { name: "Sustainability", href: "/sustainability" },
                { name: "Careers", href: "/careers" }
            ]
        },
        {
            title: "Collections",
            links: [
                { name: "Men", href: "/collections" },
                { name: "Women", href: "/collections" },
                { name: "Accessories", href: "/collections" },
                { name: "The Archive", href: "/archive" }
            ]
        },
        {
            title: "Experience",
            links: [
                { name: "Showroom", href: "/showroom" },
                { name: "Runway", href: "/runway" },
                { name: "Styler", href: "/styler" },
                { name: "Avatar", href: "/avatar" }
            ]
        },
        {
            title: "Support",
            links: [
                { name: "Contact", href: "/contact" },
                { name: "FAQ", href: "/faq" },
                { name: "Shipping", href: "/shipping" },
                { name: "Returns", href: "/returns" }
            ]
        }
    ];

    return (
        <footer className="bg-black border-t border-white/5 pt-32 pb-16 px-8 lg:px-24">
            <div className="max-w-[1600px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 lg:gap-24 pb-24 border-b border-white/5">
                    
                    {/* Brand Identifier Column */}
                    <div className="lg:col-span-2 space-y-12">
                        <Link href="/" className="font-playfair text-4xl lg:text-5xl tracking-[0.2em] text-white">
                            NOIR
                        </Link>
                        <p className="text-white/30 text-[11px] uppercase tracking-[0.4em] leading-loose italic max-w-sm">
                            "Crafting the future of luxury fashion through cinematic storytelling and immersive digital experiences."
                        </p>
                        <div className="flex items-center gap-8">
                            {[
                                { icon: Instagram, href: "#" },
                                { icon: Music2, href: "#" }, // TikTok
                                { icon: Youtube, href: "#" },
                                { icon: Share2, href: "#" }   // Pinterest
                            ].map((social, i) => (
                                <Link 
                                    key={i} 
                                    href={social.href} 
                                    className="text-white/20 hover:text-noir-gold transition-all duration-500"
                                >
                                    <social.icon size={18} strokeWidth={1.5} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    {footerSections.map((section) => (
                        <div key={section.title} className="space-y-8">
                            <h4 className="text-[10px] uppercase tracking-[0.5em] text-white shadow-sm font-black italic">
                                {section.title}
                            </h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <Link 
                                            href={link.href}
                                            className="text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-noir-gold transition-all duration-300 group flex items-center gap-2"
                                        >
                                            {link.name}
                                            <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-0.5" />
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar: Protocol & Identity */}
                <div className="pt-16 flex flex-col md:flex-row items-center justify-between gap-8">
                    <p className="text-[9px] uppercase tracking-[0.6em] text-white/10 font-black">
                        © {currentYear} Maison NOIR. Digital Couture Protocol Verified.
                    </p>
                    <div className="flex gap-12 text-[9px] uppercase tracking-[0.4em] font-medium text-white/10">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
