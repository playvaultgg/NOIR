"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function RecruitmentSection() {
    return (
        <section className="py-24 lg:py-48 bg-[#050505] relative overflow-hidden px-6 lg:px-24">
            {/* Background Aesthetic */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-noir-gold/20 to-transparent" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-noir-gold/[0.03] blur-[150px] rounded-full" />
            </div>

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <div className="space-y-12">
                        <header className="space-y-6">
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                            >
                                <Zap size={14} />
                                Human Capital / Maison Careers
                            </motion.div>
                            <motion.h3 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="text-5xl md:text-8xl font-playfair text-white italic tracking-tight leading-[0.9]"
                            >
                                Seeking <br /> 
                                <span className="text-noir-gold">Visionaries</span>
                            </motion.h3>
                        </header>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic"
                        >
                            Maison NOIR is more than a label; it is a digital laboratory of style. We are looking for architects of code, masters of the silhouette, and curators of the future.
                        </motion.p>

                        <div className="flex flex-col sm:flex-row gap-8 pt-8">
                            <Link href="/careers" className="group flex items-center justify-center gap-4 px-12 py-6 bg-white text-black rounded-2xl transition-all duration-500 hover:bg-noir-gold hover:scale-105 font-black text-[10px] uppercase tracking-[0.4em]">
                                Explore Roles
                                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/contact" className="group flex items-center justify-center gap-4 px-12 py-6 bg-transparent border border-white/10 text-white rounded-2xl transition-all duration-500 hover:border-noir-gold/40 hover:bg-white/5 font-black text-[10px] uppercase tracking-[0.4em]">
                                Direct Pitch
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <Globe size={24} />,
                                title: "Global Reach",
                                desc: "Operate across digital frontiers from Paris to the Void."
                            },
                            {
                                icon: <Users size={24} />,
                                title: "Elite Collective",
                                desc: "Join a curated team of world-class innovators."
                            },
                            {
                                icon: <Zap size={24} />,
                                title: "Hyper-Growth",
                                desc: "Fast-track your legacy in the luxury digital space."
                            },
                            {
                                icon: <Zap size={24} />,
                                title: "Future Tech",
                                desc: "Build with AI, 3D, and Spatial Commerce engines."
                            }
                        ].map((benefit, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] space-y-4 hover:border-noir-gold/20 hover:bg-white/[0.04] transition-all group"
                            >
                                <div className="text-noir-gold/40 group-hover:text-noir-gold transition-colors duration-500">
                                    {benefit.icon}
                                </div>
                                <h4 className="text-white font-playfair text-lg italic tracking-widest">{benefit.title}</h4>
                                <p className="text-white/20 text-[10px] leading-relaxed uppercase tracking-widest">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Marquee Decor */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden opacity-5 pointer-events-none pb-12">
                <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="flex whitespace-nowrap text-[8rem] font-black uppercase tracking-[0.2em] italic text-white"
                >
                    Maison NOIR Careers • Join the Legacy • Visionaries Wanted • Human Capital • 
                    Maison NOIR Careers • Join the Legacy • Visionaries Wanted • Human Capital • 
                </motion.div>
            </div>
        </section>
    );
}
