"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, ShoppingBag, MessageSquare } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { trackEvent, ANALYTICS_EVENTS } from "@/lib/analytics";

export default function AIStylist() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { 
            id: 1, 
            type: "agent", 
            text: "Neural Interface established. Maison NOIR Collective Intelligence is online. How shall we curate your personal archive today?",
            telemetry: { protocol: "God-Mode v4.1", processingTime: "0ms", sentiment: "neutral", confidence: 1.0 }
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [lastTelemetry, setLastTelemetry] = useState(messages[0].telemetry);
    const scrollRef = useRef(null);
    const addItem = useCartStore(state => state.addItem);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), type: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await fetch("/api/ai/stylist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });
            const data = await res.json();
            
            setTimeout(() => {
                const agentMsg = { 
                    id: Date.now() + 1, 
                    type: "agent", 
                    text: data.response,
                    suggestions: data.suggestions,
                    telemetry: data.telemetry
                };
                setMessages(prev => [...prev, agentMsg]);
                setLastTelemetry(data.telemetry);
                setIsTyping(false);

                // Tracking: Sentiment and Query Success
                trackEvent(ANALYTICS_EVENTS.AI_STYLIST.SENTIMENT_DETECTED, {
                    sentiment: data.telemetry?.sentiment,
                    confidence: data.telemetry?.confidence,
                    query: input
                });
            }, 1200);
        } catch (error) {
            setMessages(prev => [...prev, { id: Date.now() + 1, type: "agent", text: "Neural link fractured. Archival synchronization in progress." }]);
            setIsTyping(false);
        }
    };

    const getSentimentColor = (sentiment) => {
        switch (sentiment) {
            case "sophisticated": return "#C6A972";
            case "urgent": return "#FF4D4D";
            case "dissatisfied": return "#808080";
            default: return "#4ADE80";
        }
    };

    return (
        <>
            {/* Floating Toggle */}
            <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                onClick={() => {
                    setIsOpen(true);
                    trackEvent(ANALYTICS_EVENTS.AI_STYLIST.OPEN);
                }}
                className="fixed bottom-8 right-8 z-[100] w-16 h-16 bg-[#C6A972] text-black rounded-full shadow-[0_0_50px_rgba(198,169,114,0.4)] flex items-center justify-center hover:bg-white transition-all border-4 border-black/20"
            >
                <div className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20" />
                <Sparkles size={24} className="animate-pulse" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, y: 30, filter: "blur(10px)" }}
                        className="fixed bottom-10 right-10 z-[100] w-[460px] h-[720px] bg-black/40 border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden backdrop-blur-[80px]"
                    >
                        {/* ── Neural Grid Background ── */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(198,169,114,0.1)_0%,transparent_70%)] animate-pulse" />
                            <div className="grid grid-cols-6 h-full w-full">
                                {[...Array(24)].map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-white/5" />
                                ))}
                            </div>
                        </div>

                        {/* ── Header: System Telemetry ── */}
                        <header className="p-8 pb-4 relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C6A972] to-[#8E7951] flex items-center justify-center text-black shadow-lg">
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-1">Neural Stylist</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            <p className="text-[8px] text-white/40 font-mono tracking-widest uppercase">System Operational // {lastTelemetry?.protocol || "God-Mode v4.1"}</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/20 hover:text-white hover:bg-white/10 transition-all">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Telemetry Dashboard */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
                                    <p className="text-[7px] text-white/20 uppercase tracking-widest mb-1">Sentiment</p>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(lastTelemetry?.confidence || 0.5) * 100}%` }}
                                                className="h-full bg-noir-gold"
                                            />
                                        </div>
                                        <span className="text-[8px] text-noir-gold font-bold uppercase">{lastTelemetry?.sentiment || "Neutral"}</span>
                                    </div>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
                                    <p className="text-[7px] text-white/20 uppercase tracking-widest mb-1">Latency</p>
                                    <p className="text-[10px] text-white/60 font-mono italic">{lastTelemetry?.processingTime || "--ms"}</p>
                                </div>
                                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
                                    <p className="text-[7px] text-white/20 uppercase tracking-widest mb-1">Confidence</p>
                                    <p className="text-[10px] text-white/60 font-mono font-bold">{(lastTelemetry?.confidence || 0) * 100}%</p>
                                </div>
                            </div>
                        </header>

                        {/* ── Body: Temporal Stream ── */}
                        <div ref={scrollRef} className="flex-1 px-8 overflow-y-auto space-y-8 no-scrollbar relative z-10 py-6">
                            {messages.map(msg => (
                                <motion.div 
                                    key={msg.id} 
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[90%] space-y-4 ${msg.type === "user" ? "bg-white/5 border border-white/10 p-5 rounded-3xl" : ""}`}>
                                        <div className="relative">
                                            {msg.type === "agent" && (
                                                <div className="absolute -left-4 top-0 bottom-0 w-[2px] bg-noir-gold/20" />
                                            )}
                                            <p className={`text-[13px] leading-relaxed tracking-wide ${msg.type === "user" ? "text-white/90 font-medium" : "text-white/60 font-playfair italic font-medium"}`}>
                                                {msg.text}
                                            </p>
                                        </div>

                                        {msg.suggestions && msg.suggestions.length > 0 && (
                                            <div className="grid grid-cols-1 gap-4 pt-4">
                                                {msg.suggestions.map(p => (
                                                    <motion.div 
                                                        key={p.id} 
                                                        whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.08)" }}
                                                        className="flex gap-5 p-4 bg-white/[0.04] border border-white/5 rounded-[1.5rem] group transition-all cursor-pointer relative overflow-hidden"
                                                    >
                                                        <div className="absolute top-0 right-0 w-16 h-16 bg-noir-gold/5 blur-2xl rounded-full" />
                                                        <div className="relative w-24 h-32 rounded-xl overflow-hidden shrink-0 border border-white/10">
                                                            <Image src={p.imageUrls[0]} fill className="object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                                                        </div>
                                                        <div className="flex flex-col justify-between py-2 flex-1">
                                                            <div className="space-y-1">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-1 h-1 rounded-full bg-noir-gold/40" />
                                                                    <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">{p.category}</span>
                                                                </div>
                                                                <h4 className="text-sm text-white font-playfair italic font-bold">{p.name}</h4>
                                                                <p className="text-sm text-noir-gold font-bold">₹{p.price.toLocaleString("en-IN")}</p>
                                                            </div>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    addItem({...p, quantity: 1, image: p.imageUrls[0]});
                                                                    trackEvent(ANALYTICS_EVENTS.AI_STYLIST.OUTFIT_SELECTED, {
                                                                        productId: p.id,
                                                                        productName: p.name
                                                                    });
                                                                }}
                                                                className="w-full h-10 bg-white/5 group-hover:bg-[#C6A972] group-hover:text-black rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-white/5 group-hover:border-transparent"
                                                            >
                                                                <ShoppingBag size={12} /> Acquire Ensemble
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex items-center gap-3 text-noir-gold/40">
                                    <div className="flex gap-1.5">
                                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-noir-gold rounded-full" />
                                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-noir-gold rounded-full" />
                                        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-noir-gold rounded-full" />
                                    </div>
                                    <span className="text-[7px] uppercase tracking-[0.5em] font-black italic">Neural Processing...</span>
                                </div>
                            )}
                        </div>

                        {/* ── Footer: Input Collective ── */}
                        <div className="p-8 pt-4 relative z-10">
                            <form onSubmit={handleSend} className="relative group">
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-t from-black to-transparent pointer-events-none opacity-50 -z-10" />
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Dictate your aesthetic request..."
                                    className="w-full bg-white/[0.05] border border-white/10 rounded-2xl py-6 px-8 pr-16 text-sm text-white focus:outline-none focus:border-noir-gold/50 transition-all font-inter placeholder:text-white/10"
                                />
                                <button 
                                    type="submit" 
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-noir-gold text-black rounded-xl shadow-lg hover:bg-white hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
                                >
                                    <Send size={18} />
                                </button>
                                <div className="flex items-center justify-between mt-4 px-2">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare size={10} className="text-white/20" />
                                        <span className="text-[7px] text-white/20 uppercase tracking-[0.3em]">Encrypted Channel established</span>
                                    </div>
                                    <span className="text-[7px] text-white/20 uppercase tracking-[0.3em]">Maison Noir Collective Intelligence</span>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
