"use client";

import {
    AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, ShoppingBag, Users, Package } from "lucide-react";

const GOLD = "#C6A972";
const PIE_COLORS = ["#C6A972", "#888", "#555", "#333", "#222"];

function CustomTooltip({ active, payload, label, prefix = "₹" }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{ background: "rgba(10,10,10,0.95)", border: "1px solid rgba(198,169,114,0.3)", borderRadius: 12, padding: "10px 16px" }}>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.3em", marginBottom: 4 }}>{label}</p>
            {payload.map((p, i) => (
                <p key={i} style={{ color: p.color || GOLD, fontSize: 14, fontWeight: 700 }}>
                    {prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-IN") : p.value}
                </p>
            ))}
        </div>
    );
}

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

export default function AnalyticsCharts({ data }) {
    const {
        revenueByDay = [],
        ordersByStatus = {},
        topProducts = [],
        summary = {}
    } = data || {};

    const pieData = Object.entries(ordersByStatus).map(([name, value]) => ({ name, value }));

    const revenueData = revenueByDay
        .filter((_, i) => i % 3 === 0)
        .map((d) => ({
            ...d,
            date: new Date(d.date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        }));

    return (
        <div className="space-y-8 text-white">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" icon={TrendingUp}
                    value={`₹${Number(summary.totalRevenue || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
                    sub="All time" />
                <StatCard label="Total Orders" icon={ShoppingBag}
                    value={String(summary.totalOrders || 0)} sub="All statuses" />
                <StatCard label="Customers" icon={Users}
                    value={String(summary.totalUsers || 0)} sub="Registered" />
                <StatCard label="Products" icon={Package}
                    value={String(summary.totalProducts || 0)} sub="In catalog" />
            </div>

            {/* Revenue Chart */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
                <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-1">Revenue — Last 30 Days</h2>
                <p className="text-white/25 text-xs mb-6">Daily revenue (excluding cancelled orders)</p>
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={revenueData.length ? revenueData : MOCK_REVENUE}>
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
                        <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2}
                            fill="url(#goldGrad)" dot={false} activeDot={{ r: 4, fill: GOLD }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Status Pie */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-6">Orders by Status</h2>
                    {pieData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                                    {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip prefix="" />} />
                                <Legend formatter={(v) => <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em" }}>{v}</span>} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-white/20 text-sm italic">No order data yet — place your first order to see stats</p>
                        </div>
                    )}
                </div>

                {/* Top Products Bar */}
                <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-7">
                    <h2 className="text-[10px] uppercase tracking-widest text-[#C6A972] font-bold mb-6">Top Products by Units Sold</h2>
                    {topProducts.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={topProducts} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }} axisLine={false} tickLine={false} />
                                <YAxis type="category" dataKey="name" width={110}
                                    tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 9 }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip prefix="" />} />
                                <Bar dataKey="count" fill={GOLD} radius={[0, 6, 6, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-white/20 text-sm italic">No sales data yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const MOCK_REVENUE = [
    { date: "Mar 1", revenue: 0 },
    { date: "Mar 4", revenue: 45000 },
    { date: "Mar 7", revenue: 82000 },
    { date: "Mar 10", revenue: 61000 },
    { date: "Mar 12", revenue: 0 },
];
