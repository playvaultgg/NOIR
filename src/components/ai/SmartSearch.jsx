"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, X, ArrowRight } from "lucide-react";
import { RecommendationEngine } from "@/lib/ai/recommendationEngine";
import Link from "next/link";

/**
 * Maison NOIR Smart Search Engine
 * Phase 9 Semantic Interaction Layer.
 */
export default function SmartSearch({ isOpen, onClose }) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const performSearch = async () => {
            if (query.length < 2) {
                setResults([]);
                return;
            }
            setIsSearching(true);
            const data = await RecommendationEngine.semanticSearch(query);
            setResults(data);
            setIsSearching(false);
        };

        const timer = setTimeout(performSearch, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-noir-black/95 backdrop-blur-3xl flex flex-col p-8 md:p-24"
                >
                    <button onClick={onClose} className="absolute top-12 right-12 text-white/40 hover:text-white transition-colors">
                        <X size={32} strokeWidth={1} />
                    </button>

                    <div className="max-w-4xl mx-auto w-full space-y-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                                <Sparkles size={14} className="animate-pulse" />
                                Neural Discovery Active
                            </div>
                            <div className="relative">
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder="Describe your aesthetic interest..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full bg-transparent border-b border-white/10 py-8 text-4xl md:text-6xl font-playfair text-white outline-none focus:border-noir-gold transition-colors placeholder:text-white/5"
                                />
                                {isSearching && (
                                    <div className="absolute right-0 bottom-8">
                                        <div className="w-6 h-6 border-2 border-noir-gold border-t-transparent rounded-full animate-spin" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Archive Matches</h4>
                                <div className="space-y-4">
                                    {results.map((product) => (
                                        <Link 
                                            key={product.id} 
                                            href={`/product/${product.id}`}
                                            onClick={onClose}
                                            className="group flex items-center justify-between py-4 border-b border-white/5 hover:border-noir-gold transition-all"
                                        >
                                            <div className="flex items-center gap-6">
                                                <div className="w-12 h-16 bg-white/5 rounded overflow-hidden">
                                                    <img src={product.images[0]} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" />
                                                </div>
                                                <span className="text-xl font-playfair text-white italic group-hover:text-noir-gold transition-colors">{product.name}</span>
                                            </div>
                                            <ArrowRight size={16} className="text-white/20 group-hover:text-noir-gold transition-all group-hover:translate-x-2" />
                                        </Link>
                                    ))}
                                    {query.length > 2 && results.length === 0 && !isSearching && (
                                        <p className="text-white/20 text-sm italic">No silhouettes found in the immediate archive.</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">AI Suggestions</h4>
                                <div className="flex flex-wrap gap-3">
                                    {["Midnight silk", "Tailored onyx", "Minimalist aesthetic", "Limited drops", "Masterpieces"].map(tag => (
                                        <button 
                                            key={tag}
                                            onClick={() => setQuery(tag)}
                                            className="px-6 py-2 rounded-full border border-white/5 text-[10px] uppercase tracking-widest text-white/40 hover:border-noir-gold hover:text-white transition-all"
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
