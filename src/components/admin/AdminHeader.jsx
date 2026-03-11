"use client";

import { useSession } from "next-auth/react";
import { Bell, Search, User } from "lucide-react";

export default function AdminHeader() {
    const { data: session } = useSession();

    return (
        <header className="h-20 border-b border-white/5 bg-noir-black/50 backdrop-blur-xl sticky top-0 z-40 px-8 flex items-center justify-between">
            <div className="relative group w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={16} />
                <input
                    type="text"
                    placeholder="Search resources..."
                    className="w-full bg-white/5 border border-white/5 px-12 py-3 rounded-full text-[11px] uppercase tracking-widest outline-none focus:border-noir-gold/20 transition-all font-inter text-white/60 placeholder:text-white/20"
                />
            </div>

            <div className="flex items-center gap-6">
                <button className="relative p-2 text-white/40 hover:text-white transition-colors">
                    <Bell size={20} strokeWidth={1.5} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-noir-gold rounded-full border-2 border-noir-black" />
                </button>

                <div className="h-8 w-[1px] bg-white/5 mx-2" />

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-playfair text-white tracking-wide">{session?.user?.name || "Noir Admin"}</p>
                        <p className="text-[9px] uppercase tracking-widest text-noir-gold font-bold">Supreme Access</p>
                    </div>
                    <div className="w-10 h-10 bg-noir-gold/10 rounded-full flex items-center justify-center border border-noir-gold/20 text-noir-gold shadow-lg shadow-noir-gold/10 overflow-hidden">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="Admin" className="w-full h-full object-cover" />
                        ) : (
                            <User size={20} strokeWidth={1.5} />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
