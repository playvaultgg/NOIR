"use client";

import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
    OrbitControls, 
    Environment, 
    Float, 
    Text, 
    MeshDistortMaterial, 
    Html,
    PerspectiveCamera,
    PresentationControls,
    Stage
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Play, SkipForward, Pause } from "lucide-react";

/**
 * Maison Noir Runway Experience Engine
 * The immersive 3D fashion show centerpiece.
 * Features:
 * - Stage Composition
 * - Cinematic Camera Panning
 * - Product Spotlighting
 * - Interactive Runway Loop
 */
function RunwayModel({ isActive }) {
    const meshRef = useRef();

    useFrame((state) => {
        if (!isActive) return;
        const time = state.clock.getElapsedTime();
        // Simulates a smooth, rhythmic walk towards the camera
        meshRef.current.position.z = Math.sin(time * 0.5) * 2;
        meshRef.current.position.y = Math.sin(time * 2) * 0.05; // Head bob
    });

    return (
        <group ref={meshRef}>
            {/* The Silhouette (Abstract Placeholder) */}
            <mesh castShadow position={[0, 0, 0]}>
                <boxGeometry args={[0.5, 2, 0.3]} />
                <MeshDistortMaterial 
                    color="#000" 
                    speed={2} 
                    distort={0.1} 
                    roughness={0} 
                    metalness={0.5} 
                />
            </mesh>

            {/* Glowing Golden "Core" (Signature Noir Visual) */}
            <pointLight position={[0, 0.5, 0.2]} intensity={2} color="#c5a059" distance={1.5} />
            <mesh position={[0, 0.5, 0.2]}>
                <sphereGeometry args={[0.02, 16, 16]} />
                <meshBasicMaterial color="#c5a059" />
            </mesh>
        </group>
    );
}

export default function RunwayExperience() {
    const [isPlaying, setIsPlaying] = useState(true);

    return (
        <section className="relative w-full h-screen bg-noir-black overflow-hidden flex flex-col justify-center">
            {/* Cinematic Noise & Fog overlays */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-noir-black via-transparent to-noir-black opacity-80" />
            <div className="absolute inset-0 z-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />

            {/* Title / Technical Meta Showroom Overlay */}
            <div className="absolute top-12 left-12 z-20 space-y-4">
                <div className="flex items-center gap-3 text-noir-gold text-[10px] uppercase tracking-[0.6em] font-black">
                    <div className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-ping" />
                    Interactive Runway Loop
                </div>
                <h2 className="text-white font-playfair text-5xl italic tracking-tighter">Midnight Silhouette</h2>
                <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] font-light">Look № 024 / Collection AW26</p>
            </div>

            {/* 3D Runway Stage Canvas */}
            <div className="w-full h-full cursor-grab active:cursor-grabbing">
                <Suspense fallback={null}>
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[0, 1.5, 6]} fov={40} />
                        <fog attach="fog" args={["#000", 5, 12]} />
                        
                        <ambientLight intensity={0.1} />
                        
                        {/* Dramatic Runway Spotlights */}
                        <spotLight position={[0, 10, 2]} angle={0.2} penumbra={1} intensity={10} castShadow />
                        <spotLight position={[5, 10, 0]} angle={0.15} penumbra={1} intensity={5} color="#c5a059" />
                        <spotLight position={[-5, 10, 0]} angle={0.15} penumbra={1} intensity={5} color="#fff" />

                        <PresentationControls
                            global
                            config={{ mass: 2, tension: 500 }}
                            snap={{ mass: 4, tension: 1500 }}
                            rotation={[0, 0, 0]}
                            polar={[-Math.PI / 6, Math.PI / 6]}
                            azimuth={[-Math.PI / 4, Math.PI / 4]}
                        >
                            <Stage environment="night" intensity={0.5} contactShadow={{ opacity: 0.1 }} adjustCamera={false}>
                                <RunwayModel isActive={isPlaying} />
                            </Stage>
                        </PresentationControls>

                        {/* Infinite Runway Floor */}
                        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                            <planeGeometry args={[100, 100]} />
                            <shadowMaterial opacity={0.4} />
                        </mesh>
                    </Canvas>
                </Suspense>
            </div>

            {/* Interaction Interface controls */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-12">
                <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-4 bg-noir-gold/5 border border-noir-gold/20 rounded-full text-noir-gold hover:bg-noir-gold/20 hover:scale-110 active:scale-95 transition-all group"
                >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} className="fill-current" />}
                </button>
                
                <div className="flex flex-col items-center gap-3">
                    <span className="text-white/10 text-[9px] uppercase tracking-[0.5em] font-black">Sequencing</span>
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map(idx => (
                            <div key={idx} className={`w-8 h-px transition-colors duration-700 ${idx === 2 ? "bg-noir-gold shadow-lg shadow-noir-gold" : "bg-white/10"}`} />
                        ))}
                    </div>
                </div>

                <button className="p-4 text-white/40 hover:text-white transition-colors group">
                    <SkipForward size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </section>
    );
}
