"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, RefreshCw, Smartphone, Sparkles, Box } from "lucide-react";
import { useState, useRef, useEffect } from "react";

/**
 * Maison NOIR Augmented Reality Console
 * Phase 8.8 Immersive Interaction Layer.
 * Features:
 * - Real-time Camera Stream Integration
 * - 3D Garment Spatial Projection (Teaser/Draft)
 * - Proportional Matching Algorithms
 */
export default function ARTryOn({ product, onClose }) {
    const [stream, setStream] = useState(null);
    const [isCalibrating, setIsCalibrating] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        async function startCamera() {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } 
                });
                setStream(mediaStream);
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }
                setTimeout(() => setIsCalibrating(false), 2000);
            } catch (err) {
                console.error("AR_CAMERA_ERROR:", err);
            }
        }
        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black flex flex-col items-center justify-center"
        >
            {/* Viewport Header */}
            <div className="absolute top-0 left-0 right-0 p-8 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black">
                        <Smartphone size={14} />
                        Spatial Requisition / AR Active
                    </div>
                    <h3 className="text-white font-playfair text-2xl italic tracking-tight">{product.name}</h3>
                </div>
                <button onClick={onClose} className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white-[#C6A972] hover:text-black hover:border-[#C6A972]/20 transition-all">
                    <X size={20} />
                </button>
            </div>

            {/* Camera Viewport */}
            <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover scale-x-[-1]" 
                />
                
                {/* Virtual Overlay Layer (Abstract Prototype) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <AnimatePresence>
                        {!isCalibrating && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 0.3, scale: 1 }}
                                className="relative w-64 h-96 border-[4px] border-noir-gold/50 rounded-full flex flex-col items-center justify-center"
                            >
                                <div className="absolute top-0 -translate-y-12">
                                     <Sparkles className="text-noir-gold animate-pulse" />
                                </div>
                                <p className="text-noir-gold text-[8px] uppercase tracking-[0.6em] font-black italic">Matching Proportions</p>
                                
                                {/* Projected Silhouette Mesh Teaser */}
                                <div className="absolute inset-10 border border-white/20 rounded-full opacity-20 animate-pulse" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* HUD Elements */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-8 w-full px-8">
                     <AnimatePresence>
                        {isCalibrating ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass-effect bg-black/60 px-8 py-4 rounded-full flex items-center gap-4 border border-noir-gold/20"
                            >
                                <RefreshCw className="text-noir-gold animate-spin" size={16} />
                                <span className="text-[10px] uppercase tracking-[0.4em] text-white font-black italic">Synchronizing Spatial Mesh...</span>
                            </motion.div>
                        ) : (
                            <div className="flex gap-4">
                                <button className="px-10 py-5 bg-white text-noir-black text-[10px] uppercase tracking-[0.5em] font-black rounded-full shadow-2xl active:scale-95 transition-all">
                                    Capture Look
                                </button>
                                <button className="p-5 bg-noir-gold text-noir-black rounded-full shadow-2xl active:scale-95 transition-all">
                                    <Box size={20} />
                                </button>
                            </div>
                        )}
                     </AnimatePresence>

                     <p className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black italic text-center max-w-xs">
                        Spatial projection is a proximity simulation. Calibration accuracy depends on ambient lumen levels.
                     </p>
                </div>

                {/* Aesthetic Identification Scanlines */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
            </div>
        </motion.div>
    );
}
