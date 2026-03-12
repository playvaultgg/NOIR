"use client";

import { useRef, useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    MeshDistortMaterial,
    ContactShadows,
    Stars,
    Text,
    Float,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
    Play, SkipForward, SkipBack, Pause, Camera, 
    Volume2, VolumeX, ShoppingBag, ChevronRight, ChevronLeft,
    Maximize2
} from "lucide-react";

/* ─── Curated Look Data ─────────────────────────────────────── */
const LOOKS = [
    { id: 1, name: "Obsidian Trench", designer: "Maison Noir Archive", price: "₹85,000", category: "Runway AW26", tag: "SOLD OUT", slug: "obsidian-trench", accent: "#C6A972" },
    { id: 2, name: "Midnight Velvet Gown", designer: "Couture Atelier", price: "₹1,25,000", category: "Haute Couture", tag: "NEW", slug: "midnight-velvet-gown", accent: "#8B7355" },
    { id: 3, name: "Sovereign Silk Set", designer: "Atelier de Luxe", price: "₹1,10,000", category: "Resort Collection", tag: "EXCLUSIVE", slug: "sovereign-silk-set", accent: "#C0C0C0" },
    { id: 4, name: "Archive Leather Mono", designer: "Maison Noir Lab", price: "₹1,45,000", category: "Heritage Archive", tag: "ARCHIVE", slug: "archive-leather-mono", accent: "#8B4513" },
    { id: 5, name: "Ghost Organza Wrap", designer: "Phantom Division", price: "₹95,000", category: "Capsule SS27", tag: "LIMITED", slug: "ghost-organza-wrap", accent: "#E8E8E8" },
    { id: 6, name: "Vantablack Tuxedo", designer: "Noir Homme", price: "₹1,75,000", category: "Black Label", tag: "BESPOKE", slug: "vantablack-tuxedo", accent: "#2A2A2A" },
    { id: 7, name: "Maison Gold Blazer", designer: "Maison Noir Gold", price: "₹75,000", category: "Signature Line", tag: "FEATURED", slug: "maison-gold-blazer", accent: "#D4AF37" },
    { id: 8, name: "Obsidian Parka V2", designer: "Technical Division", price: "₹92,000", category: "AW26 Technical", tag: "NEW", slug: "obsidian-parka-v2", accent: "#1A1A2E" },
];

/* ─── 3D: Runway Model Silhouette ─────────────────────────────── */
function RunwayModel({ isActive, lookIndex }) {
    const group = useRef();
    const [color, setColor] = useState("#050505");

    useEffect(() => {
        const look = LOOKS[lookIndex % LOOKS.length];
        setColor(look.accent);
    }, [lookIndex]);
    
    useFrame((state) => {
        if (!group.current) return;
        const t = state.clock.getElapsedTime();
        if (isActive) {
            group.current.position.z = Math.sin(t * 0.35) * 3.5;
            group.current.position.y = Math.abs(Math.cos(t * 1.8)) * 0.04 - 0.5;
            group.current.rotation.y = Math.sin(t * 0.35) * 0.08;
        }
    });

    return (
        <group ref={group}>
            {/* Torso */}
            <mesh position={[0, 1.2, 0]} castShadow>
                <capsuleGeometry args={[0.25, 0.8, 8, 16]} />
                <meshStandardMaterial color="#050505" roughness={0.05} metalness={0.95} />
            </mesh>
            {/* Head */}
            <mesh position={[0, 1.88, 0]} castShadow>
                <sphereGeometry args={[0.12, 32, 32]} />
                <meshStandardMaterial color="#080808" roughness={0} metalness={1} />
            </mesh>
            {/* Left Leg */}
            <mesh position={[-0.1, 0.38, 0]} castShadow>
                <capsuleGeometry args={[0.075, 0.82, 8, 16]} />
                <meshStandardMaterial color="#060606" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Right Leg */}
            <mesh position={[0.1, 0.38, 0]} castShadow>
                <capsuleGeometry args={[0.075, 0.82, 8, 16]} />
                <meshStandardMaterial color="#060606" roughness={0.1} metalness={0.8} />
            </mesh>
            {/* Couture Aura */}
            <pointLight position={[0, 1.3, 0.2]} intensity={8} color={color} distance={2.5} />
            <mesh position={[0, 1.3, 0.2]}>
                <sphereGeometry args={[0.035, 16, 16]} />
                <meshBasicMaterial color={color} />
            </mesh>
            {/* Dynamic Fabric */}
            <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 8]}>
                <torusGeometry args={[0.32, 0.012, 16, 32]} />
                <MeshDistortMaterial color={color} speed={3} distort={0.45} opacity={0.35} transparent />
            </mesh>
            <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 12, 0, 0]}>
                <torusGeometry args={[0.22, 0.008, 12, 24]} />
                <MeshDistortMaterial color={color} speed={2} distort={0.3} opacity={0.2} transparent />
            </mesh>
        </group>
    );
}

