"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Play } from "lucide-react";

export default function RunwayVideo() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

    const MOCK_RUNWAY = "https://player.vimeo.com/external/370331493.sd.mp4?s=fb4f31c28c899c852ac3014a68297042a5d2047a&profile_id=164&oauth2_token_id=57447761";

    return (
        <div ref={containerRef} className="py-48 px-8 lg:px-24">
            <motion.div
                style={{ scale, opacity, y }}
                className="relative aspect-video lg:aspect-[21/9] w-full bg-noir-surface/10 rounded-3xl overflow-hidden group shadow-2xl"
            >
                <video
                    src={MOCK_RUNWAY}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover grayscale-[30%] opacity-60 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-1000"
                />

                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-noir-black via-transparent to-noir-black opacity-40" />

                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-8">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 1.2 }}
                        className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-md group-hover:bg-white group-hover:text-noir-black transition-all cursor-pointer shadow-2xl"
                    >
                        <Play size={32} className="ml-1" />
                    </motion.div>

                    <div className="space-y-4">
                        <h3 className="text-4xl lg:text-7xl font-playfair text-white italic tracking-tight opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-10 group-hover:translate-y-0">
                            Motion & Form
                        </h3>
                        <p className="text-[10px] uppercase tracking-[0.5em] text-noir-gold font-black opacity-0 group-hover:opacity-60 transition-all duration-1000 delay-200">
                            Runway Archive 01
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
