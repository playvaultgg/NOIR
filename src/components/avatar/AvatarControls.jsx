"use client";

import { ZoomIn, ZoomOut, RotateCw, RotateCcw, User, Camera, ShieldCheck } from "lucide-react";

/**
 * Maison Noir Avatar Controls
 * Professional viewport management for digital personae.
 * Features:
 * - Direct Camera & Rotation Injection
 * - Synthesis Parameter Display
 * - Minimalist Floating UI
 */
export default function AvatarControls({ onRotate, onZoom, onSnapshot }) {
    const controls = [
        { icon: RotateCcw, action: () => onRotate(-45), label: "Rev Counter" },
        { icon: RotateCw, action: () => onRotate(45), label: "Rev Clock" },
        { icon: ZoomIn, action: () => onZoom(1.1), label: "Zoom Focal" },
        { icon: ZoomOut, action: () => onZoom(0.9), label: "Zoom Wide" },
        { icon: Camera, action: () => onSnapshot(), label: "Identity Capture" }
    ];

    return (
        <div className="flex flex-col gap-4">
             <div className="glass-effect bg-noir-surface/40 p-4 rounded-2xl border border-white/5 space-y-4 flex flex-col items-center">
                {controls.map((ctrl, i) => (
                    <button
                        key={i}
                        onClick={ctrl.action}
                        title={ctrl.label}
                        className="p-4 bg-white/5 border border-white/5 rounded-xl text-white-[#C6A972] hover:text-black hover:border-[#C6A972]/10 transition-all hover:scale-110 active:scale-95 group"
                    >
                         <ctrl.icon size={18} strokeWidth={1.5} />
                    </button>
                ))}
             </div>

             <div className="glass-effect bg-noir-gold/10 p-4 rounded-2xl border border-noir-gold/20 flex flex-col items-center group">
                 <ShieldCheck size={18} className="text-noir-gold group-hover:animate-pulse transition-all" />
                 <span className="text-[7px] uppercase tracking-[0.2em] text-noir-gold/60 mt-2 font-black italic">Live Sync</span>
             </div>
        </div>
    );
}
