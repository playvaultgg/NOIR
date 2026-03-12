"use client";

import { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ShoppingBag, Sparkles, Check } from "lucide-react";

/* ─── Data ──────────────────────────────────────────────────── */
const STEPS = ["Top Notes", "Heart Notes", "Base Notes", "Bottle", "Engrave", "Order"];

const NOTES = {
    top: [
        { id: "bergamot", name: "Bergamot", emoji: "🍋", desc: "Citrus, Bright", color: "#F0E68C" },
        { id: "violet", name: "Violet", emoji: "💜", desc: "Floral, Powdery", color: "#EE82EE" },
        { id: "black-pepper", name: "Black Pepper", emoji: "🌶️", desc: "Spicy, Sharp", color: "#8B4513" },
        { id: "neroli", name: "Neroli", emoji: "🌸", desc: "Orange, Fresh", color: "#FFA07A" },
        { id: "grapefruit", name: "Grapefruit", emoji: "🍊", desc: "Zesty, Clean", color: "#FF6347" },
        { id: "lavender", name: "Lavender", emoji: "🌿", desc: "Herbal, Calming", color: "#967BB6" },
    ],
    heart: [
        { id: "jasmine", name: "Jasmine", emoji: "🌺", desc: "Rich, Floral", color: "#FFF8DC" },
        { id: "oud", name: "Oud", emoji: "🪵", desc: "Woody, Smoky", color: "#8B4513" },
        { id: "rose", name: "Rose Absolute", emoji: "🌹", desc: "Classic, Romantic", color: "#FF1493" },
        { id: "tuberose", name: "Tuberose", emoji: "🤍", desc: "Intense, Creamy", color: "#FFFACD" },
        { id: "iris", name: "Iris", emoji: "💙", desc: "Powdery, Elegant", color: "#4B0082" },
        { id: "geranium", name: "Geranium", emoji: "🌱", desc: "Green, Rosy", color: "#228B22" },
    ],
    base: [
        { id: "musk", name: "White Musk", emoji: "☁️", desc: "Clean, Sensual", color: "#F5F5F5" },
        { id: "amber", name: "Amber Resin", emoji: "🟡", desc: "Warm, Sweet", color: "#FFBF00" },
        { id: "sandalwood", name: "Sandalwood", emoji: "🌲", desc: "Creamy, Woody", color: "#DEB887" },
        { id: "vetiver", name: "Vetiver", emoji: "🌾", desc: "Earthy, Smoky", color: "#8B8000" },
        { id: "patchouli", name: "Patchouli", emoji: "🍂", desc: "Dark, Musky", color: "#704214" },
        { id: "vanilla", name: "Vanilla", emoji: "🍦", desc: "Sweet, Comforting", color: "#F3E5AB" },
    ],
};

const BOTTLES = [
    { id: "obelisk", name: "Obelisk", desc: "Tall rectangular artisan cut", shape: "box", args: [0.4, 1.6, 0.25] },
    { id: "sphere", name: "Orb", desc: "Spherical modernist form", shape: "sphere", args: [0.55, 32, 32] },
    { id: "cylinder", name: "Pillar", desc: "Classic cylindrical elegance", shape: "cylinder", args: [0.35, 0.35, 1.4, 32] },
];

const BASE_PRICE = 12000;
const NOTE_PRICE = 800;
const ENGRAVING_PRICE = 500;

