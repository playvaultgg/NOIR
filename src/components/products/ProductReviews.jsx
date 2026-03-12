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
        <section className="mt-16 border-t border-white/5 pt-12">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h2 className="font-playfair text-2xl italic text-white">Reviews</h2>
                    <div className="flex items-center gap-3 mt-2">
                        <StarRating value={Math.round(data.avgRating)} readOnly />
                        <span className="text-[#C6A972] font-bold text-lg">{data.avgRating || "—"}</span>
                        <span className="text-white/30 text-sm">({data.count} {data.count === 1 ? "review" : "reviews"})</span>
                    </div>
                </div>
                {session && !showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 border border-white/10 text-white/60 hover:text-white hover:border-[#C6A972]/40 rounded-xl text-xs uppercase tracking-widest transition-all"
                    >
                        <Star size={13} /> Write a Review
                    </button>
                )}
            </div>

            {/* Rating distribution */}
            {data.count > 0 && (
                <div className="mb-8 space-y-2 max-w-sm">
                    {dist.map(({ star, count }) => (
                        <div key={star} className="flex items-center gap-3">
                            <span className="text-white/30 text-xs w-4">{star}</span>
                            <Star size={10} className="text-[#C6A972] fill-[#C6A972]" />
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#C6A972] rounded-full transition-all duration-700"
                                    style={{ width: data.count ? `${(count / data.count) * 100}%` : "0%" }}
                                />
                            </div>
                            <span className="text-white/20 text-xs w-4">{count}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Write review form */}
            <AnimatePresence>
                {showForm && (
                    <motion.form
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleSubmit}
                        className="mb-10 p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4"
                    >
                        <h3 className="text-white font-semibold text-sm">Your Review</h3>
                        <div>
                            <p className="text-white/30 text-[9px] uppercase tracking-widest mb-2">Rating</p>
                            <StarRating value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                        </div>
                        <input
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            placeholder="Review title (optional)"
                            className="w-full bg-white/4 border border-white/8 focus:border-[#C6A972]/50 outline-none text-white text-sm px-4 py-3 rounded-xl placeholder:text-white/20 transition-all"
                        />
                        <textarea
                            required
                            value={form.body}
                            onChange={e => setForm({ ...form, body: e.target.value })}
                            placeholder="Tell us about your experience with this piece…"
                            rows={4}
                            className="w-full bg-white/4 border border-white/8 focus:border-[#C6A972]/50 outline-none text-white text-sm px-4 py-3 rounded-xl placeholder:text-white/20 resize-none transition-all"
                        />
                        <div className="flex gap-3">
                            <button type="submit" disabled={submitting}
                                className="flex items-center gap-2 px-6 py-2.5 bg-[#C6A972] text-black text-xs uppercase tracking-widest font-black rounded-xl hover:bg-white transition-all disabled:opacity-50">
                                <Send size={12} /> {submitting ? "Submitting…" : "Submit"}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)}
                                className="px-6 py-2.5 border border-white/10 text-white/40 hover:text-white text-xs uppercase tracking-widest rounded-xl transition-all">
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {submitted && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-2 text-green-400 text-sm">
                    <Check size={16} /> Review submitted — thank you!
                </motion.div>
            )}

            {/* Review list */}
            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2].map(i => <div key={i} className="h-24 bg-white/3 rounded-xl" />)}
                </div>
            ) : data.reviews.length === 0 ? (
                <p className="text-white/20 italic text-sm">No reviews yet. Be the first to share your experience.</p>
            ) : (
                <div className="space-y-5">
                    {data.reviews.map((r) => (
                        <motion.div
                            key={r.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl"
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex items-center gap-3">
                                    {r.user.image ? (
                                        <Image src={r.user.image} alt={r.user.name || ""} width={32} height={32} className="rounded-full" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-[#C6A972]/20 flex items-center justify-center text-[#C6A972] text-xs font-bold">
                                            {r.user.name?.[0]?.toUpperCase() || "?"}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-white text-sm font-medium">{r.user.name || "Anonymous"}</p>
                                        <p className="text-white/25 text-[9px]">{new Date(r.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <StarRating value={r.rating} readOnly />
                                    {r.verifiedPurchase && (
                                        <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-green-400 border border-green-400/20 bg-green-400/5 px-2 py-0.5 rounded-full">
                                            <Check size={8} /> Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                            {r.title && <p className="text-white font-semibold text-sm mb-1">{r.title}</p>}
                            <p className="text-white/50 text-sm leading-relaxed">{r.body}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </section>
    );
}
