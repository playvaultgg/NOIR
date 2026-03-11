"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Chrome, Sparkles } from "lucide-react";

/**
 * Maison NOIR Login Page
 * Powered by ReactBits auth-2 block logic.
 * Features:
 * - Ultra-Luxury Glassmorphism UI
 * - Neural Identity Verification Flow
 * - Google OAuth Integration
 * - Cinematic Dark Noir Aesthetics
 */
export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/account");
                router.refresh();
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl: "/account" });
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-black px-6 relative overflow-hidden">
            {/* Visual Grain & Depth Decoration */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-noir-gold/5 via-transparent to-noir-gold/2" />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md relative z-10"
            >
                <div className="text-center mb-12 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                    >
                        <Sparkles size={14} />
                        Identity Verification
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-white tracking-tighter italic">
                        Maison NOIR
                    </h1>
                </div>

                <div className="glass-effect bg-noir-surface/40 rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden backdrop-blur-3xl">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-noir-gold/20 to-transparent" />
                    
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] uppercase tracking-widest text-center italic"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Email Identifier</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-14 py-5 rounded-2xl transition-all font-inter"
                                    placeholder="name@exclusive.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] uppercase tracking-[0.3em] text-white/40 ml-1">Secret Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-noir-black/40 border border-white/5 focus:border-noir-gold outline-none text-white text-sm px-14 py-5 rounded-2xl transition-all font-inter"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-noir-black py-5 font-black uppercase text-[10px] tracking-[0.4em] rounded-2xl hover:bg-noir-gold transition-all shadow-xl shadow-white/5 relative group overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {isLoading ? "Synchronizing..." : "Initialize Entry"}
                                {!isLoading && <LogIn size={14} className="group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </button>
                    </form>

                    <div className="relative my-12">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em]">
                            <span className="bg-transparent px-4 text-white/20">External Node</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-noir-black/40 border border-white/5 text-white/70 py-4 font-bold uppercase text-[9px] tracking-[0.3em] rounded-2xl hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-3 group"
                    >
                        <Chrome size={14} className="text-noir-gold group-hover:rotate-12 transition-transform" />
                        Continue with Google
                    </button>

                    <div className="mt-12 text-center">
                        <p className="text-[10px] text-white/30 uppercase tracking-[0.3em] italic">
                            New to the Maison?{" "}
                            <Link href="/register" className="text-noir-gold hover:text-white transition-colors underline underline-offset-8 decoration-noir-gold/30">
                                Apply for Access
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </main>
    );
}
