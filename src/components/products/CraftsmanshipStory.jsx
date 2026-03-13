"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Hammer, Droplet, Wind, Sun } from "lucide-react";

const PILLARS = [
    {
        icon: Hammer,
        title: "Artisanal Forge",
        desc: "Each piece is constructed over 48 hours in our Milanese atelier.",
        image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop"
    },
    {
        icon: Droplet,
        title: "Sovereign Silk",
        desc: "Sourced from the shores of Lake Como, treated with neural enzymes.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop"
    }
];

export default function CraftsmanshipStory() {
    return (
        <section className="mt-48 lg:mt-64 relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="pt-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                    <header className="space-y-6">
                        <h4 className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">Maison Standards</h4>
                        <h3 className="text-5xl lg:text-7xl font-playfair text-white italic tracking-tight leading-tight">
                            The Ghost <br /> of Luxury.
                        </h3>
                        <p className="text-white/40 text-lg lg:text-xl font-inter italic leading-relaxed max-w-lg">
                            We do not simply manufacture; we synthesize. Every thread is a deliberate choice in the architecture of silence.
                        </p>
                    </header>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {PILLARS.map((p, i) => (
                            <div key={i} className="space-y-4 group">
                                <div className="w-12 h-12 rounded-full bg-noir-gold/10 flex items-center justify-center text-noir-gold group-hover:bg-noir-gold group-hover:text-noir-black transition-all duration-500">
                                    <p.icon size={20} />
                                </div>
                                <h5 className="text-white font-playfair text-xl italic">{p.title}</h5>
                                <p className="text-white/20 text-xs leading-relaxed uppercase tracking-wider">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/5">
                    <Image 
                        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop" 
                        alt="Craftsmanship View" 
                        fill 
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-noir-black via-transparent to-transparent opacity-80" />
                    
                    <div className="absolute bottom-12 left-12 space-y-2">
                        <div className="flex gap-2 items-center">
                            <span className="w-2 h-2 rounded-full bg-noir-gold animate-ping" />
                            <span className="text-white text-[10px] uppercase tracking-[0.4em] font-black">Atelier Live Feed</span>
                        </div>
                        <p className="text-white/40 text-[8px] uppercase tracking-widest">Milan, IT - Sector 09</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
