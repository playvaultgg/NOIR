"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
    OrbitControls, 
    Environment, 
    Float, 
    Html,
    PerspectiveCamera,
    ContactShadows,
    useGLTF,
    Animations
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, Zap, ArrowRight, Camera } from "lucide-react";

/**
 * Maison Noir Avatar Synthesis Engine
 * The high-fidelity core for virtual try-on and digital identity.
 * Features:
 * - Neural Silhouette Construction
 * - Dynamic Outfit Projection
 * - Cinematic Persona Animation
 * - Ready Player Me SDK Interface (Ready for Phase 8.6)
 */
function AvatarSilhouette({ isSyncing }) {
    const meshRef = useRef();
    
    // Abstracted Avatar Silhouette (Mannequin Proxy)
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            // Idle "Thinking" animation
            meshRef.current.position.y = Math.sin(time * 0.4) * 0.02;
            meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
        }
    });

    return (
        <group ref={meshRef}>
            {/* The Core Silhouette (Procedural Placeholder) */}
            <mesh position={[0, -0.6, 0]} castShadow>
                <capsuleGeometry args={[0.35, 1.6, 8, 32]} />
                <meshStandardMaterial 
                    color="#0a0a0a" 
                    roughness={0.05} 
                    metalness={0.6} 
                    emissive="#1a1a1a"
                    emissiveIntensity={isSyncing ? 2 : 0.5}
                />
            </mesh>

            {/* Neural Projection Aura */}
            <pointLight position={[0, 0, 0.5]} intensity={1} color="#c5a059" distance={1.5} />
            
            {/* Aesthetic Detail: Identity Core */}
            <mesh position={[0, 0.4, 0.36]}>
                <sphereGeometry args={[0.01, 16, 16]} />
                <meshBasicMaterial color="#c5a059" />
            </mesh>
        </group>
    );
}

export default function AvatarSynthesis() {
    const [isSyncing, setIsSyncing] = useState(false);
    const [step, setStep] = useState(1);

    const handleSyncIdentity = () => {
        setIsSyncing(true);
        setTimeout(() => {
            setIsSyncing(false);
            setStep(2);
        }, 3000);
    };

    return (
        <section className="relative w-full h-[85vh] bg-[#050505] rounded-3xl overflow-hidden border border-white/5 flex flex-col justify-center">
            {/* Technical Background Matrix */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute inset-x-0 h-px top-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute inset-y-0 w-px left-1/2 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            </div>
            
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Core 3D Synthesis Viewport */}
            <div className="w-full h-full cursor-grab active:cursor-grabbing relative z-10 font-inter">
                <Suspense fallback={
                    <div className="absolute inset-0 flex items-center justify-center text-noir-gold text-[10px] uppercase tracking-[0.5em] animate-pulse">
                        Neural Handshake...
                    </div>
                }>
                    <Canvas shadows>
                        <PerspectiveCamera makeDefault position={[0, 0.5, 4.5]} fov={35} />
                        <Environment preset="night" />
                        <ambientLight intensity={0.1} />
                        
                        {/* High-fidelity Spotlights */}
                        <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} color="#fff" castShadow />
                        <spotLight position={[-5, 5, -5]} angle={0.2} penumbra={1} intensity={1} color="#c5a059" />

                        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                            <AvatarSilhouette isSyncing={isSyncing} />
                        </Float>

                        <ContactShadows position={[0, -1.6, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000" />
                        <fog attach="fog" args={["#000", 2, 8]} />
                    </Canvas>
                </Suspense>

                {/* UI Overlay: Status Monitor (Top Right) */}
                <div className="absolute top-10 right-10 flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3 px-4 py-2 bg-noir-surface/40 backdrop-blur-md rounded-full border border-white/5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? "bg-noir-gold animate-ping" : "bg-green-500"}`} />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black text-white/60">
                            {isSyncing ? "Neural Sync in Progress" : "Identity Verified"}
                        </span>
                    </div>
                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/20 italic">Node: 024-MaisonNoir</span>
                </div>

                {/* UI Overlay: Interaction Panel (Bottom Center) */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-8 min-w-[320px]">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div 
                                key="step1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full space-y-8"
                            >
                                <div className="text-center space-y-2">
                                    <h4 className="text-white font-playfair text-3xl italic tracking-tight">Virtual Persona</h4>
                                    <p className="text-white/30 text-[10px] uppercase tracking-[0.4em]">Construct your digital silhouette</p>
                                </div>

                                <button 
                                    onClick={handleSyncIdentity}
                                    disabled={isSyncing}
                                    className="w-full bg-noir-gold text-noir-black py-5 font-black text-[10px] uppercase tracking-[0.5em] rounded-xl relative overflow-hidden group shadow-2xl shadow-noir-gold/20"
                                >
                                    <span className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <Zap size={14} className={isSyncing ? "animate-bounce" : ""} />
                                        Initialize Synthesis
                                    </span>
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="step2"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full glass-effect bg-noir-surface/60 p-8 rounded-2xl border border-white/5 space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-noir-gold/10 rounded-lg text-noir-gold">
                                            <ShieldCheck size={18} />
                                        </div>
                                        <div>
                                            <h5 className="text-white text-xs font-bold uppercase tracking-widest">Profile Ready</h5>
                                            <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">Ready Player Me Interface Active</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="text-white/20" size={16} />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <button className="py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-[9px] uppercase tracking-[0.3em] font-black text-white/40 hover:text-white transition-all flex items-center justify-center gap-2">
                                        <Camera size={14} />
                                        Recalibrate
                                    </button>
                                    <button className="py-3 px-4 bg-noir-gold text-noir-black rounded-lg text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white transition-all flex items-center justify-center gap-2">
                                        Enter Showroom
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Side UI Decorations (Left Sidebar) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-10 z-20 space-y-12">
                 <div className="space-y-4">
                     <span className="text-white/10 text-[8px] uppercase tracking-[0.5em] vertical-text font-black">Identity Calibration</span>
                     <div className="w-[1px] h-32 bg-gradient-to-b from-white/20 via-white/5 to-transparent mx-auto" />
                 </div>
                 {[1, 2, 3].map(i => (
                     <div key={i} className={`w-1.5 h-1.5 rounded-full border border-white/20 ${i === 2 ? "bg-noir-gold shadow-lg shadow-noir-gold/40" : ""}`} />
                 ))}
            </div>
        </section>
    );
}