/* ─── 3D: Runway Environment ──────────────────────────────────── */
function RunwayEnvironment() {
    const pillars = useMemo(() => {
        const p = [];
        for (let i = -12; i <= 12; i += 3.5) {
            p.push({ pos: [-3.2, 2, i], id: `l-${i}` });
            p.push({ pos: [3.2, 2, i], id: `r-${i}` });
        }
        return p;
    }, []);

    return (
        <group>
            {pillars.map((p) => (
                <group key={p.id} position={p.pos}>
                    <mesh>
                        <boxGeometry args={[0.08, 8, 0.08]} />
                        <meshStandardMaterial color="#0A0A0A" metalness={0.9} roughness={0.1} />
                    </mesh>
                    <pointLight position={[0, -2.5, 0.15]} intensity={1.2} color="#C6A972" distance={3.5} />
                    <mesh position={[0, -2.5, 0.12]}>
                        <planeGeometry args={[0.18, 5]} />
                        <meshBasicMaterial color="#C6A972" transparent opacity={0.08} />
                    </mesh>
                </group>
            ))}

            {/* Crowd Silhouettes */}
            {[-4.5, 4.5].map((x) => (
                <group key={x} position={[x, -0.9, 0]}>
                    {[...Array(22)].map((_, i) => (
                        <mesh key={i} position={[
                            (Math.sin(i * 137.5) - 0.5) * 1.2,
                            0,
                            (Math.cos(i * 137.5) - 0.5) * 22
                        ]}>
                            <cylinderGeometry args={[0.12, 0.15, 0.55 + Math.sin(i) * 0.1, 8]} />
                            <meshStandardMaterial color="#050505" opacity={0.4} transparent />
                        </mesh>
                    ))}
                </group>
            ))}
        </group>
    );
}

/* ─── 3D: Camera Flashes ──────────────────────────────────────── */
function CameraFlashes() {
    const [flash, setFlash] = useState(false);
    const [pos, setPos] = useState([5, 2, 0]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (Math.random() > 0.65) {
                setPos([(Math.random() - 0.5) * 12, Math.random() * 5, (Math.random() - 0.5) * 12]);
                setFlash(true);
                setTimeout(() => setFlash(false), 45);
            }
        }, 700);
        return () => clearInterval(interval);
    }, []);

    return flash ? (
        <pointLight position={pos} intensity={60} color="#fff" distance={18} decay={2} />
    ) : null;
}

/* ─── UI: Spotlight Beam Overlay ─────────────────────────────── */
function SpotlightBeams() {
    return (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
            {[
                { left: "15%", delay: "0s", color: "from-white/8" },
                { left: "35%", delay: "0.4s", color: "from-[#C6A972]/10" },
                { left: "50%", delay: "0.2s", color: "from-white/6" },
                { left: "65%", delay: "0.6s", color: "from-[#C6A972]/8" },
                { left: "82%", delay: "0.1s", color: "from-white/7" },
            ].map((beam, i) => (
                <div
                    key={i}
                    className="absolute top-0 bottom-0 w-16 origin-top"
                    style={{
                        left: beam.left,
                        background: `linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)`,
                        clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
                        animation: `spotPulse 4s ease-in-out infinite ${beam.delay}`,
                        opacity: 0.6,
                    }}
                />
            ))}
            <style>{`
                @keyframes spotPulse {
                    0%, 100% { opacity: 0.4; transform: scaleX(1); }
                    50% { opacity: 0.9; transform: scaleX(1.15); }
                }
            `}</style>
        </div>
    );
}

