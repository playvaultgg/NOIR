"use client";

import { createContext, useContext, useState, useCallback } from "react";

/**
 * MAISON NOIR — Notification Container
 * Senior Standard: Centralized toast/notification system.
 * Replaces scattered alert() calls with a unified notification queue.
 */

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const addNotification = useCallback(({ type = "info", title, message, duration = 5000 }) => {
        const id = Date.now() + Math.random();
        const notification = { id, type, title, message };

        setNotifications(prev => [...prev, notification]);

        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }

        return id;
    }, [removeNotification]);

    const notify = {
        success: (title, message) => addNotification({ type: "success", title, message }),
        error: (title, message) => addNotification({ type: "error", title, message, duration: 8000 }),
        warning: (title, message) => addNotification({ type: "warning", title, message }),
        info: (title, message) => addNotification({ type: "info", title, message }),
    };

    return (
        <NotificationContext.Provider value={{ notifications, notify, removeNotification }}>
            {children}
            {/* Notification Render Layer */}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {notifications.map((n) => (
                    <div
                        key={n.id}
                        className={`pointer-events-auto px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl 
                            max-w-sm animate-[slideIn_0.3s_ease-out] transition-all
                            ${n.type === "success" ? "bg-green-900/80 border-green-500/30 text-green-100" : ""}
                            ${n.type === "error" ? "bg-red-900/80 border-red-500/30 text-red-100" : ""}
                            ${n.type === "warning" ? "bg-yellow-900/80 border-yellow-500/30 text-yellow-100" : ""}
                            ${n.type === "info" ? "bg-noir-black/80 border-white/10 text-white" : ""}
                        `}
                        onClick={() => removeNotification(n.id)}
                    >
                        {n.title && <p className="text-xs font-bold uppercase tracking-wider mb-1">{n.title}</p>}
                        <p className="text-sm">{n.message}</p>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) throw new Error("useNotification must be used within NotificationProvider");
    return context;
}
