"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
    OrbitControls, 
    Environment, 
    Float, 
    PerspectiveCamera,
    ContactShadows,
    useGLTF
} from "@react-three/drei";
import { motion } from "framer-motion";

/**
 * Maison Noir Avatar Viewer
 * High-fidelity 3D viewport for digital personae.
 * Features:
 * - Dynamic Morphological Silhouette
 * - Atmospheric HDR Studio Lighting
 * - Interactive Orbit & Zoom
 */
function AvatarSilhouette({ bodyType, skinTone, dressed }) {
    const meshRef = useRef();
    
    // Size logic based on bodyType
    const getScale = () => {
        switch (bodyType) {
            case "SLIM": return [0.8, 1, 0.8];
            case "ATHLETIC": return [1, 1, 1];
            case "CURVY": return [1.2, 1, 1.2];
            default: return [1, 1, 1];
        }
    };

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(time * 0.4) * 0.02;
            meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
        }
    });

    return (
        <group ref={meshRef} scale={getScale()}>
            {/* The Core Silhouette */}
            <mesh position={[0, -0.6, 0]} castShadow>
                <capsuleGeometry args={[0.35, 1.6, 8, 32]} />
                <meshStandardMaterial 
                    color={skinTone || "#0a0a0a"} 
                    roughness={0.15} 
                    metalness={0.2} 
                    emissive={dressed ? "#c5a059" : "#1a1a1a"}
                    emissiveIntensity={dressed ? 0.5 : 0.2}
                />
            </mesh>

            {/* Phase 8.6: Synthesized Look Overlay */}
            {dressed && (
                <mesh position={[0, -0.6, 0]} scale={[1.05, 1.05, 1.05]}>
                    <capsuleGeometry args={[0.35, 1.6, 8, 32]} />
                    <meshStandardMaterial 
                        color="#ffffff"
                        wireframe
                        transparent
                        opacity={0.15}
                    />
                </mesh>
            )}
            
            {/* Detail Point Lights for Professional Rendering */}
            <pointLight position={[0.5, 0.5, 0.5]} intensity={1} color="#c5a059" distance={1.5} />
            <pointLight position={[-0.5, 0, -0.5]} intensity={0.5} color="#ffffff" distance={2} />
        </group>
    );
}

export default function AvatarViewer({ bodyType = "ATHLETIC", skinTone = "#E0AC69", dressed = false }) {
    return (
        <div className="relative w-full h-[600px] lg:h-[800px] bg-noir-black rounded-[3rem] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.5)]">
            {/* Technical Overlay Markers */}
            <div className="absolute top-10 left-10 flex flex-col gap-2 z-10 opacity-20">
                <span className="text-[10px] uppercase tracking-[0.5em] font-black text-white italic">Fidelity Engine: Onyx</span>
                <div className="w-px h-12 bg-gradient-to-b from-white to-transparent mx-auto" />
            </div>

            <Suspense fallback={
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                    <div className="w-12 h-12 border-2 border-noir-gold border-t-transparent rounded-full animate-spin" />
                    <span className="text-noir-gold text-[10px] uppercase tracking-[0.5em] animate-pulse">Constructing Silhouette...</span>
                </div>
            }>
                <Canvas 
                    shadows 
                    dpr={[1, 2]} 
                    gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                    onCreated={({ gl }) => {
                        gl.setClearColor('#000000', 0);
                    }}
                >
                    <PerspectiveCamera makeDefault position={[0, 0.5, 4.5]} fov={35} />
                    <Environment preset="night" />
                    <ambientLight intensity={0.2} />
                    
                    {/* Studio Lighting Setup */}
                    <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} color="#fff" castShadow />
                    <spotLight position={[-5, 5, -5]} angle={0.2} penumbra={1} intensity={1} color="#c5a059" />

                    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
                        <AvatarSilhouette 
                            bodyType={bodyType} 
                            skinTone={skinTone} 
                            dressed={dressed} 
                        />
                    </Float>

                    <ContactShadows position={[0, -1.6, 0]} opacity={0.6} scale={10} blur={2.5} far={4} color="#000" />
                    <OrbitControls 
                        enablePan={false}
                        enableZoom={true}
                        minDistance={3}
                        maxDistance={6}
                        maxPolarAngle={Math.PI / 1.7}
                    />
                    <fog attach="fog" args={["#000", 2, 8]} />
                </Canvas>
            </Suspense>

            {/* Visual Identification Hub: Phase 8.6 Metadata */}
            <div className="absolute bottom-10 right-10 p-6 glass-effect bg-noir-surface/40 rounded-3xl border border-white/5 text-right z-10">
                <h4 className="text-white font-playfair text-xs italic mb-1 uppercase tracking-widest">Active Synthesis</h4>
                <div className="flex gap-4 items-baseline justify-end">
                     <span className="text-noir-gold text-[10px] font-black">{bodyType} Protocol</span>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
