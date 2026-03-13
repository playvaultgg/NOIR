"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";

function StarRating({ value, onChange, readOnly = false }) {
    const [hovered, setHovered] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
                <button
                    key={s}
                    type={readOnly ? "button" : "button"}
                    disabled={readOnly}
                    onClick={() => !readOnly && onChange?.(s)}
                    onMouseEnter={() => !readOnly && setHovered(s)}
                    onMouseLeave={() => !readOnly && setHovered(0)}
                    className="transition-transform hover:scale-110 disabled:cursor-default"
                >
                    <Star
                        size={readOnly ? 13 : 20}
                        className={`transition-colors ${
                            s <= (hovered || value)
                                ? "fill-[#C6A972] text-[#C6A972]"
                                : "text-white/15"
                        }`}
                    />
                </button>
            ))}
        </div>
    );
}

export default function ProductReviews({ productId }) {
    const { data: session } = useSession();
    const [data, setData] = useState({ reviews: [], avgRating: 0, count: 0 });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ rating: 0, title: "", body: "" });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fetchReviews = async () => {
        setLoading(true);
        const res = await fetch(`/api/products/reviews?productId=${productId}`);
        const json = await res.json();
        setData(json);
        setLoading(false);
    };

    useEffect(() => { if (productId) fetchReviews(); }, [productId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.rating) { alert("Please select a rating"); return; }
        setSubmitting(true);
        const res = await fetch("/api/products/reviews", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, ...form }),
        });
        if (res.ok) {
            setSubmitted(true);
            setShowForm(false);
            setForm({ rating: 0, title: "", body: "" });
            await fetchReviews();
            setTimeout(() => setSubmitted(false), 3000);
        }
        setSubmitting(false);
    };

    // Rating distribution
    const dist = [5, 4, 3, 2, 1].map((s) => ({
        star: s,
        count: data.reviews.filter((r) => r.rating === s).length,
    }));

    return (
        <section className="mt-48 lg:mt-64 border-t border-white/5 pt-24 pb-32">
            <div className="flex items-center justify-between mb-16 flex-wrap gap-8">
                <div className="space-y-4">
                    <h4 className="text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">Consumer Consensus</h4>
                    <h2 className="font-playfair text-5xl lg:text-7xl italic text-white tracking-tight">Curation Reviews</h2>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                            <StarRating value={Math.round(data.avgRating)} readOnly />
                            <span className="text-[#C6A972] font-black text-xl ml-1">{data.avgRating || "—"}</span>
                        </div>
                        <span className="text-white/30 text-[10px] uppercase tracking-widest font-black">
                            {data.count} Verified Responses
                        </span>
                    </div>
                </div>
                {session && !showForm && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-noir-gold transition-colors rounded-xl text-[10px] uppercase tracking-[0.4em] font-black shadow-2xl"
                    >
                        <Send size={14} className="rotate-45" /> Submit Experience
                    </motion.button>
                )}
            </div>

            {/* Rating distribution & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
                <div className="lg:col-span-4 space-y-6">
                    <h5 className="text-white/60 text-[10px] uppercase tracking-widest font-bold border-b border-white/5 pb-4">Aesthetic Distribution</h5>
                    <div className="space-y-3">
                        {dist.map(({ star, count }) => (
                            <div key={star} className="flex items-center gap-4 group">
                                <span className="text-white/30 text-[10px] uppercase font-black w-4">{star}</span>
                                <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: data.count ? `${(count / data.count) * 100}%` : "0%" }}
                                        transition={{ duration: 1, ease: "circOut" }}
                                        className="h-full bg-noir-gold/40 group-hover:bg-noir-gold transition-colors"
                                    />
                                </div>
                                <span className="text-white/20 text-[10px] font-black w-4">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="lg:col-span-8">
                    <AnimatePresence>
                        {showForm && (
                            <motion.form
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                onSubmit={handleSubmit}
                                className="p-10 bg-[#C6A972]/[0.02] border border-[#C6A972]/10 rounded-[2rem] space-y-8 overflow-hidden"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-white font-playfair text-2xl italic tracking-tight">Record your Experience</h3>
                                    <p className="text-white/30 text-[10px] uppercase tracking-widest">Share the nuances of your acquisition.</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <p className="text-white/40 text-[9px] uppercase tracking-widest font-black italic">Quantitative Merit</p>
                                        <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-white/40 text-[9px] uppercase tracking-widest font-black italic">Defining Concept</p>
                                        <input
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            placeholder="Subjectivity…"
                                            className="w-full bg-black/40 border border-white/10 focus:border-noir-gold/50 outline-none text-white text-sm px-6 py-4 rounded-xl placeholder:text-white/10 transition-all font-inter"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-white/40 text-[9px] uppercase tracking-widest font-black italic">Narrative Detail</p>
                                    <textarea
                                        required
                                        value={form.body}
                                        onChange={e => setForm({ ...form, body: e.target.value })}
                                        placeholder="Discuss the silhouette, texture, and resonance…"
                                        rows={4}
                                        className="w-full bg-black/40 border border-white/10 focus:border-noir-gold/50 outline-none text-white text-sm px-6 py-4 rounded-2xl placeholder:text-white/10 resize-none transition-all font-inter leading-relaxed"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button type="submit" disabled={submitting}
                                        className="flex-1 h-14 bg-noir-gold text-black text-[10px] uppercase tracking-[0.4em] font-black rounded-xl hover:bg-white transition-all disabled:opacity-50">
                                        {submitting ? "Processing…" : "Formalize Review"}
                                    </button>
                                    <button type="button" onClick={() => setShowForm(false)}
                                        className="px-8 h-14 border border-white/10 text-white/40 hover:text-white text-[10px] uppercase tracking-[0.4em] font-black rounded-xl transition-all">
                                        Retract
                                    </button>
                                </div>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    {submitted && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 bg-green-400/5 border border-green-400/20 rounded-2xl flex items-center gap-4 text-green-400">
                           <div className="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center">
                               <Check size={20} />
                           </div>
                           <div className="space-y-1">
                               <p className="text-[10px] uppercase tracking-[0.2em] font-black">Archive Updated</p>
                               <p className="text-xs opacity-60">Your review has been successfully documented.</p>
                           </div>
                        </motion.div>
                    )}

                    {/* Review list */}
                    <div className="space-y-12 mt-12">
                        {loading ? (
                            <div className="space-y-8">
                                {[1, 2].map(i => <div key={i} className="h-40 bg-white/[0.02] rounded-[2rem] animate-pulse" />)}
                            </div>
                        ) : data.reviews.length === 0 ? (
                            <div className="py-24 text-center border border-white/5 border-dashed rounded-[2rem] bg-white/[0.01]">
                                <p className="text-white/20 italic text-xl font-playfair">This piece awaits its first narrative.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-12">
                                {data.reviews.map((r) => (
                                    <motion.div
                                        key={r.id}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        className="group relative"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 rounded-full overflow-hidden border border-noir-gold/20 p-1">
                                                    {r.user.image ? (
                                                        <Image src={r.user.image} alt={r.user.name || ""} fill className="object-cover rounded-full" />
                                                    ) : (
                                                        <div className="w-full h-full rounded-full bg-noir-gold/10 flex items-center justify-center text-noir-gold text-lg font-playfair italic">
                                                            {r.user.name?.[0]?.toUpperCase() || "?"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-white font-playfair text-xl italic tracking-tight">{r.user.name || "Anonymous"}</p>
                                                    <p className="text-white/20 text-[9px] uppercase tracking-[0.3em] font-medium">Acquired {new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short" })}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <StarRating value={r.rating} readOnly />
                                                {r.verified && (
                                                    <span className="flex items-center gap-2 text-[8px] uppercase tracking-[0.4em] font-black text-noir-gold border border-noir-gold/20 bg-noir-gold/5 px-4 py-1.5 rounded-full">
                                                        <div className="w-1 h-1 rounded-full bg-noir-gold animate-pulse" />
                                                        Maison Verified
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="pl-0 md:pl-18 space-y-4">
                                            {r.title && <h6 className="text-white font-playfair text-xl italic leading-tight">{r.title}</h6>}
                                            <p className="text-white/40 text-lg font-inter italic leading-relaxed max-w-3xl">{r.comment}</p>
                                        </div>
                                        
                                        <div className="absolute -left-4 top-0 w-1 h-0 bg-noir-gold group-hover:h-full transition-all duration-700 opacity-20" />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
