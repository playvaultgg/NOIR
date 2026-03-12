import { Search, Filter, MoreHorizontal, CheckCircle2, PackageSearch, XCircle, Clock, Truck } from "lucide-react";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import { useCurrency } from "@/context/CurrencyContext";

export default function OrderTableClient({ initialOrders }) {
    const { formatPrice } = useCurrency();
    const [orders, setOrders] = useState(initialOrders);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);

    const getStatusIcon = (status) => {
        switch (status) {
            case "DELIVERED": return <CheckCircle2 size={14} className="text-emerald-400" />;
            case "PENDING": return <Clock size={14} className="text-amber-400" />;
            case "CANCELLED": return <XCircle size={14} className="text-rose-400" />;
            case "REFUNDED": return <RefreshCcw size={14} className="text-purple-400" />;
            case "PROCESSING": return <PackageSearch size={14} className="text-amber-200" />;
            default: return <Truck size={14} className="text-blue-400" />;
        }
    };

    const handleUpdateOrder = (updatedOrder) => {
        setOrders(orders.map(o => o.id === updatedOrder.id ? { ...o, ...updatedOrder } : o));
    };

    const filteredOrders = orders.filter(o => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-playfair text-white italic">Order Registry</h1>
                    <p className="text-white/40 text-sm mt-1">Review transactions and fulfillment status.</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#C6A972] transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-noir-surface/40 border border-white/5 focus:border-[#C6A972] outline-none text-white text-sm pl-12 pr-4 py-2.5 rounded-xl transition-all w-64"
                        />
                    </div>
                    <button className="bg-white/5 text-white/70 hover:bg-[#C6A972] hover:text-black hover:border-[#C6A972] transition-colors duration-300 px-5 py-2.5 rounded-xl border border-white/10 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2">
                        <Filter size={16} />
                        Filter
                    </button>
                </div>
            </header>

            <div className="glass-effect rounded-2xl border border-white/5 bg-noir-surface/40 overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="text-[9px] uppercase tracking-widest text-white/30 border-b border-white/5 bg-black/20">
                                <th className="px-6 py-5 font-semibold">Order Hash</th>
                                <th className="px-6 py-5 font-semibold">Client Identity</th>
                                <th className="px-6 py-5 font-semibold">Date</th>
                                <th className="px-6 py-5 font-semibold">Status</th>
                                <th className="px-6 py-5 font-semibold">Total</th>
                                <th className="px-6 py-5 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-white/20 text-sm italic">
                                        No matching orders discovered.
                                    </td>
                                </tr>
                            ) : filteredOrders.map((order) => (
                                <tr key={order.id} className="text-sm text-white/70 hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4 font-mono text-xs text-white/50">{order.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium group-hover:text-[#C6A972] transition-colors">{order.user?.name || "Guest Client"}</div>
                                        <div className="text-[10px] text-white/30 truncate max-w-[150px]">{order.user?.email || "Unknown"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-xs tracking-wider uppercase text-white/40">
                                        {new Date(order.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md w-fit border ${
                                            order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            order.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            order.status === "CANCELLED" ? "bg-rose-500/10 text-rose-400 border-rose-500/20" :
                                            order.status === "REFUNDED" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" :
                                            order.status === "PROCESSING" ? "bg-amber-200/10 text-amber-200 border-amber-200/20" :
                                            "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        }`}>
                                            {getStatusIcon(order.status)}
                                            <span className="text-[9px] uppercase tracking-widest font-bold">{order.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#C6A972]">{formatPrice(order.totalAmount)} <span className="text-[10px] text-white/30 uppercase">({order._count.items} items)</span></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => setSelectedOrder(order)}
                                                className="px-4 py-2 hover:bg-[#C6A972] hover:text-black hover:border-transparent border border-white/5 rounded-lg transition-all text-[10px] uppercase font-black tracking-widest"
                                            >
                                                Update
                                            </button>
                                            <button className="p-2 hover:bg-[#C6A972] hover:text-black hover:border-transparent transition-colors rounded-lg" title="More">
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

            {selectedOrder && (
                <UpdateOrderStatusModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                    onUpdate={handleUpdateOrder}
                />
            )}
        </div>
    );
}

// Icon for refund that was missing in previous file but exists in lucide-react
function RefreshCcw(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    )
}
