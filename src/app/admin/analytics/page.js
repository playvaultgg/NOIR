"use client";

import { useEffect, useState } from "react";
import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, ShoppingBag, Users, Package, RefreshCw } from "lucide-react";

const GOLD = "#C6A972";
const PIE_COLORS = ["#C6A972", "#fff", "#888", "#444", "#333"];

/* ─── Custom Tooltip ────────────────────────────────────────── */
function CustomTooltip({ active, payload, label, prefix = "₹" }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "rgba(10,10,10,0.9)", border: "1px solid rgba(198,169,114,0.3)", borderRadius: 12, padding: "10px 16px" }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 4 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || GOLD, fontSize: 14, fontWeight: 700 }}>
                    {prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
                </p>
            ))}
        </div>
    );
}

/* ─── Stat Card ─────────────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, sub }) {
    return (
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-xl bg-[#C6A972]/10 flex items-center justify-center text-[#C6A972] shrink-0">
                <Icon size={18} />
            </div>
            <div>
                <p className="text-white/30 text-[9px] uppercase tracking-widest mb-1">{label}</p>
                <p className="text-white text-2xl font-bold">{value}</p>
                {sub && <p className="text-white/20 text-[9px] mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

/* ─── Main Page ─────────────────────────────────────────────── */
export default function AnalyticsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/analytics");
            if (!res.ok) throw new Error("Failed");
            const json = await res.json();
            setData(json);
            setError(null);
        } catch {
            setError("Could not load analytics data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    /* Pie chart data from ordersByStatus */
    const pieData = data
        ? Object.entries(data.ordersByStatus || {}).map(([name, value]) => ({ name, value }))
        : [];

    /* Revenue chart — shorten dates to "Mar 12" format */
    const revenueData = (data?.revenueByDay || []).map((d) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
    })).filter((_, i) => i % 3 === 0); // show every 3rd day to avoid clutter

    return (
        <div className="space-y-8 text-white">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-playfair italic">Analytics Engine</h1>
                    <p className="text-white/30 text-sm mt-1">Real-time revenue, orders, and product performance.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-xl text-white/40 text-xs uppercase tracking-widest hover:text-[#C6A972] hover:border-[#C6A972]/40 transition-all"
                >
                    <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    Refresh
                </button>
            </header>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                    {error} — Using mock data below.
                </div>
            )}

            {/* ── Summary Stats ── */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" icon={TrendingUp}
                    value={`₹${((data?.summary?.totalRevenue || 0) / 100).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                    sub="All time" />
                <StatCard label="Total Orders" icon={ShoppingBag}
                    value={(data?.summary?.totalOrders || 0).toLocaleString()}
                    sub="All statuses" />
                <StatCard label="Customers" icon={Users}
                    value={(data?.summary?.totalUsers || 0).toLocaleString()}
                    sub="Registered" />
                <StatCard label="Products" icon={Package}
                    value={(data?.summary?.totalProducts || 0).toLocaleString()}
                    sub="In catalog" />
            </div>

            {/* ── Revenue Chart ── */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-1">Revenue (30 Days)</h2>
                        <p className="text-white/30 text-xs">Daily revenue excluding cancelled orders</p>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={revenueData.length > 0 ? revenueData : mockRevenueData}>
                        <defs>
                            <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false}
                            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#goldGrad)" dot={false} activeDot={{ r: 4, fill: GOLD }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* ── Order Status Pie ── */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-6">Orders by Status</h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {pieData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip prefix="" />} />
                                <Legend formatter={(v) => <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em" }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        /* Fallback mock */
                        <div className="flex items-center justify-center h-48 text-white/20 text-sm italic">No order data yet</div>
                    )}
                </div>

                {/* ── Top Products Bar Chart ── */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-6">Top Products by Units Sold</h2>
                    {data?.topProducts?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data.topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" width={100} tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip prefix="" />} />
                                <Bar dataKey="count" fill={GOLD} radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-white/20 text-sm italic">No sales data yet</div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Mock Revenue Data (shown when API returns 0 data) ─────── */
const mockRevenueData = [
    { date: "Mar 1", revenue: 0 },
    { date: "Mar 3", revenue: 45000 },
    { date: "Mar 6", revenue: 82000 },
    { date: "Mar 9", revenue: 61000 },
    { date: "Mar 12", revenue: 120000 },
];
