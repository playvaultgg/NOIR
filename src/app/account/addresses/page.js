"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import { 
    MapPin, 
    Plus, 
    MoreVertical, 
    Trash2, 
    Check, 
    Home, 
    Briefcase, 
    Star 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddressesPage() {
    const [addresses, setAddresses] = useState([
        {
            id: "1",
            type: "Vault Original",
            isDefault: true,
            street: "7th Avenue Elite Block, Suite 402",
            city: "Manhattan",
            state: "NY",
            postalCode: "10001",
            country: "United States",
            tag: "Home"
        }
    ]);

    const [isAdding, setIsAdding] = useState(false);

    return (
        <DashboardLayout>
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="space-y-2">
                        <h2 className="text-noir-gold uppercase tracking-[0.4em] text-[10px] md:text-xs font-inter mb-4">
                            Logistics Protocol
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-playfair text-white tracking-tight italic">
                            Concierge Addresses
                        </h1>
                        <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-medium">
                            Manage your global delivery destinations for sovereign fulfillment.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="group flex items-center gap-4 px-8 py-5 bg-[#C6A972] text-[#0A0A0A] rounded-xl text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-noir-gold/10"
                    >
                        <Plus size={16} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-500" />
                        Add New Destination
                    </button>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {addresses.map((addr, i) => (
                            <motion.div
                                key={addr.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative glass-effect p-8 rounded-[2rem] border transition-all group overflow-hidden ${
                                    addr.isDefault 
                                    ? "bg-noir-surface/40 border-noir-gold/30 shadow-2xl shadow-noir-gold/5" 
                                    : "bg-noir-surface/20 border-white/5 hover:border-white/20"
                                }`}
                            >
                                {/* Background Accent */}
                                {addr.isDefault && (
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-noir-gold/5 blur-[40px] rounded-full pointer-events-none" />
                                )}

                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl border ${
                                            addr.isDefault ? "bg-noir-gold/10 border-noir-gold/20 text-noir-gold" : "bg-white/5 border-white/10 text-white/40"
                                        }`}>
                                            {addr.tag === "Home" ? <Home size={18} /> : <Briefcase size={18} />}
                                        </div>
                                        <div>
                                            <h3 className="text-white font-playfair text-xl italic">{addr.type}</h3>
                                            {addr.isDefault && (
                                                <span className="text-[8px] text-noir-gold font-black uppercase tracking-[0.2em] mt-1 block">Primary Destination</span>
                                            )}
                                        </div>
                                    </div>
                                    <button className="p-2 text-white/20 hover:text-white transition-colors">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-start gap-4 text-white/60">
                                        <MapPin size={16} className="mt-1 text-noir-gold/50" />
                                        <p className="text-sm font-inter leading-relaxed">
                                            {addr.street}<br />
                                            {addr.city}, {addr.state} {addr.postalCode}<br />
                                            {addr.country}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                                    <button className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors font-black">
                                        Edit Details
                                    </button>
                                    <div className="flex gap-4">
                                        {!addr.isDefault && (
                                            <button className="text-[9px] uppercase tracking-widest text-noir-gold hover:text-white transition-colors font-black">
                                                Set Default
                                            </button>
                                        )}
                                        <button className="p-2 text-red-500/30 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Empty/Add Placeholder */}
                        <motion.button
                            onClick={() => setIsAdding(true)}
                            className="h-full min-h-[300px] border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center p-8 group hover:border-noir-gold/30 hover:bg-noir-gold/[0.02] transition-all cursor-pointer"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-noir-gold/10 transition-all border border-white/5 group-hover:border-noir-gold/20">
                                <Plus size={24} className="text-white/20 group-hover:text-noir-gold transition-colors" />
                            </div>
                            <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20 group-hover:text-white transition-colors">Initialize New Protocol</p>
                        </motion.button>
                    </AnimatePresence>
                </div>

                {/* Info Card */}
                <div className="glass-effect bg-noir-surface/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-20 h-20 shrink-0 bg-noir-gold/10 rounded-full flex items-center justify-center border border-noir-gold/20 text-noir-gold">
                        <Star size={32} strokeWidth={1} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-playfair text-white mb-2 italic">Elite Fulfillment Logistics</h3>
                        <p className="text-white/40 text-[11px] uppercase tracking-[0.2em] leading-relaxed max-w-2xl font-medium">
                            Every destination is verified against our global logistics engine. For sovereign locations outside standard jurisdictions, please contact your personal Maison Concierge.
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
