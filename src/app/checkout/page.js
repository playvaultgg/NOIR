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
    ShoppingBag,
    Sparkles,
    Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
    const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();
    const { items, getSubtotal, clearCart } = useCartStore();
    
    // Form States
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        postalCode: ""
    });

    // Coupon / Discount States
    const [couponCode, setCouponCode] = useState("");
    const [couponStatus, setCouponStatus] = useState({ loading: false, error: null, success: null });
    const [discountAmount, setDiscountAmount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const subtotal = getSubtotal();
    const shipping = 0; // Free for luxury tier
    const total = subtotal + shipping - discountAmount;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setCouponStatus({ loading: true, error: null, success: null });

        try {
            const res = await fetch("/api/commerce/coupons/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: couponCode, cartTotal: subtotal })
            });
            const data = await res.json();

            if (data.valid) {
                setDiscountAmount(data.discountAmount);
                setAppliedCoupon(data);
                setCouponStatus({ loading: false, error: null, success: `Protocol Accepted: -₹${data.discountAmount.toLocaleString()}` });
            } else {
                setCouponStatus({ loading: false, error: data.message || "Invalid Protocol", success: null });
            }
        } catch (error) {
            setCouponStatus({ loading: false, error: "Synchronization Failure", success: null });
        }
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch("/api/checkout/create-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    items, 
                    totalAmount: total,
                    couponCode: appliedCoupon?.code,
                    shippingAddress: formData
                }),
            });

            if (res.ok) {
                const session = await res.json();
                if (session.url) {
                    window.location.href = session.url;
                } else {
                    console.error("Invalid Stripe Session ID returned.");
                    setIsProcessing(false);
                }
            } else {
                console.error("Payment Gateway Initialization Failed");
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Error during checkout:", error);
            setIsProcessing(false);
        }
    };
    // Removal of redundant declarations (now managed above in state)

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
            <header className="p-10 lg:px-24 flex items-center justify-between border-b border-white/5 bg-[#050505]/80 backdrop-blur-3xl sticky top-0 z-50">
                <Link href="/" className="flex items-center gap-4 text-white/40 hover:text-white transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[9px] uppercase tracking-[0.4em] font-black">Back to Archives</span>
                </Link>
                <Link href="/" className="text-4xl font-playfair tracking-[0.3em] relative left-[-2%] text-white">NOIR</Link>
                <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                        <span className="text-[8px] uppercase tracking-[0.5em] text-noir-gold font-black">Secure Link</span>
                        <span className="text-[7px] uppercase tracking-widest text-white/20 font-mono">MD5: F23-A90</span>
                    </div>
                    <ShieldCheck size={20} className="text-noir-gold" />
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
                            <Input label="First Name" name="firstName" placeholder="Alexander" span={1} value={formData.firstName} onChange={handleInputChange} />
                            <Input label="Last Name" name="lastName" placeholder="Sterling" span={1} value={formData.lastName} onChange={handleInputChange} />
                            <Input label="Email Address" name="email" placeholder="alex@sterling.com" span={2} type="email" value={formData.email} onChange={handleInputChange} />
                            <Input label="Shipping Address" name="address" placeholder="102 Nocturne Plaza, Elite District" span={2} value={formData.address} onChange={handleInputChange} />
                            <Input label="City" name="city" placeholder="New York" span={1} value={formData.city} onChange={handleInputChange} />
                            <Input label="Postal Code" name="postalCode" placeholder="10001" span={1} value={formData.postalCode} onChange={handleInputChange} />
                            <div className="col-span-2 pt-6">
                                <button
                                    type="submit"
                                    className="w-full h-16 bg-[#C6A972] text-[#0A0A0A] text-sm uppercase font-inter font-semibold tracking-wide rounded-lg hover:bg-white hover:text-[#0A0A0A] hover:scale-105 transition-all duration-300 shadow-xl"
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
                                className="w-full h-16 bg-[#C6A972] text-[#0A0A0A] text-sm uppercase font-inter font-semibold tracking-wide rounded-lg hover:bg-white hover:text-[#0A0A0A] hover:scale-105 transition-all duration-300 shadow-xl mt-8"
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
                            {/* Prompt 9: Discount / Coupon System Integration */}
                            <div className="p-8 border border-white/5 bg-white/5 rounded-2xl space-y-6">
                                <div className="flex items-center justify-between">
                                    <h5 className="text-[10px] uppercase tracking-[0.4em] text-noir-gold font-black">Maison Protocol (Coupon)</h5>
                                    <Sparkles size={14} className="text-noir-gold" />
                                </div>
                                <div className="flex gap-4">
                                    <input 
                                        type="text" 
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        placeholder="ENTER PROTOCOL CODE" 
                                        className="flex-1 bg-noir-black border border-white/10 px-6 py-4 text-[10px] tracking-widest text-white focus:border-noir-gold outline-none transition-all placeholder:text-white/10 rounded-sm"
                                    />
                                    <button 
                                        onClick={handleApplyCoupon}
                                        disabled={couponStatus.loading || !couponCode}
                                        className="px-8 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest font-black hover:bg-white hover:text-noir-black transition-all rounded-sm disabled:opacity-50"
                                    >
                                        {couponStatus.loading ? "Synchronizing..." : "Apply"}
                                    </button>
                                </div>
                                {couponStatus.error && <p className="text-[9px] text-red-500 uppercase tracking-widest font-bold">{couponStatus.error}</p>}
                                {couponStatus.success && <p className="text-[9px] text-green-500 uppercase tracking-widest font-bold">{couponStatus.success}</p>}
                            </div>

                            <div className="p-8 border border-white/10 bg-white/5 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <CreditCard size={80} strokeWidth={1} />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-8 bg-white/10 rounded-sm flex items-center justify-center"><span className="text-[8px] font-bold">VISA</span></div>
                                            <div className="w-12 h-8 bg-white/10 rounded-sm flex items-center justify-center"><span className="text-[8px] font-bold">MC</span></div>
                                            <div className="w-12 h-8 bg-white/10 rounded-sm flex items-center justify-center"><span className="text-[8px] font-bold">AMEX</span></div>
                                        </div>
                                        <Lock size={16} className="text-gold/60" />
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-sm font-playfair italic">Maison Secure Checkout</h4>
                                        <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
                                            You will be redirected to our encrypted gateway to finalize your acquisition. All transactions are protected by AES-256 bit protocol.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full h-16 bg-[#C6A972] text-[#0A0A0A] text-sm uppercase font-inter font-semibold tracking-wide rounded-lg flex items-center justify-center gap-4 hover:bg-white hover:text-[#0A0A0A] hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isProcessing ? (
                                        <div className="flex items-center gap-3">
                                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                            Synchronizing Secure Gateway...
                                        </div>
                                    ) : (
                                        "Initiate Secure Acquisition"
                                    )}
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
                                    <span className="text-[10px] font-bold text-white italic">₹{(item.priceAmount * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 pt-10 border-t border-white/10">
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40 font-medium">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toLocaleString()}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-green-500 font-bold">
                                    <span>Discount (Protocol Applied)</span>
                                    <span>-₹{discountAmount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-white/40 font-medium pb-10">
                                <span>Logistics</span>
                                <span className="text-noir-gold">Complimentary</span>
                            </div>
                            
                            <div className="flex justify-between items-center border-t border-white/5 pt-10">
                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-black">Aggregate Total</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-noir-gold animate-pulse" />
                                        <span className="text-[8px] uppercase tracking-widest text-noir-gold font-black">Sovereign Registry Included</span>
                                    </div>
                                </div>
                                <span className="text-4xl font-playfair font-medium text-white italic tracking-tighter">₹{total.toLocaleString()}</span>
                            </div>
                        </div>

                        <div className="pt-12 p-10 bg-white/5 border border-white/5 rounded-[2rem] flex items-center gap-8 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-noir-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="w-16 h-16 bg-noir-gold/10 rounded-2xl flex items-center justify-center text-noir-gold relative z-10">
                                <Truck size={24} strokeWidth={1.5} />
                            </div>
                            <div className="relative z-10">
                                <p className="text-[10px] uppercase tracking-[0.3em] text-white font-black leading-relaxed">
                                    Priority Logistics <br />
                                    <span className="text-white/40 font-medium">Global Express Insured</span>
                                </p>
                            </div>
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

function Input({ label, name, placeholder, span = 2, type = "text", value, onChange }) {
    return (
        <div className={`space-y-2 col-span-${span}`}>
            <label className="text-[9px] uppercase tracking-[0.3em] font-medium text-white/30 ml-1">{label}</label>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 px-6 py-4 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10 rounded-sm"
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
