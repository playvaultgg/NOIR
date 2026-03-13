"use client";

import { useState, useMemo, useEffect } from "react";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, Check, X } from "lucide-react";

export default function CollectionClient({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [filterOpen, setFilterOpen] = useState(false);
    
    // Filtering States
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedPriceRange, setSelectedPriceRange] = useState("ALL");
    const [sortBy, setSortBy] = useState("NEWEST");
    
    // Infinite Scroll / Pagination
    const [visibleCount, setVisibleCount] = useState(8);

    const categories = ["ALL", "MENS", "WOMENS"];
    const priceRanges = [
        { label: "ALL", min: 0, max: Infinity },
        { label: "UNDER ₹50,000", min: 0, max: 50000 },
        { label: "₹50,000 - ₹1,00,000", min: 50000, max: 100000 },
        { label: "OVER ₹1,00,000", min: 100000, max: Infinity }
    ];

    const sortOptions = [
        { label: "NEWEST", value: "NEWEST" },
        { label: "PRICE: LOW TO HIGH", value: "PRICE_ASC" },
        { label: "PRICE: HIGH TO LOW", value: "PRICE_DESC" }
    ];

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...initialProducts];

        // 1. Filtering
        if (selectedCategory !== "ALL") {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (selectedPriceRange !== "ALL") {
            const range = priceRanges.find(r => r.label === selectedPriceRange);
            result = result.filter(p => p.priceAmount >= range.min && p.priceAmount <= range.max);
        }

        // 2. Sorting
        switch (sortBy) {
            case "PRICE_ASC":
                result.sort((a, b) => a.priceAmount - b.priceAmount);
                break;
            case "PRICE_DESC":
                result.sort((a, b) => b.priceAmount - a.priceAmount);
                break;
            default:
                // Newest (Default DB order or mock order)
                break;
        }

        return result;
    }, [initialProducts, selectedCategory, selectedPriceRange, sortBy]);

    const displayedProducts = filteredAndSortedProducts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredAndSortedProducts.length;

    return (
        <div className="space-y-12">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-y border-white/5 py-8">
                <div className="flex items-center gap-8">
                    <button 
                        onClick={() => setFilterOpen(!filterOpen)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-full border transition-all ${filterOpen ? "bg-noir-gold border-noir-gold text-noir-black" : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"}`}
                    >
                        <SlidersHorizontal size={14} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Filters</span>
                    </button>

                    <div className="hidden lg:flex items-center gap-4 text-[9px] uppercase tracking-[0.4em] text-white/20">
                        <span className="text-white/60">{filteredAndSortedProducts.length}</span> Masterpieces Registered
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-white/20 font-black">Sort By</p>
                    <div className="relative group">
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent border-none text-white text-[10px] uppercase tracking-[0.3em] font-bold focus:ring-0 appearance-none pr-8 cursor-pointer"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-noir-surface">{opt.label}</option>
                            ))}
                        </select>
                        <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-noir-gold" />
                    </div>
                </div>
            </div>

            {/* Filter Drawer Area */}
            <AnimatePresence>
                {filterOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-white/5"
                    >
                        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                            {/* Category Filter */}
                            <div className="space-y-6">
                                <h5 className="text-[9px] uppercase tracking-[0.5em] text-noir-gold font-black">Collection</h5>
                                <div className="flex flex-wrap gap-3">
                                    {categories.map(cat => (
                                        <button 
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`px-6 py-2.5 rounded-sm border text-[9px] uppercase tracking-[0.3em] font-bold transition-all ${selectedCategory === cat ? "bg-white text-noir-black border-white" : "border-white/10 text-white/40 hover:border-white/20"}`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="space-y-6">
                                <h5 className="text-[9px] uppercase tracking-[0.5em] text-noir-gold font-black">Acquisition Value</h5>
                                <div className="grid grid-cols-1 gap-2">
                                    {priceRanges.map(range => (
                                        <button 
                                            key={range.label}
                                            onClick={() => setSelectedPriceRange(range.label)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-lg border text-[9px] uppercase tracking-[0.2em] font-bold transition-all ${selectedPriceRange === range.label ? "bg-white/5 border-noir-gold/50 text-white" : "border-white/5 text-white/20 hover:border-white/10"}`}
                                        >
                                            {range.label}
                                            {selectedPriceRange === range.label && <Check size={10} className="text-noir-gold" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Applied Filters Summary */}
                            <div className="space-y-6">
                                <h5 className="text-[9px] uppercase tracking-[0.5em] text-noir-gold font-black">Active Protocols</h5>
                                <div className="flex flex-wrap gap-3">
                                    {selectedCategory !== "ALL" && (
                                        <span className="flex items-center gap-2 px-4 py-2 bg-noir-gold/10 border border-noir-gold/20 text-noir-gold text-[8px] uppercase tracking-widest font-black rounded-full">
                                            {selectedCategory}
                                            <X size={10} className="cursor-pointer" onClick={() => setSelectedCategory("ALL")} />
                                        </span>
                                    )}
                                    {selectedPriceRange !== "ALL" && (
                                        <span className="flex items-center gap-2 px-4 py-2 bg-noir-gold/10 border border-noir-gold/20 text-noir-gold text-[8px] uppercase tracking-widest font-black rounded-full">
                                            {selectedPriceRange}
                                            <X size={10} className="cursor-pointer" onClick={() => setSelectedPriceRange("ALL")} />
                                        </span>
                                    )}
                                    {selectedCategory === "ALL" && selectedPriceRange === "ALL" && (
                                        <p className="text-[9px] text-white/10 italic">No filters active</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Grid */}
            <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24"
            >
                <AnimatePresence mode="popLayout">
                    {displayedProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.5 }}
                            layout
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {displayedProducts.length === 0 && (
                <div className="py-48 text-center space-y-4">
                    <p className="font-playfair text-3xl text-white/20 italic">No Archives Match These Criteria</p>
                    <button 
                        onClick={() => { setSelectedCategory("ALL"); setSelectedPriceRange("ALL"); }}
                        className="text-[9px] uppercase tracking-[0.5em] text-noir-gold font-black border-b border-noir-gold/30 pb-1"
                    >
                        Reset All Protocols
                    </button>
                </div>
            )}

            {/* Load More (Infinite Scroll Sim) */}
            {hasMore && (
                <div className="pt-24 flex justify-center">
                    <button 
                        onClick={() => setVisibleCount(prev => prev + 4)}
                        className="group relative px-20 py-6 border border-white/10 rounded-full overflow-hidden transition-all hover:border-noir-gold"
                    >
                        <span className="absolute inset-0 bg-white/5 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-700" />
                        <span className="relative z-10 text-[10px] font-black uppercase tracking-[0.6em] text-white/60 group-hover:text-white">Expand Collection</span>
                    </button>
                </div>
            )}
        </div>
    );
}
