"use client";

import { useEffect, useState, Suspense, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
    Environment, 
    PointerLockControls, 
    Sparkles, 
    Html, 
    useProgress,
    Stars,
} from "@react-three/drei";
import * as THREE from "three";
import Player from "./Player";
import Architecture from "./Architecture";
import ProductDisplay from "./ProductDisplay";
import ShowroomMinimap from "./ShowroomMinimap";
import { Volume2, VolumeX } from "lucide-react";

/* ─── Room zone boundaries for auto-detection ───────────────── */
const ROOM_ZONES = [
    { id: "entrance", center: [0, 0, 5],   radius: 8 },
    { id: "gallery",  center: [-12, 0, -15], radius: 10 },
    { id: "jackets",  center: [12, 0, -15],  radius: 10 },
    { id: "vip",      center: [0, 0, -35],   radius: 10 },
];

function detectRoom(pos) {
    let closest = "entrance";
    let minDist = Infinity;
    for (const zone of ROOM_ZONES) {
        const dx = pos[0] - zone.center[0];
        const dz = pos[2] - zone.center[2];
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < minDist) { minDist = dist; closest = zone.id; }
    }
    return closest;
}

/* ─── Atmosphere ─────────────────────────────────────────────── */
function BoutiqueAtmosphere() {
    const [flashActive, setFlashActive] = useState(false);
    const [flashPos, setFlashPos] = useState([0, 0, 0]);

    useFrame(() => {
        if (Math.random() > 0.997 && !flashActive) {
            setFlashPos([(Math.random() - 0.5) * 40, Math.random() * 8, (Math.random() - 0.5) * 40]);
            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 50);
        }
    });

    return (
        <group>
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={500} scale={40} size={2} speed={0.4} opacity={0.1} color="#C6A972" />
            {flashActive && <pointLight position={flashPos} intensity={50} color="#fff" distance={20} decay={2} />}
        </group>
    );
}

/* ─── Loader ─────────────────────────────────────────────────── */
function Loader() {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 border-2 border-[#C6A972] border-t-transparent rounded-full animate-spin" />
                <div className="text-[#C6A972] font-inter text-[10px] uppercase tracking-[0.6em] whitespace-nowrap bg-black/80 backdrop-blur-xl px-8 py-4 rounded-full border border-white/5">
                    Synchronizing Environment / {Math.round(progress)}%
                </div>
            </div>
        </Html>
    );
}

/* ─── Products fetched from API ──────────────────────────────── */
const FALLBACK_PRODUCTS = [
    { id: "m1", name: "Onyx Silk Trench", price: "₹85,000", category: "Runway" },
    { id: "m2", name: "Midnight Velvet Gown", price: "₹1,25,000", category: "Couture" },
    { id: "m3", name: "Maison Noir Blazer", price: "₹65,000", category: "Tailored" },
    { id: "m4", name: "Archive Leather Mono", price: "₹1,45,000", category: "Archive" },
    { id: "m5", name: "Obsidian Parka V1", price: "₹92,000", category: "Archive" },
    { id: "m6", name: "Sovereign Masterpiece", price: "₹3,50,000", category: "Bespoke" },
];

const PRODUCT_POSITIONS = [
    { position: [0, 1.2, -8],    rotation: [0, 0, 0] },
    { position: [-12, 1.2, -15], rotation: [0, Math.PI / 6, 0] },
    { position: [12, 1.2, -15],  rotation: [0, -Math.PI / 6, 0] },
    { position: [-18, 1.2, -25], rotation: [0, Math.PI / 2, 0] },
    { position: [18, 1.2, -25],  rotation: [0, -Math.PI / 2, 0] },
    { position: [0, 1.2, -35],   rotation: [0, 0, 0] },
];

/* ─── Scene wrapper that reads player pos for room detection ─── */
function SceneContent({ onRoomChange, teleportTarget, onTeleportDone }) {
    const playerRef = useRef();
    const frameCount = useRef(0);

    useFrame(() => {
        frameCount.current++;
        if (frameCount.current % 30 !== 0) return;
        if (!playerRef.current) return;
        const pos = [playerRef.current.position.x, playerRef.current.position.y, playerRef.current.position.z];
        onRoomChange(detectRoom(pos));
    });

    return null; // actual player is rendered below outside this
}

