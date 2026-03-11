import HeroSection from "@/components/home/HeroSection";
import ProductCard from "@/components/products/ProductCard";

export default function CollectionsPage() {
    return (
        <div className="pt-24 min-h-screen bg-noir-black text-white px-6 lg:px-12 flex flex-col items-center">
            <div className="max-w-[1600px] w-full text-center mb-16">
                <h2 className="text-gradient-gold uppercase tracking-[0.4em] text-[10px] md:text-sm font-inter mb-4">
                    Luxury Catalog
                </h2>
                <h1 className="text-4xl md:text-6xl font-playfair tracking-tight mb-8">
                    The Full Collections
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-x-12 md:gap-y-16 w-full max-w-[1600px] mx-auto opacity-80 hover:opacity-100 transition-opacity duration-700">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ProductCard key={i} />
                ))}
            </div>
        </div>
    );
}
