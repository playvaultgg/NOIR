"use client";

import { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Zap, 
    Droplet, 
    Wind, 
    Flower2, 
    Layers, 
    Edit3, 
    ShoppingBag,
    ChevronRight,
    FlaskConical
} from "lucide-react";
import PerfumeBottle3D from "@/components/3d/PerfumeBottle3D";
import Navbar from "@/components/layout/Navbar";

export default function FragranceLabPage() {
    const [scent, setScent] = useState({
        top: "Bergamot",
        heart: "Oud",
        base: "Sandalwood",
        color: "#C6A972"
    });
    const [glass, setGlass] = useState("clear");
    const [label, setLabel] = useState("MAISON NOIR");
    const [isCrafting, setIsCrafting] = useState(false);

    const handleCraft = () => {
        setIsCrafting(true);
        setTimeout(() => setIsCrafting(false), 2500);
    };

    const scentNotes = [
        { name: "Oud Noir", color: "#1a1a1a", notes: "Rich, Woody, Intense" },
        { name: "Sovereign Gold", color: "#C6A972", notes: "Amber, Spices, Honey" },
        { name: "Lunar Flora", color: "#9a8c98", notes: "Jasmine, Moonflower, White Tea" },
        { name: "Azure Mist", color: "#2d6a4f", notes: "Bergamot, Sea Salt, Sage" }
    ];

    return (
        <main className="min-h-screen bg-black overflow-hidden flex flex-col font-inter">
            <Navbar />
            
            <div className="flex-1 flex flex-col lg:flex-row mt-20 lg:mt-0">
                {/* ── Left Side: The 3D Viewport ── */}
                <div className="w-full lg:w-1/2 h-[50vh] lg:h-screen relative p-8 lg:p-24 bg-[radial-gradient(circle_at_center,rgba(198,169,114,0.05)_0%,transparent_70%)]">
                    <div className="absolute top-24 left-12 lg:left-24 z-10 opacity-30 select-none">
                        <span className="text-[10px] uppercase tracking-[0.6em] text-white font-black block mb-4">L'Atelier Noir / Node 04</span>
                        <div className="w-px h-24 bg-gradient-to-b from-white to-transparent" />
                    </div>

                    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                        <Canvas camera={{ position: [0, 0, 5], fov: 35 }} shadows>
                            <Suspense fallback={null}>
                                <PerfumeBottle3D 
                                    liquidColor={scent.color} 
                                    glassType={glass} 
                                    labelContent={label} 
                                />
                                <OrbitControls 
                                    enableZoom={false} 
                                    enablePan={false}
                                    maxPolarAngle={Math.PI / 1.5}
                                    minPolarAngle={Math.PI / 2.5}
                                />
                                <Sparkles count={50} scale={4} size={1} speed={0.4} opacity={0.2} color="#C6A972" />
                            </Suspense>
                        </Canvas>
                    </div>

                    <div className="absolute bottom-12 left-12 lg:left-24 z-10">
                        <p className="text-white/20 text-[9px] uppercase tracking-[0.4em] mb-4">Refraction Engine: Active</p>
                        <div className="flex gap-2">
                            {[1,2,3].map(i => <div key={i} className="w-8 h-[1px] bg-white/10" />)}
                        </div>
                    </div>
                </div>

                {/* ── Right Side: Customization Panel ── */}
                <div className="w-full lg:w-1/2 lg:h-screen overflow-y-auto p-8 lg:p-32 bg-black border-l border-white/5 selection:bg-noir-gold selection:text-black">
                    <div className="max-w-xl space-y-16">
                        <header className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-4 text-noir-gold"
                            >
                                <FlaskConical size={20} strokeWidth={1.5} />
                                <span className="text-[10px] uppercase tracking-[0.5em] font-black">Fragrance Synthesis Protocol</span>
                            </motion.div>
                            <h1 className="text-5xl lg:text-7xl font-playfair text-white italic tracking-tighter">The Custom <br /> Accord</h1>
                            <p className="text-white/40 text-sm lg:text-base font-inter italic leading-relaxed">
                                Design your personal olfactive identity. Our digital synthesis engine translates your selection into a physical silhouette of scent.
                            </p>
                        </header>

                        <div className="space-y-16">
                            {/* Note Selection */}
                            <section className="space-y-8">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Select Olfactive Profile</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {scentNotes.map((note) => (
                                        <button
                                            key={note.name}
                                            onClick={() => setScent({ ...scent, color: note.color })}
                                            className={`p-6 rounded-2xl border text-left transition-all ${
                                                scent.color === note.color 
                                                ? "bg-noir-gold/10 border-noir-gold shadow-[0_0_30px_rgba(198,169,114,0.1)]" 
                                                : "bg-white/5 border-white/5 hover:border-white/20"
                                            }`}
                                        >
                                            <div className="w-8 h-8 rounded-full mb-6" style={{ background: note.color, border: '1px solid rgba(255,255,255,0.1)' }} />
                                            <h4 className="text-white text-sm font-medium mb-1">{note.name}</h4>
                                            <p className="text-white/30 text-[9px] uppercase tracking-widest">{note.notes}</p>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Vessel Selection */}
                            <section className="space-y-8">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">The Vessel Finish</h3>
                                <div className="flex gap-4">
                                    {["clear", "frosted", "smoked"].map((type) => (
                                        <button
                                            key={type}
                                            onClick={() => setGlass(type)}
                                            className={`flex-1 py-4 px-2 rounded-xl border text-[9px] uppercase tracking-[0.3em] font-black transition-all ${
                                                glass === type 
                                                ? "bg-white text-black border-white" 
                                                : "bg-transparent text-white/40 border-white/10 hover:border-white/40"
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </section>

                            {/* Inscription */}
                            <section className="space-y-8">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-black">Personal Inscription</h3>
                                <div className="relative group">
                                    <Edit3 className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={16} />
                                    <input 
                                        type="text"
                                        value={label}
                                        onChange={(e) => setLabel(e.target.value.substring(0, 20))}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-16 py-5 text-white text-sm focus:border-noir-gold focus:outline-none transition-all placeholder:text-white/10"
                                        placeholder="Enter your name or mantra..."
                                    />
                                </div>
                            </section>

                            {/* Actions */}
                            <div className="pt-12 flex flex-col gap-6">
                                <button
                                    onClick={handleCraft}
                                    disabled={isCrafting}
                                    className="w-full bg-noir-gold text-black py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.5em] shadow-xl shadow-noir-gold/20 flex items-center justify-center gap-4 group transition-all"
                                >
                                    {isCrafting ? (
                                        <motion.div 
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <FlaskConical size={16} />
                                        </motion.div>
                                    ) : <Zap size={16} className="group-hover:fill-current" />}
                                    {isCrafting ? "Synthesizing Accord..." : "Finalize Synthesis"}
                                </button>
                                
                                <p className="text-[8px] uppercase tracking-[0.4em] text-white/10 font-black leading-relaxed text-center">
                                    Fragrance creation is final upon synthesis. Each accord is unique to your digital profile.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cinematic Overlay for Crafting */}
            <AnimatePresence>
                {isCrafting && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-center p-12 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="space-y-12"
                        >
                            <div className="w-32 h-32 border border-noir-gold rounded-full flex items-center justify-center mx-auto relative">
                                <motion.div 
                                    className="absolute inset-0 border-2 border-noir-gold rounded-full"
                                    animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <FlaskConical className="text-noir-gold" size={48} />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-white font-playfair text-4xl italic tracking-widest">Neural Distillation...</h3>
                                <p className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic animate-pulse">Encoding Olfactive Profile</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}
