"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MessageSquare, ArrowRight, Sparkles } from "lucide-react";

/**
 * Maison Contact Section
 * Integrated ReactBits contact-5 block teaser.
 * Features:
 * - Direct Concierge Connection
 * - Luxury Lead Generation
 * - Cinematic Dark Noir Aesthetics
 */
export default function ContactSection() {
    const carouselImages = [
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1974&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=1920&auto=format&fit=crop"
    ];

    return (
        <section className="py-24 lg:py-40 bg-noir-black relative px-6 lg:px-24 overflow-hidden">
            {/* Visual Depth Decoration */}
            <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-noir-gold/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start relative z-10">
                {/* Left Column: Information Hierarchy */}
                <div className="space-y-16">
                    <header className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                        >
                            MAISON NOIR / CONTACT
                        </motion.div>
                        <h3 className="text-6xl md:text-8xl font-playfair text-white tracking-tighter italic leading-[0.9]">
                            Reach out to <br /> the Concierge.
                        </h3>
                        <p className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic">
                            Experience personalized luxury. Our advisors are at your service for bespoke inquiries and private styling.
                        </p>
                    </header>

                    {/* Contact Channels Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Studio & Showroom</h4>
                            <p className="text-white font-inter text-sm leading-loose">
                                42 Archive Blvd, Level 10 <br />
                                Mumbai, MH 400001
                            </p>
                        </div>
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Electronic Mail</h4>
                                <a href="mailto:concierge@maisonnoir.co" className="text-white font-playfair text-xl italic hover:text-noir-gold transition-colors">
                                    concierge@maisonnoir.co
                                </a>
                            </div>
                            <div className="space-y-4">
                                <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Concierge Direct</h4>
                                <a href="tel:+912255501234" className="text-white font-playfair text-xl italic hover:text-noir-gold transition-colors">
                                    +91 22 5550 1234
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Action Cards (Teaser-style) */}
                    <div className="flex flex-col md:flex-row gap-6">
                        <motion.button 
                            whileHover={{ y: -5 }}
                            className="flex-1 p-8 bg-white/5 border border-white/5 rounded-[2rem] text-left group hover:border-noir-gold/30 transition-all"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="p-3 bg-white/5 rounded-full text-noir-gold">
                                    <MessageSquare size={16} />
                                </div>
                                <ArrowRight size={14} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h5 className="text-white font-playfair text-lg italic mb-2">Private Appointment</h5>
                            <p className="text-white/30 text-[9px] uppercase tracking-widest font-black">Schedule a Gallery Visit</p>
                        </motion.button>

                        <motion.button 
                            whileHover={{ y: -5 }}
                            className="flex-1 p-8 bg-[#0A0A0A] border border-white/5 rounded-[2rem] text-left group hover:border-noir-gold/30 transition-all"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div className="p-3 bg-white/5 rounded-full text-noir-gold">
                                    <Sparkles size={16} />
                                </div>
                                <ArrowRight size={14} className="text-white/20 group-hover:text-white group-hover:translate-x-1 transition-transform" />
                            </div>
                            <h5 className="text-white font-playfair text-lg italic mb-2">Bespoke Inquiry</h5>
                            <p className="text-white/30 text-[9px] uppercase tracking-widest font-black">Wholesale & Media Request</p>
                        </motion.button>
                    </div>
                </div>

                {/* Right Column: High-Fidelity Vertical Carousel */}
                <div className="relative">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="aspect-[3/4] lg:aspect-[4/6] rounded-[4rem] overflow-hidden border border-white/10 relative group"
                    >
                         {/* Swiper logic replaced with vertical scrolling marquee for cinematic feel */}
                         <div className="absolute inset-0 flex flex-col animate-vertical-marquee gap-4 p-4">
                            {[...carouselImages, ...carouselImages].map((img, i) => (
                                <div key={i} className="flex-shrink-0 w-full h-[60%] lg:h-[70%] rounded-[3rem] overflow-hidden">
                                     <img src={img} className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000" />
                                </div>
                            ))}
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-b from-noir-black via-transparent to-noir-black opacity-60 pointer-events-none" />
                         
                         {/* Carousel Overlay Metadata */}
                         <div className="absolute bottom-16 left-12 right-12 space-y-2">
                             <div className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black">The Collection</div>
                             <p className="text-white font-playfair text-3xl italic">Archival Excellence.</p>
                         </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
