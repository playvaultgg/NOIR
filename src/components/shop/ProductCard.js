"use client";

import { motion } from "framer-motion";
import { Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/image";
import { useCart } from "@/store/useCart";

export default function ProductCard({ product }) {
    const { addItem } = useCart();
    // Placeholder images for the aesthetic if data isn't full yet
    const mainImage = product?.imageUrls?.[0] || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=1976&auto=format&fit=crop";
    const hoverImage = product?.imageUrls?.[1] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2040&auto=format&fit=crop";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative flex flex-col bg-charcoal/10 rounded-sm overflow-hidden"
        >
            {/* IMAGE CONTAINER */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal/5">
                {/* Main Image */}
                <img
                    src={mainImage}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Hover Secondary Image (Lifestyle Shot) */}
                <img
                    src={hoverImage}
                    alt={`${product.name} Lifestyle`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                />

                {/* QUICK ADD CTA */}
                <div className="absolute bottom-4 right-4 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem(product);
                        }}
                        className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-black hover:bg-gold hover:text-white transition-colors"
                        aria-label="Quick Add"
                    >
                        <Plus size={18} strokeWidth={2} />
                    </button>
                </div>

                {/* TOP BADGE (E.g. NEW) */}
                {product.isFeatured && (
                    <span className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-white/10 backdrop-blur-md text-[9px] text-white uppercase tracking-[0.2em] font-medium border border-white/10">
                        Featured
                    </span>
                )}
            </div>

            {/* PRODUCT INFO */}
            <div className="flex flex-col py-6 px-1 space-y-1.5 cursor-pointer">
                <span className="text-[10px] uppercase font-inter tracking-[0.3em] text-white/40 font-medium">
                    {product.brand || "NOIR COLLECTION"}
                </span>

                <h3 className="text-xl md:text-2xl font-playfair text-white group-hover:text-gold transition-colors">
                    {product.name}
                </h3>

                <div className="flex items-baseline gap-3 pt-1">
                    <p className="text-sm font-inter font-medium tracking-widest text-gold italic">
                        ${product.price ? product.price.toLocaleString() : "995.00"}
                    </p>
                    {/* Subtle Stock Indicator for CRO */}
                    {product.stock < 5 && product.stock > 0 && (
                        <span className="text-[9px] uppercase tracking-widest text-red-400 opacity-60">Low Stock</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
