"use client";

import { useState } from "react";
import { X, Package, Truck, CheckCircle, RefreshCcw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UpdateOrderStatusModal({ order, onClose, onUpdate }) {
    const [status, setStatus] = useState(order.status);
    const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
    const [courierName, setCourierName] = useState(order.courierName || "");
    const [refundAmount, setRefundAmount] = useState(order.refundAmount || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/orders/${order.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    trackingNumber,
                    courierName,
                    refundAmount: refundAmount ? Number(refundAmount) : undefined
                })
            });

            if (!res.ok) throw new Error("Failed to update order");
            
            const updated = await res.json();
            onUpdate(updated);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 w-full max-w-md relative overflow-hidden shadow-2xl"
            >
                {/* Background Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6A972]/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-playfair italic text-white">Update Registry</h2>
                            <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] mt-1">Order ID: {order.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-2 font-bold px-1">Fulfillment Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={`px-3 py-2 rounded-xl text-[10px] font-bold tracking-widest uppercase border transition-all ${
                                                status === s 
                                                ? "bg-[#C6A972] text-black border-[#C6A972] shadow-lg shadow-[#C6A972]/20" 
                                                : "bg-white/5 text-white/40 border-white/5 hover:border-white/10"
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {status === "SHIPPED" && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                    <div>
                                        <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-2 font-bold px-1">Tracking ID</label>
                                        <input 
                                            type="text"
                                            value={trackingNumber}
                                            onChange={(e) => setTrackingNumber(e.target.value)}
                                            placeholder="Enter tracking number"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C6A972] focus:ring-1 focus:ring-[#C6A972] transition-all outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-2 font-bold px-1">Courier Service</label>
                                        <input 
                                            type="text"
                                            value={courierName}
                                            onChange={(e) => setCourierName(e.target.value)}
                                            placeholder="FedEx, DHL, BlueDart..."
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C6A972] focus:ring-1 focus:ring-[#C6A972] transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {status === "REFUNDED" && (
                                <div className="animate-in fade-in slide-in-from-top-2">
                                    <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-2 font-bold px-1">Refund Amount (₹)</label>
                                    <input 
                                        type="number"
                                        value={refundAmount}
                                        onChange={(e) => setRefundAmount(e.target.value)}
                                        placeholder="Full or partial amount"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-[#C6A972] focus:ring-1 focus:ring-[#C6A972] transition-all outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 flex items-center gap-3 text-rose-400 text-xs">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-xl text-xs uppercase tracking-[0.3em] font-black hover:bg-[#C6A972] transition-all duration-500 disabled:opacity-50"
                        >
                            {loading ? "ARCHIVING..." : "CONFIRM UPDATE"}
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
}
