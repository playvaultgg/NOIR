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
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

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
            className={`relative flex-shrink-0 w-32 md:w-48 cursor-pointer rounded-2xl overflow-hidden border transition-all duration-500 ${
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
                        onClick={(e) => { 
                            e.stopPropagation(); 
                            trackEvent(ANALYTICS_EVENTS.COMMERCE.CHECKOUT_INIT, {
                                source: "runway_card",
                                productId: look.id,
                                productName: look.name
                            });
                            window.location.href = `/product/${look.slug}`; 
                        }}
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
        trackEvent(ANALYTICS_EVENTS.RUNWAY.VIEW, {
            initialLook: LOOKS[0].name
        });
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
        const nextIdx = (lookIndex + dir + LOOKS.length) % LOOKS.length;
        setLookIndex(nextIdx);
        
        trackEvent(ANALYTICS_EVENTS.RUNWAY.LOOK_SWITCH, {
            from: LOOKS[lookIndex].name,
            to: LOOKS[nextIdx].name,
            direction: dir > 0 ? "forward" : "backward"
        });
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
                src="https://cdn.pixabay.com/audio/2022/03/10/audio_c8fd871678.mp3"
                loop
                muted={isMuted}
                autoPlay
            />

            {/* ── Cinematic Transition Flash ── */}
            <AnimatePresence>
                {prevLookIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0 z-[100] bg-white pointer-events-none mix-blend-overlay"
                    />
                )}
            </AnimatePresence>

            {/* ── Cinematic Vignette + Noise ── */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] contrast-150 mix-blend-soft-light" />
                
                {/* Bloom Overlay */}
                <div className="absolute inset-0 bg-[#C6A972]/5 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            </div>

            {/* ── Spotlight Beams ── */}
            <SpotlightBeams />

            {/* ── Top Left: Show Metadata ── */}
            <div className="absolute top-6 left-6 lg:top-10 lg:left-10 z-20 space-y-3 lg:space-y-5">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 lg:gap-4"
                >
                    <div className="flex gap-1">
                        <div className="w-0.5 lg:w-1 h-3 bg-[#C6A972]" />
                        <div className="w-0.5 lg:w-1 h-3 bg-[#C6A972] opacity-40" />
                    </div>
                    <span className="text-[#C6A972] text-[7px] lg:text-[9px] uppercase font-black tracking-[0.4em] lg:tracking-[0.6em]">
                        Live Broadcast · Maison Noir AW26 · Tokyo High-Fidelity
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
                        className="space-y-0.5 lg:space-y-1"
                    >
                        <div className="flex items-center gap-3 mb-2">
                             <div className="px-2 py-0.5 border border-[#C6A972]/30 rounded text-[7px] text-[#C6A972] font-black uppercase tracking-widest bg-[#C6A972]/5">
                                 Active Silhouette
                             </div>
                             <div className="w-8 h-px bg-white/10" />
                        </div>
                        <h1 className="text-white font-playfair text-4xl md:text-5xl lg:text-7xl italic tracking-tighter leading-none">
                            {currentLook.name.split(" ").map((word, i) => (
                                <span key={i} className={i === currentLook.name.split(" ").length - 1 ? "text-[#C6A972]" : ""}>
                                    {word}{" "}
                                </span>
                            ))}
                        </h1>
                        <div className="flex items-center gap-3 lg:gap-5 pt-1 lg:pt-3">
                            <p className="text-white/30 text-[7px] lg:text-[9px] uppercase tracking-[0.3em] lg:tracking-[0.4em] font-medium border-r border-white/10 pr-3 lg:pr-5">
                                Look № {String(lookIndex + 1).padStart(2, "0")} / {String(LOOKS.length).padStart(2, "0")}
                            </p>
                            <p className="text-[#C6A972] text-[7px] lg:text-[9px] uppercase tracking-[0.3em] lg:tracking-[0.4em] font-bold italic">
                                {currentLook.designer}
                            </p>
                        </div>
                        <p className="text-white/50 text-xl md:text-2xl font-light tracking-wider pt-2">
                            {currentLook.price}
                        </p>
                        <motion.button
                            onClick={() => {
                                trackEvent(ANALYTICS_EVENTS.COMMERCE.CHECKOUT_INIT, {
                                    source: "runway_hero",
                                    productId: currentLook.id,
                                    productName: currentLook.name
                                });
                                window.location.href = `/product/${currentLook.slug}`;
                            }}
                            whileHover={{ scale: 1.05, backgroundColor: "#fff" }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-6 inline-flex items-center gap-3 bg-[#C6A972] text-[#0A0A0A] px-8 py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.4em] transition-all"
                        >
                            <ShoppingBag size={14} />
                            Acquire This Ensemble
                        </motion.button>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* ── Top Right: Controls ── */}
            <div className="absolute top-10 right-10 z-20 flex items-center gap-6">
                <div className="flex flex-col items-end px-6 border-r border-white/10">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A972] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C6A972]"></span>
                        </div>
                        <span className="text-white/40 text-[8px] uppercase tracking-widest font-black">Spatial Audio</span>
                    </div>
                    <span className="text-white text-[9px] uppercase tracking-widest font-bold italic text-noir-gold">"Echoes of Noir" — Official Soundtrack</span>
                </div>
                
                <button
                    onClick={toggleMute}
                    className="group relative w-14 h-14 rounded-full border border-white/10 bg-white/5 backdrop-blur-2xl flex items-center justify-center text-white/40 hover:text-[#C6A972] hover:border-[#C6A972]/40 transition-all"
                    title={isMuted ? "Unmute" : "Mute"}
                >
                    <div className="absolute inset-0 rounded-full bg-[#C6A972]/5 group-hover:scale-110 transition-transform" />
                    {isMuted ? <VolumeX size={18} strokeWidth={1} /> : <Volume2 size={18} strokeWidth={1} />}
                    
                    {!isMuted && (
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-0.5 items-end h-6 pointer-events-none">
                            {[0.4, 0.7, 0.3, 0.9, 0.5].map((h, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ height: [`${h * 100}%`, `${(1-h) * 100}%`, `${h * 100}%`] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                    className="w-0.5 bg-noir-gold"
                                />
                            ))}
                        </div>
                    )}
                </button>
            </div>

            {/* ── 3D Scene ── */}
            <div className="absolute inset-0">
                <Canvas shadows gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }} camera={{ position: [0, 1.2, 8], fov: 35 }}>
                    <Suspense fallback={null}>
                        <color attach="background" args={["#000"]} />
                        <fog attach="fog" args={["#000", 6, 20]} />

                        <Environment preset="night" />
                        <ambientLight intensity={0.02} />

                        {/* Main runway spotlight - High Fidelity */}
                        <spotLight
                            position={[0, 18, 0]}
                            angle={0.12}
                            penumbra={1}
                            intensity={40}
                            castShadow
                            shadow-mapSize={[2048, 2048]}
                            shadow-bias={-0.0001}
                            color="#fff"
                        />
                        <spotLight
                            position={[0, 18, 2]}
                            angle={0.15}
                            penumbra={1}
                            intensity={20}
                            color="#C6A972"
                        />
                        
                        {/* Side Accent lights */}
                        <spotLight position={[-8, 12, -4]} angle={0.25} penumbra={0.8} intensity={15} color="#C6A972" />
                        <spotLight position={[8, 12, -4]} angle={0.25} penumbra={0.8} intensity={15} color="#C6A972" />

                        <CameraFlashes />

                        <group position={[0, -1, 0]}>
                            <RunwayModel isActive={isPlaying} lookIndex={lookIndex} />
                            <RunwayEnvironment />

                            {/* Reflective Runway Floor - Ultra Premium */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
                                <planeGeometry args={[3.2, 50]} />
                                <meshStandardMaterial color="#050505" roughness={0.02} metalness={1} />
                            </mesh>
                            
                            {/* Runway Side Strips */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.65, -0.005, 0]}>
                                <planeGeometry args={[0.05, 50]} />
                                <meshBasicMaterial color="#C6A972" transparent opacity={0.3} />
                            </mesh>
                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.65, -0.005, 0]}>
                                <planeGeometry args={[0.05, 50]} />
                                <meshBasicMaterial color="#C6A972" transparent opacity={0.3} />
                            </mesh>

                            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                                <planeGeometry args={[150, 150]} />
                                <shadowMaterial opacity={0.7} />
                            </mesh>
                            <ContactShadows position={[0, -0.01, 0]} opacity={1} scale={30} blur={2} far={5} />
                        </group>

                        <Stars radius={150} depth={50} count={8000} factor={4} saturation={0} fade speed={1} />
                    </Suspense>
                    <OrbitControls
                        enablePan={false}
                        enableZoom={false}
                        maxPolarAngle={Math.PI / 2}
                        minPolarAngle={Math.PI / 2.2}
                    />
                </Canvas>
            </div>

            {/* ── Bottom Controls ── */}
            <div className="absolute bottom-0 left-0 right-0 z-20">
                {/* Look progress bar */}
                <div className="flex gap-1 mb-4 lg:mb-8 px-8 lg:px-12">
                    {LOOKS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToLook(i)}
                            className={`h-0.5 flex-1 rounded-full transition-all duration-1000 ${i === lookIndex ? "bg-noir-gold shadow-[0_0_10px_#C6A972]" : "bg-white/5 hover:bg-white/20"}`}
                        />
                    ))}
                </div>

                {/* Controls row */}
                <div className="flex items-end justify-between px-8 lg:px-12 pb-8 lg:pb-12 gap-6 lg:gap-10 overflow-x-auto no-scrollbar">
                    {/* Playback Controls */}
                    <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                        <button
                            onClick={() => advanceLook(-1)}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all"
                        >
                            <SkipBack size={16} strokeWidth={1.5} />
                        </button>
                        <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="w-14 h-14 lg:w-20 lg:h-20 bg-white text-black rounded-full flex items-center justify-center hover:bg-noir-gold transition-all hover:scale-105 active:scale-95 shadow-3xl"
                        >
                            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                        </button>
                        <button
                            onClick={() => advanceLook(1)}
                            className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-2xl flex items-center justify-center text-white/30 hover:text-white hover:border-white/20 transition-all"
                        >
                            <SkipForward size={16} strokeWidth={1.5} />
                        </button>
                        <div className="hidden md:flex flex-col gap-1 ml-4 border-l border-white/5 pl-6">
                            <p className="text-white/20 text-[8px] uppercase tracking-[0.4em] font-black">Transmission</p>
                            <p className="text-noir-gold text-[10px] uppercase tracking-[0.2em] font-black italic">Infinite Sequence</p>
                        </div>
                    </div>

                    {/* Look Selection Deck */}
                    <div className="flex-1 overflow-hidden relative min-w-0">
                        <div className="absolute left-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-16 lg:w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                        <div
                            ref={cardsRef}
                            className="flex gap-4 lg:gap-6 overflow-x-auto pb-12 scrollbar-none snap-x"
                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                        >
                            {LOOKS.map((look, i) => (
                                <div key={look.id} className="snap-center">
                                    <LookCard
                                        look={look}
                                        isActive={i === lookIndex}
                                        onClick={() => goToLook(i)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* REC / Telemetry (Desktop Only) */}
                    <div className="hidden xl:flex flex-col items-end gap-3 opacity-30 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                            <Camera size={14} className="text-white" />
                            <span className="text-[10px] font-mono tracking-tighter text-white font-bold italic">STREAMING 4K · 60FPS</span>
                        </div>
                        <div className="w-48 h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                        <div className="flex gap-4 text-[9px] font-mono text-white/60">
                            <span>ISO 400</span>
                            <span>f/2.8</span>
                            <span>1/120</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
