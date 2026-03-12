"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Zap } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Float, Environment, ContactShadows } from "@react-three/drei";

function RunwaySilhouette() {
    const meshRef = useRef();
    return (
        <group>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <mesh position={[0, -1, 0]} castShadow>
                    <capsuleGeometry args={[0.4, 1.8, 4, 16]} />
                    <meshStandardMaterial 
                        color="#050505" 
                        roughness={0} 
                        metalness={1} 
                        emissive="#C6A972" 
                        emissiveIntensity={0.2} 
                    />
                </mesh>
            </Float>
            <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
        </group>
    );
}

export default function RunwayPreview() {
    return (
        <section className="py-24 lg:py-40 bg-noir-black relative overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 lg:px-24">
                <header className="mb-20 text-center space-y-4">
                    <h4 className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">Maison Events</h4>
                    <h3 className="text-4xl md:text-6xl font-playfair text-white tracking-tight italic">The Virtual Runway</h3>
                </header>

                <div className="relative aspect-[21/9] w-full bg-[#050505] rounded-[2rem] overflow-hidden group border border-white/5">
                     {/* 3D Visual Layer */}
                     <div className="absolute inset-0 z-0">
                        <Canvas camera={{ position: [0, 0, 5], fov: 40 }} shadows>
                            <Suspense fallback={null}>
                                <Environment preset="night" />
                                <RunwaySilhouette />
                                <ambientLight intensity={0.5} />
                                <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} color="#C6A972" />
                            </Suspense>
                        </Canvas>
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                     </div>

                     {/* Content Overlay */}
                     <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-8">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Link href="/runway" className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-noir-gold hover:text-noir-black transition-all duration-500 group/btn shadow-[0_0_80px_rgba(255,255,255,0.05)]">
                                <Play size={32} fill="currentColor" className="ml-2" />
                                <div className="absolute inset-0 rounded-full border border-noir-gold/50 animate-ping opacity-0 group-hover/btn:opacity-100" />
                            </Link>
                        </motion.div>
                        
                        <div className="text-center space-y-3">
                            <p className="text-white/40 text-[10px] uppercase tracking-[0.5em] font-black">Archive Invitation</p>
                            <h4 className="text-2xl md:text-3xl font-playfair text-white italic tracking-widest">Midnight Symphony AW26</h4>
                        </div>
                     </div>

                     <div className="absolute top-8 left-8 flex gap-4 opacity-40 z-30">
                        <Zap size={14} className="text-red-500 animate-pulse" />
                        <span className="text-[8px] uppercase tracking-[0.3em] text-white font-black italic">Neural Projection Stream</span>
                     </div>
                </div>

                <div className="relative mt-24 mb-12 flex overflow-hidden border-y border-white/5 bg-[#0A0A0A] py-12">
                    <motion.div
                        className="flex whitespace-nowrap gap-16 lg:gap-32 items-center"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    >
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex items-center gap-8 shrink-0 px-8 group grayscale hover:grayscale-0 transition-all duration-700">
                                <div className="w-16 h-32 bg-white/5 rounded-full flex items-center justify-center border border-white/5 group-hover:border-noir-gold/50">
                                    <div className="w-0.5 h-12 bg-noir-gold/20 group-hover:bg-noir-gold animate-pulse" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-white font-playfair italic text-xl">Look 0{i + 1}</span>
                                    <span className="text-[8px] uppercase tracking-[0.4em] text-[#C6A972]/40 font-black italic">Silk Obsidian</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/runway" className="text-[10px] uppercase tracking-[0.4em] text-noir-gold hover:text-white transition-all underline underline-offset-8 decoration-noir-gold/30">
                        Experience the Full Show
                    </Link>
                </div>
            </div>
        </section>
    );
}

