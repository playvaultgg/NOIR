"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PointerLockControls, PositionalAudio, Sky, Sparkles } from "@react-three/drei";
import Player from "./Player";
import Architecture from "./Architecture";
import ProductDisplay from "./ProductDisplay";

/**
 * Maison NOIR - Virtual Showroom Application
 * Central wrapper for the 3D Canvas experience.
 */
export default function BoutiqueScene() {
    const [start, setStart] = useState(false);

    if (!start) {
        return (
            <div className="absolute inset-0 bg-noir-black z-[100] flex flex-col items-center justify-center space-y-8">
                <div className="text-center space-y-4">
                    <h2 className="text-4xl md:text-6xl font-playfair tracking-tighter text-white italic">
                        The Showroom
                    </h2>
                    <p className="text-white/40 font-inter text-sm uppercase tracking-[0.3em]">
                        WASD to move &middot; Mouse to look &middot; Click to interact
                    </p>
                </div>
                <button 
                    onClick={() => setStart(true)}
                    className="px-12 py-4 bg-[#C6A972] text-[#0A0A0A] font-inter font-semibold tracking-widest uppercase rounded-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(198,169,114,0.3)]"
                >
                    Enter 3D Experience
                </button>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-[#0A0A0A]">
            <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 60 }}>
                {/* Environment Settings */}
                <color attach="background" args={["#0A0A0A"]} />
                <fog attach="fog" args={["#0A0A0A", 10, 40]} />
                <Environment preset="city" />

                {/* Lighting */}
                <ambientLight intensity={0.2} />
                <directionalLight 
                    position={[10, 20, 10]} 
                    intensity={1.5} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]} 
                />

                {/* Player Controls */}
                <PointerLockControls />
                <Player />

                {/* Level Architecture */}
                <Architecture />

                {/* Atmospheric Dust */}
                <Sparkles count={500} scale={30} size={1} speed={0.4} opacity={0.2} color="#C6A972" />

                {/* Product Placements in Zones */}
                {/* Zone 1: Entrance Lobby */}
                <ProductDisplay 
                    position={[0, 1.2, -5]} 
                    product={{ id: "m1", name: "Onyx Silk Trench", price: "₹85,000", category: "Runway" }} 
                />

                {/* Zone 2: Designer Gallery */}
                <ProductDisplay 
                    position={[-8, 1.2, -10]} 
                    rotation={[0, Math.PI / 4, 0]}
                    product={{ id: "m2", name: "Midnight Velvet Gown", price: "₹1,25,000", category: "Couture" }} 
                />
                 <ProductDisplay 
                    position={[8, 1.2, -10]} 
                    rotation={[0, -Math.PI / 4, 0]}
                    product={{ id: "m3", name: "Maison Noir Blazer", price: "₹65,000", category: "Tailored" }} 
                />

                {/* Zone 3: Luxury Jacket Section */}
                <ProductDisplay 
                    position={[-15, 1.2, -20]} 
                    rotation={[0, Math.PI / 2, 0]}
                    product={{ id: "m4", name: "Archive Leather Mono", price: "₹1,45,000", category: "Archive" }} 
                />

                {/* Zone 4: VIP Collection Room */}
                <ProductDisplay 
                    position={[0, 1.2, -30]} 
                    product={{ id: "m5", name: "Sovereign Masterpiece", price: "₹3,50,000", category: "Bespoke" }} 
                />

            </Canvas>

            {/* UI Overlay */}
            <div className="absolute top-8 left-8 text-white/50 text-[10px] uppercase tracking-[0.4em] font-black italic pointer-events-none">
                MAISON NOIR - VIRTUAL SHOWROOM Active
            </div>
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 text-white/30 text-xs font-inter pointer-events-none bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/5">
                <span>[W][A][S][D] Move</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>[Mouse] Look</span>
            </div>
        </div>
    );
}
