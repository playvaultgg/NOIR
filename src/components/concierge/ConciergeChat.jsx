"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Bot, ShoppingBag, BookOpen, ShieldCheck } from "lucide-react";

/**
 * Maison NOIR AI Concierge (The Archivist)
 * A premium floating interface for omnichannel assistance.
 * Persona: "The Archivist" - knowledgeable, professional, and refined.
 */
export default function ConciergeChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content: "Greetings. I am the Maison Archivist. I hold the keys to our seasonal repositories and archival history. How may I facilitate your discovery within the Maison today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now(),
            role: "user",
            content: inputValue,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        setIsTyping(true);

        // Advanced Archivist Response Logic
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                role: "assistant",
                content: generateArchivistResponse(inputValue),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: shouldShowAction(inputValue) ? "CATALOGUE" : null
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1200);
    };

    const shouldShowAction = (query) => {
        const q = query.toLowerCase();
        return q.includes("collection") || q.includes("show") || q.includes("products") || q.includes("buy");
    };

    const generateArchivistResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes("hi") || q.includes("hello")) return "A pleasure to see you in the archives. I am at your disposal for any inquiry regarding our collections or virtual exhibits.";
        if (q.includes("runway") || q.includes("show")) return "The Midnight Symphony AW26 is our current flagship exhibition. It represents the pinnacle of our neural projection technology. Shall I guide you to the VIP viewing area?";
        if (q.includes("showroom") || q.includes("boutique")) return "Our Virtual Showroom is currently holding our most prestigious garments in a vacuum of digital silence. It is a museum-grade experience for the discerning collector.";
        if (q.includes("fragrance") || q.includes("perfume") || q.includes("avatar")) return "L'Atelier Noir is where we synthesize olfactive identities. You can design your personal flacon and scent there. It is a highly personalized ritual.";
        if (q.includes("black")) return "Our 'Obsidian' series is a study in the depth of silence. Each piece is hand-spun from dead-stock silk. The texture is designed to absorb light rather than reflect it.";
        return "I have cross-referenced our archives with your inquiry. While that specific data point is currently being indexed, I can offer you a private tour of our latest seasonal drops.";
    };

    return (
        <div className="fixed bottom-8 right-8 lg:bottom-12 lg:right-12 z-[150] pointer-events-none">
            {/* Trigger Button */}
            <motion.button
                layout
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="ml-auto pointer-events-auto w-16 h-16 bg-noir-gold rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(198,169,114,0.3)] text-noir-black cursor-pointer overflow-hidden border border-white/10 group relative"
            >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}>
                            <X size={24} strokeWidth={2.5} />
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="relative">
                            <BookOpen size={24} strokeWidth={2.5} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-noir-gold animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Concierge Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" }}
                        className="absolute bottom-24 right-0 w-80 sm:w-[450px] h-[650px] pointer-events-auto glass-effect rounded-[2.5rem] border border-white/5 shadow-[0_0_120px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-8 bg-[#050505]/40 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-noir-gold/10 flex items-center justify-center border border-noir-gold/20 relative group">
                                    <div className="absolute inset-0 bg-noir-gold/5 blur-xl group-hover:bg-noir-gold/20 transition-all" />
                                    <ShieldCheck className="text-noir-gold relative z-10" size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-playfair text-xl italic tracking-widest uppercase leading-none mb-1">The Archivist</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-noir-gold animate-pulse" />
                                        <span className="text-[8px] uppercase tracking-[0.4em] text-noir-gold font-black italic">Maison AI Concierge</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <motion.div animate={{ opacity: [0.2, 0.5, 0.2] }} transition={{ repeat: Infinity, duration: 3 }} className="text-[8px] uppercase tracking-widest text-white/20 font-black">Secure Link</motion.div>
                            </div>
                        </div>

                        {/* Messages Box */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar select-text">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[88%] space-y-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                        <div className={`p-6 rounded-3xl text-[13px] font-inter leading-relaxed tracking-wide ${
                                            msg.role === "user" 
                                            ? "bg-white text-black font-semibold rounded-br-none" 
                                            : "bg-[#0A0A0A]/80 text-white/80 border border-white/5 rounded-bl-none shadow-2xl"
                                        }`}>
                                            {msg.content}
                                            {msg.action === "CATALOGUE" && (
                                                <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                                                    <p className="text-[9px] uppercase tracking-[0.3em] text-noir-gold font-black italic">Archival Reference:</p>
                                                    <Link href="/collections" className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group/link">
                                                        <span className="text-[10px] uppercase tracking-widest text-white">View Full Catalogue</span>
                                                        <Sparkles size={12} className="text-noir-gold group-hover/link:scale-125 transition-transform" />
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 px-3">
                                            <span className="text-[7px] uppercase tracking-[0.5em] text-white/10 font-black">{msg.time}</span>
                                            <div className="h-[1px] flex-1 bg-white/5" />
                                            <span className="text-[7px] uppercase tracking-[0.5em] text-white/20 font-black">{msg.role === "user" ? "Client" : "Archivist"}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-[#0A0A0A]/80 border border-white/5 p-4 rounded-2xl flex gap-1.5 backdrop-blur-md">
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2 }} className="w-1 h-1 bg-noir-gold rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1 h-1 bg-noir-gold rounded-full" />
                                        <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1 h-1 bg-noir-gold rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-[#050505]/60 border-t border-white/5 backdrop-blur-3xl">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Consult the Archivist..."
                                    className="w-full bg-[#0A0A0A] border border-white/5 rounded-2xl py-6 px-7 pr-16 text-xs text-white placeholder:text-white/10 focus:outline-none focus:border-noir-gold/30 transition-all shadow-inner"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleSend}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-xl shadow-2xl hover:bg-noir-gold transition-colors"
                                >
                                    <Send size={16} />
                                </motion.button>
                            </div>
                            <div className="mt-5 flex items-center justify-between opacity-20 px-2 font-inter">
                                <div className="flex items-center gap-2">
                                    <Sparkles size={10} className="text-noir-gold" />
                                    <span className="text-[7px] uppercase tracking-[0.4em] text-white font-black italic">Hyper-personalized concierge</span>
                                </div>
                                <div className="text-[7px] uppercase tracking-[0.5em] text-white/50 font-black">Vault 2.0</div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
