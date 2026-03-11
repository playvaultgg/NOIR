"use client";

import { useState } from "react";
import {
    Package,
    User,
    Heart,
    Settings,
    LogOut,
    ChevronRight,
    Clock,
    ShieldCheck
} from "lucide-react";

const ORDER_HISTORY = [
    { id: "ORD-9281", date: "Oct 24, 2025", total: "$1,250.00", status: "Delivered" },
    { id: "ORD-8742", date: "Sep 15, 2025", total: "$750.00", status: "Shipped" },
    { id: "ORD-7633", date: "Aug 02, 2025", total: "$2,400.00", status: "Delivered" },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState("orders");

    return (
        <div className="min-h-screen bg-black pt-24 pb-12 px-6 lg:px-12 flex flex-col lg:flex-row gap-8">

            {/* SIDEBAR NAVIGATION */}
            <aside className="w-full lg:w-72 flex flex-col pt-8">
                <div className="mb-12">
                    <h2 className="text-sm uppercase tracking-[0.4em] text-gold font-inter mb-4">My Dashboard</h2>
                    <h3 className="text-2xl font-playfair text-white">Alexander S.</h3>
                </div>

                <nav className="flex flex-col gap-4">
                    <NavItem
                        icon={<Package size={18} />}
                        label="Order History"
                        active={activeTab === "orders"}
                        onClick={() => setActiveTab("orders")}
                    />
                    <NavItem
                        icon={<User size={18} />}
                        label="Profile"
                        active={activeTab === "profile"}
                        onClick={() => setActiveTab("profile")}
                    />
                    <NavItem
                        icon={<Heart size={18} />}
                        label="Wishlist"
                        active={activeTab === "wishlist"}
                        onClick={() => setActiveTab("wishlist")}
                    />
                    <NavItem
                        icon={<Settings size={18} />}
                        label="Settings"
                        active={activeTab === "settings"}
                        onClick={() => setActiveTab("settings")}
                    />

                    <button className="flex items-center gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-medium text-white/40 hover:text-red-400 transition-all border border-transparent mt-8">
                        <LogOut size={18} />
                        Log Out
                    </button>
                </nav>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-grow pt-8">
                <div className="glass-effect rounded-[24px] p-8 lg:p-12 min-h-[600px]">

                    {activeTab === "orders" && (
                        <section className="space-y-12">
                            <header className="flex items-center justify-between">
                                <h4 className="text-2xl font-playfair text-white">Order History</h4>
                                <button className="text-[10px] uppercase tracking-[0.2em] text-gold border-b border-gold/40 pb-1">Filter All Time</button>
                            </header>

                            <div className="overflow-x-auto no-scrollbar">
                                <table className="w-full text-left">
                                    <thead className="border-b border-white/5">
                                        <tr>
                                            <th className="pb-6 text-[10px] uppercase tracking-widest text-white/30 font-medium font-inter">Order ID</th>
                                            <th className="pb-6 text-[10px] uppercase tracking-widest text-white/30 font-medium font-inter">Date</th>
                                            <th className="pb-6 text-[10px] uppercase tracking-widest text-white/30 font-medium font-inter">Total</th>
                                            <th className="pb-6 text-[10px] uppercase tracking-widest text-white/30 font-medium font-inter">Status</th>
                                            <th className="pb-6"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {ORDER_HISTORY.map((order) => (
                                            <tr key={order.id} className="group cursor-pointer hover:bg-white/5 transition-all">
                                                <td className="py-8 text-[11px] uppercase tracking-widest text-white font-medium">{order.id}</td>
                                                <td className="py-8 text-sm text-white/60 font-inter">{order.date}</td>
                                                <td className="py-8 text-[11px] uppercase tracking-[0.1em] text-white font-bold">{order.total}</td>
                                                <td className="py-8">
                                                    <span className={`px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold ${order.status === "Delivered" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-gold/10 text-gold border border-gold/20"
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="py-8 text-right pr-4">
                                                    <ChevronRight size={16} className="text-white/20 group-hover:text-gold transition-colors ml-auto" />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {ORDER_HISTORY.length === 0 && (
                                <div className="h-64 flex flex-col items-center justify-center opacity-30">
                                    <Package size={48} strokeWidth={1} />
                                    <p className="mt-4 text-[10px] uppercase tracking-[0.3em]">No orders found</p>
                                </div>
                            )}
                        </section>
                    )}

                    {activeTab !== "orders" && (
                        <div className="h-full flex items-center justify-center text-center py-20 opacity-20">
                            <div>
                                <ShieldCheck size={48} strokeWidth={1} className="mx-auto" />
                                <p className="mt-4 text-[10px] uppercase tracking-[0.3em]">{activeTab} Section coming soon</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* TRUST BADGE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="glass-effect rounded-[20px] p-6 flex items-center gap-6">
                        <div className="bg-gold/10 p-3 rounded-full text-gold">
                            <ShieldCheck size={20} />
                        </div>
                        <div>
                            <h5 className="text-[11px] uppercase tracking-widest text-white font-bold">Secure Gateway</h5>
                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">All transactions encrypted via RSA-4096</p>
                        </div>
                    </div>
                    <div className="glass-effect rounded-[20px] p-6 flex items-center gap-6">
                        <div className="bg-gold/10 p-3 rounded-full text-gold">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h5 className="text-[11px] uppercase tracking-widest text-white font-bold">Priority Support</h5>
                            <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">Dedicated concierge for dashboard users</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 px-6 py-4 text-[11px] uppercase tracking-[0.3em] font-medium transition-all border border-transparent ${active
                    ? "text-gold bg-gold/5 border-gold/10 rounded-xl"
                    : "text-white/40 hover:text-white"
                }`}
        >
            {icon}
            {label}
        </button>
    );
}
