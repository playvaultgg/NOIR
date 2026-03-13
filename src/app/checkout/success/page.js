"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { jsPDF } from "jspdf";
import { useSearchParams } from "next/navigation";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

function SuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id") || "MN-INTERNAL-AUTH";
    const orderId = searchParams.get("order_id");
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(!!orderId);
    const orderNumber = order?.id ? `MN-${order.id.slice(-6).toUpperCase()}` : `MN-${Math.floor(100000 + Math.random() * 900000)}`;

    useEffect(() => {
        if (orderId) {
            fetch(`/api/user/orders/${orderId}`)
                .then(res => res.json())
                .then(data => {
                    setOrder(data);
                    setLoading(false);
                    
                    // Tracking: Checkout Conversion
                    trackEvent(ANALYTICS_EVENTS.COMMERCE.CHECKOUT_CONVERSION, {
                        orderId: data.id,
                        totalAmount: data.totalAmount,
                        sessionId: sessionId
                    });
                })
                .catch(err => {
                    console.error("Order fetch error:", err);
                    setLoading(false);
                });
        }
    }, [orderId]);

    useEffect(() => {
        // Subtle golden confetti for a luxury feel
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ["#C6A972", "#ffffff"]
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#C6A972", "#ffffff"]
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const handleDownloadPDF = () => {
        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const goldColor = "#C6A972";
        const blackColor = "#0A0A0A";

        // Background
        doc.setFillColor(blackColor);
        doc.rect(0, 0, 210, 297, "F");

        // Border
        doc.setDrawColor(goldColor);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 277);
        doc.rect(12, 12, 186, 273);

        // Content
        doc.setTextColor(goldColor);
        doc.setFontSize(24);
        doc.text("MAISON NOIR", 105, 40, { align: "center" });

        doc.setTextColor("#FFFFFF");
        doc.setFontSize(32);
        doc.text("CERTIFICATE OF AUTHENTICITY", 105, 70, { align: "center" });

        doc.setFontSize(10);
        doc.setTextColor(goldColor);
        doc.text("DIGITAL ASSET ARCHIVE / SOVEREIGN TIER", 105, 80, { align: "center" });

        doc.setDrawColor(goldColor);
        doc.setLineWidth(0.2);
        doc.line(40, 90, 170, 90);

        doc.setTextColor("#FFFFFF");
        doc.setFontSize(14);
        doc.text("This document certifies the permanent registration of", 105, 110, { align: "center" });
        
        doc.setFontSize(18);
        doc.setTextColor(goldColor);
        doc.text(orderNumber, 105, 125, { align: "center" });

        doc.setFontSize(12);
        doc.setTextColor("#FFFFFF");
        doc.text("within the Maison NOIR Private Registry.", 105, 140, { align: "center" });

        // Metadata
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100); // Gray for labels
        doc.text("REGISTRY TIER:", 40, 170);
        doc.setTextColor(255, 255, 255);
        doc.text("ARCHIVAL SOVEREIGN", 170, 170, { align: "right" });

        doc.setTextColor(100, 100, 100);
        doc.text("IDENTIFIER:", 40, 180);
        doc.setTextColor(255, 255, 255);
        doc.text(sessionId, 170, 180, { align: "right" });

        doc.setTextColor(100, 100, 100);
        doc.text("ENCRYPTION:", 40, 190);
        doc.setTextColor(255, 255, 255);
        doc.text("RSA-4096 / NOIR-NODE-V2", 170, 190, { align: "right" });

        doc.setTextColor(100, 100, 100);
        doc.text("TIMESTAMP:", 40, 200);
        doc.setTextColor(255, 255, 255);
        doc.text(new Date().toLocaleString(), 170, 200, { align: "right" });

        // Footer Seal
        doc.setDrawColor(goldColor);
        doc.circle(105, 240, 15);
        doc.setTextColor(goldColor);
        doc.setFontSize(8);
        doc.text("OFFICIAL SEAL", 105, 241, { align: "center" });

        doc.setFontSize(6);
        doc.setTextColor(80, 80, 80);
        doc.text("THE ABOVE ASSET IS SECURED BY THE MAISON IDENTITY PROTOCOL.", 105, 270, { align: "center" });

        doc.save(`MAISON_NOIR_TOKEN_${orderNumber}.pdf`);
    };

    return (
        <main className="min-h-screen bg-noir-black flex items-center justify-center p-8 overflow-hidden relative">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-noir-gold/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-3xl w-full relative z-10 space-y-16">
                {/* Header Cluster */}
                <div className="text-center space-y-6">
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 1, type: "spring" }}
                        className="w-24 h-24 bg-noir-gold rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_60px_rgba(198,169,114,0.3)] border border-white/20"
                    >
                        <ShieldCheck size={40} className="text-noir-black" strokeWidth={2.5} />
                    </motion.div>
                    
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                        className="space-y-4"
                    >
                        <h1 className="text-5xl lg:text-7xl font-playfair text-white italic tracking-tight">Acquisition Secured</h1>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-noir-gold font-black">Maison Repository / Order #{orderNumber}</p>
                    </motion.div>
                </div>

                {/* Digital Certificate Reveal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="glass-effect border border-white/10 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 space-y-12">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-playfair text-white italic mb-2">Digital Certificate of Authenticity</h2>
                                <p className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-black">Encryption Type: RSA-4096 / Sovereign Archive</p>
                            </div>
                            <Sparkles className="text-noir-gold animate-pulse" size={24} />
                        </div>

                        <div className="h-px bg-white/5 w-full" />

                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-10">
                            <div className="space-y-2">
                                <p className="text-[7px] uppercase tracking-[0.5em] text-white/20 font-black">Status</p>
                                <p className="text-[10px] uppercase tracking-widest text-noir-gold font-bold">Authenticated</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[7px] uppercase tracking-[0.5em] text-white/20 font-black">Tier</p>
                                <p className="text-[10px] uppercase tracking-widest text-white font-bold">Archival Sovereign</p>
                            </div>
                            <div className="space-y-2 col-span-2 lg:col-span-1">
                                <p className="text-[7px] uppercase tracking-[0.5em] text-white/20 font-black">Registry</p>
                                <p className="text-[10px] uppercase tracking-widest text-white/60 font-mono">{sessionId.slice(0, 8)}...</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-6 pt-8">
                            <button 
                                onClick={handleDownloadPDF}
                                className="flex-1 h-16 bg-white/5 border border-white/10 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black text-white hover:bg-white/10 transition-all flex items-center justify-center gap-4 group"
                            >
                                <Download size={16} className="text-noir-gold group-hover:translate-y-1 transition-transform" />
                                Download PDF Token
                            </button>
                            <Link href="/account" className="flex-1 h-16 bg-white text-noir-black rounded-xl text-[10px] uppercase tracking-[0.3em] font-black flex items-center justify-center gap-4 hover:bg-noir-gold transition-all">
                                View Maison Identity
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Assurance */}
                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 1 }}
                    className="text-center text-[9px] uppercase tracking-[0.4em] text-white/20 font-black italic"
                >
                    Welcome to the Inner Sanctum of Maison NOIR.
                </motion.p>
            </div>
        </main>
    );
}

/**
 * Maison NOIR - Acquisition Success Page
 * Features cinematic animations and a digital certificate reveal.
 */
export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-noir-black flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-noir-gold border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
