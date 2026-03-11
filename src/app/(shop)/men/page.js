import ProductGrid from "@/components/shop/ProductGrid";
import { getProductsByCategory } from "@/modules/products/product.service";

export const dynamic = 'force-dynamic';

export default async function MensPage() {
    const mensProducts = await getProductsByCategory('MENS');

    return (
        <main className="bg-black text-white min-h-screen">
            {/* COLLECTION HEADER BANNER */}
            <section className="relative h-[50vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=2070&auto=format&fit=crop"
                        alt="Mens Luxury Banner"
                        className="w-full h-full object-cover grayscale brightness-50"
                    />
                </div>

                <div className="relative z-10 space-y-4">
                    <h2 className="text-gold uppercase tracking-[0.6em] text-[10px] md:text-sm font-inter">
                        Curated Menswear
                    </h2>
                    <h1 className="text-5xl md:text-7xl font-playfair tracking-tight">
                        The Gentlemen's Edit
                    </h1>
                    <p className="max-w-md mx-auto text-[11px] text-white/40 uppercase tracking-widest font-light leading-relaxed">
                        Crafted for the modern visionary who defines luxury
                        through every precise detail.
                    </p>
                </div>
            </section>

            {/* FILTER BAR / NAVIGATION */}
            <div className="sticky top-20 z-30 bg-black/90 backdrop-blur-md border-y border-white/5 py-6 px-6 lg:px-12 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 italic font-inter">{mensProducts.length} ITEMS</span>
                <div className="flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium">
                    <button className="text-gold border-b border-gold/40">Sort by New</button>
                    <button className="hover:text-gold transition-colors">Filters</button>
                </div>
            </div>

            {/* STAGGERED PRODUCT GRID */}
            <section className="px-6 lg:px-12 py-16 lg:py-24">
                <ProductGrid products={mensProducts} />
            </section>
        </main>
    );
}
