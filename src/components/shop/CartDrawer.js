"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/store/useCart";
import Link from "next/link";
import { parseImages } from "@/lib/utils";

export default function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } = useCart();

    const handleCheckoutClick = () => {
        closeCart();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] cursor-pointer"
                    />

                    {/* DRAWER PANEL */}
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-charcoal border-l border-white/5 z-[210] shadow-2xl flex flex-col"
                    >
                        {/* HEADER */}
                        <header className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <ShoppingBag size={20} className="text-gold" />
                                <h3 className="text-sm uppercase tracking-[0.4em] text-white font-inter font-medium leading-none mt-1">
                                    Shopping Bag
                                </h3>
                            </div>
                            <button
                                onClick={closeCart}
                                className="text-white/40 hover:text-gold transition-colors"
                                aria-label="Close cart"
                            >
                                <X size={24} strokeWidth={1.5} />
                            </button>
                        </header>

                        {/* ITEMS LIST */}
                        <div className={`flex-grow overflow-y-auto no-scrollbar p-8 ${items.length === 0 ? "flex items-center justify-center" : ""}`}>
                            {items.length === 0 ? (
                                <div className="text-center space-y-4 opacity-20">
                                    <ShoppingBag size={48} strokeWidth={1} className="mx-auto" />
                                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium">Your bag is empty</p>
                                </div>
                            ) : (
                                <div className="space-y-10">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 group animate-in fade-in slide-in-from-right-4 duration-500">
                                            <div className="w-24 aspect-[3/4] bg-white/5 overflow-hidden flex-shrink-0 border border-white/5">
                                                <img
                                                    src={parseImages(item.imageUrls || item.images)[0] || "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop"}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover grayscale-[20%] group-hover:scale-110 transition-transform duration-700"
                                                />
                                            </div>

                                            <div className="flex-grow flex flex-col justify-between py-1">
                                                <div className="space-y-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-[11px] uppercase tracking-widest text-white/50">{item.brand || "NOIR COLLECTION"}</h4>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-white/20 hover:text-red-400 transition-colors"
                                                        >
                                                            <Trash2 size={14} strokeWidth={1.5} />
                                                        </button>
                                                    </div>
                                                    <h5 className="text-lg font-playfair text-white">{item.name}</h5>
                                                </div>

                                                <div className="flex items-center justify-between mt-4">
                                                    <div className="flex items-center border border-white/10 rounded-sm">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-2 text-white/40 hover:text-white transition-colors"
                                                        >
                                                            <Minus size={12} />
                                                        </button>
                                                        <span className="w-8 text-center text-[10px] text-white font-medium">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-2 text-white/40 hover:text-white transition-colors"
                                                        >
                                                            <Plus size={12} />
                                                        </button>
                                                    </div>
                                                    <p className="text-[11px] font-bold text-gold italic tracking-widest">
                                                        ${(item.price * item.quantity).toLocaleString()}.00
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* FOOTER / CHECKOUT */}
                        {items.length > 0 && (
                            <footer className="p-8 border-t border-white/5 bg-charcoal/50 space-y-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                                        <span>Subtotal</span>
                                        <span className="text-white font-medium italic">${getTotal().toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-white/40">
                                        <span>Shipping</span>
                                        <span className="text-gold italic font-bold">Complimentary</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center py-4 border-t border-white/5">
                                    <span className="text-[11px] uppercase tracking-[0.4em] text-white font-bold">Estimated Total</span>
                                    <span className="text-2xl font-bold font-playfair text-gold italic">${getTotal().toLocaleString()}.00</span>
                                </div>

                                <Link
                                    href="/checkout"
                                    onClick={handleCheckoutClick}
                                    className="w-full h-16 bg-gold text-black text-[11px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-4 group hover:bg-white transition-all duration-500 shadow-2xl shadow-gold/20"
                                >
                                    Proceed to Secure Checkout
                                    <ArrowRight size={16} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
                                </Link>

                                <p className="text-[9px] text-center uppercase tracking-widest text-white/20 mt-4 leading-relaxed">
                                    By proceeding, you agree to the NOIR <br />
                                    <span className="text-gold/40 border-b border-gold/10 pb-0.5 cursor-pointer hover:text-gold transition-colors">Client Sales Agreements & Privacy Policy.</span>
                                </p>
                            </footer>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}
