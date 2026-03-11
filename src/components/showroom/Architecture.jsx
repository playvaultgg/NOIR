"use client";

import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { MeshReflectorMaterial, SoftShadows } from "@react-three/drei";

export default function Architecture() {
    return (
        <group>
            {/* Enable Soft Shadows for photorealistic architectural feel */}
            <SoftShadows size={40} samples={16} focus={0.5} />
            
            {/* 1. Showroom Floor (Luxury Marble Concept) */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={15}
                    roughness={0.8}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#09090A"
                    metalness={0.5}
                />
            </mesh>

            {/* 2. Entrance Lobby Ceiling & Light Panels */}
            {/* Linear floating strip lights */}
            {[...Array(6)].map((_, i) => (
                <mesh key={`light-${i}`} position={[-6 + i * 4, 4, -4]}>
                    <boxGeometry args={[0.2, 0.1, 40]} />
                    <meshBasicMaterial color="#C6A972" toneMapped={false} />
                    <pointLight intensity={10} distance={10} color="#C6A972" decay={2} />
                </mesh>
            ))}

            {/* 3. Runway Stage Raised Platform */}
             <mesh position={[0, -0.1, -15]} receiveShadow castShadow>
                <boxGeometry args={[6, 0.4, 15]} />
                <meshStandardMaterial color="#0A0A0A" />
            </mesh>
            <mesh position={[0, 0.11, -15]}>
                <planeGeometry args={[6.1, 15.1]} />
                <meshBasicMaterial color="#C6A972" />
            </mesh>

            {/* 4. Pillars VIP Section */}
            {[[-12, -25], [12, -25], [-8, -35], [8, -35]].map((pos, idx) => (
                <mesh key={`pillar-${idx}`} position={[pos[0], 4, pos[1]]} receiveShadow castShadow>
                     <cylinderGeometry args={[1, 1, 8, 32]} />
                     <meshStandardMaterial color="#0F172A" roughness={0.1} metalness={0.8} />
                </mesh>
            ))}
        </group>
    );
}
