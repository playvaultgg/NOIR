"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { 
    Environment, 
    Float, 
    MeshTransmissionMaterial, 
    ContactShadows,
    PresentationControls
} from "@react-three/drei";
import * as THREE from "three";

/**
 * Maison NOIR - 3D Quick-Look Protocol
 * Minimalist WebGL preview for shopping grid cards.
 */
export default function QuickLook3D({ color = "#C6A972" }) {
    return (
        <div className="w-full h-full relative">
            <Canvas camera={{ position: [0, 0, 4], fov: 35 }}>
                <Suspense fallback={null}>
                    <Environment preset="studio" />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={2} />
                    
                    <PresentationControls
                        global
                        config={{ mass: 2, tension: 500 }}
                        snap={{ mass: 4, tension: 1500 }}
                        rotation={[0, 0.3, 0]}
                        polar={[-Math.PI / 3, Math.PI / 3]}
                        azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                    >
                        <ProductSilhouette color={color} />
                    </PresentationControls>

                    <ContactShadows 
                        position={[0, -1.2, 0]} 
                        opacity={0.3} 
                        scale={6} 
                        blur={2.5} 
                        far={3} 
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}

function ProductSilhouette({ color }) {
    const meshRef = useRef();

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={meshRef}>
                {/* ── Mannequin Torso Archetype ── */}
                <mesh position={[0, -0.2, 0]}>
                    <cylinderGeometry args={[0.5, 0.4, 1.4, 32]} />
                    <MeshTransmissionMaterial 
                        thickness={0.2}
                        transmission={1}
                        ior={1.2}
                        roughness={0.1}
                        chromaticAberration={0.05}
                        color={color}
                    />
                </mesh>
                
                {/* Head Sphere */}
                <mesh position={[0, 0.7, 0]}>
                    <sphereGeometry args={[0.2, 32, 32]} />
                    <meshStandardMaterial 
                        color={color} 
                        roughness={0} 
                        metalness={1} 
                    />
                </mesh>

                {/* Weighted Base Plinth */}
                <mesh position={[0, -1, 0]}>
                    <cylinderGeometry args={[0.6, 0.7, 0.1, 32]} />
                    <meshStandardMaterial color="#050505" metalness={1} roughness={0.1} />
                </mesh>
            </group>
        </Float>
    );
}
