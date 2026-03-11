"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rotate3d, Compass, Maximize2 } from "lucide-react";

export default function Product360Viewer() {
    const [isRotating, setIsRotating] = useState(false);
    const [progress, setProgress] = useState(0);

    // Simplified simulation for 360 viewer as our assets are currently 2D
    // In a real scenario, this would load a Three.js scene or an image sequence.

    return (
        <div className="py-24 group">
            <div className="relative aspect-square max-w-3xl mx-auto rounded-3xl overflow-hidden glass-effect bg-noir-surface/5 border border-white/5 flex flex-col items-center justify-center space-y-12 p-24">

                <div className="absolute top-10 left-10 flex gap-4">
                    <div className="px-4 py-2 glass-effect rounded-full text-[9px] uppercase tracking-widest text-noir-gold border border-noir-gold/20 flex items-center gap-2">
                        <Rotate3d size={12} />
                        Interactive 360°
                    </div>
                </div>

                <motion.div
                    animate={{ rotateY: isRotating ? 360 : 0 }}
                    transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                    className="w-full aspect-[3/4] relative opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
                >
                    {/* Dynamic placeholder for 360 investigation */}
                    <div className="absolute inset-0 border-[0.5px] border-white/5 rounded-full flex items-center justify-center">
                        <div className="w-[80%] h-[80%] border-[0.5px] border-white/10 rounded-full flex items-center justify-center">
                            <Compass size={48} className="text-noir-gold/20 group-hover:text-noir-gold transition-colors duration-1000" strokeWidth={1} />
                        </div>
                    </div>
                </motion.div>

                <div className="text-center space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-black">Spatial Investigation</h3>
                    <p className="text-sm font-playfair text-white italic max-w-xs">
                        Examine the silhouette through three-dimensional space for ultimate form appreciation.
                    </p>
                </div>

                <div className="absolute bottom-10 inset-x-10">
                    <div className="h-px w-full bg-white/5 relative">
                        <motion.div
                            className="absolute inset-y-0 left-0 bg-noir-gold"
                            animate={{ width: ["0%", "100%", "0%"] }}
                            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                        />
                    </div>
                </div>

                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-4 glass-effect rounded-2xl text-white/40 hover:text-white transition-all">
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
