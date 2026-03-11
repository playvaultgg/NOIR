"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight, HelpCircle } from "lucide-react";

/**
 * Maison FAQ Discovery Section
 * Integrated ReactBits faq-3 block teaser.
 * Features:
 * - Direct Archive Portal
 * - Categorized Knowledge Teasers
 * - High-Fidelity Call to Action
 */
export default function FAQSection() {
    return (
        <section className="py-24 lg:py-40 bg-noir-black border-t border-white/5 relative px-6 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-center">
                <div className="flex-1 space-y-12">
                    <header className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                        >
                            <HelpCircle size={16} />
                            Maison Knowledge Hub
                        </motion.div>
                        <h3 className="text-5xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight">
                            Common <br /> Inquiries
                        </h3>
                        <p className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic">
                            A curated archive regarding bespoke acquisition, global concierge delivery, and the virtual showroom protocol.
                        </p>
                    </header>

                    <Link href="/faq" className="group flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.4em] font-black">
                        Access Full Knowledge Archive
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        "How does concierge shipping work?",
                        "Can I return bespoke acquisitions?",
                        "How do I access personal styling?",
                        "What is the avatar synthesis process?"
                    ].map((q, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-8 bg-noir-surface/20 border border-white/5 rounded-3xl hover:border-noir-gold/20 transition-all group"
                        >
                             <h4 className="text-white font-playfair text-lg italic mb-4 group-hover:text-noir-gold transition-colors">{q}</h4>
                             <p className="text-white/20 text-[9px] uppercase tracking-[0.2em] leading-relaxed">
                                Curated from the Maison knowledge protocol...
                             </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
