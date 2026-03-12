"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Tag, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EMPTY_FORM = {
    code: "",
    description: "",
    discountType: "PERCENT",
    discountValue: "",
    minOrderValue: "",
    maxUses: "",
    expiresAt: "",
};

export default function AdminCouponsPage() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchCoupons = async () => {
        setLoading(true);
        const res = await fetch("/api/admin/coupons");
        const data = await res.json();
        setCoupons(Array.isArray(data) ? data : []);
        setLoading(false);
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        const res = await fetch("/api/admin/coupons", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, discountValue: +form.discountValue }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Failed"); setSaving(false); return; }
        setShowForm(false);
        setForm(EMPTY_FORM);
        fetchCoupons();
        setSaving(false);
    };

    const toggleActive = async (c) => {
        await fetch(`/api/admin/coupons/${c.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isActive: !c.isActive }),
        });
        fetchCoupons();
    };

    const deleteCoupon = async (id) => {
        if (!confirm("Delete this coupon?")) return;
        await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
        fetchCoupons();
    };

    return (
        <div className="space-y-8 text-white">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair italic">Coupon Manager</h1>
                    <p className="text-white/30 text-sm mt-1">Create and manage discount codes for customers.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#C6A972] text-black text-xs uppercase tracking-widest font-black rounded-xl hover:bg-white transition-all"
                >
                    <Plus size={14} /> New Coupon
                </button>
            </header>

            {/* Create form modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.form
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onSubmit={handleCreate}
                            className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-8 w-full max-w-lg space-y-5"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="font-playfair text-xl italic">New Coupon</h2>
                                <button type="button" onClick={() => { setShowForm(false); setError(""); }} className="text-white/30 hover:text-white">
                                    <X size={18} />
                                </button>
                            </div>

                            {error && <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs">{error}</div>}

                            <div className="grid grid-cols-2 gap-4">
                                <label className="col-span-2 flex flex-col gap-1.5">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Coupon Code *</span>
                                    <input required value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                        placeholder="NOIR20" className="noir-input" />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Type</span>
                                    <select value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}
                                        className="noir-input">
                                        <option value="PERCENT">Percent (%)</option>
                                        <option value="FIXED">Fixed (₹)</option>
                                    </select>
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Value *</span>
                                    <input required type="number" min="1" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })}
                                        placeholder={form.discountType === "PERCENT" ? "20" : "500"} className="noir-input" />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Min Order (₹)</span>
                                    <input type="number" min="0" value={form.minOrderValue} onChange={e => setForm({ ...form, minOrderValue: e.target.value })}
                                        placeholder="0" className="noir-input" />
                                </label>
                                <label className="flex flex-col gap-1.5">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Max Uses</span>
                                    <input type="number" min="1" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })}
                                        placeholder="Unlimited" className="noir-input" />
                                </label>
                                <label className="col-span-2 flex flex-col gap-1.5">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Expires At</span>
                                    <input type="date" value={form.expiresAt} onChange={e => setForm({ ...form, expiresAt: e.target.value })}
                                        className="noir-input" />
                                </label>
                                <label className="col-span-2 flex flex-col gap-1.5">
                                    <span className="text-white/40 text-[9px] uppercase tracking-widest">Description</span>
                                    <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                                        placeholder="Summer sale 20% off" className="noir-input" />
                                </label>
                            </div>
                            <button type="submit" disabled={saving}
                                className="w-full h-12 bg-[#C6A972] hover:bg-white text-black text-xs uppercase tracking-widest font-black rounded-xl transition-all disabled:opacity-50">
                                {saving ? "Creating…" : "Create Coupon"}
                            </button>
                        </motion.form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Coupon table */}
            {loading ? (
                <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/3 rounded-xl" />)}
                </div>
            ) : coupons.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                    <Tag size={40} className="text-white/10" />
                    <p className="text-white/30 text-sm italic">No coupons yet. Create one to get started.</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Header */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-5 py-2 text-[9px] uppercase tracking-widest text-white/20 font-bold">
                        <span>Code</span>
                        <span>Discount</span>
                        <span>Min Order</span>
                        <span>Uses</span>
                        <span>Expires</span>
                        <span />
                    </div>
                    {coupons.map((c) => (
                        <motion.div
                            key={c.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 bg-white/[0.02] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
                        >
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-bold text-[#C6A972]">{c.code}</span>
                                    {!c.isActive && <span className="text-[8px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">Inactive</span>}
                                </div>
                                {c.description && <p className="text-white/30 text-xs mt-0.5 truncate max-w-[160px]">{c.description}</p>}
                            </div>
                            <span className="text-white text-sm font-semibold">
                                {c.discountType === "PERCENT" ? `${c.discountValue}%` : `₹${c.discountValue}`}
                            </span>
                            <span className="text-white/40 text-sm">
                                {c.minOrderValue > 0 ? `₹${c.minOrderValue}` : "—"}
                            </span>
                            <span className="text-white/40 text-sm">
                                {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ""}
                            </span>
                            <span className="text-white/40 text-xs">
                                {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("en-IN") : "Never"}
                            </span>
                            <div className="flex items-center gap-2">
                                <button onClick={() => toggleActive(c)} className={`transition-colors ${c.isActive ? "text-[#C6A972]" : "text-white/20 hover:text-white/50"}`}>
                                    {c.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                </button>
                                <button onClick={() => deleteCoupon(c.id)} className="text-white/20 hover:text-red-400 transition-colors">
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style jsx global>{`
                .noir-input {
                    width: 100%;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 10px;
                    padding: 10px 14px;
                    color: white;
                    font-size: 13px;
                    outline: none;
                    transition: border-color 0.2s;
                }
                .noir-input:focus { border-color: rgba(198,169,114,0.6); }
                .noir-input option { background: #0F0F0F; }
            `}</style>
        </div>
    );
}
