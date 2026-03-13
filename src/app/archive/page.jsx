import { getProductsByCategory } from "@/modules/products/product.service";
import MuseumArchiveClient from "@/components/archive/MuseumArchiveClient";
import Footer from "@/components/layout/Footer";

export default async function ArchivePage() {
    // Fetch consolidated collection data
    const mensProducts = await getProductsByCategory("MENS");
    const womensProducts = await getProductsByCategory("WOMENS");
    const allProducts = [...mensProducts, ...womensProducts];

    return (
        <main className="min-h-screen bg-[#050505]">
            <MuseumArchiveClient products={allProducts} />
            <Footer />
        </main>
    );
}
