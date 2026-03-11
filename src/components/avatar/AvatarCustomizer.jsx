"use client";

import { motion } from "framer-motion";
import { User, ShieldCheck, Zap, ArrowRight, Camera } from "lucide-react";
import { useState } from "react";

/**
 * Maison Noir Avatar Customizer
 * Phase 8.6 Persona Construction Interface.
 * Features:
 * - Body Type Selection
 * - Skin Tone Synthesis
 * - Real-time Identity Calibration
 */
export default function AvatarCustomizer({ onUpdate, currentAvatar }) {
    const bodyTypes = [
        { id: "SLIM", label: "Slim", description: "Refined linear silhouette" },
        { id: "ATHLETIC", label: "Athletic", description: "Balanced athletic structure" },
        { id: "CURVY", label: "Curvy", description: "Fuller dimensional form" }
    ];

    const skinTones = [
        { id: "FAIR", color: "#F9E4D4", label: "Fair" },
        { id: "MEDIUM", color: "#E0AC69", label: "Medium" },
        { id: "TAN", color: "#8D5524", label: "Tan" },
        { id: "DEEP", color: "#4B321B", label: "Deep" }
    ];

    return (
        <div className="space-y-12">
            {/* Body Type Selection Cluster */}
            <div className="space-y-6">
                <header className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                    <User size={14} />
                    01. Morphological Structure
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {bodyTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onUpdate({ bodyType: type.id })}
                            className={`p-6 rounded-2xl border text-left transition-all duration-500 group ${
                                currentAvatar?.bodyType === type.id 
                                ? "bg-noir-gold border-noir-gold text-noir-black" 
                                : "bg-noir-surface/40 border-white/5 text-white hover:border-noir-gold/20"
                            }`}
                        >
                            <h4 className="font-playfair text-xl italic mb-1">{type.label}</h4>
                            <p className={`text-[9px] uppercase tracking-widest leading-relaxed italic ${
                                currentAvatar?.bodyType === type.id ? "text-noir-black/60" : "text-white/20"
                            }`}>
                                {type.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Skin Tone Synthesis Cluster */}
            <div className="space-y-6">
                <header className="flex items-center gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                    <Zap size={14} />
                    02. Chromatic Identity
                </header>
                <div className="flex flex-wrap gap-4">
                    {skinTones.map((tone) => (
                        <button
                            key={tone.id}
                            onClick={() => onUpdate({ skinTone: tone.color })}
                            className={`w-16 h-16 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                                currentAvatar?.skinTone === tone.color 
                                ? "border-noir-gold scale-110" 
                                : "border-white/10 hover:border-white/30"
                            }`}
                            style={{ backgroundColor: tone.color }}
                        >
                            {currentAvatar?.skinTone === tone.color && (
                                <ShieldCheck size={20} className="text-noir-black bg-white/40 rounded-full p-0.5" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Verification & Sync CTA */}
            <div className="pt-8 border-t border-white/5">
                <button className="group flex items-center justify-between py-6 w-full border-b border-white/5 hover:border-noir-gold transition-colors duration-500">
                    <span className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">Dispatch Synthesis Protocol</span>
                    <ArrowRight className="text-white/10 group-hover:text-noir-gold group-hover:translate-x-2 transition-all" size={16} />
                </button>
            </div>
        </div>
    );
}