/* ─── 3D Bottle ─────────────────────────────────────────────── */
function PerfumeBottle3D({ bottleId, topNote, heartNote, baseNote, engravingText }) {
    const meshRef = useRef();
    const bottle = BOTTLES.find((b) => b.id === bottleId) || BOTTLES[0];

    // Derive bottle color from selected notes
    const color = useMemo(() => {
        const top = topNote ? NOTES.top.find((n) => n.id === topNote) : null;
        const heart = heartNote ? NOTES.heart.find((n) => n.id === heartNote) : null;
        const base = baseNote ? NOTES.base.find((n) => n.id === baseNote) : null;
        const c = top?.color || heart?.color || base?.color || "#C6A972";
        const col = new THREE.Color(c);
        col.multiplyScalar(0.6); // darken
        return col;
    }, [topNote, heartNote, baseNote]);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    });

    const geom = () => {
        if (bottle.shape === "box") return <boxGeometry args={bottle.args} />;
        if (bottle.shape === "sphere") return <sphereGeometry args={bottle.args} />;
        return <cylinderGeometry args={bottle.args} />;
    };

    return (
        <Float speed={1.5} floatIntensity={0.4} rotationIntensity={0.1}>
            <group>
                {/* Main bottle body */}
                <mesh ref={meshRef} castShadow>
                    {geom()}
                    <meshPhysicalMaterial
                        color={color}
                        roughness={0.05}
                        metalness={0.1}
                        transmission={0.85}
                        thickness={0.5}
                        ior={1.5}
                        transparent
                    />
                </mesh>
                {/* Liquid inside */}
                <mesh scale={0.7}>
                    {geom()}
                    <meshStandardMaterial
                        color={color}
                        roughness={0.1}
                        metalness={0.3}
                        transparent
                        opacity={0.5}
                    />
                </mesh>
                {/* Glowing aura */}
                <pointLight intensity={6} color={color.getStyle ? color.getStyle() : "#C6A972"} distance={3} />
                {/* Engraving text */}
                {engravingText && (
                    <Text
                        position={[0, 0, bottle.shape === "sphere" ? 0.56 : 0.13]}
                        fontSize={0.06}
                        color="#C6A972"
                        font="/fonts/Playfair/PlayfairDisplay-Italic.ttf"
                        maxWidth={0.6}
                        textAlign="center"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {engravingText}
                    </Text>
                )}
            </group>
        </Float>
    );
}

