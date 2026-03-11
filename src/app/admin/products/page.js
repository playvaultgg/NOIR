import prisma from "@/lib/prisma";
import { Plus, Search, Edit3, Trash2, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
    const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-white italic">Product Registry</h1>
                    <p className="text-white/40 text-sm mt-1">Manage the Maison Noir catalog.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C6A972] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search catalog..."
                            className="bg-noir-surface/40 border border-white/5 focus:border-[#C6A972] outline-none text-white text-sm pl-12 pr-4 py-2.5 rounded-xl transition-all"
                        />
                    </div>
                    <button className="bg-[#C6A972] text-black hover:bg-white transition-colors duration-300 px-5 py-2.5 rounded-xl text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                        <Plus size={16} />
                        Add Product
                    </button>
                </div>
            </header>

            <div className="glass-effect rounded-2xl border border-white/5 bg-noir-surface/40 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 bg-black/20">
                                <th className="px-6 py-5 font-semibold">Item</th>
                                <th className="px-6 py-5 font-semibold">Category</th>
                                <th className="px-6 py-5 font-semibold">Stock</th>
                                <th className="px-6 py-5 font-semibold">Price</th>
                                <th className="px-6 py-5 font-semibold">Status</th>
                                <th className="px-6 py-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map((product) => (
                                <tr key={product.id} className="text-sm text-white/70 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12 bg-white/5 rounded-lg overflow-hidden shrink-0 border border-white/10">
                                                <Image 
                                                    src={product.imageUrls[0]} 
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="text-white font-medium group-hover:text-[#C6A972] transition-colors">{product.name}</div>
                                                <div className="text-[10px] text-white/30 tracking-widest uppercase">{product.brand || "NOIR"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs tracking-wider uppercase text-white/40">{product.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-[10px] rounded-md font-bold ${
                                            product.stock > 10 ? "bg-white/5 text-white/60" : "bg-red-500/10 text-red-400"
                                        }`}>
                                            {product.stock} Units
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#C6A972]">₹{product.price.toLocaleString('en-IN')}</td>
                                    <td className="px-6 py-4">
                                        {product.isFeatured ? (
                                            <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 rounded w-fit">
                                                Featured
                                            </span>
                                        ) : (
                                            <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold border border-white/5 bg-white/5 px-2 py-1 rounded w-fit">
                                                Standard
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 hover:bg-[#C6A972] hover:text-black hover:border-transparent transition-colors rounded-lg text-white/60" title="Edit">
                                                <Edit3 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-red-500/20 rounded-lg text-white/60 hover:text-red-400 transition-colors" title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                            <button className="p-2 hover:bg-[#C6A972] hover:text-black hover:border-transparent transition-colors rounded-lg text-white/60" title="More">
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
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
