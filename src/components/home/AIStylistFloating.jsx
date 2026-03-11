"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageSquare } from "lucide-react";

export default function AIStylistFloating() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!scrolled) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[90]">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 w-80 bg-[#0A0A0A] border border-white/10 rounded-2xl shadow-2xl shadow-[#C6A972]/5 overflow-hidden"
                    >
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#111111]">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-[#C6A972]" />
                                <span className="text-[#F5F5F5] font-playfair font-medium">Maison Stylist</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-[#E5E5E5] font-inter text-sm">
                                Based on your recent exploration of the Archive, I recommend the <strong>Midnight Silk Trench</strong>.
                            </p>
                            <button className="w-full py-2.5 bg-[#C6A972] text-[#0A0A0A] rounded-lg font-inter font-semibold tracking-wide hover:bg-white hover:scale-[1.02] transition-all duration-300">
                                View Recommendation
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => setIsOpen(true)}
                        className="w-14 h-14 bg-[#0A0A0A] border border-[#C6A972]/30 rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-[#111111] hover:border-[#C6A972] transition-colors"
                    >
                        <Sparkles className="w-5 h-5 text-[#C6A972]" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}
