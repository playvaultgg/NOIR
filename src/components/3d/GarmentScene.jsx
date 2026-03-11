"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box, Sphere, Float, Html, useGLTF, MeshDistortMaterial, Text } from "@react-three/drei";
import LightingRig from "./LightingRig";
import CameraControls from "./CameraControls";

/**
 * Maison Noir Garment Scene Engine
 * The high-fidelity 3D core for product inspection.
 * Features:
 * - Suspense Integration (Lazy loading)
 * - Cinematic Float (Gentle movement)
 * - Fabric Highlight Simulation
 * - Real-time Fallback Mode
 */
function PlaceholderGarment() {
    const meshRef = useRef();
    const [isHovered, setIsHovered] = useState(false);

    // Subtle 3D "Breathing" (Fabric Physics Proxy)
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            meshRef.current.rotation.y = Math.sin(time * 0.2) * 0.1;
            meshRef.current.position.y = Math.sin(time * 0.5) * 0.05;
        }
    });

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <group 
                ref={meshRef} 
                onPointerOver={() => setIsHovered(true)}
                onPointerOut={() => setIsHovered(false)}
            >
                {/* Visual Representation of Luxury Garment (Abstract) */}
                <Box args={[1, 1.8, 0.2]} position={[0, 0, 0]} castShadow>
                     <MeshDistortMaterial
                        color="#0a0a0a"
                        roughness={0.1}
                        metalness={0.4}
                        distort={isHovered ? 0.35 : 0.1} // Simulates fabric ripple on hover
                        speed={2}
                    />
                </Box>
                
                {/* Golden Accents (Maison Identity) */}
                <Sphere args={[0.05, 16, 16]} position={[0, 1, 0.1]} castShadow>
                    <meshStandardMaterial color="#c5a059" metalness={1} roughness={0} />
                </Sphere>

                {/* Aesthetic Identification Tag */}
                <Html position={[0, -1.2, 0]} center>
                    <div className="text-[8px] uppercase tracking-[0.4em] text-white/30 whitespace-nowrap italic pointer-events-none select-none">
                        Fabric ID: NOIR-SILK-001
                    </div>
                </Html>
            </group>
        </Float>
    );
}

export default function GarmentScene({ modelUrl }) {
    return (
        <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
            <Suspense fallback={
                <div className="absolute inset-0 flex items-center justify-center text-noir-gold text-[10px] uppercase tracking-[0.5em] animate-pulse">
                    Synchronizing Silhouette...
                </div>
            }>
                <Canvas
                    shadows
                    gl={{ antialias: true, alpha: true }}
                    className="w-full h-full"
                >
                    <CameraControls />
                    <LightingRig />

                    {/* Placeholder Logic: Used until high-fidelity GLBs are provided */}
                    <PlaceholderGarment />

                    {/* Gradient Fog for cinematic depth */}
                    <fog attach="fog" args={["#000", 2, 10]} />
                </Canvas>
            </Suspense>
            
            {/* Visual Interface Overlay */}
            <div className="absolute bottom-6 left-6 flex items-center gap-4 pointer-events-none">
                <div className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-ping" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black">360° Inspection Active</span>
            </div>
        </div>
    );
}
