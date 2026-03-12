"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Send, Sparkles } from "lucide-react";

/**
 * Maison NOIR Forgot Password Page
 * Features:
 * - Split layout (Form on left, Animated visual/testimonial on right)
 * - Matching the luxury Auth-2 design system
 */
export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // Simulate API call for password reset
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
        } catch (err) {
            setError("Unable to process your request. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex bg-black">
            {/* ── Left Side: Reset Form ── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md"
                >
                    <div className="mb-10 lg:mb-16">
                        <Link href="/" className="inline-block mb-12 group">
                            <h2 className="font-playfair text-2xl tracking-[0.2em] text-white group-hover:text-[#C6A972] transition-colors">
                                N O I R
                            </h2>
                        </Link>
                        
                        {!isSubmitted ? (
                            <>
                                <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-3 italic font-playfair">
                                    Restore Access
                                </h1>
                                <p className="text-white/40 text-sm">
                                    Enter your email address and we&apos;ll send you a link to reset your secure key.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-3 italic font-playfair">
                                    Check your vault
                                </h1>
                                <p className="text-white/40 text-sm">
                                    We have sent a cryptographic reset link to <span className="text-white font-medium">{email}</span>.
                                </p>
                            </>
                        )}
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl"
                        >
                            {error}
                        </motion.div>
                    )}

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80 uppercase tracking-widest text-[10px]">Email address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C6A972] transition-colors" size={18} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 focus:border-[#C6A972] outline-none text-white text-sm px-12 py-3.5 rounded-xl transition-all"
                                        placeholder="Enter your registered email"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#C6A972] text-[#0A0A0A] text-sm uppercase font-inter font-semibold tracking-wide rounded-lg py-3.5 hover:bg-white hover:text-[#0A0A0A] hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group mt-2"
                            >
                                {isLoading ? "Requesting..." : "Send Reset Link"}
                                {!isLoading && <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6">
                            <Link
                                href="/login"
                                className="w-full bg-white/5 border border-white/10 text-white text-sm uppercase font-inter font-semibold tracking-wide rounded-lg py-3.5 hover:bg-white hover:text-[#0A0A0A] hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group"
                            >
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                Return to Login
                            </Link>
                        </div>
                    )}

                    <div className="mt-12 pt-8 border-t border-white/5">
                        <Link href="/login" className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to login page
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* ── Right Side: Visual/Animated Area ── */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0A0A0A] items-center justify-center p-12">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C6A972]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C6A972]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
                
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 max-w-lg"
                >
                    <div className="glass-effect bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                        <Sparkles className="text-[#C6A972] mb-6 w-8 h-8" />
                        
                        <p className="text-2xl font-playfair text-white leading-relaxed mb-8 italic">
                            "Secure access is the bedrock of digital sovereignty. We ensure your heritage remains protected within the Maison NOIR vault."
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden flex items-center justify-center">
                                <h2 className="font-playfair text-xl tracking-tighter text-white/20 select-none">Vault</h2>
                            </div>
                            <div>
                                <h4 className="text-white font-medium uppercase tracking-widest text-[10px]">Maison Security Protocol</h4>
                                <p className="text-white/40 text-[9px] uppercase tracking-widest mt-1">Sovereign Encryption Suite</p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute -inset-4 bg-gradient-to-br from-[#C6A972]/20 to-transparent blur-2xl -z-10 rounded-[3rem] opacity-50" />
                </motion.div>
            </div>
        </main>
    );
}