/* ─── UI: Look Card ──────────────────────────────────────────── */
function LookCard({ look, isActive, onClick }) {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`relative flex-shrink-0 w-48 cursor-pointer rounded-2xl overflow-hidden border transition-all duration-500 ${
                isActive 
                    ? "border-[#C6A972]/60 shadow-[0_0_24px_rgba(198,169,114,0.25)]" 
                    : "border-white/5 hover:border-white/20"
            }`}
            style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)" }}
        >
            {/* Gradient preview */}
            <div 
                className="h-28 w-full"
                style={{ background: `linear-gradient(135deg, ${look.accent}22 0%, #0A0A0A 100%)` }}
            >
                {/* Abstract silhouette */}
                <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-1 opacity-60">
                        <div className="w-5 h-5 rounded-full" style={{ background: look.accent }} />
                        <div className="w-3 h-10 rounded-full" style={{ background: look.accent, opacity: 0.7 }} />
                        <div className="flex gap-1">
                            <div className="w-2 h-8 rounded-full" style={{ background: look.accent, opacity: 0.5 }} />
                            <div className="w-2 h-8 rounded-full" style={{ background: look.accent, opacity: 0.5 }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tag */}
            <div className="absolute top-2 right-2">
                <span 
                    className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: look.accent, color: "#0A0A0A" }}
                >
                    {look.tag}
                </span>
            </div>

            {/* Active indicator */}
            {isActive && (
                <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-[#C6A972] animate-pulse" />
            )}

            <div className="p-3 space-y-1.5">
                <p className="text-white/30 text-[8px] uppercase tracking-[0.3em] font-black">{look.category}</p>
                <h4 className="text-white font-playfair text-sm leading-tight">{look.name}</h4>
                <p className="text-white/40 text-[9px]">{look.designer}</p>
                <div className="flex items-center justify-between pt-1">
                    <span className="text-[#C6A972] text-xs font-bold">{look.price}</span>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => { e.stopPropagation(); window.location.href = `/product/${look.slug}`; }}
                        className="w-6 h-6 rounded-full bg-[#C6A972] flex items-center justify-center"
                    >
                        <ShoppingBag size={10} color="#0A0A0A" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function RunwayExperience() {
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [lookIndex, setLookIndex] = useState(0);
    const [prevLookIndex, setPrevLookIndex] = useState(null);
    const [direction, setDirection] = useState(1);
    const audioRef = useRef(null);
    const cardsRef = useRef(null);

    const currentLook = LOOKS[lookIndex];

    /* Auto-advance look every 8s */
    useEffect(() => {
        if (!isPlaying) return;
        const timer = setInterval(() => advanceLook(1), 8000);
        return () => clearInterval(timer);
    }, [isPlaying, lookIndex]);

    /* Scroll active card into view */
    useEffect(() => {
        if (!cardsRef.current) return;
        const card = cardsRef.current.children[lookIndex];
        if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }, [lookIndex]);

    const advanceLook = useCallback((dir) => {
        setDirection(dir);
        setPrevLookIndex(lookIndex);
        setLookIndex((prev) => (prev + dir + LOOKS.length) % LOOKS.length);
    }, [lookIndex]);

    const goToLook = useCallback((idx) => {
        setDirection(idx > lookIndex ? 1 : -1);
        setPrevLookIndex(lookIndex);
        setLookIndex(idx);
    }, [lookIndex]);

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (audioRef.current) {
            audioRef.current.muted = newMuted;
            if (!newMuted) audioRef.current.play().catch(() => {});
        }
    };

    /* Slide variants */
    const slideVariants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40, filter: "blur(8px)" }),
        center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40, filter: "blur(8px)", transition: { duration: 0.4 } }),
    };

    return (
        <section className="relative w-full h-screen bg-black overflow-hidden select-none">
            {/* ── Audio ── */}
            <audio
                ref={audioRef}
                src="https://www.bensound.com/bensound-music/bensound-epic.mp3"
                loop
                muted={isMuted}
                autoPlay
            />

            {/* ── Cinematic Vignette + Noise ── */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-60" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.025] contrast-150" />
            </div>

            {/* ── Spotlight Beams ── */}
            <SpotlightBeams />

            {/* ── Top Left: Show Metadata ── */}
            <div className="absolute top-10 left-10 z-20 space-y-5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-4"
                >
                    <div className="flex gap-1">
                        <div className="w-1 h-3 bg-[#C6A972]" />
                        <div className="w-1 h-3 bg-[#C6A972] opacity-40" />
                    </div>
                    <span className="text-[#C6A972] text-[9px] uppercase font-black tracking-[0.6em]">
                        Live Broadcast · Maison Noir AW26
                    </span>
                </motion.div>

                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={lookIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="space-y-1"
                    >
                        <h1 className="text-white font-playfair text-5xl lg:text-6xl italic tracking-tighter leading-none">
                            {currentLook.name.split(" ").map((word, i) => (
                                <span key={i} className={i === currentLook.name.split(" ").length - 1 ? "text-[#C6A972]" : ""}>
                                    {word}{" "}
                                </span>
                            ))}
                        </h1>
                        <div className="flex items-center gap-5 pt-3">
                            <p className="text-white/30 text-[9px] uppercase tracking-[0.4em] font-medium border-r border-white/10 pr-5">
                                Look № {String(lookIndex + 1).padStart(2, "0")} / {String(LOOKS.length).padStart(2, "0")}
                            </p>
                            <p className="text-[#C6A972] text-[9px] uppercase tracking-[0.4em] font-bold italic">
                                {currentLook.designer}
                            </p>
                        </div>
                        <p className="text-white/50 text-xl font-light tracking-wider pt-1">
                            {currentLook.price}
                        </p>
                        <motion.a
                            href={`/product/${currentLook.slug}`}
                            whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-4 inline-flex items-center gap-3 bg-[#C6A972] text-[#0A0A0A] px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.4em]"
                        >
                            <ShoppingBag size={12} />
                            Shop This Look
                        </motion.a>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Top Right: Controls ── */}
            <div className="absolute top-10 right-10 z-20 flex items-center gap-4">
                <button
                    onClick={toggleMute}
                    className="w-11 h-11 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-[#C6A972] hover:border-[#C6A972]/40 transition-all"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    {isMuted ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
                </button>
                <div className="flex flex-col items-end px-4 border-l border-white/10">
                    <span className="text-white/20 text-[8px] uppercase tracking-widest font-black">Camera</span>
                    <span className="text-white text-[9px] uppercase tracking-widest font-bold">FR-04 Cinematic</span>
                </div>
            </div>

            {/* ── 3D Scene ── */}
            <div className="absolute inset-0">
                <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} camera={{ position: [0, 1.2, 8], fov: 35 }}>
                    <Suspense fallback={null}>
                        <color attach="background" args={["#000"]} />
                        <fog attach="fog" args={["#000", 8, 22]} />

                        <Environment preset="night" />
                        <ambientLight intensity={0.04} />

                        {/* Main runway spotlight */}
                        <spotLight
                            position={[0, 16, 0]}
                            angle={0.14}
                            penumbra={1}
                            intensity={30}
                            castShadow
                            shadow-bias={-0.0001}
                            color="#fff"
                        />
                        {/* Gold accent lights */}
                        <spotLight position={[-5, 10, -3]} angle={0.2} penumbra={0.8} intensity={12} color="#C6A972" />
                        <spotLight position={[5, 10, -3]} angle={0.2} penumbra={0.8} intensity={12} color="#C6A972" />

                        <CameraFlashes />

                        <group position={[0, -1, 0]}>
                            <RunwayModel isActive={isPlaying} lookIndex={lookIndex} />
                            <RunwayEnvironment />

                            {/* Reflective Runway Floor */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                                <planeGeometry args={[2.5, 45]} />
                                <meshStandardMaterial color="#060606" roughness={0.04} metalness={0.9} />
                            </mesh>
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                                <planeGeometry args={[120, 120]} />
                                <shadowMaterial opacity={0.6} />
                            </mesh>
                            <ContactShadows position={[0, -0.01, 0]} opacity={1} scale={25} blur={2.5} far={4.5} />
                        </group>

                        <Stars radius={120} depth={60} count={6000} factor={4} saturation={0} fade speed={0.8} />
                    </Suspense>
                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 2.5}
                    />
                </Canvas>
            </div>

            {/* ── Bottom Controls ── */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Look progress bar */}
                <div className="flex gap-0.5 mb-5 px-10">
                    {LOOKS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToLook(i)}
                            className={`h-0.5 flex-1 rounded-full transition-all duration-700 ${i === lookIndex ? "bg-[#C6A972]" : "bg-white/10 hover:bg-white/25"}`}
                        />
                    ))}
                </div>

                {/* Controls row */}
                <div className="flex items-end justify-between px-10 pb-8 gap-6">
                    {/* Playback */}
                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => advanceLook(-1)}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                        >
                            <SkipBack size={16} />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-[#C6A972] transition-all hover:scale-110 active:scale-90 shadow-2xl"
                        >
                            {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button
                            onClick={() => advanceLook(1)}
                            className="w-10 h-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
                        >
                            <SkipForward size={16} />
                        </button>
                        <div className="flex flex-col gap-1 ml-2">
                            <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-black">Mode</p>
                            <p className="text-[#C6A972] text-[9px] uppercase tracking-[0.2em] font-bold">Auto Sequence</p>
                        </div>
                    </div>

                    {/* Look Cards Horizontal Scroll */}
                    <div className="flex-1 overflow-hidden relative">
                        {/* fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                        <div
                            ref={cardsRef}
                            className="flex gap-3 overflow-x-auto pb-1 scrollbar-none"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {LOOKS.map((look, i) => (
                                <LookCard
                                    key={look.id}
                                    look={look}
                                    isActive={i === lookIndex}
                                    onClick={() => goToLook(i)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* REC indicator */}
                    <div className="flex flex-col items-end gap-1 opacity-25 shrink-0">
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            <Camera size={13} />
                            <span className="text-[9px] font-mono tracking-tighter">REC</span>
                        </div>
                        <div className="w-28 h-px bg-white mt-1" />
                    </div>
                </div>
            </div>
        </section>
    );
}
