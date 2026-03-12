"use client";

import { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
    OrbitControls, 
    Environment, 
    Float, 
    MeshDistortMaterial, 
    Html,
    PerspectiveCamera,
    PresentationControls,
    Stage,
    ContactShadows,
    Reflector,
    Text,
    Stars
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Play, SkipForward, Pause, Camera, Zap, Maximize } from "lucide-react";

/**
 * Enhanced Runway Model Silhouette
 */
function RunwayModel({ isActive }) {
    const group = useRef();
    
    useFrame((state) => {
        if (!isActive) return;
        const t = state.clock.getElapsedTime();
        
        // Sophisticated walking movement
        group.current.position.z = Math.sin(t * 0.4) * 4; // Move back and forth
        group.current.position.y = Math.abs(Math.cos(t * 2)) * 0.05 - 0.5; // Slight step lift
        group.current.rotation.y = Math.sin(t * 0.4) * 0.1; // Slighting swaying
    });

    return (
        <group ref={group}>
            {/* Humanoid Abstract Construction */}
            {/* Torso */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
                <meshStandardMaterial color="#050505" roughness={0.1} metalness={0.9} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.85, 0]} castShadow>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial color="#050505" roughness={0} metalness={1} />
            </mesh>
            {/* Legs */}
            <mesh position={[-0.1, 0.4, 0]} castShadow>
                <capsuleGeometry args={[0.08, 0.8, 8, 16]} />
                <meshStandardMaterial color="#050505" />
            </mesh>
            <mesh position={[0.1, 0.4, 0]} castShadow>
                <capsuleGeometry args={[0.08, 0.8, 8, 16]} />
                <meshStandardMaterial color="#050505" />
            </mesh>

            {/* Glowing Signature Core */}
            <pointLight position={[0, 1.3, 0.2]} intensity={5} color="#C6A972" distance={2} />
            <mesh position={[0, 1.3, 0.2]}>
                <sphereGeometry args={[0.03, 16, 16]} />
                <meshBasicMaterial color="#C6A972" />
            </mesh>
            
            {/* Dynamic Drapery (Abstract) */}
            <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 8]}>
                <torusGeometry args={[0.3, 0.01, 16, 30]} />
                <MeshDistortMaterial color="#C6A972" speed={3} distort={0.4} opacity={0.3} transparent />
            </mesh>
        </group>
    );
}

/**
 * Environmental Elements: Crowd & Pillars
 */
function RunwayEnvironment() {
    const pillars = useMemo(() => {
        const p = [];
        for (let i = -10; i <= 10; i += 4) {
            p.push({ pos: [-3, 2, i], id: `l-${i}` });
            p.push({ pos: [3, 2, i], id: `r-${i}` });
        }
        return p;
    }, []);

    return (
        <group>
            {/* Pillars */}
            {pillars.map((p) => (
                <group key={p.id} position={p.pos}>
                    <mesh>
                        <boxGeometry args={[0.1, 8, 0.1]} />
                        <meshStandardMaterial color="#111" />
                    </mesh>
                    <pointLight position={[0, -2, 0.1]} intensity={0.5} color="#C6A972" distance={3} />
                    <mesh position={[0, -2, 0.1]}>
                        <planeGeometry args={[0.2, 4]} />
                        <meshBasicMaterial color="#C6A972" transparent opacity={0.1} />
                    </mesh>
                </group>
            ))}

            {/* Crowd Silhouettes */}
            {[-4, 4].map((x) => (
                <group key={x} position={[x, -0.9, 0]}>
                    {[...Array(20)].map((_, i) => (
                        <mesh key={i} position={[Math.random() - 0.5, 0, (Math.random() - 0.5) * 20]}>
                            <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
                            <meshStandardMaterial color="#050505" opacity={0.5} transparent />
                        </mesh>
                    ))}
                </group>
            ))}
        </group>
    );
}

/**
 * Random Photography Flashes
 */
function CameraFlashes() {
    const [flash, setFlash] = useState(false);
    const [pos, setPos] = useState([5, 2, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                setPos([(Math.random() - 0.5) * 10, Math.random() * 4, (Math.random() - 0.5) * 10]);
                setFlash(true);
                setTimeout(() => setFlash(false), 50);
            }
        }, 800);
        return () => clearInterval(interval);
    }, []);

    return flash ? (
        <pointLight position={pos} intensity={50} color="#fff" distance={15} decay={2} />
    ) : null;
}

