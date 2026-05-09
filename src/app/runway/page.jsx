"use client";

import dynamic from "next/dynamic";

const RunwayExperience = dynamic(() => import("@/components/3d/RunwayExperience"), {
    ssr: false,
    loading: () => (
        <div className="h-screen w-full bg-black flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-[#C6A972] border-t-transparent rounded-full animate-spin" />
        </div>
    )
});

export default function RunwayPage() {
    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold selection:text-noir-black overflow-hidden">
            {/* Core Cinematic Engine */}
            <RunwayExperience />
        </main>
    );
}
