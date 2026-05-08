"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

/**
 * MAISON NOIR — Loading Container
 * Senior Standard: Global loading state manager with route-level awareness.
 * Prevents UI flicker and provides consistent loading indicators.
 */

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
    const [loadingStates, setLoadingStates] = useState({});
    const [globalLoading, setGlobalLoading] = useState(false);

    const startLoading = useCallback((key = "global") => {
        setLoadingStates(prev => ({ ...prev, [key]: true }));
        if (key === "global") setGlobalLoading(true);
    }, []);

    const stopLoading = useCallback((key = "global") => {
        setLoadingStates(prev => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
        if (key === "global") setGlobalLoading(false);
    }, []);

    const isLoading = useCallback((key) => {
        if (key) return !!loadingStates[key];
        return Object.keys(loadingStates).length > 0;
    }, [loadingStates]);

    return (
        <LoadingContext.Provider value={{ startLoading, stopLoading, isLoading, globalLoading }}>
            {children}
            {/* Global Loading Overlay */}
            {globalLoading && (
                <div className="fixed inset-0 z-[9998] bg-noir-black/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-2 border-noir-gold border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] uppercase tracking-[0.4em] text-noir-gold font-bold">
                            Processing...
                        </p>
                    </div>
                </div>
            )}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const context = useContext(LoadingContext);
    if (!context) throw new Error("useLoading must be used within LoadingProvider");
    return context;
}
