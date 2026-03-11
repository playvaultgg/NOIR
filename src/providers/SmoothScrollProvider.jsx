"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScrollProvider({ children }) {
    useEffect(() => {
        // Lenis instantiation for luxury smooth scroll
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false, // Leave native on touch devices for frictionless mobile scroll
            touchMultiplier: 2,
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Clean up on component unmount
        return () => {
            lenis.destroy();
        };
    }, []);

    return <>{children}</>;
}
