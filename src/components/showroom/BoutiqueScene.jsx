"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
    Environment, 
    PointerLockControls, 
    Sparkles, 
    Html, 
    useProgress,
    Stars,
    Float
} from "@react-three/drei";
import * as THREE from "three";
import Player from "./Player";
import Architecture from "./Architecture";
import ProductDisplay from "./ProductDisplay";

/**
 * Atmospheric Engine for the Showroom
 * Handles visual dust, random paparazzi flashes, and celestial depth.
 */
function BoutiqueAtmosphere() {
    const flashRef = useRef();
    const [flashActive, setFlashActive] = useState(false);
    const [flashPos, setFlashPos] = useState([0, 0, 0]);

    useFrame((state) => {
        // Random "Museum Flash" effect
        if (Math.random() > 0.995 && !flashActive) {
            setFlashPos([
                (Math.random() - 0.5) * 40,
                Math.random() * 8,
                (Math.random() - 0.5) * 40
            ]);
            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 50);
        }
    });

    return (
        <group>
            {/* Celestial Depth */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            {/* Museum Dust / Sparkles */}
            <Sparkles count={500} scale={40} size={2} speed={0.4} opacity={0.1} color="#C6A972" />
            
            {/* Intermittent Camera Flashes */}
            {flashActive && (
                <pointLight 
                    position={flashPos} 
                    intensity={50} 
                    color="#fff" 
                    distance={20} 
                    decay={2}
                />
            )}
        </group>
    );
}

function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-2 border-noir-gold border-t-transparent rounded-full animate-spin" />
                <div className="text-noir-gold font-inter text-[10px] uppercase tracking-[0.6em] whitespace-nowrap bg-black/80 backdrop-blur-xl px-8 py-4 rounded-full border border-white/5">
                    Synchronizing Environment / {Math.round(progress)}%
                </div>
            </div>
        </Html>
    );
}

export default function BoutiqueScene() {
    const [start, setStart] = useState(false);

    if (!start) {
        return (
            <div className="absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center p-12 overflow-hidden">
                {/* Visual Backdrop */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(198,169,114,0.15)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

                <div className="text-center space-y-12 relative z-10 max-w-2xl">
                    <header className="space-y-6">
                        <div className="flex justify-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.6em] font-black italic">
                            <span className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-pulse" />
                            Archival Showroom Active
                        </div>
                        <h2 className="text-6xl md:text-8xl font-playfair tracking-tighter text-white italic leading-tight">
                            The Boutique <br />
                            <span className="text-noir-gold">Museum.</span>
                        </h2>
                    </header>

                    <div className="grid grid-cols-2 gap-8 text-white/40 font-mono text-[9px] uppercase tracking-widest border-y border-white/5 py-8">
                        <div>[W][A][S][D] Navigation</div>
                        <div>[MOUSE] Reticle Look</div>
                        <div>[CLICK] Interaction</div>
                        <div>[ESC] Decouple Mouse</div>
                    </div>

                    <button 
                        onClick={() => setStart(true)}
                        className="group relative px-20 py-6 bg-white text-black font-black uppercase text-[10px] tracking-[0.5em] rounded-2xl hover:bg-noir-gold transition-all duration-500 shadow-[0_0_60px_rgba(255,255,255,0.1)] overflow-hidden"
                    >
                        <span className="relative z-10">Enter Experience</span>
                        <div className="absolute inset-0 bg-noir-gold translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                    </button>
                    
                    <p className="text-white/10 text-[8px] uppercase tracking-[0.3em] italic">
                        Phase 8.0 Environmental Simulation / High Fidelity Protocol
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-black selection:bg-noir-gold selection:text-black">
            <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 60 }}>
                <color attach="background" args={["#000"]} />
                <fog attach="fog" args={["#000", 5, 45]} />
                
                <Suspense fallback={<Loader />}>
                    <Environment preset="night" />
                    <ambientLight intensity={0.05} />
                    
                    {/* Performance Player */}
                    <PointerLockControls />
                    <Player />

                    {/* Level Architecture */}
                    <Architecture />

                    {/* Atmosphere Layer */}
                    <BoutiqueAtmosphere />

                    {/* ── Product Exhibition Zones ── */}
                    {/* Zone 1: The Entrance Monument */}
                    <ProductDisplay 
                        position={[0, 1.2, -8]} 
                        product={{ id: "m1", name: "Onyx Silk Trench", price: "₹85,000", category: "Runway" }} 
                    />

                    {/* Zone 2: The Designer Gallery */}
                    <ProductDisplay 
                        position={[-12, 1.2, -15]} 
                        rotation={[0, Math.PI / 6, 0]}
                        product={{ id: "m2", name: "Midnight Velvet Gown", price: "₹1,25,000", category: "Couture" }} 
                    />
                    <ProductDisplay 
                        position={[12, 1.2, -15]} 
                        rotation={[0, -Math.PI / 6, 0]}
                        product={{ id: "m3", name: "Maison Noir Blazer", price: "₹65,000", category: "Tailored" }} 
                    />

                    {/* Zone 3: The Archival Wing */}
                    <ProductDisplay 
                        position={[-18, 1.2, -25]} 
                        rotation={[0, Math.PI / 2, 0]}
                        product={{ id: "m4", name: "Archive Leather Mono", price: "₹1,45,000", category: "Archive" }} 
                    />
                    <ProductDisplay 
                        position={[18, 1.2, -25]} 
                        rotation={[0, -Math.PI / 2, 0]}
                        product={{ id: "m5", name: "Obsidian Parka V1", price: "₹92,000", category: "Archive" }} 
                    />

                    {/* Zone 4: The VIP Vault */}
                    <ProductDisplay 
                        position={[0, 1.2, -35]} 
                        product={{ id: "m6", name: "Sovereign Masterpiece", price: "₹3,50,000", category: "Bespoke" }} 
                    />
                </Suspense>
            </Canvas>

            {/* ── Immersive UI Overlay ── */}
            <div className="absolute top-12 left-12 flex flex-col gap-2 z-10 pointer-events-none opacity-40">
                <span className="text-[10px] uppercase tracking-[0.6em] text-white font-black italic">Boutique Meta-Shell / Active</span>
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
            </div>

            <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end z-10 pointer-events-none">
                <div className="flex items-center gap-6 bg-white/5 backdrop-blur-3xl px-8 py-4 rounded-full border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-white/20 text-[8px] uppercase tracking-widest font-black">Location</span>
                        <span className="text-white text-[10px] uppercase tracking-widest font-bold font-playfair italic">Main Galleria</span>
                    </div>
                    <div className="w-px h-6 bg-white/10" />
                    <div className="flex gap-4 items-center">
                        <span className="text-white/40 text-[9px] font-mono">X: 0.00 Y: 1.60 Z: 5.00</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-right">
                        <p className="text-noir-gold text-[9px] uppercase tracking-[0.3em] font-black italic mb-1">Navigation Key</p>
                        <p className="text-white/20 text-[8px] uppercase tracking-widest">W/A/S/D to move &middot; Click objects to focus</p>
                    </div>
                </div>
            </div>

            {/* Scanning Grid Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
}
