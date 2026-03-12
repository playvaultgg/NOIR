import { getProductsByCategory } from "@/modules/products/product.service";
import ProductCard from "@/components/products/ProductCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default async function ArchivePage() {
    // Fetch consolidated collection data
    const mensProducts = await getProductsByCategory("MENS");
    const womensProducts = await getProductsByCategory("WOMENS");
    const allProducts = [...mensProducts, ...womensProducts];

    return (
        <main className="min-h-screen bg-noir-black pt-32 pb-48 px-6 lg:px-24 text-white">
            <Navbar />
            
            <div className="max-w-[1600px] mx-auto">
                <header className="mb-20 space-y-6 text-center lg:text-left pt-20">
                    <div className="flex items-center justify-center lg:justify-start gap-4 text-noir-gold text-[10px] uppercase tracking-[0.5em] font-black italic">
                        <span className="w-1.5 h-1.5 rounded-full bg-noir-gold animate-pulse" />
                        NOIR ARCHIVE / Historical Curation
                    </div>
                    <h1 className="text-4xl md:text-8xl font-playfair text-white tracking-tighter italic">
                        The Heritage Vault
                    </h1>
                    <p className="text-white/20 text-sm lg:text-lg font-inter max-w-2xl italic leading-relaxed">
                        A retrospective look at our most iconic silhouettes. These pieces represent the foundation of Maison NOIR's aesthetic vocabulary.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-24">
                    {allProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                
                {allProducts.length === 0 && (
                    <div className="py-48 text-center text-white/20">
                        <p className="text-[10px] uppercase tracking-[0.5em] font-black italic">Decrypting Archives...</p>
                    </div>
                )}
            </div>
            
            <Footer />
        </main>
    );
}
