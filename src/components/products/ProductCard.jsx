"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

import { useWishlistStore } from "@/store/wishlistStore";
import ScarcityBadge from "@/components/cro/ScarcityBadge";
import QuickLook3D from "@/components/3d/QuickLook3D";
import { useCurrency } from "@/context/CurrencyContext";

export default function ProductCard({
    product = {
        id: "m1",
        name: "Onyx Silk Trench",
        price: 85000,
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000&auto=format&fit=crop"
        ],
        stock: 3,
        isLimitedDrop: true
    }
}) {
    const { formatPrice, currency } = useCurrency();
    // Data Normalization Layer: Support both DB (imageUrls) and Mock (images) formats
    const productImages = product.images || product.imageUrls || [];

    const [isHovered, setIsHovered] = useState(false);
    const { addItem, addOutfitItem } = useCartStore();
    const { toggleWishlist, isInWishlist } = useWishlistStore();
    const wishlisted = isInWishlist(product.id);

    // 3D Tilt Effect Setup (Framer Motion)
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Calculate mouse position relative to center of card
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Normalize values between -0.5 and 0.5
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="relative group w-full flex flex-col cursor-pointer perspective-[1000px] mb-12 transition-all duration-500 hover:scale-[1.02]"
        >
            {/* Visual Product Box */}
            <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-noir-surface rounded-sm shadow-xl transition-all duration-500 hover:shadow-2xl group-hover:shadow-noir-gold/10">

                {/* 3D Quick-Look Transition */}
                <AnimatePresence>
                    {isHovered && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 z-10"
                        >
                            <QuickLook3D color="#C6A972" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Image (Visible when not hovered/3D active) */}
                <Image
                    src={productImages[0] || "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop"}
                    alt={product.name}
                    fill
                    className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-20" : "opacity-100"}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Soft gold glow overlay on hover */}
                <div className="absolute inset-0 bg-noir-gold/0 group-hover:bg-noir-gold/[0.05] transition-colors duration-700 pointer-events-none" />

                {/* Wishlist Heart Icon */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                    }}
                    className={`absolute top-4 right-4 z-10 p-2.5 transition-all backdrop-blur-md border rounded-full ${wishlisted
                        ? "bg-noir-gold text-noir-black border-noir-gold shadow-lg shadow-noir-gold/20"
                        : "bg-black/20 text-white/50 hover:text-white border-white/10"
                        }`}
                >
                    <Heart
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${wishlisted ? "scale-110 fill-current" : ""}`}
                        strokeWidth={1.5}
                    />
                </button>

                {/* Scarcity System Injection */}
                <div className="absolute top-4 left-4 z-10 transition-transform duration-500 group-hover:translate-x-1">
                    <ScarcityBadge stock={product.stock} isLimitedDrop={product.isLimitedDrop} />
                </div>

                {/* Quick Add To Cart */}
                <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-10 flex gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem({
                                id: product.id,
                                name: product.name,
                                priceAmount: product.priceAmount,
                                image: productImages[0],
                                size: "M"
                            });
                        }}
                        className="flex-1 glass-effect bg-black/60 hover:bg-[#C6A972] hover:text-black hover:border-transparent transition-colors duration-300 text-white text-[10px] md:text-xs uppercase tracking-[0.2em] h-12 flex items-center justify-center gap-2 font-black border border-white/10 rounded-sm"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Quick Purchase
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addOutfitItem({
                                ...product,
                                image: productImages[0]
                            });
                        }}
                        className="w-12 h-12 glass-effect bg-black/60 hover:bg-white hover:text-black hover:border-transparent transition-colors duration-300 text-white border border-white/10 rounded-sm flex items-center justify-center shrink-0"
                        title="Add to Outfit Builder"
                    >
                        <Sparkles className="w-4 h-4" />
                    </button>
                </div>
            </Link>

            {/* Product Metadata */}
            <div className="mt-6 flex flex-col text-left px-1">
                <h3 className="font-playfair text-xl text-white group-hover:text-noir-gold transition-colors duration-500 tracking-tight">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between mt-1.5">
                    <div className="flex flex-col gap-3">
                        <p className="text-white/40 text-[10px] font-inter uppercase tracking-[0.2em]">
                            New Arrival
                        </p>
                        {/* Prompt 3: Color Variant Preview */}
                        <div className="flex gap-1.5">
                            {["#C6A972", "#FAFAFA", "#000000"].map((color) => (
                                <div 
                                    key={color} 
                                    className="w-2.5 h-2.5 rounded-full border border-white/10 hover:border-white transition-colors cursor-crosshair"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </div>
                    <p className="text-noir-gold text-sm font-inter font-medium tracking-wider">
                        {formatPrice(product.price || product.priceAmount || 0)}
                    </p>
                </div>
            </div>

            {/* SEO Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org/",
                        "@type": "Product",
                        "name": product.name,
                        "image": productImages[0],
                        "offers": {
                            "@type": "Offer",
                            "priceCurrency": currency,
                            "price": product.price || product.priceAmount || 0,
                            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
                        }
                    })
                }}
            />
        </motion.div>
    );
}
