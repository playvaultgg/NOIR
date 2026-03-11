"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronRight,
    ChevronDown,
    ShieldCheck,
    Lock,
    CreditCard,
    Truck,
    ArrowLeft,
    ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/store/useCart";

export default function CheckoutPage() {
    const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const { items, getTotal, clearCart } = useCart();
    const subtotal = getTotal();

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, totalAmount: total }),
            });

            if (res.ok) {
                clearCart();
                router.push("/checkout/success");
            } else {
                console.error("Checkout Failed");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            setIsProcessing(false);
        }
    };
    const shipping = 0; // Free for luxury tier
    const total = subtotal + shipping;

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center space-y-8">
                <div className="opacity-20 flex flex-col items-center translate-y-[-20%]">
                    <ShoppingBag size={80} strokeWidth={1} className="text-white" />
                    <h2 className="text-2xl font-playfair text-white mt-8">Your bag is currently empty</h2>
                </div>
                <Link
                    href="/shop"
                    className="px-12 py-5 border border-white/20 text-[11px] uppercase tracking-[0.4em] text-white hover:border-gold hover:text-gold transition-all duration-500"
                >
                    Return to Collections
                </Link>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-black text-white font-inter selection:bg-gold/30">

            {/* MINIMALIST HEADER */}
            <header className="p-8 lg:px-24 flex items-center justify-between border-b border-white/5">
                <Link href="/" className="flex items-center gap-4 text-white/40 hover:text-white transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-medium">Continue Shopping</span>
                </Link>
                <span className="text-3xl font-playfair tracking-[0.2em] relative left-[-4%]">NOIR</span>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-gold/60" />
                    <span className="text-[9px] uppercase tracking-widest text-white/30 hidden md:block">Secure Session</span>
                </div>
            </header>

            <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row min-h-[calc(100vh-100px)]">

                {/* LEFT COLUMN: MULTI-STEP ACCORDION */}
                <section className="w-full lg:w-[60%] lg:border-r border-white/5 p-8 lg:p-24 space-y-8">

                    {/* STEP 1: SHIPPING */}
                    <CheckoutStep
                        number={1}
                        title="Shipping Details"
                        active={step === 1}
                        completed={step > 1}
                        onEdit={() => setStep(1)}
                    >
                        <form className="grid grid-cols-2 gap-6 pt-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                            <Input label="First Name" placeholder="Alexander" span={1} />
                            <Input label="Last Name" placeholder="Sterling" span={1} />
                            <Input label="Email Address" placeholder="alex@sterling.com" span={2} type="email" />
                            <Input label="Shipping Address" placeholder="102 Nocturne Plaza, Elite District" span={2} />
                            <Input label="City" placeholder="New York" span={1} />
                            <Input label="Postal Code" placeholder="10001" span={1} />
                            <div className="col-span-2 pt-6">
                                <button
                                    type="submit"
                                    className="w-full h-16 bg-white text-black text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all duration-500 shadow-xl"
                                >
                                    Continue to Delivery
                                </button>
                            </div>
                        </form>
                    </CheckoutStep>

                    {/* STEP 2: DELIVERY */}
                    <CheckoutStep
                        number={2}
                        title="Delivery Method"
                        active={step === 2}
                        completed={step > 2}
                        onEdit={() => setStep(2)}
                    >
                        <div className="space-y-4 pt-6">
                            <DeliveryOption
                                title="Global Express"
                                desc="Complimentary · 2-4 Business Days"
                                price="Free"
                                selected={true}
                            />
                            <button
                                onClick={() => setStep(3)}
                                className="w-full h-16 bg-white text-black text-[12px] uppercase tracking-[0.4em] font-bold hover:bg-gold transition-all duration-500 shadow-xl mt-8"
                            >
                                Continue to Payment
                            </button>
                        </div>
                    </CheckoutStep>

                    {/* STEP 3: PAYMENT */}
                    <CheckoutStep
                        number={3}
                        title="Payment Information"
                        active={step === 3}
                        completed={false}
                    >
                        <div className="pt-6 space-y-10">
                            <div className="p-8 border border-white/10 bg-white/5 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <CreditCard size={80} strokeWidth={1} />
                                </div>
                                <div className="relative z-10 space-y-8">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-8 bg-white/10 rounded-sm flex items-center justify-center"><span className="text-[8px] font-bold">VISA</span></div>
                                            <div className="w-12 h-8 bg-white/10 rounded-sm flex items-center justify-center"><span className="text-[8px] font-bold">MC</span></div>
                                            <div className="w-12 h-8 bg-white/10 rounded-sm flex items-center justify-center"><span className="text-[8px] font-bold">AMEX</span></div>
                                        </div>
                                        <Lock size={16} className="text-gold/60" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <Input label="Cardholder Name" placeholder="Alexander Sterling" span={2} />
                                        <Input label="Card Number" placeholder="••••  ••••  ••••  4821" span={2} />
                                        <Input label="Expiration Date" placeholder="MM / YY" span={1} />
                                        <Input label="CVV" placeholder="•••" span={1} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full h-16 bg-gold text-black text-[12px] uppercase tracking-[0.4em] font-bold flex items-center justify-center gap-4 hover:bg-white transition-all duration-500 shadow-2xl shadow-gold/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? "Processing..." : "Complete Luxury Order"}
                                </button>
                                <p className="text-[10px] text-center uppercase tracking-widest text-white/30 pt-4 flex items-center justify-center gap-3">
                                    <ShieldCheck size={14} className="text-gold/40" />
                                    Encrypted with AES-256 Bit SSL Protocol
                                </p>
                            </div>
                        </div>
                    </CheckoutStep>

                </section>

                {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
                <aside className="w-full lg:w-[40%] bg-charcoal/30 lg:h-screen lg:sticky lg:top-0 p-8 lg:p-24 overflow-y-auto no-scrollbar">
                    <div className="space-y-12">
                        <h4 className="text-sm uppercase tracking-[0.4em] text-white/60 font-medium">Order Summary</h4>

                        <div className="space-y-8">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-6 items-center">
                                    <div className="w-16 aspect-[3/4] bg-white/5 flex-shrink-0 relative">
                                        <img
                                            src={item.imageUrls?.[0] || item.images?.[0] || "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop"}
                                            className="w-full h-full object-cover grayscale-[30%] opacity-80"
                                        />
                                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-gold text-black text-[9px] font-bold flex items-center justify-center rounded-full">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-grow">
                                        <h5 className="text-[12px] font-playfair text-white">{item.name}</h5>
                                        <p className="text-[9px] uppercase tracking-widest text-white/30 mt-1">{item.brand || "NOIR COLLECTION"}</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-white italic">${(item.price * item.quantity).toLocaleString()}.00</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-12 border-t border-white/5">
                            <div className="flex justify-between text-[11px] uppercase tracking-widest text-white/40">
                                <span>Subtotal</span>
                                <span className="text-white">${subtotal.toLocaleString()}.00</span>
                            </div>
                            <div className="flex justify-between text-[11px] uppercase tracking-widest text-white/40">
                                <span>Shipping</span>
                                <span className="text-gold font-bold">Complimentary</span>
                            </div>
                            <div className="flex justify-between items-center pt-8">
                                <span className="text-[12px] uppercase tracking-[0.4em] text-white font-bold">Total</span>
                                <span className="text-3xl font-playfair font-bold text-gold italic">${total.toLocaleString()}.00</span>
                            </div>
                        </div>

                        <div className="pt-12 p-8 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-6">
                            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                <Truck size={20} />
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 leading-relaxed font-medium">
                                Your order is eligible for <br />
                                <span className="text-white">Eco-Conscious Express delivery.</span>
                            </p>
                        </div>
                    </div>
                </aside>

            </div>
        </main>
    );
}

