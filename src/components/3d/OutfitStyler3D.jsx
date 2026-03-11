"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Suspense, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
    OrbitControls, 
    Environment, 
    Float, 
    Text, 
    MeshDistortMaterial, 
    Html,
    PerspectiveCamera,
    ContactShadows,
    PresentationControls
} from "@react-three/drei";
import { Plus, X, ShoppingBag, Sparkles, RefreshCw } from "lucide-react";

/**
 * Maison Noir 3D Outfit Styler Engine
 * The immersive center for digital curation.
 * Features:
 * - Dynamic Garment Attachment
 * - Mannequin Silhouette Proxy
 * - Interactive Selection Grid
 * - AI Synthesis Feedback
 */
function Mannequin({ activeLayers }) {
    return (
        <group>
            {/* The Core Silhouette (Abstract Humanoid) */}
            <mesh position={[0, -0.5, 0]} castShadow>
                <capsuleGeometry args={[0.4, 1.8, 4, 32]} />
                <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.2} />
            </mesh>

            {/* Render Active Garment Layers (Phase 8.7 Simulation) */}
            {activeLayers.map((layer, idx) => (
                <group key={layer.id} position={[0, 0, 0.1 * idx]}>
                    <Float speed={2} rotationIntensity={0.1} floatIntensity={0.2}>
                         <mesh castShadow position={[0, 0.2, 0]}>
                            <boxGeometry args={[0.9, 1.2, 0.4]} />
                            <MeshDistortMaterial 
                                color={layer.color || "#0a0a0a"} 
                                speed={1.5} 
                                distort={0.2} 
                                roughness={0.1} 
                                metalness={0.5} 
                            />
                        </mesh>
                    </Float>
                </group>
            ))}

            {/* Pulse of Identity (Core Light) */}
            <pointLight position={[0, 0.5, 0.4]} intensity={1.5} color="#c5a059" distance={2} />
        </group>
    );
}

export default function OutfitStyler3D() {
    const [activeLayers, setActiveLayers] = useState([]);
    const [isAIPressing, setIsAIPressing] = useState(false);

    const CATALOG = [
        { id: "T1", name: "Midnight Silk Coat", category: "Outerwear", color: "#050505" },
        { id: "T2", name: "Crimson Satin Vest", category: "Tops", color: "#4a0404" },
        { id: "T3", name: "Metallic Mesh Scarf", category: "Accessories", color: "#2d2d2d" },
    ];

    const toggleLayer = (layer) => {
        if (activeLayers.find(l => l.id === layer.id)) {
            setActiveLayers(activeLayers.filter(l => l.id !== layer.id));
        } else {
            setActiveLayers([...activeLayers, layer]);
        }
    };

    const handleAISynthesize = () => {
        setIsAIPressing(true);
        setTimeout(() => setIsAIPressing(false), 2000);
    };

    return (
        <section className="relative w-full h-[80vh] bg-noir-black rounded-3xl border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
            {/* Cinematic Background Grain */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            
            {/* 3D Styling Canvas */}
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Suspense fallback={null}>
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={40} />
                        <Environment preset="studio" />
                        <ambientLight intensity={0.2} />
                        <spotLight position={[5, 10, 5]} intensity={2} castShadow />
                        
                        <PresentationControls
                            global
                            config={{ mass: 2, tension: 500 }}
                            snap={{ mass: 4, tension: 1500 }}
                            rotation={[0, 0, 0]}
                            polar={[-Math.PI / 4, Math.PI / 4]}
                            azimuth={[-Math.PI / 4, Math.PI / 4]}
                        >
                            <Mannequin activeLayers={activeLayers} />
                        </PresentationControls>

                        <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} />
                        <fog attach="fog" args={["#000", 2, 8]} />
                    </Canvas>
                </Suspense>
            </div>

            {/* UI Overlay: Left Sidebar (Layer Selection) */}
            <div className="absolute top-8 left-8 bottom-8 w-64 z-20 flex flex-col gap-6">
                <div className="glass-effect bg-noir-surface/40 p-6 border border-white/5 rounded-2xl flex flex-col gap-6">
                    <div>
                        <h4 className="text-[10px] uppercase tracking-[0.4em] text-noir-gold font-black mb-1">Styler v1.0</h4>
                        <h3 className="text-white font-playfair text-xl italic tracking-tight">Curate Identity</h3>
                    </div>

                    <div className="space-y-3">
                        {CATALOG.map((item) => {
                            const isActive = activeLayers.find(l => l.id === item.id);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => toggleLayer(item)}
                                    className={`w-full group flex items-center justify-between p-4 rounded-xl border transition-all duration-500 ${
                                        isActive 
                                        ? "bg-noir-gold border-noir-gold text-noir-black shadow-lg shadow-noir-gold/20" 
                                        : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:border-white/10"
                                    }`}
                                >
                                    <div className="text-left">
                                        <p className="text-[8px] uppercase tracking-widest font-black opacity-60 mb-1">{item.category}</p>
                                        <p className="text-[10px] font-medium tracking-wide">{item.name}</p>
                                    </div>
                                    <Plus size={14} className={`transition-transform duration-500 ${isActive ? "rotate-45" : ""}`} />
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-auto">
                    <button 
                        onClick={handleAISynthesize}
                        className="w-full glass-effect bg-white/5 border border-white/5 p-4 rounded-xl text-white/60 hover:text-noir-gold hover:border-noir-gold/20 transition-all flex items-center justify-center gap-3 group"
                    >
                        <Sparkles size={16} className={isAIPressing ? "animate-spin" : "group-hover:animate-pulse"} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Neural Suggestion</span>
                    </button>
                </div>
            </div>

            {/* UI Overlay: Right Actions (Synthesis Feedback) */}
            <AnimatePresence>
                {activeLayers.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="absolute top-8 right-8 z-20 w-72"
                    >
                         <div className="glass-effect bg-noir-surface/60 p-8 border border-white/5 rounded-2xl text-center space-y-6">
                            <div className="space-y-2">
                                <h5 className="text-noir-gold text-[9px] uppercase tracking-[0.6em] font-black italic">Composition Aura</h5>
                                <div className="flex justify-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className={`w-1 h-1 rounded-full ${i <= activeLayers.length + 1 ? "bg-noir-gold" : "bg-white/10"}`} />
                                    ))}
                                </div>
                            </div>
                            
                            <p className="text-white font-playfair text-lg italic tracking-tighter leading-tight">
                                "The metallic mesh highlights create a cinematic tension with the silk base."
                            </p>

                            <button className="w-full bg-white text-noir-black py-4 rounded-lg font-bold text-[9px] uppercase tracking-[0.4em] hover:bg-noir-gold transition-colors flex items-center justify-center gap-2">
                                <ShoppingBag size={14} />
                                Acquire Selection
                            </button>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Visual Interface Elements */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-12 items-center">
                 <div className="flex flex-col items-center">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-white/20 mb-2">360° Interaction</span>
                    <RefreshCw className="text-white/10 animate-spin-slow" size={20} />
                 </div>
            </div>
        </section>
    );
}
