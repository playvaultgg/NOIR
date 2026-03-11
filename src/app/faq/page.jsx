"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";

/**
 * Maison Knowledge FAQ Page
 * Powered by ReactBits faq-3 block logic.
 * Features:
 * - Luxury Accordion Interactions
 * - Categorized Maison Wisdom
 * - Cinematic Dark Noir Aesthetics
 */
export default function FAQPage() {
    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "For our elite collectors, we offer global concierge shipping. Standard delivery to major luxury hubs (London, Paris, NYC, Tokyo, Milan) typically takes 3-5 business days. Bespoke items may require additional timeline for precision crafting."
        },
        {
            question: "Can I return luxury items?",
            answer: "The Maison accepts returns within 14 days of delivery, provided the item is in its original, pristine condition with all security seals intact. Custom-tailored pieces and high-jewelry are ineligible for return due to their personalized nature."
        },
        {
            question: "Do you offer personal styling?",
            answer: "Indeed. Our Maison stylists are available for private consultations. We offer digital styling sessions via our 3D Showroom and Styler, as well as in-person appointments at our flagship boutiques."
        },
        {
            question: "How does the virtual showroom work?",
            answer: "Enter our digital fashion house to explore garments in 360° space. Our Three.js-powered showroom allows you to simulate lighting, inspect fabric physics, and project silhouettes onto your digital avatar for the ultimate pre-acquisition experience."
        },
        {
            question: "Is there an elite membership?",
            answer: "Membership is granted to our loyal collectors. Noir Elite status provides early access to limited seasonal drops, private runway invites, and exclusive digital assets for the NOIR metaverse."
        }
    ];

    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold selection:text-noir-black pt-24 pb-40 px-6 lg:px-24 relative overflow-hidden">
            {/* Visual Background Elements */}
            <div className="absolute top-0 right-0 w-[50vw] h-[50vh] bg-noir-gold/5 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[50vw] h-[50vh] bg-noir-gold/3 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            <div className="max-w-4xl mx-auto relative z-10">
                <header className="mb-24 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                    >
                        <Sparkles size={14} className="animate-pulse" />
                        Maison Knowledge
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-6xl md:text-8xl font-playfair text-white tracking-tight italic"
                    >
                        Frequently Asked <br /> Questions
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/30 text-lg md:text-xl font-inter italic max-w-2xl leading-relaxed"
                    >
                        A curated archive of collective wisdom regarding the NOIR experience, from bespoke acquisition to digital persona synthesis.
                    </motion.p>
                </header>

                <div className="space-y-6">
                    {faqs.map((faq, idx) => (
                        <FAQItem key={idx} faq={faq} index={idx} />
                    ))}
                </div>

                <footer className="mt-32 pt-12 border-t border-white/5 text-center">
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] italic">
                        Missing information? <a href="/contact" className="text-noir-gold hover:text-white transition-colors underline underline-offset-4">Consult the Concierge</a>
                    </p>
                </footer>
            </div>
        </main>
    );
}

function FAQItem({ faq, index }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + (index * 0.1) }}
            className={`glass-effect rounded-2xl border border-white/5 transition-all duration-700 overflow-hidden ${
                isOpen ? "bg-noir-surface/40 border-noir-gold/20" : "bg-noir-surface/20"
            }`}
        >
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-8 flex items-center justify-between text-left group"
            >
                <span className={`text-lg md:text-xl font-playfair tracking-tight transition-colors duration-500 ${
                    isOpen ? "text-noir-gold" : "text-white group-hover:text-noir-gold/80"
                }`}>
                    {faq.question}
                </span>
                <div className={`p-2 rounded-full border border-white/5 transition-all duration-700 ${
                    isOpen ? "bg-noir-gold text-noir-black rotate-180" : "text-white/20"
                }`}>
                    <ChevronDown size={16} />
                </div>
            </button>
            <motion.div 
                initial={false}
                animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
            >
                <div className="px-8 pb-8 pt-0">
                    <p className="text-white/40 text-[11px] md:text-xs uppercase tracking-[0.3em] leading-loose max-w-3xl italic">
                        {faq.answer}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}
