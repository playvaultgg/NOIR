"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ArrowRight } from "lucide-react";

const HERO_SLIDES = [
    {
        id: 1,
        title: "Timeless Silhouettes",
        subtitle: "The Mens Collection",
        image: "https://images.unsplash.com/photo-1539106604051-9b09d171618a?q=80&w=2070&auto=format&fit=crop",
        cta: "Explore Menswear",
        link: "/mens",
    },
    {
        id: 2,
        title: "Elegant Textures",
        subtitle: "Couture for Her",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2069&auto=format&fit=crop",
        cta: "Explore Womenswear",
        link: "/womens",
    },
    {
        id: 3,
        title: "Definitive Luxury",
        subtitle: "Accessories & Fine Jewelry",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935&auto=format&fit=crop",
        cta: "Shop Accessories",
        link: "/shop",
    },
];

export default function Hero() {
    const [index, setIndex] = useState(0);
    const slidesRef = useRef([]);
    const contentRef = useRef(null);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
        }, 7000); // 7s per slide for that slow luxury feel

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // GSAP Transition for Content
        if (contentRef.current) {
            gsap.fromTo(
                contentRef.current.children,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    stagger: 0.2,
                    duration: 1.2,
                    ease: "power3.out"
                }
            );
        }

        // KEN BURNS Effect on current slide
        const currentSlide = slidesRef.current[index];
        if (currentSlide) {
            gsap.fromTo(
                currentSlide,
                { scale: 1.1, x: "-2%", y: "-1%" },
                {
                    scale: 1,
                    x: "0%",
                    y: "0%",
                    duration: 7.5,
                    ease: "linear"
                }
            );
        }
    }, [index]);

    return (
        <section className="relative h-[100dvh] w-full overflow-hidden bg-black flex items-center justify-center">
            {/* BACKGROUND GALLERY */}
            {HERO_SLIDES.map((slide, i) => (
                <div
                    key={slide.id}
                    ref={(el) => (slidesRef.current[i] = el)}
                    className={`absolute inset-0 transition-opacity duration-[2000ms] pointer-events-none ${i === index ? "opacity-100" : "opacity-0"
                        }`}
                >
                    {/* OVERLAY TINT */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
                    <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover grayscale-[20%] brightness-[75%]"
                    />
                </div>
            ))}

            {/* CONTENT OVERLAY */}
            <div className="relative z-20 container mx-auto px-6 lg:px-12 pointer-events-none">
                <div ref={contentRef} className="max-w-4xl space-y-4 md:space-y-6">
                    <h2 className="text-gold/90 uppercase tracking-[0.5em] text-[10px] md:text-xs font-inter font-medium">
                        {HERO_SLIDES[index].subtitle}
                    </h2>
                    <h1 className="text-5xl md:text-8xl lg:text-9xl font-playfair text-white leading-[1.1] tracking-tight">
                        {HERO_SLIDES[index].title}
                    </h1>
                    <div className="pt-6 pointer-events-auto">
                        <Link
                            href={HERO_SLIDES[index].link}
                            className="inline-flex items-center gap-4 px-8 py-4 bg-transparent border border-white/20 hover:border-gold group transition-all duration-500 overflow-hidden relative"
                        >
                            <span className="relative z-10 text-[11px] uppercase tracking-[0.3em] font-medium group-hover:text-black transition-colors">
                                {HERO_SLIDES[index].cta}
                            </span>
                            <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1 group-hover:text-black transition-all" />

                            {/* Luxury Progress Bar / Slide indicator hover */}
                            <div className="absolute inset-0 bg-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* PROGRESS INDICATORS (Bottom Right) */}
            <div className="absolute bottom-12 right-12 z-20 flex gap-4 lg:flex hidden">
                {HERO_SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className="group relative h-12 w-[1px] bg-white/20 overflow-hidden transition-all duration-300 pointer-events-auto"
                    >
                        <div
                            className={`absolute top-0 left-0 w-full bg-gold transition-all duration-[7s] linear ${i === index ? "h-full" : "h-0"
                                }`}
                        />
                        <span className="absolute -left-8 top-1/2 -rotate-90 text-[8px] tracking-widest text-white/40 opacity-0 group-hover:opacity-100 transition-opacity">
                            0{i + 1}
                        </span>
                    </button>
                ))}
            </div>
        </section>
    );
}
