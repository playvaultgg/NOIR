"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Bot, ShoppingBag } from "lucide-react";

/**
 * Maison NOIR AI Stylist Assistant
 * Cinematic floating chat interface for personalized curation.
 * Features:
 * - Natural Language Style Queries
 * - Real-time Product Recommendations
 * - Luxury Motion Design (Spring Physics)
 */
export default function AIStylistChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: "assistant",
            content: "Welcome to Maison NOIR. I am your personal digital stylist. How may I assist your style discovery today?",
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

        // Simulated AI Response Logic (Phase 9 Implementation)
        setTimeout(() => {
            const botMsg = {
                id: Date.now() + 1,
                role: "assistant",
                content: generateStylistResponse(inputValue),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                action: inputValue.toLowerCase().includes("outfit") || inputValue.toLowerCase().includes("black") ? "RECOMMEND" : null
            };
            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 1500);
    };

    const generateStylistResponse = (query) => {
        const q = query.toLowerCase();
        if (q.includes("black")) return "Exquisite choice. Our Onyx Silk collection features hand-tailored silhouettes designed for midnight elegance. Would you like to view the Silk Trench?";
        if (q.includes("outfit") || q.includes("evening")) return "For a prestigious evening, I recommend our tailored velvet gown paired with the Argent Pearl blouse. It creates a silhouette of unparalleled sophistication.";
        if (q.includes("price") || q.includes("cost")) return "Maison NOIR pieces are investment-grade masterpieces. I can provide the exact acquisition values for specific collection items if you wish.";
        return "Of course. I am analyzing our late-winter archives to find the perfect coordination for your aesthetic profile.";
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(198, 169, 114, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-32 right-8 lg:bottom-12 lg:right-12 z-[110] w-16 h-16 bg-noir-gold rounded-full flex items-center justify-center shadow-2xl text-noir-black cursor-pointer overflow-hidden group"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }}>
                            <X size={24} />
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="relative">
                            <MessageSquare size={24} />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border-2 border-noir-gold animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* AI Stylist Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                         transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-4 left-4 right-4 lg:bottom-32 lg:right-12 lg:left-auto w-auto lg:w-[450px] h-[600px] z-[110] glass-effect rounded-[3rem] shadow-[0_0_100px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border border-white/10"
                    >
                        {/* Header */}
                        <div className="p-8 bg-noir-black/40 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-noir-gold/10 flex items-center justify-center border border-noir-gold/20">
                                    <Bot className="text-noir-gold" size={20} />
                                </div>
                                <div>
                                    <h3 className="text-white font-playfair text-lg italic uppercase tracking-widest">Maison Stylist</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] uppercase tracking-widest text-white/30 font-black">AI Engine: Genesis</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/20 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth no-scrollbar">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div className={`max-w-[85%] space-y-2 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                        <div className={`p-5 rounded-3xl text-sm font-inter leading-relaxed ${
                                            msg.role === "user" 
                                            ? "bg-noir-gold text-noir-black font-semibold rounded-tr-none" 
                                            : "bg-white/5 text-white/80 border border-white/5 rounded-tl-none backdrop-blur-md"
                                        }`}>
                                            {msg.content}
                                            {msg.action === "RECOMMEND" && (
                                                <motion.button 
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-4 w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-[9px] uppercase tracking-widest transition-all"
                                                >
                                                    <ShoppingBag size={12} />
                                                    View Curated Selections
                                                </motion.button>
                                            )}
                                        </div>
                                        <div className="text-[8px] uppercase tracking-widest text-white/20 font-black px-2 flex items-center justify-end gap-2">
                                            {msg.role === "user" ? <User size={8} /> : <Bot size={8} />}
                                            {msg.time}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-4 rounded-2xl flex gap-1">
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-noir-gold rounded-full" />
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-noir-gold rounded-full" />
                                        <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-noir-gold rounded-full" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-noir-black/40 border-t border-white/5">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Inquire with the Maison Stylist..."
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pr-16 text-sm text-white focus:outline-none focus:border-noir-gold/50 transition-all placeholder:text-white/20"
                                />
                                <button
                                    onClick={handleSend}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-noir-gold text-noir-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-3 opacity-20">
                                <Sparkles size={10} className="text-noir-gold" />
                                <span className="text-[8px] uppercase tracking-[0.4em] text-white font-black italic">Conversational Luxury Intelligence</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
