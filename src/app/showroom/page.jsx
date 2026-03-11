"use client";

import BoutiqueScene from "@/components/showroom/BoutiqueScene";

/**
 * Maison Noir Virtual Showroom
 * The High-Fidelity 3D Shopping Core (Phase 8/Museum).
 */
export default function ShowroomPage() {
    return (
        <main className="h-[100dvh] w-full bg-[#0A0A0A] selection:bg-[#C6A972] selection:text-[#0A0A0A] overflow-hidden relative">
            <BoutiqueScene />
        </main>
    );
}
