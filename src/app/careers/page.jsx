"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Briefcase, Cpu, Globe, Palette, Send, Zap, ChevronRight, Star, ShieldCheck, Layers, Sparkles } from "lucide-react";

function JobCard({ role, delay }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.8 }}
            whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.04)" }}
            className="group relative glass-effect bg-white/[0.02] p-10 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row md:items-center justify-between cursor-pointer hover:border-noir-gold/30 transition-all duration-500 overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-noir-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative z-10 space-y-4 md:space-y-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-noir-gold group-hover:bg-noir-gold group-hover:text-black transition-all duration-500">
                        <Zap size={16} />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="text-white font-playfair text-2xl italic group-hover:text-noir-gold transition-colors">{role.title}</h3>
                            {role.status === "High Priority" && (
                                <motion.span 
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="text-[7px] uppercase tracking-[0.2em] bg-noir-gold/10 text-noir-gold px-3 py-1 rounded-full border border-noir-gold/20 font-black"
                                >
                                    Priority
                                </motion.span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-medium">{role.type}</span>
                            <div className="w-1 h-1 rounded-full bg-noir-gold/30" />
                            <span className="text-noir-gold/40 text-[8px] uppercase tracking-[0.3em] font-bold italic">Ref: MN-{role.refId}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-6 mt-6 md:mt-0">
                <span className="hidden md:block text-[10px] uppercase tracking-[0.4em] text-white/10 group-hover:text-noir-gold transition-colors">Apply Now</span>
                <div className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center group-hover:border-noir-gold/40 group-hover:translate-x-2 transition-all duration-500">
                    <ChevronRight size={18} className="text-white/20 group-hover:text-noir-gold" />
                </div>
            </div>
        </motion.div>
    );
}

