"use client";

import { createContext, useContext, useCallback, useReducer } from "react";

/**
 * MAISON NOIR — Error Boundary Container
 * Senior Standard: Centralized error capture with categorized handling.
 * Catches API errors, network failures, and payment errors in one place.
 */

const ErrorContext = createContext(null);

const errorReducer = (state, action) => {
    switch (action.type) {
        case "SET_ERROR":
            return {
                ...state,
                errors: [...state.errors, { ...action.payload, id: Date.now(), timestamp: new Date().toISOString() }],
            };
        case "CLEAR_ERROR":
            return { ...state, errors: state.errors.filter(e => e.id !== action.payload) };
        case "CLEAR_ALL":
            return { ...state, errors: [] };
        default:
            return state;
    }
};

export function ErrorBoundaryContainer({ children }) {
    const [state, dispatch] = useReducer(errorReducer, { errors: [] });

    const captureError = useCallback((error, context = "unknown") => {
        const errorPayload = {
            message: error.message || String(error),
            context,
            stack: error.stack || null,
            category: categorizeError(error),
        };

        dispatch({ type: "SET_ERROR", payload: errorPayload });

        // Log to console in development
        if (process.env.NODE_ENV === "development") {
            console.error(`[NOIR Error — ${context}]:`, error);
        }

        return errorPayload;
    }, []);

    const clearError = useCallback((id) => {
        dispatch({ type: "CLEAR_ERROR", payload: id });
    }, []);

    const clearAll = useCallback(() => {
        dispatch({ type: "CLEAR_ALL" });
    }, []);

    return (
        <ErrorContext.Provider value={{ errors: state.errors, captureError, clearError, clearAll }}>
            {children}
        </ErrorContext.Provider>
    );
}

/**
 * Categorize errors for appropriate handling.
 */
function categorizeError(error) {
    const msg = (error.message || "").toLowerCase();

    if (msg.includes("network") || msg.includes("fetch") || msg.includes("timeout")) return "network";
    if (msg.includes("razorpay") || msg.includes("payment") || msg.includes("order")) return "payment";
    if (msg.includes("auth") || msg.includes("session") || msg.includes("unauthorized")) return "auth";
    if (msg.includes("prisma") || msg.includes("database") || msg.includes("constraint")) return "database";
    return "general";
}

export function useErrorBoundary() {
    const context = useContext(ErrorContext);
    if (!context) throw new Error("useErrorBoundary must be used within ErrorBoundaryContainer");
    return context;
}