export default function RunwayExperience() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [lookIndex, setLookIndex] = useState(24);

    return (
        <section className="relative w-full h-screen bg-black overflow-hidden select-none">
            {/* Cinematic Post-Processing Mock (UI-based) */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] contrast-150" />
            </div>

            {/* Technical Metadata Overlay */}
            <div className="absolute top-12 left-12 z-20 space-y-6">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                >
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-noir-gold" />
                        <div className="w-1 h-3 bg-noir-gold opacity-50" />
                    </div>
                    <span className="text-noir-gold text-[10px] uppercase font-inter font-black tracking-[0.6em]">
                        Live Broadcast / Session AW26
                    </span>
                </motion.div>
                
                <div className="space-y-1">
                    <h2 className="text-white font-playfair text-6xl italic tracking-tighter leading-none">
                        Midnight <br /> Silhouette
                    </h2>
                    <div className="flex items-center gap-6 pt-4">
                        <p className="text-white/40 text-[9px] uppercase tracking-[0.4em] font-medium border-r border-white/10 pr-6">
                            Look № {lookIndex} / 048
                        </p>
                        <p className="text-noir-gold text-[9px] uppercase tracking-[0.4em] font-bold italic">
                            Sovereign Archive
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Bar (Top Right) */}
            <div className="absolute top-12 right-12 z-20 flex gap-4">
                <button className="w-12 h-12 rounded-full border border-white/5 bg-white/5 backdrop-blur-md flex items-center justify-center text-white/40 hover:text-noir-gold hover:border-noir-gold/40 transition-all group">
                    <Maximize size={18} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                </button>
                <div className="flex flex-col items-end justify-center px-6 border-l border-white/10">
                    <span className="text-white/20 text-[8px] uppercase tracking-widest font-black">Camera Unit</span>
                    <span className="text-white text-[10px] uppercase tracking-widest font-bold">FR-04 Cinematic</span>
                </div>
            </div>

            {/* 3D Scene */}
            <div className="w-full h-full">
                <Canvas shadows gl={{ antialias: true }} camera={{ position: [0, 1, 8], fov: 35 }}>
                    <Suspense fallback={null}>
                        <color attach="background" args={["#000"]} />
                        <fog attach="fog" args={["#000", 8, 20]} />
                        
                        <Environment preset="night" />
                        <ambientLight intensity={0.05} />
                        
                        {/* Main Spotlight */}
                        <spotLight 
                            position={[0, 15, 0]} 
                            angle={0.15} 
                            penumbra={1} 
                            intensity={20} 
                            castShadow 
                            shadow-bias={-0.0001}
                        />

                        {/* Photography Flashes Layer */}
                        <CameraFlashes />

                        <PresentationControls
                            global
                            config={{ mass: 2, tension: 500 }}
                            snap={{ mass: 4, tension: 1500 }}
                            rotation={[0, 0, 0]}
                            polar={[-Math.PI / 10, Math.PI / 10]}
                            azimuth={[-Math.PI / 6, Math.PI / 6]}
                        >
                            <group position={[0, -1, 0]}>
                                <RunwayModel isActive={isPlaying} />
                                <RunwayEnvironment />
                                
                                {/* The Reflective Runway */}
                                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                                    <planeGeometry args={[2, 40]} />
                                    <meshStandardMaterial 
                                        color="#080808" 
                                        roughness={0.05} 
                                        metalness={0.8}
                                    />
                                </mesh>

                                {/* Floor Background (Non-reflective but receives shadows) */}
                                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                                    <planeGeometry args={[100, 100]} />
                                    <shadowMaterial opacity={0.5} />
                                </mesh>
                                
                                <ContactShadows position={[0, -0.01, 0]} opacity={1} scale={20} blur={2} far={4.5} />
                            </group>
                        </PresentationControls>

                        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                    </Suspense>
                    <OrbitControls 
                        enablePan={false} 
                        enableZoom={false} 
                        maxPolarAngle={Math.PI / 2} 
                        minPolarAngle={Math.PI / 2.5} 
                    />
                </Canvas>
            </div>

            {/* Runway Controls & Navigation */}
            <div className="absolute bottom-12 left-0 right-0 z-20 px-12 flex items-center justify-between">
                <div className="flex items-center gap-12">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center hover:bg-noir-gold transition-all hover:scale-110 active:scale-90 shadow-2xl"
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-4 items-baseline">
                            <span className="text-white/20 text-[9px] uppercase tracking-[0.5em] font-black">Sequencing Mode</span>
                            <span className="text-noir-gold text-[8px] uppercase tracking-[0.2em] font-bold">Automatic</span>
                        </div>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5, 6].map(idx => (
                                <motion.div 
                                    key={idx} 
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    className={`h-0.5 w-12 origin-left transition-colors duration-1000 ${idx === 3 ? "bg-noir-gold" : "bg-white/5"}`} 
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <button className="flex items-center gap-4 text-white/30 hover:text-white transition-all group">
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] group-hover:tracking-[0.5em] transition-all">Next Silhouette</span>
                        <SkipForward size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Photography Counter Overlay */}
            <div className="absolute bottom-12 right-12 z-20 flex flex-col items-end opacity-20">
                <div className="flex items-center gap-3 text-white">
                    <Camera size={14} />
                    <span className="text-[10px] font-mono tracking-tighter italic">REC 00:42:15:08</span>
                </div>
                <div className="w-32 h-[1px] bg-white mt-2" />
            </div>
        </section>
    );
}

