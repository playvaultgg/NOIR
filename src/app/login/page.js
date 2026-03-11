"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, LogIn, Chrome, Sparkles } from "lucide-react";

/**
 * Maison NOIR Login Page - ReactBits Auth-2 adaptation
 * Features:
 * - Split layout (Form on left, Animated visual/testimonial on right)
 * - Gradient backgrounds and animated elements
 * - Clean, modern glassmorphism UI
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
        <main className="min-h-screen flex bg-black">
            {/* ── Left Side: Auth Form (ReactBits Auth-2 style) ── */}
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
                        
                        <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-3">
                            Welcome back
                        </h1>
                        <p className="text-white/40 text-sm">
                            Enter your credentials to access your account.
                        </p>
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Email address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C6A972] transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#C6A972] outline-none text-white text-sm px-12 py-3.5 rounded-xl transition-all"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-white/80">Password</label>
                                <Link href="/forgot-password" className="text-xs text-[#C6A972] hover:text-white transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C6A972] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#C6A972] outline-none text-white text-sm px-12 py-3.5 rounded-xl transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#C6A972] text-[#0A0A0A] text-sm uppercase font-inter font-semibold tracking-wide rounded-lg py-3.5 hover:bg-white hover:text-[#0A0A0A] hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group mt-2"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                            {!isLoading && <LogIn size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-black px-4 text-white/40">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-[#0A0A0A] border border-[#C6A972]/30 text-[#C6A972] hover:bg-white hover:text-[#0A0A0A] hover:border-white py-3.5 rounded-lg text-sm uppercase font-inter font-semibold tracking-wide hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center gap-3"
                    >
                        <Chrome size={18} />
                        Google
                    </button>

                    <p className="mt-10 text-center text-sm text-white/40">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-white hover:text-[#C6A972] transition-colors font-medium">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>

            {/* ── Right Side: Visual/Animated Area (ReactBits Auth-2 style) ── */}
            <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#0A0A0A] items-center justify-center p-12">
                {/* Gradient Backgrounds */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#C6A972]/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#C6A972]/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />
                
                {/* Noise texture */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

                {/* Animated Testimonial Card */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 max-w-lg"
                >
                    <div className="glass-effect bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                        <Sparkles className="text-[#C6A972] mb-6 w-8 h-8" />
                        
                        <p className="text-2xl font-playfair text-white leading-relaxed mb-8 italic">
                            "Maison NOIR has completely redefined my understanding of luxury fashion. The curated selections and the seamless digital experience are truly unparalleled."
                        </p>
                        
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white/10 overflow-hidden">
                                {/* Placeholder avatar */}
                                <div className="w-full h-full bg-gradient-to-br from-[#C6A972] to-black/50" />
                            </div>
                            <div>
                                <h4 className="text-white font-medium">Eleanor Vance</h4>
                                <p className="text-white/40 text-sm">Vogue Contributing Editor</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative blurred card behind */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-[#C6A972]/20 to-transparent blur-2xl -z-10 rounded-[3rem] opacity-50" />
                </motion.div>
            </div>
        </main>
    );
}
