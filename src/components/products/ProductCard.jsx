"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

import { useWishlistStore } from "@/store/wishlistStore";
import ScarcityBadge from "@/components/cro/ScarcityBadge";

export default function ProductCard({
    product = {
        id: "m1",
        name: "Onyx Silk Trench",
        price: "₹85,000",
        priceAmount: 85000,
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000&auto=format&fit=crop"
        ],
        stock: 3,
        isLimitedDrop: true
    }
}) {
    // Data Normalization Layer: Support both DB (imageUrls) and Mock (images) formats
    const productImages = product.images || product.imageUrls || [];

    const [isHovered, setIsHovered] = useState(false);
    const addItem = useCartStore((state) => state.addItem);
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
            className="relative group w-full flex flex-col cursor-pointer perspective-[1000px] mb-8"
        >
            {/* Visual Product Box */}
            <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-noir-surface rounded-sm shadow-2xl transition-shadow duration-500 group-hover:shadow-noir-gold/5">

                {/* Main Image */}
                <Image
                    src={productImages[0] || "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop"}
                    alt={product.name}
                    fill
                    className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-0" : "opacity-100"}`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Hover Image Swap */}
                <Image
                    src={productImages[1] || productImages[0] || "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2080&auto=format&fit=crop"}
                    alt={`${product.name} alternate view`}
                    fill
                    className={`object-cover transition-opacity duration-700 ${isHovered ? "opacity-100" : "opacity-0"} scale-105 group-hover:scale-100 transition-transform`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Soft gold glow overlay on hover */}
                <div className="absolute inset-0 bg-noir-gold/0 group-hover:bg-noir-gold/[0.03] transition-colors duration-700 pointer-events-none" />

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
                <div className="absolute bottom-4 left-4 right-4 translate-y-[120%] group-hover:translate-y-0 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-10">
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
                        className="w-full glass-effect bg-black/60 hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-white text-[9px] uppercase tracking-[0.3em] py-3.5 flex items-center justify-center gap-2 font-bold"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Quick Purchase
                    </button>
                </div>
            </Link>

            {/* Product Metadata */}
            <div className="mt-5 flex flex-col text-left px-1">
                <h3 className="font-playfair text-xl text-white group-hover:text-noir-gold transition-colors duration-500 tracking-tight">
                    {product.name}
                </h3>
                <div className="flex items-center justify-between mt-1.5">
                    <p className="text-white/40 text-[10px] font-inter uppercase tracking-[0.2em]">
                        New Arrival
                    </p>
                    <p className="text-noir-gold text-sm font-inter font-medium tracking-wider">
                        {product.price}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
