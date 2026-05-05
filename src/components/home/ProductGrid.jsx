"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";

/**
 * Maison Product Grid
 * High-performance grid for elite commerce.
 * Features:
 * - Responsive Matrix (4/2/1)
 * - Cinematic Card Interactions
 * - Dynamic Scarcity Engine Integration
 */
export default function ProductGrid({ products = [] }) {
    return (
        <section className="py-24 lg:py-40 bg-noir-black relative px-6 lg:px-24">

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-x-12 md:gap-y-16 max-w-[1600px] mx-auto">
                {products.length > 0 ? (
                    products.map((product, idx) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: (idx % 4) * 0.1 }}
                        >
                            <ProductGridItem product={product} />
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-40 text-center space-y-4">
                        <p className="text-white/20 text-[10px] uppercase tracking-[0.5em] font-black italic">Awaiting seasonal arrival...</p>
                    </div>
                )}
            </div>

            <footer className="mt-24 pt-12 border-t border-white/5 flex justify-center">
                <button className="text-[10px] uppercase tracking-[0.4em] text-white/40 hover:text-noir-gold transition-all flex items-center gap-4 group">
                    <div className="h-[1px] w-12 bg-white/10 group-hover:bg-noir-gold transition-colors" />
                    View the Full Catalogue
                    <div className="h-[1px] w-12 bg-white/10 group-hover:bg-noir-gold transition-colors" />
                </button>
            </footer>
        </section>
    );
}

/**
 * Enhanced Product Grid Item
 * Extends the base ProductCard with 3D tilt and advanced UI markers.
 */
function ProductGridItem({ product }) {
    // We reuse the existing ProductCard but ensure it fits the grid spec
    return (
        <div className="relative group perspective-1000">
             <ProductCard product={product} />
             
             {/* Scarcity Badge Component */}
             {product.stock < 10 && (
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 bg-red-600 px-3 py-1 rounded-full shadow-lg shadow-red-600/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span className="text-[8px] uppercase tracking-[0.2em] font-black text-white">Rare Acquisition</span>
                </div>
             )}
        </div>
    );
}
