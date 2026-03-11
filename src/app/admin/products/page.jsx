"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit2,
    Trash2,
    Eye,
    Package,
    ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { getProductsByCategory } from "@/modules/products/product.service";

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function load() {
            // In a real scenario, we'd have a specific admin fetcher, 
            // but we'll use the service for now.
            const mens = await getProductsByCategory("MENS");
            const womens = await getProductsByCategory("WOMENS");
            setProducts([...mens, ...womens]);
            setIsLoading(false);
        }
        load();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-12">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/5">
                <div className="space-y-2">
                    <h2 className="text-noir-gold uppercase tracking-[0.4em] text-[10px] font-bold">Catalog Control</h2>
                    <h1 className="text-4xl font-playfair text-white tracking-tight">Product Archive</h1>
                </div>
                <Link href="/admin/products/new">
                    <button className="bg-white text-noir-black px-8 py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] font-black hover:bg-noir-gold transition-all shadow-xl flex items-center gap-3 group">
                        Launch New Creation
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    </button>
                </Link>
            </header>

            {/* Management Toolbar */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="relative group flex-1">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-noir-gold transition-colors" size={18} />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search collection by name or identifier..."
                        className="w-full bg-noir-surface/40 border border-white/5 px-16 py-5 rounded-2xl text-[11px] uppercase tracking-widest outline-none focus:border-noir-gold/20 transition-all font-inter text-white/60 placeholder:text-white/20"
                    />
                </div>
                <button className="glass-effect bg-white/5 border border-white/5 px-8 py-5 rounded-2xl text-[11px] uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-3">
                    <Filter size={18} />
                    Filter
                </button>
            </div>

            {/* Products Table Suite */}
            <div className="glass-effect bg-noir-surface/40 rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Masterpiece</th>
                            <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Category</th>
                            <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Price</th>
                            <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30">Stock Status</th>
                            <th className="px-8 py-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/30 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-4 opacity-20">
                                        <div className="w-8 h-8 border-2 border-noir-gold border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[10px] uppercase tracking-widest">Accessing Curation...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredProducts.map((product) => (
                            <tr key={product.id} className="group hover:bg-white/[0.03] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-20 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 relative group-hover:scale-105 transition-transform duration-500">
                                            <img src={product.images?.[0]} className="w-full h-full object-cover grayscale-[20%]" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Eye size={16} className="text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-playfair text-white tracking-wide">{product.name}</p>
                                            <p className="text-[9px] uppercase tracking-widest text-white/20 mt-1">ID: {product.id.slice(-6)}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-[10px] uppercase tracking-widest text-white/40">{product.category}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-xs font-inter text-noir-gold font-bold tracking-widest">{product.price}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-1.5 h-1.5 rounded-full ${product.stock <= 5 ? "bg-red-500 animate-pulse" : "bg-green-500/60"}`} />
                                        <span className={`text-[10px] uppercase tracking-widest ${product.stock <= 5 ? "text-red-500" : "text-white/40"}`}>
                                            {product.stock} in inventory
                                        </span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-white/40 hover:text-white transition-all shadow-lg" title="Edit Masterpiece">
                                            <Edit2 size={14} />
                                        </button>
                                        <button className="p-3 bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 rounded-xl text-red-500/40 hover:text-red-500 transition-all shadow-lg" title="Decommission">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
