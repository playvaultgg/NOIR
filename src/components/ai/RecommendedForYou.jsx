"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { RecommendationEngine } from "@/lib/ai/recommendationEngine";
import ProductCard from "../products/ProductCard";

/**
 * Maison NOIR AI Recommendations Module
 * Phase 9 Predictive Merchandising.
 * Features:
 * - Neural Behavioral Analysis (Simulated)
 * - Cinematic Curation Grid
 * - Luxury Motion Sequencing
 */
export default function RecommendedForYou() {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        async function fetchRecs() {
            const data = await RecommendationEngine.getPersonalizedCuration("current-user");
            setRecommendations(data);
        }
        fetchRecs();
    }, []);

    if (recommendations.length === 0) return null;

    return (
        <section className="py-24 px-6 md:px-12 lg:px-24 bg-noir-black relative overflow-hidden">
            {/* Visual Depth Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-noir-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="max-w-[1600px] mx-auto space-y-16">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                            <Sparkles size={14} className="animate-pulse" />
                            Neural Curation Protocol
                        </div>
                        <h2 className="text-4xl md:text-6xl font-playfair text-white tracking-tighter italic">Recommended for You</h2>
                        <p className="text-white/20 text-sm md:text-lg font-inter max-w-xl italic">
                            Our AI stylists have analyzed the archive to find silhouettes that align with your digital aesthetic.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-12">
                    {recommendations.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
