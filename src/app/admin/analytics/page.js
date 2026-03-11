import prisma from "@/lib/prisma";
import { AreaChart, BarChart } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAnalytics() {
    const products = await prisma.product.findMany({
        take: 3,
        orderBy: { orders: { _count: 'desc' } },
        include: { _count: { select: { orders: true, wishedBy: true } } }
    });

    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-playfair text-white italic">Analytics Engine</h1>
                <p className="text-white/40 text-sm mt-1">Deep metrics and dimensional growth tracking.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Advanced Mock Chart 1 */}
                <div className="glass-effect p-8 rounded-2xl border border-white/5 bg-noir-surface/40 flex flex-col justify-between h-[400px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold">Conversion Rate matrix</h2>
                            <div className="text-3xl font-inter text-white mt-2">4.2%</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-white/40">
                            <AreaChart size={20} />
                        </div>
                    </div>
                    
                    <div className="flex items-end justify-between h-48 gap-3 pt-4 border-b border-white/5">
                        {[15, 25, 20, 35, 30, 50, 45, 60, 55, 80, 75, 95].map((height, idx) => (
                            <div key={idx} className="w-full flex justify-center group h-full items-end pb-2">
                                <div 
                                    className="w-full max-w-[12px] bg-white/10 rounded-full group-hover:bg-[#C6A972] transition-colors relative"
                                    style={{ height: `${height}%` }}
                                >
                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[9px] text-[#C6A972] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {height}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pt-4 flex justify-between text-[9px] uppercase tracking-widest text-white/30">
                        <span>Jan</span>
                        <span>Dec</span>
                    </div>
                </div>

                {/* Advanced Mock Chart 2 */}
                <div className="glass-effect p-8 rounded-2xl border border-white/5 bg-noir-surface/40 flex flex-col justify-between h-[400px]">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold">Category Distribution</h2>
                            <div className="text-white/40 text-sm mt-1">Sales by sector</div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-white/40">
                            <BarChart size={20} />
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center gap-6">
                        {[ 
                            { label: "Menswear", value: 65, color: "bg-[#C6A972]" },
                            { label: "Womenswear", value: 82, color: "bg-white" },
                            { label: "Accessories", value: 45, color: "bg-white/40" },
                            { label: "Virtual Assets", value: 28, color: "bg-white/10" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
                                    <span className="text-white/60">{stat.label}</span>
                                    <span className="text-white">{stat.value}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${stat.color} rounded-full transition-all duration-1000`} style={{ width: `${stat.value}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Performers */}
                <div className="lg:col-span-2 glass-effect p-8 rounded-2xl border border-white/5 bg-noir-surface/40">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-6 border-b border-white/5 pb-4">Top Performing Products</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {products.map((product, i) => (
                            <div key={product.id} className="p-4 bg-white/[0.02] rounded-xl border border-white/5 flex gap-4">
                                <div className="text-[#C6A972] font-playfair text-2xl font-black italic">
                                    0{i + 1}
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-bold truncate max-w-[150px]">{product.name}</h4>
                                    <p className="text-[#C6A972] text-xs font-mono mt-1">₹{product.price.toLocaleString('en-IN')}</p>
                                    <div className="flex gap-4 mt-3">
                                        <div className="text-[9px] uppercase tracking-widest text-white/40">
                                            <strong className="text-white font-mono">{product._count.orders}</strong> Sales
                                        </div>
                                        <div className="text-[9px] uppercase tracking-widest text-white/40">
                                            <strong className="text-white font-mono">{product._count.wishedBy}</strong> Hearts
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
