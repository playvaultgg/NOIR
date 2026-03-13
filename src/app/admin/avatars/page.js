import prisma from "@/lib/prisma";
import { UserCircle2, AlertTriangle, ScanLine, Search, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAvatars() {
    const avatars = await prisma.useravatar.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    });

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-white italic">Identity Synthesis</h1>
                    <p className="text-white/40 text-sm mt-1">Manage virtual 3D avatars and precise dimensional data.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C6A972] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search identities..."
                            className="bg-noir-surface/40 border border-white/5 focus:border-[#C6A972] outline-none text-white text-sm pl-12 pr-4 py-2.5 rounded-xl transition-all"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {avatars.length === 0 ? (
                    <div className="col-span-full py-20 px-6 text-center glass-effect rounded-2xl border border-white/5 bg-noir-surface/40">
                        <UserCircle2 className="mx-auto h-12 w-12 text-white/10 mb-4" />
                        <h3 className="text-white/60 text-sm font-medium">No Synthetic Identities Found</h3>
                        <p className="text-white/30 text-xs mt-1">Users have not generated any 3D avatars yet.</p>
                    </div>
                ) : avatars.map((avatar) => (
                    <div key={avatar.id} className="glass-effect p-6 rounded-2xl border border-white/5 bg-noir-surface/40 group hover:border-white/10 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-[#C6A972]">
                                    <ScanLine size={18} />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">{avatar.user?.name || "Anonymous Client"}</div>
                                    <div className="text-[9px] uppercase tracking-widest text-[#C6A972]">Body: {avatar.bodyType}</div>
                                </div>
                            </div>
                            <button className="text-white/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-2 bg-white/5 rounded-lg">
                                <Trash2 size={14} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass-effect p-3 rounded-xl bg-black/20 border border-white/5">
                                    <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Height</div>
                                    <div className="text-white font-mono text-sm">{avatar.height}m</div>
                                </div>
                                <div className="glass-effect p-3 rounded-xl bg-black/20 border border-white/5">
                                    <div className="text-[9px] uppercase tracking-widest text-white/30 mb-1">Weight</div>
                                    <div className="text-white font-mono text-sm">{avatar.weight}kg</div>
                                </div>
                            </div>

                            <div className="glass-effect p-4 rounded-xl bg-black/20 border border-white/5 space-y-3">
                                <div className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold border-b border-white/5 pb-2">Precise Metrics</div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-white/40">Chest</span>
                                    <span className="text-white">{avatar.chest || "--"} cm</span>
                                </div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-white/40">Waist</span>
                                    <span className="text-white">{avatar.waist || "--"} cm</span>
                                </div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-white/40">Hips</span>
                                    <span className="text-white">{avatar.hips || "--"} cm</span>
                                </div>
                                <div className="flex justify-between text-xs font-mono">
                                    <span className="text-white/40">Shoulders</span>
                                    <span className="text-white">{avatar.shoulders || "--"} cm</span>
                                </div>
                            </div>

                            {!avatar.modelURL && (
                                <div className="flex items-center gap-2 text-[10px] text-amber-400/80 bg-amber-500/10 p-2 rounded-lg border border-amber-500/10">
                                    <AlertTriangle size={12} />
                                    No 3D Model URL Synthesized
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
