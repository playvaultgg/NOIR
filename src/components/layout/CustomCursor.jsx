"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName === "A" || e.target.tagName === "BUTTON" || e.target.closest("button")) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    return (
        <div className="hidden lg:block pointer-events-none fixed inset-0 z-[10000]">
            {/* Main Dot */}
            <motion.div
                animate={{
                    x: mousePosition.x - 4,
                    y: mousePosition.y - 4,
                    scale: isHovering ? 2 : 1,
                }}
                transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
                className="w-2 h-2 bg-noir-gold rounded-full"
            />
            
            {/* Outer Ring */}
            <motion.div
                animate={{
                    x: mousePosition.x - 20,
                    y: mousePosition.y - 20,
                    scale: isHovering ? 1.5 : 1,
                    opacity: isHovering ? 0.5 : 0.2,
                }}
                transition={{ type: "spring", damping: 40, stiffness: 150, mass: 0.8 }}
                className="w-10 h-10 border border-noir-gold rounded-full"
            />
        </div>
    );
}
