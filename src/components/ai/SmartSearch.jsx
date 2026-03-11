"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { performSmartSearch } from "@/modules/ai/ai.service";

export default function SmartSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length > 2) {
                setIsSearching(true);
                const searchResults = await performSmartSearch(query);
                setResults(searchResults);
                setIsSearching(false);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-noir-black/95 backdrop-blur-3xl flex flex-col p-8 lg:p-24"
        >
            <header className="flex justify-between items-center mb-16">
                <div className="flex items-center gap-4 text-noir-gold uppercase tracking-[0.4em] text-[10px] font-black">
                    <Sparkles size={16} />
                    AI Neural Search
                </div>
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                    <X size={32} strokeWidth={1} />
                </button>
            </header>

            <div className="max-w-5xl mx-auto w-full space-y-24">
                <div className="relative group">
                    <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={40} strokeWidth={1} />
                    <input
                        autoFocus
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by aesthetic, material, or silhouette..."
                        className="w-full bg-transparent border-b border-white/10 py-10 px-16 text-4xl lg:text-7xl font-playfair text-white outline-none focus:border-noir-gold transition-all italic placeholder:text-white/5"
                    />
                    {isSearching && (
                        <div className="absolute right-0 top-1/2 -translate-y-1/2">
                            <div className="w-8 h-8 border-2 border-noir-gold border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Discovery Results */}
                    <div className="space-y-12">
                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Neural Matches</h4>
                        <div className="space-y-8">
                            {results.length > 0 ? results.map((product) => (
                                <Link
                                    key={product.id}
                                    href={`/product/${product.id}`}
                                    onClick={onClose}
                                    className="flex items-center gap-8 group"
                                >
                                    <div className="w-24 h-32 bg-white/5 rounded-xl overflow-hidden relative border border-white/5 group-hover:border-noir-gold transition-colors">
                                        <Image src={product.images?.[0] || product.image} fill className="object-cover" />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <p className="text-2xl font-playfair text-white tracking-wide group-hover:text-noir-gold transition-colors">{product.name}</p>
                                        <p className="text-[10px] uppercase tracking-widest text-noir-gold font-bold">{product.price}</p>
                                    </div>
                                    <ArrowRight size={20} className="text-white/20 group-hover:text-white group-hover:translate-x-2 transition-all" />
                                </Link>
                            )) : query.length > 2 ? (
                                <p className="text-white/40 font-playfair italic text-xl">No matches found in current curation.</p>
                            ) : (
                                <div className="space-y-4">
                                    {["Noir Silk", "Onyx Collection", "Maison Velvet"].map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="block text-2xl font-playfair text-white/20 hover:text-white transition-colors"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* AI Style Suggestion */}
                    <div className="glass-effect bg-white/[0.02] rounded-3xl p-12 border border-white/5 space-y-8 h-fit">
                        <div className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-widest font-black">
                            <Sparkles size={14} />
                            Style Prediction
                        </div>
                        <h3 className="text-3xl font-playfair text-white italic">Searching for "Dark Minimalist"?</h3>
                        <p className="text-sm text-white/30 leading-relaxed uppercase tracking-widest text-[10px]">
                            Our neural engine suggests pairing your search with the <span className="text-white">Onyx Silk Tier</span> for a complete Maison appearance.
                        </p>
                        <ul className="space-y-4 pt-4">
                            {["Hand-tailored fits", "Premium monochrome", "Collector exclusives"].map(item => (
                                <li key={item} className="flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/60">
                                    <div className="w-1 h-1 bg-noir-gold rounded-full" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
