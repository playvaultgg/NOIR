"use client";

import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function TermsPage() {
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
                            Legal Framework
                        </div>
                        <h1 className="text-5xl md:text-7xl font-playfair italic tracking-tighter">
                            Terms of Service
                        </h1>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-medium">Last Updated: March 2026</p>
                    </div>

                    <div className="space-y-12 font-inter text-white/70 leading-relaxed font-light">
                        <section className="space-y-6">
                            <h2 className="text-xl font-playfair italic text-white">1. Requisition Acceptance</h2>
                            <p>
                                By placing an order (Requisition) with Maison NOIR, you agree to these Terms. We reserve the right to decline any requisition at our sole discretion, particularly those involving high-risk profiles or automated bots.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-playfair italic text-white">2. Intellectual Property</h2>
                            <p>
                                All designs, including but not limited to 3D models, fabric textures, and cinematic silhouettes, are the exclusive property of NOIR COUTURE. Unauthorized reproduction or digital minting is strictly prohibited.
                            </p>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-playfair italic text-white">3. Returns & Exchanges</h2>
                            <p>
                                Due to the bespoke nature of our assembly and biometric tailoring, we offer a 14-day consultation period for all returns. Items must be returned in "Vault Original" condition with all digital tags intact.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
