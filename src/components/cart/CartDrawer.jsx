"use client";

import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartDrawer() {
    const { items, isOpen, closeCart, increaseQty, decreaseQty, removeItem, getSubtotal } = useCartStore();
    const [mounted, setMounted] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const subtotal = getSubtotal();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Blur Layer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-noir-black/90 backdrop-blur-xl z-[100]"
                    />

                    {/* Drawer Slide Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 40, stiffness: 200 }}
                        className="fixed top-0 right-0 bottom-0 w-full max-w-lg bg-noir-surface border-l border-white/5 z-[101] flex flex-col shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden"
                    >
                        {/* Elegant Header with Noise Overlay */}
                        <div className="flex items-center justify-between p-10 border-b border-white/5 relative bg-gradient-to-r from-noir-black to-noir-surface">
                            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                            <div className="relative z-10">
                                <h2 className="text-3xl font-playfair tracking-[0.05em] text-white italic">Your Selection</h2>
                                <p className="text-[8px] uppercase tracking-[0.5em] text-noir-gold font-black mt-2">Maison Repository / Vault {items.length}</p>
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-3 hover:bg-white/5 rounded-full transition-all group flex items-center gap-2 relative z-10"
                            >
                                <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 group-hover:text-white transition-colors">Dismiss</span>
                                <X strokeWidth={1} size={24} className="text-white/60 group-hover:text-white" />
                            </button>
                        </div>

                        {/* Cinematic Cart Content list */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-10 flex flex-col gap-10">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-8">
                                    <ShoppingBag size={80} strokeWidth={0.3} className="text-noir-gold/10" />
                                    <div className="text-center space-y-2">
                                        <p className="font-playfair text-2xl text-white/60 italic">Awaits Your Curation</p>
                                        <p className="font-inter uppercase tracking-[0.3em] text-[9px] font-black">Your bag is currently empty.</p>
                                    </div>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.div 
                                        layout
                                        key={`${item.id}-${item.size}`} 
                                        className="flex gap-8 group relative"
                                    >
                                        {/* Thumbnail Image with Zoom Hover */}
                                        <div className="relative w-32 h-44 flex-shrink-0 bg-noir-black overflow-hidden border border-white/5 rounded-sm">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100"
                                            />
                                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
                                        </div>

                                        {/* Metadata Engine */}
                                        <div className="flex flex-col flex-1 justify-between py-2">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-start gap-4">
                                                    <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase leading-relaxed font-inter">{item.name}</h3>
                                                    <button
                                                        onClick={() => removeItem(item.id, item.size)}
                                                        className="text-white/10 hover:text-white transition-colors p-1"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[8px] text-noir-gold uppercase tracking-[0.4em] font-black px-3 py-1 border border-noir-gold/20 bg-noir-gold/5 rounded-full">
                                                        Ref: {item.size}
                                                    </span>
                                                    <span className="text-[8px] text-white/30 uppercase tracking-[0.4em] font-black italic">Archival Quality</span>
                                                </div>
                                            </div>

                                            {/* Precise Quantity & Luxury Price Control */}
                                            <div className="flex items-center justify-between w-full mt-8">
                                                <div className="flex items-center bg-white/5 border border-white/5 rounded-full px-3 py-1.5 backdrop-blur-md">
                                                    <button
                                                        onClick={() => decreaseQty(item.id, item.size)}
                                                        className="p-1.5 hover:text-noir-gold transition-colors text-white/20"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-xs w-8 text-center font-black font-inter text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => increaseQty(item.id, item.size)}
                                                        className="p-1.5 hover:text-noir-gold transition-colors text-white/20"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-black mb-1 italic">Acquisition Value</p>
                                                    <p className="text-xl tracking-tighter text-white font-medium italic">
                                                        ₹{(item.priceAmount || 0).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Premium Checkout Action */}
                        {items.length > 0 && (
                            <div className="p-10 bg-noir-black/60 backdrop-blur-3xl border-t border-white/5 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[9px] uppercase tracking-[0.5em] font-black text-white/20">Aggregate Total</span>
                                        <div className="flex items-center gap-3">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[8px] text-white/40 uppercase tracking-[0.4em] font-bold">Secure Protocol Active</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-3xl font-playfair tracking-tighter block text-white italic">
                                            ₹{(subtotal || 0).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Archival Confirmation Step */}
                                <div 
                                    onClick={() => setConfirmed(!confirmed)}
                                    className="p-6 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${confirmed ? "bg-noir-gold border-noir-gold shadow-[0_0_15px_rgba(198,169,114,0.4)]" : "border-white/20 group-hover:border-white/40"}`}>
                                            {confirmed && <Check size={12} className="text-noir-black font-black" />}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] uppercase tracking-[0.3em] text-white font-black">Archival Confirmation</p>
                                            <p className="text-[8px] uppercase tracking-[0.2em] text-white/30 italic font-medium">I understand these pieces are part of the sovereign archive series.</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/checkout" onClick={(e) => !confirmed && e.preventDefault()}>
                                    <button 
                                        disabled={!confirmed}
                                        className={`w-full relative group overflow-hidden py-6 flex items-center justify-center font-black rounded-sm transition-all duration-700 ${confirmed ? "bg-white text-noir-black shadow-[0_0_40px_rgba(255,255,255,0.1)] active:scale-95" : "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed grayscale"}`}
                                    >
                                        <span className="absolute inset-0 bg-noir-gold w-0 group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                                        <span className="relative z-10 text-[10px] uppercase tracking-[0.5em] font-black">
                                            Initialize Acquisition
                                        </span>
                                    </button>
                                </Link>

                                <div className="flex items-center justify-center gap-4 opacity-10 pt-2">
                                    <div className="h-[1px] flex-1 bg-white" />
                                    <p className="text-[7px] text-white uppercase tracking-[0.6em] whitespace-nowrap font-black">Maison NOIR Concierge Endorsed</p>
                                    <div className="h-[1px] flex-1 bg-white" />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

function Check(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    )
}

