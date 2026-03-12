"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { 
    MeshTransmissionMaterial, 
    Environment, 
    Text, 
    Float,
    ContactShadows
} from "@react-three/drei";
import * as THREE from "three";

/**
 * L'Atelier Noir: High-Fidelity 3D Perfume Engine
 * Renders a customizable glass flacon with physical liquid simulation.
 */
export default function PerfumeBottle3D({ 
    liquidColor = "#C6A972", 
    glassType = "clear", 
    labelContent = "MAISON NOIR",
    intensity = 1 
}) {
    const bottleRef = useRef();
    const liquidRef = useRef();

    // Material configuration based on glass type
    const glassProps = useMemo(() => {
        switch (glassType) {
            case "frosted":
                return { thickness: 0.2, roughness: 0.4, transmission: 1, ior: 1.2, chromaticAberration: 0.02 };
            case "smoked":
                return { thickness: 0.5, roughness: 0.1, transmission: 0.9, ior: 1.5, color: "#111" };
            default: // Clear
                return { thickness: 0.15, roughness: 0, transmission: 1, ior: 1.4, chromaticAberration: 0.05 };
        }
    }, [glassType]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (bottleRef.current) {
            bottleRef.current.rotation.y = t * 0.1;
        }
        if (liquidRef.current) {
            // Subtle liquid wave effect
            liquidRef.current.position.y = Math.sin(t * 1.5) * 0.01;
        }
    });

    return (
        <group>
            <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                <group ref={bottleRef}>
                    {/* The Outer Glass Flacon */}
                    <mesh position={[0, 0, 0]}>
                        <boxGeometry args={[1.2, 1.8, 0.6]} />
                        <MeshTransmissionMaterial 
                            {...glassProps}
                            backside
                            resolution={512}
                        />
                    </mesh>

                    {/* The Golden Liquid Core */}
                    <mesh ref={liquidRef} position={[0, -0.1, 0]} scale={[0.9, 0.8, 0.9]}>
                        <boxGeometry args={[1.1, 1.6, 0.5]} />
                        <meshPhysicalMaterial 
                            color={liquidColor}
                            transmission={1}
                            thickness={1}
                            roughness={0}
                            ior={1.33}
                            opacity={0.8}
                            transparent
                        />
                    </mesh>

                    {/* Bottle Cap (Metallic Gold) */}
                    <mesh position={[0, 1.1, 0]}>
                        <cylinderGeometry args={[0.3, 0.3, 0.4, 32]} />
                        <meshStandardMaterial 
                            color="#C6A972" 
                            roughness={0.1} 
                            metalness={1} 
                        />
                    </mesh>

                    {/* The Inscribed Label */}
                    <group position={[0, 0.1, 0.31]}>
                        <mesh>
                            <planeGeometry args={[0.8, 0.5]} />
                            <meshStandardMaterial color="#fff" roughness={0.5} />
                        </mesh>
                        <Text
                            position={[0, 0, 0.01]}
                            fontSize={0.06}
                            color="#000"
                            anchorX="center"
                            anchorY="middle"
                            maxWidth={0.7}
                        >
                            {labelContent.toUpperCase()}
                        </Text>
                    </group>
                </group>
            </Float>

            {/* Environmental Setup */}
            <ContactShadows 
                position={[0, -1.2, 0]} 
                opacity={0.4} 
                scale={10} 
                blur={2} 
                far={4} 
            />
            <Environment preset="studio" />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#C6A972" />
            <spotLight 
                position={[0, 5, 0]} 
                angle={0.15} 
                penumbra={1} 
                intensity={10} 
                castShadow 
            />
        </group>
    );
}
