"use client";

import { Environment, ContactShadows } from "@react-three/drei";

/**
 * Maison Noir Studio Lighting Rig
 * Engineered for high-fidelity fabric reflections and cinematic shadows.
 * Features:
 * - Studio-tier HDR Environment
 * - Contrast-heavy Point Spotlights (Noir Aesthetic)
 * - Soft Contact Shadows
 */
export default function LightingRig() {
    return (
        <>
            {/* Global Ambient Fill (Subtle) */}
            <ambientLight intensity={0.2} />

            {/* Main Key Light (Acentric Highlight) */}
            <spotLight
                position={[10, 15, 10]}
                angle={0.15}
                penumbra={1}
                intensity={1.5}
                castShadow
                shadow-mapSize={[2048, 2048]}
            />

            {/* Rim Light (Silk Reflection Simulation) */}
            <pointLight position={[-10, 5, -10]} intensity={2} color="#f0d69b" />

            {/* Bottom Fill */}
            <pointLight position={[0, -5, 5]} intensity={0.5} />

            {/* Luxury Studio Environment Mapping */}
            <Environment preset="studio" />

            {/* High-fidelity Contact Shadows */}
            <ContactShadows
                position={[0, -1.5, 0]}
                opacity={0.4}
                scale={10}
                blur={2.5}
                far={4}
            />
        </>
    );
}
