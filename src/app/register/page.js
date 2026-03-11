"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, UserPlus, Chrome, Sparkles } from "lucide-react";

/**
 * Maison NOIR Registration Page - ReactBits Auth-2 adaptation
 * Features:
 * - Split layout matching the login page
 * - Premium gradient visuals and animated feedback
 * - Clean glassmorphism form UI
 */
export default function RegisterPage() {
    const [name, setName] = useState("");
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
            const res = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
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
            } else {
                const data = await res.json();
                setError(data.message || "Registration failed.");
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
                    <div className="mb-10 lg:mb-12">
                        <Link href="/" className="inline-block mb-10 group">
                            <h2 className="font-playfair text-2xl tracking-[0.2em] text-white group-hover:text-[#C6A972] transition-colors">
                                N O I R
                            </h2>
                        </Link>
                        
                        <h1 className="text-3xl lg:text-4xl font-semibold text-white mb-3">
                            Apply for Access
                        </h1>
                        <p className="text-white/40 text-sm">
                            Join the Maison to unlock curated luxury and personalized styling.
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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Full Name</label>
                            <div className="relative group">
                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C6A972] transition-colors" size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#C6A972] outline-none text-white text-sm px-12 py-3.5 rounded-xl transition-all"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                        </div>

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
                            <label className="text-sm font-medium text-white/80">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#C6A972] transition-colors" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 focus:border-[#C6A972] outline-none text-white text-sm px-12 py-3.5 rounded-xl transition-all"
                                    placeholder="••••••••"
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#C6A972] text-black font-semibold py-3.5 rounded-xl hover:bg-[#d4b97e] transition-all flex items-center justify-center gap-2 group mt-4"
                        >
                            {isLoading ? "Processing..." : "Create Account"}
                            {!isLoading && <UserPlus size={16} className="group-hover:translate-x-1 transition-transform" />}
                        </button>
                    </form>

                    <div className="relative my-7">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="bg-black px-4 text-white/40">Or continue with</span>
                        </div>
                    </div>

                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-white/5 border border-white/10 text-white-[#C6A972] hover:text-black hover:border-[#C6A972]/10 transition-all flex items-center justify-center gap-3"
                    >
                        <Chrome size={18} />
                        Google
                    </button>

                    <p className="mt-8 text-center text-sm text-white/40">
                        Already have an account?{" "}
                        <Link href="/login" className="text-white hover:text-[#C6A972] transition-colors font-medium">
                            Sign in
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

                {/* Animated Feature Card (Different from Login for variety) */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative z-10 max-w-lg"
                >
                    <div className="glass-effect bg-white/5 border border-white/10 p-10 rounded-3xl backdrop-blur-xl relative overflow-hidden">
                        <Lock className="text-[#C6A972] mb-6 w-8 h-8" />
                        
                        <h3 className="text-2xl font-semibold text-white mb-4">
                            Exclusive Access
                        </h3>
                        <p className="text-white/60 leading-relaxed mb-8">
                            Creating an account grants you access to limited collections, early runway releases, and your own personal digital AI stylist to curate your signature look.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            {['Early access to drops', 'Personal AI styling assistant', 'Exclusive member pricing'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#C6A972]/20 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-3 h-3 text-[#C6A972]" />
                                    </div>
                                    <span className="text-white/80 text-sm">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Decorative blurred card behind */}
                    <div className="absolute -inset-4 bg-gradient-to-br from-[#C6A972]/20 to-transparent blur-2xl -z-10 rounded-[3rem] opacity-50" />
                </motion.div>
            </div>
        </main>
    );
}
