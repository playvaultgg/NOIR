"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AvatarViewer from "@/components/avatar/AvatarViewer";
import AvatarCustomizer from "@/components/avatar/AvatarCustomizer";
import { User, ShieldCheck, Zap, ArrowRight, Camera, UserPlus, Sparkles } from "lucide-react";
import Link from "next/link";

/**
 * Maison Noir Avatar Synthesis Page (Phase 8.6)
 */
export default function AvatarPage() {
    const { data: session } = useSession();
    const [step, setStep] = useState(1); // 1: Customize, 2: Synthesis, 3: Success
    const [isSaving, setIsSaving] = useState(false);
    const [avatarData, setAvatarData] = useState({
        bodyType: "ATHLETIC",
        skinTone: "#E0AC69",
        height: 1.8,
        weight: 75
    });

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const res = await fetch("/api/avatar");
                const data = await res.json();
                if (data.avatar) {
                    setAvatarData(data.avatar);
                }
            } catch (err) {
                console.error("FAILED_TO_LOAD_AVATAR:", err);
            }
        };
        fetchAvatar();
    }, []);

    const handleUpdate = (updates) => {
        setAvatarData(prev => ({ ...prev, ...updates }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setStep(2); // Synthesis state
        
        try {
            await fetch("/api/avatar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(avatarData)
            });
            
            setTimeout(() => {
                setIsSaving(false);
                setStep(3); // Success
            }, 3000);
        } catch (err) {
            console.error("AVATAR_SAVE_ERROR:", err);
            setIsSaving(false);
            setStep(1);
        }
    };

    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold selection:text-noir-black pt-24 pb-40">
            <div className="absolute inset-x-0 top-0 h-[80vh] bg-gradient-to-b from-noir-gold/5 via-transparent to-transparent blur-[150px] opacity-40 pointer-events-none" />
            
            <div className="max-w-screen-2xl mx-auto px-8 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                    
                    {/* Left: Viewport Corridor */}
                    <div className="lg:col-span-7 space-y-12">
                        <header className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                            >
                                <UserPlus size={16} />
                                Phase 8.6 / Persona Construction
                            </motion.div>
                            <motion.h1 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-6xl md:text-8xl font-playfair text-white italic tracking-tighter"
                            >
                                Digital <br /> Silhouette
                            </motion.h1>
                        </header>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <AvatarViewer 
                                bodyType={avatarData.bodyType} 
                                skinTone={avatarData.skinTone} 
                            />
                        </motion.div>
                    </div>

                    {/* Right: Technical Curation Corridor */}
                    <div className="lg:col-span-5 pt-12 lg:pt-48 h-fit lg:sticky lg:top-32 selection:bg-noir-gold selection:text-noir-black">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="customize"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-12"
                                >
                                    <AvatarCustomizer onUpdate={handleUpdate} currentAvatar={avatarData} />
                                    <button 
                                        onClick={handleSave}
                                        className="w-full bg-white text-noir-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] hover:bg-noir-gold transition-all shadow-2xl flex items-center justify-center gap-4"
                                    >
                                        <Zap size={14} className="animate-pulse" />
                                        Initialize Synthesis
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="synthesis"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center p-12 glass-effect bg-noir-surface/40 rounded-[3rem] border border-white/5 space-y-12 min-h-[500px]"
                                >
                                    <div className="w-32 h-32 border-2 border-noir-gold border-t-transparent rounded-full animate-spin flex items-center justify-center shadow-[0_0_60px_rgba(197,160,89,0.2)]">
                                        <Sparkles className="text-noir-gold animate-pulse" size={32} />
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-white font-playfair text-4xl italic">Synchronizing...</h3>
                                        <p className="text-white/30 text-[10px] uppercase tracking-[0.5em] max-w-xs mx-auto italic leading-loose">
                                            Handshaking with neural node 024. Mapping morphological weights to digital persona.
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="ready"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="glass-effect bg-noir-surface/40 p-12 rounded-[3rem] border border-white/5 space-y-12"
                                >
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4 text-green-500 text-[10px] uppercase tracking-[0.5em] font-black italic">
                                            <ShieldCheck size={18} />
                                            Identity Verified
                                        </div>
                                        <h3 className="text-white font-playfair text-5xl italic tracking-tight">Persona Active</h3>
                                        <p className="text-white/30 text-sm font-light italic leading-loose">
                                            Your digital silhouette is now integrated into the Maison Noir ecosystem. You can now utilize the virtual try-on engine in the digital showroom and across all product curations.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <Link href="/showroom" className="w-full bg-white text-noir-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] flex items-center justify-center gap-4 hover:bg-noir-gold transition-all shadow-xl">
                                             Enter 3D Showroom
                                             <ArrowRight size={14} />
                                        </Link>
                                        <button 
                                            onClick={() => setStep(1)}
                                            className="w-full bg-white/5 border border-white/5 text-white/40 py-6 rounded-2xl text-[10px] uppercase tracking-[0.5em] font-black hover:text-white transition-all flex items-center justify-center gap-4"
                                        >
                                            <Camera size={14} />
                                            Recalibrate Identity
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </main>
    );
}
