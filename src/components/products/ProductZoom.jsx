"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";

export default function ProductZoom({ image }) {
    const [isZooming, setIsZooming] = useState(false);
    const containerRef = useRef(null);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth movement for magnifying glass effect
    const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

    // Map mouse position within container to background position (for zoom)
    const bgPosX = useTransform(springX, (v) => `${v * 100}%`);
    const bgPosY = useTransform(springY, (v) => `${v * 100}%`);

    const handleMouseMove = (e) => {
        if (!containerRef.current) return;
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;
        mouseX.set(x);
        mouseY.set(y);
    };

    return (
        <div
            ref={containerRef}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden cursor-crosshair group bg-noir-surface/10 border border-white/5"
        >
            <Image
                src={image}
                alt="Magnified View"
                fill
                className={`object-cover transition-opacity duration-700 ${isZooming ? "opacity-0" : "opacity-100"}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Magnified High-Fidelity Detail Layer */}
            <motion.div
                style={{
                    backgroundImage: `url(${image})`,
                    backgroundPositionX: bgPosX,
                    backgroundPositionY: bgPosY,
                    backgroundSize: "250%",
                    opacity: isZooming ? 1 : 0
                }}
                className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
            />

            {/* Branding Overlay for High-Performance Presentation */}
            <div className="absolute top-6 right-6 p-4 glass-effect rounded-xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none flex flex-col items-end gap-2 text-right">
                <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white italic">Fabric Detail</p>
                <p className="text-[8px] uppercase tracking-widest text-noir-gold/60">Inspect for Craftsmanship</p>
            </div>
        </div>
    );
}
