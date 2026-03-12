"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Box, Boxes } from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Environment, Float, MeshReflectorMaterial } from "@react-three/drei";

function ShowroomSilhouette() {
    return (
        <group>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
                <planeGeometry args={[20, 20]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={512}
                    mixBlur={1}
                    mixStrength={10}
                    roughness={1}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.5}
                />
            </mesh>
            
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                {/* Abstract Monument */}
                {[[-2, 0, -2], [2, 0, -2], [0, 1, -4]].map((pos, i) => (
                    <mesh key={i} position={pos}>
                        <boxGeometry args={[1, 4, 1]} />
                        <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0.1} />
                    </mesh>
                ))}
                
                {/* Glowing Core */}
                <mesh position={[0, 0.5, -2]}>
                    <sphereGeometry args={[0.3, 32, 32]} />
                    <meshBasicMaterial color="#C6A972" />
                    <pointLight intensity={10} distance={10} color="#C6A972" />
                </mesh>
            </Float>
        </group>
    );
}

export default function ShowroomPreview() {
    return (
        <section className="py-24 lg:py-40 px-6 lg:px-24 bg-black relative overflow-hidden group">
            {/* Visual Ambiance */}
            <div className="absolute inset-0 z-0 opacity-10">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="max-w-[1600px] mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                <div className="space-y-12">
                     <header className="space-y-6">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic"
                        >
                            <Boxes size={16} />
                            Spatial Commerce Engine
                        </motion.div>
                        <h3 className="text-5xl md:text-7xl font-playfair text-white tracking-widest italic leading-tight">
                            The Virtual <br /> Showroom
                        </h3>
                        <p className="text-white/40 text-lg md:text-xl font-inter max-w-lg leading-relaxed italic">
                            Step into the digital void. Inspect every stitch, manipulate the light, and experience the silhouette in full 3D fidelity before acquisition.
                        </p>
                     </header>

                     <Link href="/showroom" className="group flex items-center justify-center gap-3 w-fit px-12 py-6 bg-white text-black rounded-2xl transition-all duration-500 hover:bg-noir-gold hover:scale-105 font-black text-[10px] uppercase tracking-[0.4em] shadow-2xl">
                        Enter Experience
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </Link>
                </div>

                {/* Live 3D Preview */}
                <div className="relative h-[600px] bg-[#050505] rounded-[4rem] border border-white/5 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                    <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                        <Suspense fallback={null}>
                            <Environment preset="night" />
                            <ShowroomSilhouette />
                        </Suspense>
                    </Canvas>

                    {/* Metadata Overlays */}
                    <div className="absolute top-10 right-10 bg-black/60 backdrop-blur-2xl p-6 border border-white/5 rounded-2xl space-y-4">
                        <div className="flex gap-2 items-center">
                            <div className="w-1 h-1 rounded-full bg-noir-gold animate-pulse" />
                            <span className="text-[8px] uppercase tracking-[0.3em] text-white/60">Node: Boutique-04 / Active</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white font-playfair italic text-lg leading-none">Spatial Shell</p>
                            <p className="text-noir-gold text-[8px] uppercase tracking-[0.4em] font-black italic">60 FPS / ULTRA</p>
                        </div>
                    </div>
                    
                    <div className="absolute bottom-10 left-10 text-[8px] uppercase tracking-[0.4em] text-white/10 font-black">
                        Maison NOIR Environmental Simulation
                    </div>
                </div>
            </div>
        </section>
    );
}