/* ─── Main BoutiqueScene ─────────────────────────────────────── */
export default function BoutiqueScene() {
    const [start, setStart] = useState(false);
    const [products, setProducts] = useState(FALLBACK_PRODUCTS);
    const [currentRoom, setCurrentRoom] = useState("entrance");
    const [isMuted, setIsMuted] = useState(true);
    const [teleportTarget, setTeleportTarget] = useState(null);
    const audioRef = useRef(null);
    const controlsRef = useRef(null);

    /* Fetch real products */
    useEffect(() => {
        fetch("/api/products?limit=6")
            .then((r) => r.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data.slice(0, 6).map((p) => ({
                        id: p.id,
                        name: p.name,
                        price: `₹${Number(p.price).toLocaleString("en-IN")}`,
                        category: p.category,
                    })));
                }
            })
            .catch(() => {}); // silently use fallback
    }, []);

    const handleTeleport = useCallback((coords, roomId) => {
        setTeleportTarget(coords);
        setCurrentRoom(roomId);
    }, []);

    const toggleMute = () => {
        const newMuted = !isMuted;
        setIsMuted(newMuted);
        if (audioRef.current) {
            audioRef.current.muted = newMuted;
            if (!newMuted) audioRef.current.play().catch(() => {});
        }
    };

    if (!start) {
        return (
            <div className="absolute inset-0 bg-black z-[100] flex flex-col items-center justify-center p-12 overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(198,169,114,0.15)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />

                <div className="text-center space-y-12 relative z-10 max-w-2xl">
                    <header className="space-y-6">
                        <div className="flex justify-center gap-4 text-[#C6A972] text-[10px] uppercase tracking-[0.6em] font-black italic">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A972] animate-pulse" />
                            Archival Showroom Active
                        </div>
                        <h2 className="text-6xl md:text-8xl font-playfair tracking-tighter text-white italic leading-tight">
                            The Boutique <br />
                            <span className="text-[#C6A972]">Museum.</span>
                        </h2>
                    </header>

                    <div className="grid grid-cols-2 gap-8 text-white/40 font-mono text-[9px] uppercase tracking-widest border-y border-white/5 py-8">
                        <div>[W][A][S][D] Navigation</div>
                        <div>[MOUSE] Reticle Look</div>
                        <div>[CLICK] Interact with Products</div>
                        <div>[ESC] Decouple Mouse</div>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        <p className="text-white/25 text-[9px] uppercase tracking-widest">4 Interactive Rooms · Real Products · Ambient Music</p>
                        <button
                            onClick={() => setStart(true)}
                            className="group relative px-20 py-6 bg-white text-black font-black uppercase text-[10px] tracking-[0.5em] rounded-2xl hover:bg-[#C6A972] transition-all duration-500 shadow-[0_0_60px_rgba(255,255,255,0.1)] overflow-hidden"
                        >
                            <span className="relative z-10">Enter Experience</span>
                            <div className="absolute inset-0 bg-[#C6A972] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        </button>
                    </div>

                    <p className="text-white/10 text-[8px] uppercase tracking-[0.3em] italic">
                        Phase 8.0 Environmental Simulation · High Fidelity Protocol
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 bg-black selection:bg-[#C6A972] selection:text-black">
            {/* Ambient Music */}
            <audio ref={audioRef} src="https://www.bensound.com/bensound-music/bensound-piano-moment.mp3" loop muted={isMuted} autoPlay />

            <Canvas shadows camera={{ position: [0, 1.6, 5], fov: 60 }} teleportTarget={teleportTarget}>
                <color attach="background" args={["#000"]} />
                <fog attach="fog" args={["#000", 5, 45]} />

                <Suspense fallback={<Loader />}>
                    <Environment preset="night" />
                    <ambientLight intensity={0.05} />

                    <PointerLockControls ref={controlsRef} />
                    <Player teleportTarget={teleportTarget} />

                    <Architecture />
                    <BoutiqueAtmosphere />

                    {/* Product displays mapped to positions with real prod data */}
                    {products.map((product, i) => {
                        const pos = PRODUCT_POSITIONS[i] || PRODUCT_POSITIONS[0];
                        return (
                            <ProductDisplay
                                key={product.id}
                                position={pos.position}
                                rotation={pos.rotation}
                                product={product}
                            />
                        );
                    })}
                </Suspense>
            </Canvas>

            {/* ── HUD Overlay ── */}
            <div className="absolute top-10 left-10 flex flex-col gap-2 z-10 pointer-events-none opacity-40">
                <span className="text-[10px] uppercase tracking-[0.6em] text-white font-black italic">Boutique Meta-Shell · Active</span>
                <div className="w-px h-10 bg-gradient-to-b from-white to-transparent" />
            </div>

            {/* Current room indicator top right */}
            <div className="absolute top-10 right-10 z-20 flex items-center gap-4">
                <button
                    onClick={toggleMute}
                    className="w-11 h-11 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white/40 hover:text-[#C6A972] hover:border-[#C6A972]/40 transition-all"
                >
                    {isMuted ? <VolumeX size={16} strokeWidth={1.5} /> : <Volume2 size={16} strokeWidth={1.5} />}
                </button>
                <div className="bg-white/5 backdrop-blur-xl border border-white/5 px-5 py-2.5 rounded-full">
                    <p className="text-white/20 text-[7px] uppercase tracking-widest font-black">Zone</p>
                    <p className="text-white text-[10px] uppercase tracking-widest font-bold font-playfair italic capitalize">
                        {currentRoom}
                    </p>
                </div>
            </div>

            {/* Minimap */}
            <ShowroomMinimap currentRoom={currentRoom} onTeleport={handleTeleport} />

            {/* Bottom control hint */}
            <div className="absolute bottom-10 right-10 z-10 pointer-events-none text-right">
                <p className="text-[#C6A972] text-[9px] uppercase tracking-[0.3em] font-black italic mb-1">Navigation</p>
                <p className="text-white/20 text-[8px] uppercase tracking-widest">W/A/S/D · Click Products · Map to Teleport</p>
            </div>

            {/* Scanning Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.025] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
}
