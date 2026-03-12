"use client";

import { motion } from "framer-motion";

const ROOMS = [
    { id: "entrance", label: "Entrance", pos: { x: 50, y: 80 }, teleport: [0, 1.6, 5] },
    { id: "gallery", label: "Gallery", pos: { x: 25, y: 55 }, teleport: [-12, 1.6, -15] },
    { id: "jackets", label: "Jackets", pos: { x: 75, y: 55 }, teleport: [12, 1.6, -15] },
    { id: "vip", label: "VIP Vault", pos: { x: 50, y: 20 }, teleport: [0, 1.6, -35] },
];

const ROOM_CONNECTIONS = [
    ["entrance", "gallery"],
    ["entrance", "jackets"],
    ["gallery", "vip"],
    ["jackets", "vip"],
];

export default function ShowroomMinimap({ currentRoom, onTeleport }) {
    const getRoomById = (id) => ROOMS.find((r) => r.id === id);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-10 left-10 z-20 w-52 select-none"
            style={{
                background: "rgba(10,10,10,0.85)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(198,169,114,0.12)",
                borderRadius: "16px",
                padding: "14px",
            }}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-black">Minimap</span>
                <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-[#C6A972] animate-pulse" />
                    <span className="text-[7px] text-[#C6A972] uppercase tracking-widest font-bold">Active</span>
                </div>
            </div>

            {/* Map SVG */}
            <div className="relative w-full" style={{ height: "120px" }}>
                <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    {/* Connection lines */}
                    {ROOM_CONNECTIONS.map(([a, b], i) => {
                        const ra = getRoomById(a);
                        const rb = getRoomById(b);
                        return (
                            <line
                                key={i}
                                x1={ra.pos.x}
                                y1={ra.pos.y}
                                x2={rb.pos.x}
                                y2={rb.pos.y}
                                stroke="rgba(198,169,114,0.15)"
                                strokeWidth="0.8"
                            />
                        );
                    })}
                </svg>

                {/* Room dots */}
                {ROOMS.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => onTeleport(room.teleport, room.id)}
                        title={`Teleport to ${room.label}`}
                        className="absolute group"
                        style={{
                            left: `${room.pos.x}%`,
                            top: `${room.pos.y}%`,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <div
                            className={`w-3 h-3 rounded-full border transition-all duration-300 group-hover:scale-150 ${
                                currentRoom === room.id
                                    ? "bg-[#C6A972] border-[#C6A972] shadow-[0_0_8px_rgba(198,169,114,0.6)]"
                                    : "bg-white/20 border-white/20 group-hover:bg-[#C6A972]/50 group-hover:border-[#C6A972]/50"
                            }`}
                        />
                        <span
                            className="absolute top-4 left-1/2 -translate-x-1/2 text-[7px] uppercase tracking-wider whitespace-nowrap transition-opacity"
                            style={{ color: currentRoom === room.id ? "#C6A972" : "rgba(255,255,255,0.35)" }}
                        >
                            {room.label}
                        </span>
                    </button>
                ))}
            </div>

            {/* Current room label */}
            <div className="mt-5 pt-3 border-t border-white/5">
                <p className="text-[7px] text-white/20 uppercase tracking-widest">Current Zone</p>
                <p className="text-xs text-white font-playfair italic mt-0.5 capitalize">
                    {ROOMS.find((r) => r.id === currentRoom)?.label ?? "—"}
                </p>
            </div>
        </motion.div>
    );
}
