"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";

/**
 * Maison Contact Section
 * Integrated ReactBits contact-5 block teaser.
 * Features:
 * - Direct Concierge Connection
 * - Luxury Lead Generation
 * - Cinematic Dark Noir Aesthetics
 */
export default function ContactSection() {
    return (
        <section className="py-24 lg:py-40 bg-noir-black relative px-6 lg:px-24 overflow-hidden">
            {/* Visual Background Elements */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-noir-gold/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
                <div className="space-y-12">
                     <header className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                        >
                            <MessageSquare size={16} />
                            Executive Concierge
                        </motion.div>
                        <h3 className="text-5xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight">
                            Speak With a <br /> Maison Concierge
                        </h3>
                        <p className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic">
                            For bespoke inquiries, press collaborations, or private styling sessions. Our advisors are available global-standard for immediate assistance.
                        </p>
                     </header>

                     <div className="flex flex-col md:flex-row gap-8">
                        <Link href="/contact" className="group/btn relative px-12 py-5 bg-white overflow-hidden rounded-full">
                            <span className="absolute inset-0 bg-noir-gold translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                            <span className="relative z-10 text-noir-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3">
                                Connect Now
                                <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                     </div>
                </div>

                {/* Quick Interaction Form */}
                <div className="glass-effect bg-noir-surface/20 p-12 rounded-[3rem] border border-white/5 space-y-8">
                    <div className="space-y-4">
                        <h4 className="text-white font-playfair text-2xl italic">Direct Inquiry</h4>
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">Immediate Dispatch Protocol Enabled</p>
                    </div>

                    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Identity</label>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-4 rounded-xl transition-all font-inter"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Email</label>
                            <input 
                                type="email" 
                                placeholder="exclusive@domain.com" 
                                className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-4 rounded-xl transition-all font-inter"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Objective</label>
                            <textarea 
                                placeholder="How may we assist you?" 
                                rows={3}
                                className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-4 rounded-xl transition-all font-inter resize-none"
                            />
                        </div>
                        <button className="w-full text-noir-gold border border-noir-gold/20 hover:bg-noir-gold hover:text-noir-black py-4 rounded-xl text-[10px] uppercase tracking-[0.4em] font-black transition-all">
                            Dispatch Inquiry
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
