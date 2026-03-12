"use client";

import { useEffect } from "react";
import { captureError } from "@/lib/sentry";

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log to our new sentry utility
        captureError(error, { location: "Root Error Boundary" });
    }, [error]);

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
            <div className="max-w-md space-y-8">
                <div className="space-y-4">
                    <h2 className="font-playfair text-4xl text-noir-gold italic">System Interruption</h2>
                    <p className="text-white/40 text-sm font-inter uppercase tracking-widest">
                        A critical error has been captured. The archival protocol has been suspended.
                    </p>
                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-left">
                        <p className="text-red-500/80 font-mono text-[10px] break-all">
                            {error.message || "Unknown error occurred during synthesis."}
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={() => reset()}
                    className="px-8 py-3 bg-white text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-full hover:bg-noir-gold transition-colors"
                >
                    Review & Restart
                </button>
            </div>
        </div>
    );
}
