import prisma from "@/lib/prisma";
import { AlertOctagon, ArrowRight, PackageOpen, Boxes } from "lucide-react";
import Image from "next/image";
import { parseImages } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminInventory() {
    const inventory = await prisma.product.findMany({
        orderBy: { stock: 'asc' }, // Order by lowest stock first
    });

    const outOfStock = inventory.filter(i => i.stock === 0);
    const lowStock = inventory.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold);
    const healthyStock = inventory.filter(i => i.stock > i.lowStockThreshold);

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-playfair text-white italic">Vault Logistics</h1>
                <p className="text-white/40 text-sm mt-1">Real-time inventory intelligence and alerts.</p>
            </header>

            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-effect p-6 rounded-2xl border border-rose-500/20 bg-rose-500/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
                            <AlertOctagon size={20} />
                        </div>
                    </div>
                    <h3 className="text-rose-400/60 text-[10px] uppercase tracking-widest font-bold mb-1">Out of Stock</h3>
                    <p className="text-3xl font-inter font-semibold text-rose-400 tracking-tight">{outOfStock.length}</p>
                </div>
                
                <div className="glass-effect p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
                            <PackageOpen size={20} />
                        </div>
                    </div>
                    <h3 className="text-amber-500/60 text-[10px] uppercase tracking-widest font-bold mb-1">Low Stock Alerts</h3>
                    <p className="text-3xl font-inter font-semibold text-amber-500 tracking-tight">{lowStock.length}</p>
                </div>

                <div className="glass-effect p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <Boxes size={20} />
                        </div>
                    </div>
                    <h3 className="text-emerald-400/60 text-[10px] uppercase tracking-widest font-bold mb-1">Healthy Stock</h3>
                    <p className="text-3xl font-inter font-semibold text-emerald-400 tracking-tight">{healthyStock.length}</p>
                </div>
            </div>

            {/* Critical Inventory List */}
            <div className="glass-effect rounded-2xl border border-white/5 bg-noir-surface/40 overflow-hidden mt-8">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold">Action Required</h2>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5">
                                <th className="px-6 py-5 font-semibold">Product Vault</th>
                                <th className="px-6 py-5 font-semibold">SKU</th>
                                <th className="px-6 py-5 font-semibold">Current Level</th>
                                <th className="px-6 py-5 font-semibold">Status</th>
                                <th className="px-6 py-5 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[...outOfStock, ...lowStock].map((item) => (
                                <tr key={item.id} className="text-sm text-white/70 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-10 h-10 border border-white/10 rounded overflow-hidden shrink-0">
                                                <Image src={parseImages(item.imageUrls)[0] || "/placeholder.jpg"} alt={item.name} fill className="object-cover" />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium group-hover:text-[#C6A972] transition-colors">{item.name}</div>
                                                <div className="text-[10px] text-white/40 tracking-wider uppercase">{item.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-white/30 truncate max-w-[100px]">{item.id}</td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-white text-lg">{item.stock}</span> <span className="text-[10px] text-white/40 uppercase tracking-widest">Units</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.stock === 0 ? (
                                            <span className="text-[9px] uppercase tracking-widest text-rose-400 font-bold border border-rose-500/20 bg-rose-500/10 px-2 py-1 rounded w-fit inline-flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                                                Depleted
                                            </span>
                                        ) : (
                                            <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold border border-amber-500/20 bg-amber-500/10 px-2 py-1 rounded w-fit inline-flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                                Critical
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-[#C6A972] hover:text-black rounded-lg border border-[#C6A972]/10 hover:border-transparent text-[10px] uppercase font-bold tracking-widest transition-all">
                                            Restock
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
