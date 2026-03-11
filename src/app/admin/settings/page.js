import { Settings2, CreditCard, Paintbrush, Percent, Truck, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminSettings() {
    return (
        <div className="space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-playfair text-white italic">System Configuration</h1>
                <p className="text-white/40 text-sm mt-1">Adjust global parameters and integrations.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    { label: "Payment Gateways", icon: CreditCard, desc: "Configure Stripe, Razorpay routing protocols.", active: true },
                    { label: "Brand Stylometry", icon: Paintbrush, desc: "Update logos, colors, typography tokens.", active: false },
                    { label: "Discount Engines", icon: Percent, desc: "Create Black Friday or seasonal drops.", active: true },
                    { label: "Logistics Routing", icon: Truck, desc: "Shipping zones, warehouse APIs, carriers.", active: true },
                    { label: "Company Profile", icon: Building2, desc: "Legal entities, tax IDs, invoice addresses.", active: false },
                    { label: "Advanced Rules", icon: Settings2, desc: "Clear caches, database indices, webhooks.", active: false },
                ].map((setting, i) => (
                    <div key={i} className="glass-effect p-6 rounded-2xl border border-white/5 bg-noir-surface/40 group hover:border-white/20 transition-all cursor-pointer">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-white/5 rounded-xl text-white/70 group-hover:text-[#C6A972] transition-colors">
                                <setting.icon size={20} />
                            </div>
                            {setting.active ? (
                                <span className="text-[9px] uppercase tracking-widest text-[#C6A972] font-bold px-2 py-1 bg-[#C6A972]/10 rounded border border-[#C6A972]/20">Active</span>
                            ) : (
                                <span className="text-[9px] uppercase tracking-widest text-white/30 font-bold px-2 py-1 bg-white/5 rounded border border-white/5">Dormant</span>
                            )}
                        </div>
                        <h3 className="text-white text-sm font-bold mb-1 group-hover:text-[#C6A972] transition-colors">{setting.label}</h3>
                        <p className="text-white/40 text-xs leading-relaxed">{setting.desc}</p>
                    </div>
                ))}
            </div>

            {/* Mock Global Save */}
            <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                <button className="bg-[#C6A972] text-black hover:bg-white transition-colors duration-300 px-6 py-3 rounded-xl text-[10px] uppercase tracking-widest font-bold">
                    Deploy Configuration
                </button>
            </div>
        </div>
    );
}
