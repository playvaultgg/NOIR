"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const toggleMode = () => {
        setMode(mode === "login" ? "register" : "login");
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === "register") {
                // Simplified registration flow for MVP (ideally a separate API route)
                // We will just show an error directing to use Login with seeded account
                setError("Registration closed. Use test admin account.");
                setIsLoading(false);
                return;
            }

            // LOGIN
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError(res.error);
            } else {
                router.refresh();
                onClose();
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        signIn("google");
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
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110]"
                    />

                    {/* SLIDING PANEL */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md glass-effect z-[120] p-8 flex flex-col items-center justify-center"
                    >
                        {/* CLOSE BUTTON */}
                        <button
                            onClick={onClose}
                            className="absolute top-8 right-8 text-white/40 hover:text-gold transition-colors"
                        >
                            <X size={24} strokeWidth={1.5} />
                        </button>

                        <div className="w-full text-center mb-12">
                            <h2 className="text-sm uppercase tracking-[0.4em] text-gold font-inter mb-4">
                                {mode === "login" ? "Welcome Back" : "Create Account"}
                            </h2>
                            <h3 className="text-4xl font-playfair text-white">
                                NOIR
                            </h3>
                            {error && (
                                <p className="text-red-400 text-[10px] uppercase tracking-widest mt-4 font-medium italic">
                                    {error}
                                </p>
                            )}
                        </div>

                        {/* FORM */}
                        <form className="w-full space-y-6" onSubmit={handleSubmit}>
                            {mode === "register" && (
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={16} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter your name"
                                            className="w-full bg-white/5 border border-white/10 px-12 py-3.5 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10"
                                            required={mode === "register"}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={16} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full bg-white/5 border border-white/10 px-12 py-3.5 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[10px] uppercase tracking-widest text-white/40 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={16} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/5 border border-white/10 px-12 py-3.5 text-sm text-white focus:border-gold outline-none transition-all placeholder:text-white/10"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                disabled={isLoading}
                                className="w-full bg-gold py-4 text-black text-[11px] uppercase tracking-[0.3em] font-bold flex items-center justify-center gap-3 hover:bg-white transition-all duration-300 mt-4 shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading && <Loader2 size={16} className="animate-spin" />}
                                {mode === "login" ? "Sign In" : "Register"}
                            </button>

                            <div className="relative flex items-center py-4">
                                <div className="flex-grow border-t border-white/5"></div>
                                <span className="flex-shrink mx-4 text-[9px] uppercase tracking-widest text-white/20">or</span>
                                <div className="flex-grow border-t border-white/5"></div>
                            </div>

                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-white/5 border border-white/10 py-4 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.3em] font-medium text-white hover:bg-white/10 transition-all"
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4" alt="G" />
                                Sign in with Google
                            </button>
                        </form>

                        <div className="mt-12 text-center">
                            <p className="text-[10px] uppercase tracking-widest text-white/40">
                                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                            </p>
                            <button
                                onClick={toggleMode}
                                className="mt-2 text-[11px] uppercase tracking-[0.2em] text-gold hover:text-white transition-colors"
                                type="button"
                            >
                                {mode === "login" ? "Create Account" : "Sign In Now"}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
