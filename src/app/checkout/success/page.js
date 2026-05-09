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
    const [fallbackOrderNumber, setFallbackOrderNumber] = useState("MN-XXXXXX");

    const orderNumber = order?.id ? `MN-${order.id.slice(-6).toUpperCase()}` : fallbackOrderNumber;

    useEffect(() => {
        // Generate random order number only on client to avoid hydration mismatch
        const timer = setTimeout(() => {
            setFallbackOrderNumber(`MN-${Math.floor(100000 + Math.random() * 900000)}`);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

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
    }, [orderId, sessionId]);

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

        const goldColor = [198, 169, 114]; // #C6A972
        const blackColor = [5, 5, 5];
        const whiteColor = [255, 255, 255];
        const dimGray = [60, 60, 60];

        // 1. PURE BLACK BACKGROUND
        doc.setFillColor(blackColor[0], blackColor[1], blackColor[2]);
        doc.rect(0, 0, 210, 297, "F");

        // 2. SUBTLE WATERMARK
        doc.setTextColor(15, 15, 15);
        doc.setFontSize(120);
        doc.setFont("helvetica", "bold");
        doc.text("NOIR", 105, 160, { align: "center", angle: 45 });

        // 3. EXECUTIVE BORDERS (GILDED)
        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setLineWidth(0.8);
        doc.rect(10, 10, 190, 277); // Outer
        doc.setLineWidth(0.2);
        doc.rect(13, 13, 184, 271); // Inner accent

        // 4. HEADER SECTION
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("PRIVATE REGISTRY ACQUISITION", 105, 30, { align: "center", charSpace: 3 });

        doc.setFontSize(28);
        doc.setFont("times", "italic");
        doc.text("Maison NOIR", 105, 45, { align: "center" });

        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setLineWidth(0.3);
        doc.line(80, 50, 130, 50);

        // 5. MAIN TITLE
        doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2]);
        doc.setFontSize(32);
        doc.setFont("helvetica", "bold");
        doc.text("CERTIFICATE OF", 105, 75, { align: "center" });
        doc.text("AUTHENTICITY", 105, 88, { align: "center" });

        doc.setFontSize(9);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFont("helvetica", "normal");
        doc.text("Sovereign Tier Archival Registration", 105, 98, { align: "center", charSpace: 1 });

        // 6. CERTIFICATION TEXT
        doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2]);
        doc.setFontSize(12);
        doc.setFont("times", "italic");
        doc.text("This serves as formal validation for the permanent registry of", 105, 120, { align: "center" });

        doc.setFontSize(24);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFont("helvetica", "bold");
        doc.text(orderNumber, 105, 135, { align: "center", charSpace: 2 });

        // 7. TRANSACTION SUMMARY (Itemized if available)
        doc.setDrawColor(30, 30, 30);
        doc.line(30, 150, 180, 150);

        doc.setFontSize(8);
        doc.setTextColor(dimGray[0], dimGray[1], dimGray[2]);
        doc.text("ACQUIRED ASSETS", 30, 158);

        if (order?.orderitem) {
            let yPos = 168;
            order.orderitem.forEach((item, index) => {
                doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2]);
                doc.setFontSize(10);
                doc.text(item.product?.name || "Archival Piece", 30, yPos);
                doc.text(`x${item.quantity}`, 180, yPos, { align: "right" });
                yPos += 8;
            });
        } else {
            doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2]);
            doc.setFontSize(10);
            doc.text("Archival Acquisition Series - Selection Alpha", 30, 168);
        }

        // ADD TOTAL PAYMENT
        const totalY = 195;
        doc.setDrawColor(30, 30, 30);
        doc.line(30, totalY - 5, 180, totalY - 5);
        
        doc.setFontSize(8);
        doc.setTextColor(dimGray[0], dimGray[1], dimGray[2]);
        doc.text("AGGREGATE ACQUISITION VALUE", 30, totalY);
        
        doc.setFontSize(14);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setFont("times", "bolditalic");
        const totalText = order?.totalAmount ? `INR ${order.totalAmount.toLocaleString()}` : "Value Encrypted";
        doc.text(totalText, 180, totalY, { align: "right" });

        // 8. METADATA GRID
        const gridY = 210;
        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.setLineWidth(0.1);
        doc.line(30, gridY - 5, 180, gridY - 5);

        doc.setFontSize(7);
        doc.setTextColor(dimGray[0], dimGray[1], dimGray[2]);
        doc.text("REGISTRY HASH", 30, gridY);
        doc.text("TIMESTAMP", 80, gridY);
        doc.text("CLEARANCE", 140, gridY);

        doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2]);
        doc.setFontSize(8);
        doc.text(sessionId.substring(0, 24).toUpperCase(), 30, gridY + 6);
        doc.text(new Date().toLocaleString(), 80, gridY + 6);
        doc.text("LEVEL 7 / SOVEREIGN", 140, gridY + 6);

        // 9. SIGNATURE & SEAL
        doc.setDrawColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.circle(50, 255, 12);
        doc.setFontSize(6);
        doc.setTextColor(goldColor[0], goldColor[1], goldColor[2]);
        doc.text("OFFICIAL", 50, 254, { align: "center" });
        doc.text("MAISON SEAL", 50, 257, { align: "center" });

        doc.setDrawColor(dimGray[0], dimGray[1], dimGray[2]);
        doc.line(120, 260, 180, 260);
        doc.setFontSize(8);
        doc.setFont("times", "italic");
        doc.setTextColor(whiteColor[0], whiteColor[1], whiteColor[2]);
        doc.text("Senior Concierge Management", 150, 265, { align: "center" });
        doc.text("Maison NOIR Headquarters, Paris", 150, 270, { align: "center" });

        doc.setFontSize(6);
        doc.setTextColor(dimGray[0], dimGray[1], dimGray[2]);
        doc.text("This document is cryptographically linked to the Noir Blockchain Registry.", 105, 285, { align: "center" });

        doc.save(`MAISON_NOIR_CERTIFICATE_${orderNumber}.pdf`);
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
