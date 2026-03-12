"use client";

import dynamic from "next/dynamic";

const PerfumeBuilder = dynamic(() => import("@/components/3d/PerfumeBuilder"), {
    ssr: false,
    loading: () => (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-2 border-[#C6A972] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#C6A972] text-[10px] uppercase tracking-[0.5em]">Loading Atelier…</p>
            </div>
        </div>
    ),
});

export default function PerfumePageClient() {
    return <PerfumeBuilder />;
}
