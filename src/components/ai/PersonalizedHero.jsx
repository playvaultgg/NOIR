"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getUserStyleProfile } from "@/modules/ai/ai.service";
import { useSession } from "next-auth/react";

export default function PersonalizedHero() {
    const { data: session } = useSession();
    const [profile, setProfile] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        async function fetchPersonalization() {
            // 1. Fetch Identity Profile
            const profileData = await getUserStyleProfile(session?.user?.id);
            setProfile(profileData);

            // 2. Fetch Behavioral Signature
            const signature = JSON.parse(localStorage.getItem("maison_signature_v1") || "[]");
            if (signature.length > 0) {
                const lastId = signature[0]; // Most recent
                try {
                    const res = await fetch(`/api/products/${lastId}`);
                    const productData = await res.json();
                    if (productData) {
                        setSpotlightProduct(productData);
                    }
                } catch (e) {
                    console.warn("Personalization spotlight failed to materialize.");
                }
            }
            
            setIsLoaded(true);
        }
        fetchPersonalization();
    }, [session?.user?.id]);

    const [spotlightProduct, setSpotlightProduct] = useState(null);

    if (!isLoaded || !profile) return null;

    return (
        <section className="relative min-h-[80vh] w-full flex items-center justify-center overflow-hidden bg-noir-black py-32">
            {/* Neural Background Gradients */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-noir-gold/20 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-white/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-24 flex flex-col lg:flex-row items-center gap-24">

                {/* Profile Identity Card */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full lg:w-1/2 space-y-12"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.6em] font-black">
                            <Sparkles size={16} />
                            Neural Style Identification
                        </div>
                        <h1 className="text-6xl lg:text-8xl font-playfair text-white italic tracking-tight leading-none">
                            Welcome Back, <br />
                            <span className="text-white/40 not-italic">{session?.user?.name?.split(' ')[0] || "Collector"}</span>
                        </h1>
                    </div>

                    <div className="glass-effect bg-white/[0.02] border border-white/5 rounded-3xl p-10 space-y-8 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-noir-gold/10 transition-colors duration-1000">
                            <User size={120} strokeWidth={0.5} />
                        </div>

                        <div className="space-y-2 relative z-10">
                            <p className="text-[10px] uppercase tracking-widest text-white/30">Current Aesthetic</p>
                            <h3 className="text-3xl font-playfair text-white italic">{profile.aesthetic}</h3>
                        </div>

                        <div className="flex flex-wrap gap-3 relative z-10">
                            {profile.tags.map(tag => (
                                <span key={tag} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest text-white/60">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="pt-8 flex items-center justify-between relative z-10 border-t border-white/5">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest text-white/30">Maison Tier</p>
                                <p className="text-[10px] text-noir-gold font-black uppercase tracking-widest mt-1">{profile.loyaltyTier}</p>
                            </div>
                            <Link href="/account" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-noir-gold hover:bg-noir-gold hover:text-noir-black transition-all">
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* AI Visual Spotlight */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full lg:w-1/2 relative aspect-[4/5] lg:aspect-square"
                >
                    <div className="absolute inset-0 border border-white/5 rounded-3xl overflow-hidden group">
                        <Image
                            src={spotlightProduct?.images?.[0] || spotlightProduct?.imageUrls?.[0] || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop"}
                            alt={spotlightProduct?.name || "Recommended for Your Style"}
                            fill
                            className="object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-noir-black via-transparent to-transparent opacity-60" />

                        <div className="absolute bottom-10 left-10 space-y-4">
                            <p className="text-noir-gold text-[10px] uppercase tracking-[0.4em] font-black">Inspired by Your Curation</p>
                            <h2 className="text-4xl font-playfair text-white italic tracking-tight">{spotlightProduct?.name || "The Onyx Winter Series"}</h2>
                            <Link href={spotlightProduct ? `/product/${spotlightProduct.id}` : "/shop"} className="inline-flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white border-b border-white/20 pb-1 hover:border-noir-gold hover:text-noir-gold transition-all">
                                {spotlightProduct ? "Examine Selection" : "Examine The Sequence"}
                            </Link>
                        </div>
                    </div>

                    {/* Technical Node Triggers */}
                    <div className="absolute -top-6 -right-6 w-32 h-32 glass-effect rounded-2xl flex flex-col items-center justify-center text-center p-4 border border-white/10 animate-float">
                        <p className="text-[8px] uppercase tracking-widest text-white/30 mb-2">Confidence</p>
                        <p className="text-2xl font-playfair text-noir-gold italic font-bold leading-none">98%</p>
                        <p className="text-[7px] uppercase tracking-widest text-white/10 mt-2">Neural Match</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
