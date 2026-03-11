"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

export default function VariantSelector() {
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState("Noir");

    const SIZES = [
        { label: "XS", stock: 2 },
        { label: "S", stock: 5 },
        { label: "M", stock: 12 },
        { label: "L", stock: 0 },
        { label: "XL", stock: 4 },
    ];

    const COLORS = [
        { label: "Noir", hex: "#000000" },
        { label: "Argent", hex: "#C0C0C0" },
        { label: "Sable", hex: "#C2B280" },
    ];

    return (
        <div className="space-y-12 py-8">
            {/* Configuration: Color Curation */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.4em] text-white/40">
                    <span>Tone Selection</span>
                    <span className="text-white font-bold">{selectedColor}</span>
                </div>
                <div className="flex gap-4">
                    {COLORS.map((color) => (
                        <button
                            key={color.label}
                            onClick={() => setSelectedColor(color.label)}
                            className={`relative w-12 h-12 rounded-full border-2 transition-all p-1 duration-500 ${selectedColor === color.label
                                    ? "border-noir-gold shadow-lg shadow-noir-gold/20 scale-110"
                                    : "border-white/5 opacity-40 hover:opacity-100"
                                }`}
                        >
                            <div
                                className="w-full h-full rounded-full flex items-center justify-center"
                                style={{ backgroundColor: color.hex }}
                            >
                                {selectedColor === color.label && (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                        <Check size={14} className={color.label === 'Noir' ? 'text-white' : 'text-black'} strokeWidth={3} />
                                    </motion.div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Configuration: Silhouette Scale */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.4em] text-white/40">
                    <span>Measurements</span>
                    <button className="text-noir-gold hover:text-white transition-colors border-b border-noir-gold/20 pb-0.5">Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                    {SIZES.map((size) => {
                        const isOutOfStock = size.stock === 0;
                        const isSelected = selectedSize === size.label;

                        return (
                            <button
                                key={size.label}
                                disabled={isOutOfStock}
                                onClick={() => setSelectedSize(size.label)}
                                className={`relative px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest border transition-all duration-500 overflow-hidden group ${isOutOfStock
                                        ? "opacity-20 cursor-not-allowed border-white/5"
                                        : isSelected
                                            ? "bg-noir-gold text-noir-black border-noir-gold shadow-xl shadow-noir-gold/20"
                                            : "bg-white/5 border-white/5 text-white/60 hover:border-white/20 hover:text-white"
                                    }`}
                            >
                                {size.label}
                                {isOutOfStock && (
                                    <div className="absolute inset-x-0 h-[1.5px] bg-white/20 top-1/2 -rotate-45 block" />
                                )}

                                {/* Visual Feedback on Interaction */}
                                <div className="absolute inset-0 bg-white/5 scale-0 group-hover:scale-100 transition-transform origin-center rounded-xl" />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
