"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useState } from "react";
import { 
    User, 
    Mail, 
    Lock, 
    Bell, 
    Shield, 
    Globe, 
    CreditCard,
    Save,
    Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState(session?.user?.name || "");
    const [status, setStatus] = useState(null); // 'success' | 'error'

    const handleSave = async () => {
        setIsLoading(true);
        setStatus(null);
        try {
            const res = await fetch("/api/user/settings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (res.ok) {
                await update({ name }); // Update next-auth session
                setStatus("success");
                setTimeout(() => setStatus(null), 3000);
            } else {
                setStatus("error");
            }
        } catch (error) {
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-12">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                    <div className="space-y-2">
                        <h2 className="text-noir-gold uppercase tracking-[0.4em] text-[10px] md:text-xs font-inter mb-4">
                            Configuration Suite
                        </h2>
                        <h1 className="text-4xl md:text-6xl font-playfair text-white tracking-tight italic">
                            Account Preferences
                        </h1>
                        <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-medium">
                            Tailor your Maison NOIR experience to your personal signature.
                        </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-4">
                        <AnimatePresence>
                            {status === "success" && (
                                <motion.span 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="text-noir-gold text-[10px] uppercase tracking-widest font-black italic"
                                >
                                    Vault Synchronized
                                </motion.span>
                            )}
                        </AnimatePresence>
                        <button 
                            onClick={handleSave}
                            disabled={isLoading}
                            className="group flex items-center gap-4 px-8 py-5 bg-[#C6A972] text-[#0A0A0A] rounded-xl text-[10px] uppercase tracking-[0.2em] font-black hover:bg-white transition-all hover:scale-105 active:scale-95 shadow-xl shadow-noir-gold/10 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                                    <Sparkles size={16} />
                                </motion.div>
                            ) : <Save size={16} />}
                            {isLoading ? "Synchronizing..." : "Synchronize Changes"}
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    {/* Primary Settings Column */}
                    <div className="xl:col-span-2 space-y-12">
                        {/* Profile Identity */}
                        <section className="glass-effect bg-noir-surface/20 p-10 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-noir-gold/10 rounded-xl border border-noir-gold/20 text-noir-gold">
                                    <User size={20} />
                                </div>
                                <h3 className="text-2xl font-playfair text-white italic">Identity & Silhouette</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={16} />
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white text-sm focus:border-noir-gold focus:outline-none transition-all"
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-black ml-1">Archive Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={16} />
                                        <input 
                                            type="email" 
                                            defaultValue={session?.user?.email || ""}
                                            disabled
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-12 py-4 text-white/30 text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Security Protocol */}
                        <section className="glass-effect bg-noir-surface/20 p-10 rounded-[2.5rem] border border-white/5">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20 text-red-500">
                                    <Shield size={20} />
                                </div>
                                <h3 className="text-2xl font-playfair text-white italic">Security Protocol</h3>
                            </div>

                            <div className="space-y-8">
                                <p className="text-white/40 text-xs leading-relaxed max-w-xl">
                                    Two-factor authentication and cryptographic session management are active to protect your status in the Maison.
                                </p>
                                
                                <button className="px-6 py-3 border border-white/10 rounded-lg text-[10px] uppercase tracking-widest text-white/70 hover:bg-white hover:text-black transition-all">
                                    Refresh Security Credentials
                                </button>
                            </div>
                        </section>

                        {/* Notifications */}
                        <section className="glass-effect bg-noir-surface/20 p-10 rounded-[2.5rem] border border-white/5">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
                                    <Bell size={20} />
                                </div>
                                <h3 className="text-2xl font-playfair text-white italic">Transmission Preferences</h3>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { title: "Drop Alerts", desc: "Immediate notification for new archival releases." },
                                    { title: "Concierge Updates", desc: "Tracking and fulfillment updates for active requisitions." },
                                    { title: "Runway Invites", desc: "Digital and physical invitations to seasonal showcases." }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <div>
                                            <h4 className="text-white text-sm font-medium">{item.title}</h4>
                                            <p className="text-white/30 text-[10px] uppercase tracking-widest mt-1">{item.desc}</p>
                                        </div>
                                        <div className="w-12 h-6 bg-noir-gold rounded-full relative cursor-pointer shadow-inner">
                                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Secondary Sidebar Column */}
                    <div className="space-y-8">
                        {/* Membership Insight */}
                        <div className="glass-effect bg-gradient-to-br from-noir-gold/20 via-transparent to-transparent bg-noir-surface/40 rounded-[2.5rem] p-10 border border-noir-gold/10 relative overflow-hidden group">
                           <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <Sparkles className="text-noir-gold animate-pulse" size={24} />
                                    <h3 className="text-xl font-playfair text-white tracking-tight">Privilege Status</h3>
                                </div>
                                
                                <div className="space-y-6">
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Current Tier</p>
                                        <h4 className="text-2xl font-playfair text-noir-gold italic tracking-widest">Sovereign Bronze</h4>
                                    </div>
                                    
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest leading-relaxed">
                                        Acquire 2 more archival pieces to elevate your status to Silver and unlock priority runway access.
                                    </p>
                                </div>
                           </div>
                        </div>

                        {/* Local Settings */}
                        <div className="glass-effect bg-noir-surface/20 p-10 rounded-[2.5rem] border border-white/5 space-y-8">
                            <h3 className="text-xl font-playfair text-white italic mb-6">Regional Sync</h3>
                            
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest text-white/20 font-black">Currency</label>
                                    <select className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-[11px] uppercase tracking-widest focus:border-noir-gold focus:outline-none appearance-none cursor-pointer">
                                        <option>INR - Rupee (₹)</option>
                                        <option>USD - Dollars ($)</option>
                                        <option>EUR - Euro (€)</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest text-white/20 font-black">Language</label>
                                    <select className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white text-[11px] uppercase tracking-widest focus:border-noir-gold focus:outline-none appearance-none cursor-pointer">
                                        <option>English (Global)</option>
                                        <option>French (Maison)</option>
                                        <option>Italian (Fine Arts)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Account Danger Zone */}
                        <div className="p-10 border-2 border-dashed border-red-500/10 rounded-[2.5rem] group hover:border-red-500/30 transition-all">
                            <h4 className="text-red-500/60 font-medium text-xs uppercase tracking-widest mb-4">Danger Zone</h4>
                            <p className="text-white/20 text-[10px] uppercase tracking-widest leading-relaxed mb-6">
                                Permanently purge your archival identity and order history from the Maison NOIR vault.
                            </p>
                            <button className="text-red-500/40 hover:text-red-500 text-[10px] uppercase tracking-widest font-black border-b border-red-500/10 hover:border-red-500 transition-all pb-1">
                                Deactivate Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
