"use client";

import { useGLTF, Html, Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useState, useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight, X } from "lucide-react";

/**
 * Maison NOIR - Product Exhibition Node
 * Includes interactive pedestal and proximity-based metadata.
 */
export default function ProductDisplay({ position, rotation = [0, 0, 0], product }) {
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const [isNear, setIsNear] = useState(false);
    const groupRef = useRef();
    const { camera } = useThree();

    // Interaction & Proximity Logic
    useFrame((state, delta) => {
        if (groupRef.current) {
            // Constant subtle rotation when idle
            if (!hovered && !active) {
                groupRef.current.rotation.y += delta * 0.1;
            } else if (hovered && !active) {
                groupRef.current.rotation.y += delta * 0.4;
            }

            // Proximity check (Check if player is within 4 units)
            const worldPos = new THREE.Vector3();
            groupRef.current.getWorldPosition(worldPos);
            const dist = camera.position.distanceTo(worldPos);
            setIsNear(dist < 5);
        }
    });

    return (
        <group 
            position={position} 
            rotation={rotation}
            ref={groupRef}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* ── Visual Backdrop: Focus Spotlight ── */}
            <spotLight 
                position={[0, 4, 0]} 
                angle={0.2} 
                penumbra={1} 
                intensity={isNear ? 10 : 2} 
                color={hovered ? "#FFFFFF" : "#C6A972"}
                castShadow 
            />

            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.5}>
                {/* ── The Mannequin Silhouette ── */}
                <group onClick={() => setActive(!active)}>
                    {/* Head - Simple sphere */}
                    <mesh position={[0, 0.8, 0]} castShadow>
                        <sphereGeometry args={[0.08, isNear ? 16 : 6, isNear ? 16 : 6]} />
                        <meshStandardMaterial color="#050505" metalness={1} roughness={0} />
                    </mesh>
                    {/* Body Core */}
                    <mesh position={[0, 0, 0]} castShadow>
                        <boxGeometry args={[0.3, 1.4, 0.15]} />
                        <meshStandardMaterial 
                            color="#050505" 
                            roughness={0.1} 
                            metalness={0.9} 
                            emissive="#C6A972"
                            emissiveIntensity={(hovered || isNear) ? 0.2 : 0}
                        />
                    </mesh>
                </group>

                {/* ── Proximity UI: Holographic Metadata ── */}
                {isNear && (
                    <Html 
                        position={[0.5, 0.5, 0]} 
                        center 
                        distanceFactor={6}
                        occlude={[groupRef]}
                    >
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            className="w-72 bg-black/60 backdrop-blur-3xl border border-white/5 rounded-3xl p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.8)] pointer-events-auto"
                        >
                            <div className="space-y-4">
                                <header className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-1 h-1 rounded-full bg-noir-gold animate-ping" />
                                            <span className="text-noir-gold text-[8px] uppercase tracking-[0.4em] font-black italic">
                                                {product.category}
                                            </span>
                                        </div>
                                        <h3 className="font-playfair text-xl italic tracking-tight">{product.name}</h3>
                                    </div>
                                    <p className="font-inter text-noir-gold text-sm font-black">{product.price}</p>
                                </header>

                                <p className="text-white/30 text-[9px] uppercase tracking-widest leading-relaxed">
                                    Digital Craftsmanship / Masterpiece No. {Math.floor(Math.random() * 100)} <br />
                                    Archival quality finish.
                                </p>

                                <div className="pt-2 flex gap-2">
                                    <button className="flex-1 h-10 bg-white text-black text-[9px] uppercase tracking-widest font-black rounded-xl hover:bg-noir-gold transition-colors flex items-center justify-center gap-2">
                                        <ShoppingBag size={12} />
                                        Acquire
                                    </button>
                                    <button 
                                        onClick={() => setActive(false)}
                                        className="w-10 h-10 border border-white/5 flex items-center justify-center rounded-xl text-white/20 hover:text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </Html>
                )}
            </Float>

            {/* ── The Pedestal: Architectural Base ── */}
            <group position={[0, -1, 0]}>
                {/* Main Plinth */}
                <mesh receiveShadow castShadow>
                    <cylinderGeometry args={[0.5, 0.6, 0.2, 32]} />
                    <meshStandardMaterial color="#0a0a0a" metalness={1} roughness={0.1} />
                </mesh>
                {/* Glowing Floor Mark */}
                <mesh position={[0, -0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.61, 0.63, 64]} />
                    <meshBasicMaterial color="#C6A972" transparent opacity={0.5} />
                </mesh>
                {/* Static Aura */}
                <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[0.45, 32]} />
                    <meshBasicMaterial color="#C6A972" transparent opacity={0.05} />
                </mesh>
            </group>
        </group>
    );
}
