"use client";

import { motion } from "framer-motion";
import ProductCard from "../products/ProductCard";
import { Sparkles, ArrowRight } from "lucide-react";

export default function RecommendedForYou({ products = [], title = "Tailored for Your Curation" }) {
    if (products.length === 0) return null;

    return (
        <section className="py-24 space-y-16">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.4em] font-black">
                        <Sparkles size={14} />
                        AI Discovery Engine
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-playfair text-white tracking-tight italic">
                        {title}
                    </h2>
                </div>

                <button className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-white transition-all group">
                    Explore Your Style Profile
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                {products.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                            duration: 1.2,
                            ease: [0.16, 1, 0.3, 1],
                            delay: idx * 0.15
                        }}
                    >
                        <ProductCard product={product} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
