"use client";

import { useState, useRef, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Text, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ShoppingBag, Sparkles, Check } from "lucide-react";
import PerfumeBottle3D from "./PerfumeBottle3D";

/* ─── Data ──────────────────────────────────────────────────── */
const STEPS = ["Aroma Protocol", "Heart Essence", "Base Archive", "Vessel", "Label Identity", "Synthesis"];

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
    { id: "obelisk", name: "Obelisk", desc: "Tall rectangular masterpiece", shape: "box", args: [0.4, 1.6, 0.25] },
    { id: "sphere", name: "Orb", desc: "Spherical modernist form", shape: "sphere", args: [0.55, 32, 32] },
    { id: "cylinder", name: "Pillar", desc: "Classic cylindrical elegance", shape: "cylinder", args: [0.35, 0.35, 1.4, 32] },
];

const BASE_PRICE = 12000;
const NOTE_PRICE = 800;
const ENGRAVING_PRICE = 500;

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

/* ─── Label Material Selector ───────────────────────────────── */
function LabelMaterialSelector({ selected, onSelect }) {
    const materials = [
        { id: "onyx", name: "Deep Onyx", color: "#111", desc: "Matte stealth finish" },
        { id: "gold", name: "24K Gold", color: "#C6A972", desc: "Polished luxury" },
        { id: "platinum", name: "Platinum", color: "#E5E4E2", desc: "Modern brilliance" },
    ];
    return (
        <div className="flex gap-4">
            {materials.map((m) => (
                <button
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    className={`flex-1 p-4 rounded-3xl border transition-all ${
                        selected === m.id ? "border-[#C6A972] bg-[#C6A972]/5" : "border-white/5 bg-white/2"
                    }`}
                >
                    <div className="w-full h-8 rounded-full mb-3" style={{ backgroundColor: m.color }} />
                    <p className="text-white text-[10px] font-bold uppercase tracking-widest">{m.name}</p>
                </button>
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
    const [labelMaterial, setLabelMaterial] = useState("onyx");
    const [engraving, setEngraving] = useState("");
    const [isSynthesizing, setIsSynthesizing] = useState(false);
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
            customConfig: { topNote, heartNote, baseNote, bottle, engraving, labelMaterial },
        };
        // Dispatch to cart store or localStorage
        try {
            const cart = JSON.parse(localStorage.getItem("noir-cart") || "[]");
            cart.push(item);
            localStorage.setItem("noir-cart", JSON.stringify(cart));
            // Dispatch a custom event for the cart drawer to update
            window.dispatchEvent(new Event("cart-updated"));
        } catch (e) {
            console.error("Failed to add bespoke creation to archive:", e);
        }
        setAdded(true);
        setTimeout(() => setAdded(false), 3000);
    };

    const handleSynthesize = () => {
        setIsSynthesizing(true);
        setTimeout(() => {
            setIsSynthesizing(false);
            setStep(5);
        }, 3000);
    };

    const stepContent = () => {
        if (isSynthesizing) {
            return (
                <div className="flex flex-col items-center justify-center h-full space-y-8 py-20">
                    <div className="relative w-24 h-24">
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-b-2 border-[#C6A972] rounded-full"
                        />
                        <div className="absolute inset-4 border border-white/5 rounded-full animate-pulse" />
                    </div>
                    <div className="text-center space-y-2">
                        <h3 className="text-[#C6A972] font-playfair text-2xl italic tracking-widest">Molecular Synthesis</h3>
                        <p className="text-white/20 text-[8px] uppercase tracking-[0.6em]">Aligning Olfactory Protocols</p>
                    </div>
                </div>
            );
        }

        switch (step) {
            case 0: return <NoteSelector notes={NOTES.top} selected={topNote} onSelect={setTopNote} />;
            case 1: return <NoteSelector notes={NOTES.heart} selected={heartNote} onSelect={setHeartNote} />;
            case 2: return <NoteSelector notes={NOTES.base} selected={baseNote} onSelect={setBaseNote} />;
            case 3: return <BottleSelector selected={bottle} onSelect={setBottle} />;
            case 4:
                return (
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Label Material</label>
                            <LabelMaterialSelector selected={labelMaterial} onSelect={setLabelMaterial} />
                        </div>
                        <div className="space-y-4">
                            <label className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black">Bespoke Engraving</label>
                            <input
                                maxLength={20}
                                value={engraving}
                                onChange={(e) => setEngraving(e.target.value)}
                                placeholder="THE ETERNAL NOIR"
                                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#C6A972] text-white font-playfair italic text-lg tracking-widest uppercase transition-all"
                            />
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <div className="p-8 border border-white/10 bg-white/[0.02] rounded-[2rem] space-y-6">
                            <div className="space-y-1">
                                <p className="text-white/20 text-[8px] uppercase tracking-[0.5em] font-black">Manifesto</p>
                                <h3 className="text-white font-playfair italic text-3xl">"{engraving || "UNTITLED NOIR"}"</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-white/5">
                                <div className="space-y-4">
                                    {['Top', 'Heart', 'Base'].map(l => (
                                        <div key={l}>
                                            <p className="text-white/20 text-[7px] uppercase tracking-widest">{l}</p>
                                            <p className="text-[#C6A972] text-[10px] font-bold uppercase">{l === 'Top' ? (NOTES.top.find(n => n.id === topNote)?.name || '—') : l === 'Heart' ? (NOTES.heart.find(n => n.id === heartNote)?.name || '—') : (NOTES.base.find(n => n.id === baseNote)?.name || '—')}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-white/20 text-[7px] uppercase tracking-widest">Vessel</p>
                                        <p className="text-white text-[10px] font-bold uppercase">{BOTTLES.find(b => b.id === bottle)?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-white/20 text-[7px] uppercase tracking-widest">Label</p>
                                        <p className="text-white text-[10px] font-bold uppercase">{labelMaterial}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-4">
                           <div>
                                <p className="text-white/30 text-[9px] uppercase tracking-widest font-black">Total Acquisition</p>
                                <p className="text-[#C6A972] text-4xl font-black">₹{price.toLocaleString()}</p>
                           </div>
                           <button 
                                onClick={handleAddToCart}
                                className="px-12 py-5 bg-[#C6A972] text-black rounded-full text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(198,169,114,0.3)]"
                           >
                               {added ? 'In Registry' : 'Acquire Creation'}
                           </button>
                        </div>
                    </div>
                );
            default: return null;
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

            <div className="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-80px)]">
                {/* ── Left: 3D Canvas ── */}
                <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative bg-black flex items-center justify-center">
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
                <div className="w-full lg:w-1/2 flex flex-col bg-[#080808] border-t lg:border-t-0 lg:border-l border-white/5">
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
                                onClick={() => {
                                    if (step === 3) handleSynthesize();
                                    else setStep(step + 1);
                                }}
                                className="flex items-center gap-2 text-[#C6A972] text-xs uppercase tracking-[0.3em] hover:text-white font-black transition-all"
                            >
                                {step === 3 ? "Begin Synthesis" : "Next Protocol"} <ChevronRight size={14} />
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