function CheckoutStep({ number, title, active, completed, onEdit, children }) {
    return (
        <div className={`transition-all duration-700 ${completed ? "opacity-60" : "opacity-100"}`}>
            <div className="flex items-center justify-between group">
                <div className="flex items-center gap-6">
                    <div className={`w-10 h-10 rounded-full border flex items-center justify-center text-[11px] font-bold transition-all duration-500 ${active ? "bg-gold border-gold text-black shadow-lg shadow-gold/20 scale-110" : "border-white/10 text-white/20"
                        }`}>
                        {completed ? "✓" : number}
                    </div>
                    <h3 className={`text-sm uppercase tracking-[0.4em] font-medium transition-colors ${active ? "text-gold" : "text-white/40"}`}>
                        {title}
                    </h3>
                </div>
                {completed && (
                    <button onClick={onEdit} className="text-[10px] uppercase tracking-widest text-gold opacity-0 group-hover:opacity-100 transition-opacity border-b border-gold/40">
                        Edit Details
                    </button>
                )}
            </div>
            <AnimatePresence>
                {active && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Input({ label, placeholder, span = 2, type = "text" }) {
    return (
        <div className={`space-y-2 col-span-${span}`}>
            <label className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/30 ml-1">{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10"
            />
        </div>
    );
}

function DeliveryOption({ title, desc, price, selected }) {
    return (
        <div className={`p-6 border flex items-center justify-between cursor-pointer transition-all duration-300 ${selected ? "border-gold bg-gold/5" : "border-white/10 hover:border-white/30"
            }`}>
            <div className="flex items-center gap-6">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? "border-gold" : "border-white/20"}`}>
                    {selected && <div className="w-2.5 h-2.5 bg-gold rounded-full" />}
                </div>
                <div>
                    <h5 className="text-[11px] uppercase tracking-widest text-white font-bold">{title}</h5>
                    <p className="text-[10px] uppercase tracking-widest text-white/30 mt-1">{desc}</p>
                </div>
            </div>
            <span className="text-[11px] uppercase tracking-widest font-bold italic text-gold">{price}</span>
        </div>
    );
}
