"use client";

import { useGLTF, Html, Float } from "@react-three/drei";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function ProductDisplay({ position, rotation = [0, 0, 0], product }) {
    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);
    const groupRef = useRef();

    // Fallback/Placeholder geometry if model fails or isn't needed immediately. 
    // Ideally we'd use useGLTF("/models/silk-tux.glb") but let's make an abstract couture form
    // since the 'silk-tux.glb' might not exist or be styled exactly.
    // Instead, I'll build a suspended fashion frame just in case.
    
    // Rotating interaction
    useFrame((state, delta) => {
        if (groupRef.current && hovered && !active) {
            groupRef.current.rotation.y += delta * 0.5;
        }
    });

    return (
        <group 
            position={position} 
            rotation={rotation}
            ref={groupRef}
        >
            {/* Spotlight directly on the product */}
            <spotLight 
                position={[0, 4, 0]} 
                angle={0.3} 
                penumbra={1} 
                intensity={hovered ? 5 : 2} 
                color={hovered ? "#FFFFFF" : "#C6A972"}
                castShadow 
            />

            <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
                {/* The Mannequin/Abstract Display Stand */}
                <mesh 
                    position={[0, 0, 0]} 
                    castShadow
                    onClick={() => setActive(!active)}
                    onPointerOver={() => setHovered(true)}
                    onPointerOut={() => setHovered(false)}
                >
                    <cylinderGeometry args={[0.3, 0.2, 1.8, 32]} />
                    <meshStandardMaterial 
                        color={hovered ? "#2A2A2A" : "#1A1A1A"} 
                        roughness={0.2}
                        metalness={0.8}
                    />
                    
                    {/* Glowing effect ring around waist when hovered */}
                    {hovered && (
                        <mesh position={[0, 0, 0]}>
                            <torusGeometry args={[0.35, 0.02, 16, 100]} />
                            <meshBasicMaterial color="#C6A972" />
                        </mesh>
                    )}
                </mesh>

                {/* Html interactive HUD when clicked or hovered strongly */}
                {(active || hovered) && (
                    <Html position={[1, 1, 0]} transform sprite zIndexRange={[100, 0]}>
                        <div 
                            className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-80 text-white shadow-2xl transition-all duration-300 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()} // Stop clicking UI from bubbling to mesh
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="text-[#C6A972] text-[10px] uppercase font-black tracking-[0.4em] mb-1 block">
                                        {product.category}
                                    </span>
                                    <h3 className="font-playfair text-xl italic leading-none">{product.name}</h3>
                                </div>
                                <p className="font-inter text-[#E5E5E5] font-semibold">{product.price}</p>
                            </div>
                            
                            <p className="text-white/40 text-[10px] font-inter uppercase tracking-[0.2em] mb-6 leading-relaxed">
                                Hand-stitched precision. Explore the intricate details of this masterpiece directly within the archive space.
                            </p>
                            
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-[#C6A972] text-[#0A0A0A] font-inter text-[10px] uppercase tracking-[0.3em] font-bold rounded hover:bg-white hover:scale-105 transition-all">
                                    Add to Cart
                                </button>
                                <button 
                                    onClick={() => setActive(false)}
                                    className="px-4 border border-white/20 text-white/40 rounded hover:text-white hover:border-[#C6A972] transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </Html>
                )}
            </Float>

            {/* Platform disc */}
            <mesh position={[0, -1, 0]} receiveShadow>
                <cylinderGeometry args={[0.8, 0.8, 0.05, 32]} />
                <meshStandardMaterial color="#0A0A0A" />
            </mesh>
        </group>
    );
}
