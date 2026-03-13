import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MeshReflectorMaterial, SoftShadows, MeshTransmissionMaterial, Sparkles, Html } from "@react-three/drei";

function CinematicFlashes() {
    const lightRef = useRef();
    useFrame((state) => {
        if (!lightRef.current) return;
        // Occasional flashes of light
        const t = state.clock.elapsedTime;
        const flash = Math.sin(t * 2) > 0.98 ? 10 : 0;
        lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, flash, 0.1);
    });
    return <pointLight ref={lightRef} position={[0, 8, -25]} color="#C6A972" />;
}

/**
 * Maison NOIR - Showroom Architecture
 * High-fidelity environment construction.
 */
export default function Architecture({ currentRoom }) {
    const isVIP = currentRoom === "vip";

    // Generate randomized panel positions for a "brushed architectural" look
    const panels = useMemo(() => {
        const p = [];
        for (let i = -2; i <= 2; i++) {
            p.push({ pos: [i * 10, 5, -50], rot: [0, 0, 0] }); // Back wall
            p.push({ pos: [-25, 5, i * 10 - 20], rot: [0, Math.PI / 2, 0] }); // Left wall
            p.push({ pos: [25, 5, i * 10 - 20], rot: [0, -Math.PI / 2, 0] }); // Right wall
        }
        return p;
    }, []);

    return (
        <group>
            <SoftShadows size={40} samples={16} focus={0.5} />
            
            {/* ── Atmospheric Effects: Dust Particles ── */}
            <Sparkles 
                count={isVIP ? 200 : 50} 
                scale={[40, 10, 60]} 
                size={0.4} 
                speed={0.2} 
                opacity={0.1} 
                color="#C6A972" 
                position={[0, 5, -20]}
            />
            
            <CinematicFlashes />

            {/* ── Floor: Onyx Marble Reflector ── */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={512}
                    mixBlur={1}
                    mixStrength={10}
                    roughness={0.9}
                    depthScale={1}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.2}
                    color="#030303" 
                    metalness={0.9}
                />
            </mesh>

            {/* ── Walls: Brushed Obsidian Panels ── */}
            {panels.map((p, i) => (
                <mesh key={`panel-${i}`} position={p.pos} rotation={p.rot} receiveShadow castShadow>
                     <planeGeometry args={[10, 12]} />
                     <meshStandardMaterial 
                        color="#0a0a0a" 
                        roughness={0.2} 
                        metalness={1} 
                        normalScale={new THREE.Vector2(0.1, 0.1)}
                    />
                </mesh>
            ))}

            {/* ── Ceiling: The Void with Light Grids ── */}
            <mesh position={[0, 10, -20]} rotation={[Math.PI / 2, 0, 0]}>
                <planeGeometry args={[60, 60]} />
                <meshStandardMaterial color="#020202" />
            </mesh>
            
            {/* Emissive Skylights */}
            {[[-10, -10], [10, -10], [-10, -30], [10, -30]].map((pos, i) => (
                <group key={`sky-${i}`} position={[pos[0], 9.9, pos[1]]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <planeGeometry args={[6, 6]} />
                        <meshBasicMaterial color="#C6A972" transparent opacity={0.3} />
                    </mesh>
                    <rectAreaLight
                        width={6}
                        height={6}
                        intensity={2}
                        color="#C6A972"
                        position={[0, -0.1, 0]}
                        rotation={[-Math.PI / 2, 0, 0]}
                    />
                </group>
            ))}

            {/* ── Integrated Lighting Strips ── */}
            {[...Array(6)].map((_, i) => (
                <group key={`strip-${i}`} position={[-20 + i * 8, 9.8, -20]}>
                    <mesh rotation={[Math.PI / 2, 0, 0]}>
                        <boxGeometry args={[0.05, 40, 0.05]} />
                        <meshBasicMaterial color="#C6A972" toneMapped={false} />
                    </mesh>
                    <pointLight position={[0, -0.5, 0]} intensity={5} distance={15} color="#C6A972" />
                </group>
            ))}

            {/* ── Runway Stage: Curation Pedestal ── */}
            <group position={[0, 0, -15]}>
                {/* Main Base */}
                <mesh position={[0, -0.2, 0]} receiveShadow castShadow>
                    <boxGeometry args={[8, 0.4, 12]} />
                    <meshStandardMaterial color="#080808" metalness={0.8} roughness={0.1} />
                </mesh>
                {/* Glowing Trim */}
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[8.1, 0.05, 12.1]} />
                    <meshBasicMaterial color="#C6A972" />
                </mesh>
                {/* Glass Cover Preview (Placeholder for a future key piece) */}
                <mesh position={[0, 1.2, 0]}>
                    <boxGeometry args={[2, 2.5, 2]} />
                    <MeshTransmissionMaterial 
                        thickness={0.2}
                        transmission={1}
                        ior={1.2}
                        roughness={0.1}
                        chromaticAberration={0.05}
                        transparent
                        opacity={0.3}
                    />
                </mesh>
            </group>

            {/* ── Structural Elements: Pillars ── */}
            {[[-15, -10], [15, -10], [-15, -30], [15, -30], [-15, -50], [15, -50]].map((pos, i) => (
                <mesh key={`pillar-${i}`} position={[pos[0], 5, pos[1]]} receiveShadow castShadow>
                     <boxGeometry args={[1, 10, 1]} />
                     <meshStandardMaterial color="#050505" roughness={0.05} metalness={1} />
                </mesh>
            ))}

            {/* ── UI Signal: Audio Protocol ── */}
            <Html position={[-24, 0.5, -10]} transform rotation={[0, Math.PI / 2, 0]} occlude>
                <div className="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xl p-4 rounded-xl border border-white/5 pointer-events-none select-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-pulse" />
                    <span className="text-[8px] uppercase tracking-[0.4em] text-white font-black italic whitespace-nowrap">
                        Maison Ambient Feed / 44.1kHz Active
                    </span>
                </div>
            </Html>
        </group>
    );
}

