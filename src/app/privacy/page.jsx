"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-noir-black text-white selection:bg-noir-gold selection:text-noir-black">
            <Navbar />
            
            <section className="pt-48 pb-32 px-6 lg:px-24 max-w-4xl mx-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-16"
                >
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="text-noir-gold text-[10px] uppercase tracking-[0.6em] font-black italic">
                            Encryption & Shield
                        </div>
                        <h1 className="text-5xl md:text-7xl font-playfair italic tracking-tighter">
                            Privacy Policy
                        </h1>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Last Updated: March 2026</p>
                    </div>

                    <div className="space-y-12 font-inter text-white/70 leading-relaxed font-light">
                        <section className="space-y-6">
                            <h2 className="text-xl font-playfair italic text-white">1. Data Sovereignty</h2>
                            <p>
                                At Maison NOIR, we believe your data is the final frontier of luxury. We do not sell, rent, or trade your personal information. All biometric data used for Virtual Try-On is processed locally on your device and never touches our sovereign servers.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-playfair italic text-white">2. Collection of Information</h2>
                            <p>
                                We collect only the vital descriptors required to facilitate an elite shopping experience:
                            </p>
                            <ul className="list-disc pl-5 space-y-3 marker:text-noir-gold">
                                <li>Identity Records (Name, Email for requisition updates)</li>
                                <li>Logistics Metadata (Shipping destination)</li>
                                <li>Transaction History (Stored on private ledger)</li>
                            </ul>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-playfair italic text-white">3. Cryptographic Security</h2>
                            <p>
                                Every transaction on our platform is secured via end-to-end military-grade encryption. Your financial details are never stored in plain text.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
