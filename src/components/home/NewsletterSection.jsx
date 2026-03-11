"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function NewsletterSection() {
    return (
        <section className="relative py-32 px-6 lg:px-24 bg-[#0A0A0A] overflow-hidden flex items-center justify-center">
            {/* Cinematic Noise & Fog */}
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-black/90 to-[#0A0A0A]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C6A972]/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-center gap-3 text-[#C6A972] text-[10px] uppercase tracking-[0.5em] font-black italic">
                        <Sparkles size={14} className="animate-pulse" />
                        Exclusive Privilege
                    </div>
                    <h2 className="text-4xl md:text-5xl font-playfair text-[#F5F5F5] italic tracking-wide leading-tight">
                        The Inner Circle
                    </h2>
                    <p className="text-[#E5E5E5]/60 font-inter text-sm md:text-base max-w-md mx-auto leading-relaxed">
                        Join the Maison NOIR society to receive private invitations to runway drops and access to archival pieces before the public.
                    </p>
                </motion.div>

                <motion.form 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto w-full"
                    onSubmit={(e) => e.preventDefault()}
                >
                    <input 
                        type="email" 
                        placeholder="Your digital address" 
                        className="flex-1 bg-[#111111] border border-white/10 rounded-lg px-6 py-4 text-[#F5F5F5] font-inter text-sm outline-none placeholder:text-white/30 focus:border-[#C6A972]/50 transition-colors"
                        required
                    />
                    <button type="submit" className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#C6A972] text-[#0A0A0A] rounded-lg font-inter font-semibold tracking-wide hover:bg-white transition-colors duration-300">
                        Join
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.form>
            </div>
        </section>
    );
}
