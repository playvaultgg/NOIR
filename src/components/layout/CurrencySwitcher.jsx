"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, Globe } from "lucide-react";

export default function CurrencySwitcher() {
    const { currency, changeCurrency, currencies } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 group"
            >
                <Globe className="w-3.5 h-3.5 text-noir-gold" />
                <span className="text-[10px] font-bold tracking-widest text-white/70 uppercase">
                    {currency}
                </span>
                <ChevronDown 
                    className={`w-3 h-3 text-white/40 transition-transform duration-500 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute right-0 mt-2 w-32 py-2 bg-noir-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
                    >
                        {Object.entries(currencies).map(([code, data]) => (
                            <button
                                key={code}
                                onClick={() => {
                                    changeCurrency(code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center justify-between px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 ${
                                    currency === code 
                                    ? 'text-noir-gold bg-noir-gold/10' 
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <span>{data.label}</span>
                                <span>{data.symbol}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
