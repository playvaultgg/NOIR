"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    MeshDistortMaterial,
    MeshWobbleMaterial,
    TorusKnot,
    Float,
    PresentationControls,
    Stage
} from "@react-three/drei";
import { useRef } from "react";

function LuxuryModel() {
    const meshRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.y = t * 0.3;
        meshRef.current.position.y = Math.sin(t) * 0.1;
    });

    return (
        <TorusKnot ref={meshRef} args={[1, 0.4, 256, 32]}>
            <meshPhysicalMaterial
                color="#D4AF37"
                metalness={0.9}
                roughness={0.1}
                reflectivity={1}
                iridescence={0.3}
                clearcoat={1}
                clearcoatRoughness={0.1}
                emissive="#1a1100"
            />
        </TorusKnot>
    );
}

export default function Product3DViewer() {
    return (
        <div className="w-full h-[500px] bg-charcoal/20 relative group overflow-hidden cursor-grab active:cursor-grabbing border border-white/5">
            {/* 3D TITLE LABEL */}
            <div className="absolute top-6 left-6 z-10 pointer-events-none">
                <span className="text-[10px] uppercase tracking-[0.4em] text-gold/40 font-inter">Inspection Vault</span>
                <p className="text-[11px] uppercase tracking-widest text-white/20 mt-1 italic">360° Interactive Product Render</p>
            </div>

            <Canvas shadows camera={{ position: [0, 0, 4.5], fov: 40 }}>
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                <pointLight position={[-10, -10, -10]} intensity={1} color="#D4AF37" />

                <PresentationControls
                    global
                    config={{ mass: 2, tension: 500 }}
                    snap={{ mass: 4, tension: 1500 }}
                    rotation={[0, 0.3, 0]}
                    polar={[-Math.PI / 3, Math.PI / 3]}
                    azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
                >
                    <Stage environment="city" intensity={0.5} contactShadow={false} adjustCamera={false}>
                        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
                            <LuxuryModel />
                        </Float>
                    </Stage>
                </PresentationControls>

                <Environment preset="studio" />
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            {/* INTERACTIVE HINT */}
            <div className="absolute bottom-6 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-[1px] bg-gold/40" />
                    <span className="text-[9px] uppercase tracking-widest text-gold/60">Drag to Inspect</span>
                </div>
            </div>
        </div>
    );
}