export default function CareersPage() {
    const [formData, setFormData] = useState({ name: "", email: "", role: "Select Domain", pitch: "" });
    const [status, setStatus] = useState({ loading: false, success: false });
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: containerRef });
    const yHero = useTransform(scrollYProgress, [0, 1], [0, 200]);

    const openRoles = [
        {
            category: "Digital Couture & 3D",
            icon: Palette,
            roles: [
                { title: "Lead 3D Silhouette Architect", type: "Paris / Remote", status: "High Priority" },
                { title: "Digital Textile & Shader Specialist", type: "Remote", status: "Active" }
            ]
        },
        {
            category: "Intelligent Systems",
            icon: Cpu,
            roles: [
                { title: "Generative Style Synthesis Engineer", type: "London / Remote", status: "High Priority" },
                { title: "Spatial Commerce Architect", type: "Remote", status: "Active" }
            ]
        },
        {
            category: "Global Strategy",
            icon: Globe,
            roles: [
                { title: "Luxury Experience Director", type: "New York", status: "Active" },
                { title: "Cinematic Narrative Lead", type: "Paris", status: "Active" }
            ]
        }
    ];

    const [roles, setRoles] = useState([]);

    useEffect(() => {
        // Hydrate roles with stable random IDs on client
        const timer = setTimeout(() => {
            setRoles(openRoles.map(section => ({
                ...section,
                roles: section.roles.map(r => ({
                    ...r,
                    refId: Math.floor(Math.random() * 9000) + 1000
                }))
            })));
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false });
        setTimeout(() => {
            setStatus({ loading: false, success: true });
            setFormData({ name: "", email: "", role: "Select Domain", pitch: "" });
        }, 2000);
    };

    return (
        <main ref={containerRef} className="min-h-screen bg-[#050505] selection:bg-noir-gold selection:text-noir-black pt-24 pb-48 px-6 lg:px-24 relative overflow-hidden">
            {/* Cinematic Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                <motion.div 
                    style={{ y: yHero }}
                    className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-noir-gold/[0.03] blur-[200px] rounded-full -translate-y-1/2 translate-x-1/2" 
                />
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-noir-gold/[0.02] to-transparent pointer-events-none" />
            </div>
            
            <div className="max-w-[1600px] mx-auto relative z-10">
                {/* Hero Section */}
                <header className="py-20 lg:py-40 text-center space-y-12">
                    <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full border border-noir-gold/20 bg-noir-gold/5 backdrop-blur-md">
                        <Sparkles size={12} className="text-noir-gold animate-pulse" />
                        <span className="text-noir-gold text-[9px] uppercase tracking-[0.4em] font-black italic">Seeking The Architects of Style</span>
                    </div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="text-7xl md:text-[12rem] font-playfair text-white italic tracking-tighter leading-[0.8]"
                    >
                        Join the <br /> <span className="text-noir-gold drop-shadow-[0_0_50px_rgba(198,169,114,0.2)]">Legacy</span>
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="max-w-2xl mx-auto space-y-8"
                    >
                        <p className="text-white/40 text-xl md:text-2xl font-playfair italic leading-relaxed">
                            Maison NOIR is a collective of visionaries at the intersection of haute couture and hyper-tech. We don&apos;t hire; we recruit legends.
                        </p>
                        <div className="flex justify-center gap-12 pt-8 opacity-30">
                            {["Visions", "Craft", "Legacy"].map(word => (
                                <span key={word} className="text-[10px] uppercase tracking-[0.6em] font-black italic text-white">{word}</span>
                            ))}
                        </div>
                    </motion.div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 lg:gap-32 mt-24">
                    {/* Listings */}
                    <div className="lg:col-span-7 space-y-24">
                        {roles.map((section, sIdx) => (
                            <div key={section.category} className="space-y-10">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-[1px] bg-noir-gold/30" />
                                    <h2 className="text-noir-gold text-[11px] uppercase tracking-[0.6em] font-black italic">{section.category}</h2>
                                    <div className="flex-1 h-[1px] bg-white/5" />
                                </div>

                                <div className="space-y-6">
                                    {section.roles.map((role, rIdx) => (
                                        <JobCard key={role.title} role={role} delay={sIdx * 0.1 + rIdx * 0.1} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Elite Application Form */}
                    <div className="lg:col-span-5">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="sticky top-32 glass-effect bg-white/[0.02] p-12 lg:p-16 rounded-[4rem] border border-white/5 space-y-12"
                        >
                            <div className="space-y-6 text-center">
                                <div className="w-20 h-20 rounded-[2rem] bg-noir-gold/5 border border-noir-gold/20 flex items-center justify-center mx-auto text-noir-gold">
                                    <ShieldCheck size={32} strokeWidth={1} />
                                </div>
                                <h3 className="text-3xl font-playfair text-white italic">Direct Protocol</h3>
                                <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] leading-loose max-w-xs mx-auto">
                                    In the absence of a matching role, initiate a direct pitch for your unique brilliance.
                                </p>
                            </div>

                            <form className="space-y-8" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 ml-1">Identity</label>
                                        <input 
                                            type="text" required value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-white/[0.03] border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-5 rounded-2xl transition-all font-inter"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 ml-1">Encryption</label>
                                        <input 
                                            type="email" required value={formData.email}
                                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-white/[0.03] border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-5 rounded-2xl transition-all font-inter"
                                            placeholder="Secure Email"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 ml-1">The Domain</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.role}
                                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                                            className="w-full bg-white/[0.03] border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-5 rounded-2xl transition-all font-inter appearance-none cursor-pointer"
                                        >
                                            <option className="bg-noir-black">Select Domain</option>
                                            <option className="bg-noir-black">Couture Architect</option>
                                            <option className="bg-noir-black">Intelligent Systems</option>
                                            <option className="bg-noir-black">Brand Narrative</option>
                                            <option className="bg-noir-black">Global Operations</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                                            <Layers size={14} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[9px] uppercase tracking-[0.4em] text-white/30 ml-1">The Legacy Pitch</label>
                                    <textarea 
                                        rows={5} required value={formData.pitch}
                                        onChange={(e) => setFormData({...formData, pitch: e.target.value})}
                                        className="w-full bg-white/[0.03] border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-5 rounded-2xl transition-all font-inter resize-none"
                                        placeholder="Define your contribution to the future of the Maison..."
                                    />
                                </div>

                                <button 
                                    disabled={status.loading}
                                    className="w-full bg-white text-noir-black py-6 font-black uppercase text-[10px] tracking-[0.5em] rounded-2xl hover:bg-noir-gold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                                >
                                    {status.loading ? "TRANSMITTING..." : "INITIATE PROTOCOL"}
                                    <Send size={16} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                                </button>

                                {status.success && (
                                    <motion.p 
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="text-noir-gold text-[10px] uppercase tracking-[0.4em] text-center font-black animate-pulse"
                                    >
                                        Protocol Initiated. Awaiting Review.
                                    </motion.p>
                                )}
                            </form>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Bottom Marquee */}
            <div className="mt-48 pt-24 border-t border-white/5 overflow-hidden">
                <motion.div 
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
                    className="flex whitespace-nowrap text-[15rem] font-black uppercase tracking-tighter italic text-white/[0.02] leading-none"
                >
                    LEGACY RECRUITMENT • VISIONARIES ONLY • MAISON NOIR • THE FUTURE IS CURATED • 
                </motion.div>
            </div>
        </main>
    );
}
