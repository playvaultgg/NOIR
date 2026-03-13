"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare, Send } from "lucide-react";

/**
 * Maison NOIR Contact Page
 * Enhanced with Database Integration.
 */
export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "Select Objective",
        message: ""
    });
    const [status, setStatus] = useState({ loading: false, success: false, error: null });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: false, error: null });

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ loading: false, success: true, error: null });
                setFormData({ name: "", email: "", subject: "Select Objective", message: "" });
            } else {
                throw new Error(data.error || "Failed to dispatch message");
            }
        } catch (err) {
            setStatus({ loading: false, success: false, error: err.message });
        }
    };

    const contactSections = [
        {
            title: "Concierge Support",
            description: "Direct access to our luxury advisors for immediate assistance.",
            icon: MessageSquare,
            action: "Open Chat"
        },
        {
            title: "Press Inquiries",
            description: "For global media and editorial collaborations.",
            icon: Mail,
            action: "Contact Press"
        },
        {
            title: "Private Styling",
            description: "Book an appointment with our elite fashion consultants.",
            icon: Phone,
            action: "Schedule Call"
        },
        {
            title: "Customer Care",
            description: "Inquiries regarding orders, returns, and shipping.",
            icon: MapPin,
            action: "Visit Center"
        }
    ];

    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold selection:text-noir-black pt-24 pb-40 px-6 lg:px-24">
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            <div className="max-w-7xl mx-auto relative z-10">
                <header className="mb-20 text-center space-y-4">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-noir-gold uppercase tracking-[0.5em] text-[10px] md:text-xs font-black"
                    >
                        Inquiries & Concierge
                    </motion.h2>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-playfair text-white italic tracking-tighter"
                    >
                        Contact the <br /> Maison Concierge
                    </motion.h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Contact Form Section */}
                    <motion.section 
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass-effect bg-noir-surface/40 p-8 md:p-12 rounded-3xl border border-white/5"
                    >
                        <form className="space-y-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Legal Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="Alexander Noir"
                                        className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-4 rounded-xl transition-all font-inter"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Email Identifier</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="a.noir@exclusive.com"
                                        className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-4 rounded-xl transition-all font-inter"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Inquiry Subject</label>
                                <select 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-4 rounded-xl transition-all font-inter appearance-none"
                                >
                                    <option>Select Objective</option>
                                    <option>Bespoke Order</option>
                                    <option>Press & Media</option>
                                    <option>Styling Appointment</option>
                                    <option>Other Excellence</option>
                                </select>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Detailed Message</label>
                                <textarea 
                                    rows={5}
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="How may the Maison assist you today?"
                                    className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-6 py-4 rounded-xl transition-all font-inter resize-none"
                                />
                            </div>

                            <button 
                                disabled={status.loading}
                                className="w-full bg-white text-noir-black py-5 font-black uppercase text-[10px] tracking-[0.4em] rounded-xl hover:bg-noir-gold transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {status.loading ? "Dispatching..." : "Dispatch Message"}
                                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>

                            {status.success && (
                                <p className="text-[#C6A972] text-[10px] uppercase tracking-widest text-center animate-pulse mt-4">
                                    Message transmitted successfully.
                                </p>
                            )}
                            {status.error && (
                                <p className="text-red-400 text-[10px] uppercase tracking-widest text-center mt-4">
                                    {status.error}
                                </p>
                            )}
                        </form>
                    </motion.section>

                    {/* Support Channels Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {contactSections.map((section, idx) => (
                            <motion.div 
                                key={section.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + (idx * 0.1) }}
                                className="glass-effect bg-noir-surface/20 p-8 rounded-3xl border border-white/5 flex flex-col justify-between group hover:border-noir-gold/20 transition-all"
                            >
                                <div className="space-y-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-noir-gold border border-white/10 group-hover:bg-noir-gold/10 transition-colors">
                                        <section.icon size={20} />
                                    </div>
                                    <h3 className="text-white font-playfair text-xl italic">{section.title}</h3>
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest leading-loose">
                                        {section.description}
                                    </p>
                                </div>
                                <button className="mt-8 text-[10px] uppercase tracking-[0.3em] text-noir-gold hover:text-white transition-colors text-left flex items-center gap-2 group/btn">
                                    {section.action}
                                    <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </motion.div>
                        ))}
                    </section>
                </div>
            </div>
        </main>
    );
}

function ArrowRight({ size, className }) {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