/* ─── Note Selector ────────────────────────────────────────── */
function NoteSelector({ notes, selected, onSelect }) {
    return (
        <div className="grid grid-cols-2 gap-2.5">
            {notes.map((note) => (
                <motion.button
                    key={note.id}
                    onClick={() => onSelect(selected === note.id ? null : note.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-300 text-left ${
                        selected === note.id
                            ? "border-[#C6A972] bg-[#C6A972]/8"
                            : "border-white/5 bg-white/3 hover:border-white/15"
                    }`}
                >
                    <span className="text-xl leading-none mt-0.5">{note.emoji}</span>
                    <div className="min-w-0">
                        <p className="text-white text-xs font-semibold truncate">{note.name}</p>
                        <p className="text-white/40 text-[9px] truncate">{note.desc}</p>
                    </div>
                    {selected === note.id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#C6A972] flex items-center justify-center">
                            <Check size={9} color="#000" strokeWidth={3} />
                        </div>
                    )}
                </motion.button>
            ))}
        </div>
    );
}

/* ─── Bottle Selector ───────────────────────────────────────── */
function BottleSelector({ selected, onSelect }) {
    return (
        <div className="flex gap-3">
            {BOTTLES.map((b) => (
                <motion.button
                    key={b.id}
                    onClick={() => onSelect(b.id)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex-1 p-4 rounded-2xl border transition-all text-left ${
                        selected === b.id
                            ? "border-[#C6A972] bg-[#C6A972]/8"
                            : "border-white/5 bg-white/3 hover:border-white/15"
                    }`}
                >
                    <p className="text-white text-sm font-semibold mb-1">{b.name}</p>
                    <p className="text-white/40 text-[9px] leading-relaxed">{b.desc}</p>
                </motion.button>
            ))}
        </div>
    );
}

/* ─── Main Builder ───────────────────────────────────────────── */
export default function PerfumeBuilder() {
    const [step, setStep] = useState(0);
    const [topNote, setTopNote] = useState(null);
    const [heartNote, setHeartNote] = useState(null);
    const [baseNote, setBaseNote] = useState(null);
    const [bottle, setBottle] = useState("obelisk");
    const [engraving, setEngraving] = useState("");
    const [added, setAdded] = useState(false);

    const price = BASE_PRICE
        + (topNote ? NOTE_PRICE : 0)
        + (heartNote ? NOTE_PRICE : 0)
        + (baseNote ? NOTE_PRICE : 0)
        + (engraving.trim() ? ENGRAVING_PRICE : 0);

    const handleAddToCart = () => {
        const item = {
            id: `custom-perfume-${Date.now()}`,
            name: `Custom Perfume${engraving ? ` — "${engraving}"` : ""}`,
            price,
            quantity: 1,
            isCustomPerfume: true,
            customConfig: { topNote, heartNote, baseNote, bottle, engraving },
        };
        // Dispatch to cart store or localStorage
        try {
            const cart = JSON.parse(localStorage.getItem("noir-cart") || "[]");
            cart.push(item);
            localStorage.setItem("noir-cart", JSON.stringify(cart));
        } catch {}
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    const stepContent = () => {
        switch (step) {
            case 0:
                return (
                    <div className="space-y-3">
                        <p className="text-white/40 text-xs leading-relaxed">Select your opening accord — the first impression.</p>
                        <NoteSelector notes={NOTES.top} selected={topNote} onSelect={setTopNote} />
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-3">
                        <p className="text-white/40 text-xs leading-relaxed">The heart defines the soul of your fragrance.</p>
                        <NoteSelector notes={NOTES.heart} selected={heartNote} onSelect={setHeartNote} />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-3">
                        <p className="text-white/40 text-xs leading-relaxed">Base notes linger longest — the final memory.</p>
                        <NoteSelector notes={NOTES.base} selected={baseNote} onSelect={setBaseNote} />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-3">
                        <p className="text-white/40 text-xs leading-relaxed">Choose the vessel that houses your creation.</p>
                        <BottleSelector selected={bottle} onSelect={setBottle} />
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <p className="text-white/40 text-xs leading-relaxed">
                            Engrave up to 20 characters — a name, a date, a word. <span className="text-[#C6A972]">+₹500</span>
                        </p>
                        <div className="relative">
                            <input
                                type="text"
                                maxLength={20}
                                value={engraving}
                                onChange={(e) => setEngraving(e.target.value)}
                                placeholder="e.g. For You, Always"
                                className="w-full bg-white/5 border border-white/10 focus:border-[#C6A972] outline-none text-white text-sm px-5 py-4 rounded-xl transition-all placeholder:text-white/20 font-playfair italic"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 text-[9px] font-mono">
                                {engraving.length}/20
                            </span>
                        </div>
                        {engraving && (
                            <div className="p-4 border border-[#C6A972]/20 bg-[#C6A972]/5 rounded-xl">
                                <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Preview</p>
                                <p className="text-[#C6A972] font-playfair italic text-lg">"{engraving}"</p>
                            </div>
                        )}
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-5">
                        <div className="border border-white/5 rounded-2xl p-5 space-y-3">
                            <p className="text-white/20 text-[9px] uppercase tracking-widest font-black">Your Creation</p>
                            {[
                                { label: "Top Note", value: topNote ? NOTES.top.find(n => n.id === topNote)?.name : "—" },
                                { label: "Heart Note", value: heartNote ? NOTES.heart.find(n => n.id === heartNote)?.name : "—" },
                                { label: "Base Note", value: baseNote ? NOTES.base.find(n => n.id === baseNote)?.name : "—" },
                                { label: "Bottle", value: BOTTLES.find(b => b.id === bottle)?.name || "—" },
                                { label: "Engraving", value: engraving || "None" },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex items-center justify-between">
                                    <span className="text-white/30 text-xs">{label}</span>
                                    <span className="text-white text-xs font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <div>
                                <p className="text-white/30 text-[9px] uppercase tracking-widest">Total</p>
                                <p className="text-[#C6A972] text-2xl font-bold">₹{price.toLocaleString("en-IN")}</p>
                            </div>
                            <motion.button
                                onClick={handleAddToCart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`flex items-center gap-2 px-7 py-3.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                                    added
                                        ? "bg-green-500 text-white"
                                        : "bg-[#C6A972] text-[#0A0A0A] hover:bg-white"
                                }`}
                            >
                                {added ? <><Check size={14} /> Added!</> : <><ShoppingBag size={14} /> Add to Cart</>}
                            </motion.button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white">
            {/* Header */}
            <div className="border-b border-white/5 px-8 py-6 flex items-center justify-between">
                <div>
                    <p className="text-[#C6A972] text-[9px] uppercase tracking-[0.6em] font-black mb-1">Atelier Exclusif</p>
                    <h1 className="font-playfair text-3xl italic">Custom Perfume Builder</h1>
                </div>
                <div className="text-right">
                    <p className="text-white/20 text-[9px] uppercase tracking-widest">Estimated Price</p>
                    <p className="text-[#C6A972] text-xl font-bold">₹{price.toLocaleString("en-IN")}</p>
                </div>
            </div>

            <div className="flex h-[calc(100vh-80px)]">
                {/* ── Left: 3D Canvas ── */}
                <div className="w-1/2 relative bg-black flex items-center justify-center">
                    {/* Noise texture */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,169,114,0.05)_0%,transparent_70%)]" />

                    <div className="w-full h-full">
                        <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
                            <color attach="background" args={["#000"]} />
                            <fog attach="fog" args={["#000", 6, 20]} />
                            <Suspense fallback={null}>
                                <Environment preset="night" />
                                <ambientLight intensity={0.15} />
                                <spotLight position={[0, 8, 5]} angle={0.25} penumbra={1} intensity={20} castShadow />
                                <spotLight position={[-4, 4, 2]} angle={0.3} intensity={8} color="#C6A972" />
                                <PerfumeBottle3D
                                    bottleId={bottle}
                                    topNote={topNote}
                                    heartNote={heartNote}
                                    baseNote={baseNote}
                                    engravingText={engraving}
                                />
                            </Suspense>
                            <OrbitControls enablePan={false} enableZoom={false} autoRotate={false} />
                        </Canvas>
                    </div>

                    {/* Labels */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                        {[
                            { note: topNote, notes: NOTES.top, label: "Top" },
                            { note: heartNote, notes: NOTES.heart, label: "Heart" },
                            { note: baseNote, notes: NOTES.base, label: "Base" },
                        ].map(({ note, notes, label }) => {
                            const found = note ? notes.find((n) => n.id === note) : null;
                            return (
                                <div key={label} className="text-center">
                                    <p className="text-white/20 text-[8px] uppercase tracking-widest">{label}</p>
                                    <p className="text-white text-[10px] font-medium">{found?.name ?? "—"}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Right: Builder UI ── */}
                <div className="w-1/2 flex flex-col bg-[#080808] border-l border-white/5">
                    {/* Step tabs */}
                    <div className="flex border-b border-white/5 overflow-x-auto">
                        {STEPS.map((s, i) => (
                            <button
                                key={s}
                                onClick={() => setStep(i)}
                                className={`relative flex-shrink-0 px-5 py-4 text-[9px] uppercase tracking-[0.3em] font-black transition-all ${
                                    i === step
                                        ? "text-[#C6A972]"
                                        : i < step
                                            ? "text-white/40"
                                            : "text-white/15"
                                }`}
                            >
                                {i < step && <Check size={8} className="inline mr-1" />}
                                {s}
                                {i === step && (
                                    <motion.div layoutId="stepUnderline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C6A972]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Step content */}
                    <div className="flex-1 overflow-y-auto px-8 py-7">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-playfair text-2xl italic text-white mb-1">{STEPS[step]}</h2>
                                <div className="w-8 h-0.5 bg-[#C6A972] mb-5" />
                                {stepContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation */}
                    <div className="border-t border-white/5 px-8 py-5 flex justify-between items-center">
                        <button
                            onClick={() => setStep(Math.max(0, step - 1))}
                            disabled={step === 0}
                            className="flex items-center gap-2 text-white/30 text-xs uppercase tracking-widest hover:text-white disabled:opacity-0 transition-all"
                        >
                            <ChevronLeft size={14} /> Back
                        </button>
                        <div className="flex gap-1.5">
                            {STEPS.map((_, i) => (
                                <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-[#C6A972]" : i < step ? "w-3 bg-[#C6A972]/40" : "w-3 bg-white/10"}`} />
                            ))}
                        </div>
                        {step < STEPS.length - 1 ? (
                            <button
                                onClick={() => setStep(Math.min(STEPS.length - 1, step + 1))}
                                className="flex items-center gap-2 text-[#C6A972] text-xs uppercase tracking-widest hover:text-white font-black transition-all"
                            >
                                Next <ChevronRight size={14} />
                            </button>
                        ) : (
                            <div className="w-16" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
