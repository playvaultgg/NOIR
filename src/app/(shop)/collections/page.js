import { getProductsByCategory } from "@/modules/products/product.service";
import ProductCard from "@/components/products/ProductCard";
import CollectionClient from "@/components/products/CollectionClient";

export default async function CollectionsPage() {
    // Fetch consolidated collection data
    const mensProducts = await getProductsByCategory("MENS");
    const womensProducts = await getProductsByCategory("WOMENS");
    const allProducts = [...mensProducts, ...womensProducts];

    return (
        <main className="min-h-screen bg-noir-black pt-32 pb-48 px-6 lg:px-24">
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-20 space-y-6 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-pulse" />
                        A/W 2026 / Global Catalog
                    </div>
                    <h1 className="text-4xl md:text-8xl font-playfair text-white tracking-tighter italic">
                        The Masterpieces
                    </h1>
                    <p className="text-white/20 text-sm lg:text-lg font-inter max-w-2xl italic leading-relaxed">
                        Curate your digital identity from our curated archives of hand-tailored silhouettes and artisanal textures.
                    </p>
                </header>

                <CollectionClient initialProducts={allProducts} />
                
                {allProducts.length === 0 && (
                    <div className="py-48 text-center text-white/20">
                        <p className="text-[10px] uppercase tracking-[0.5em] font-black italic">Synchronizing Archive...</p>
                    </div>
                )}
            </div>
        </main>
    );
}
