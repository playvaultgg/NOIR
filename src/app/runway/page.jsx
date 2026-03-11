"use client";

import RunwayExperience from "@/components/3d/RunwayExperience";

export default function RunwayPage() {
    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold selection:text-noir-black overflow-hidden">
            {/* Core Cinematic Engine */}
            <RunwayExperience />
        </main>
    );
}
