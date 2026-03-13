import { getProductById, getProductsByCategory } from "@/modules/products/product.service";
import ProductViewClient from "@/components/products/ProductViewClient";
import ProductRecommendations from "@/components/products/ProductRecommendations";
import RunwayVideo from "@/components/products/RunwayVideo";
import OutfitBuilder from "@/components/ai/OutfitBuilder";
import ProductReviews from "@/components/products/ProductReviews";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";

import CraftsmanshipStory from "@/components/products/CraftsmanshipStory";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) return { title: "Product Not Found | NOIR" };

    return {
        title: `${product.name} | Maison NOIR`,
        description: `Acquire the ${product.name} from the latest Maison NOIR curation. Express global delivery available.`,
        openGraph: {
            images: [product.images?.[0] || product.image],
        },
    };
}

export default async function ProductPage({ params }) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    // Log view activity (Fire and forget, don't block render)
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
        prisma.customerActivity.create({
            data: {
                userId: session.user.id,
                action: "VIEW_PRODUCT",
                metadata: { productId: product.id, name: product.name }
            }
        }).catch(err => console.error("Error logging view activity:", err));
    }

    // Fetch recommendations from same category
    const recommendations = await getProductsByCategory(product.category);
    const filteredRecs = recommendations.filter(p => p.id !== product.id).slice(0, 4);

    return (
        <main className="min-h-screen bg-noir-black selection:bg-noir-gold/30">
            <div className="max-w-screen-2xl mx-auto px-8 lg:px-24 py-32 lg:py-48">
                <ProductViewClient product={product} />
                <RunwayVideo />
                <CraftsmanshipStory />

                <section className="mt-48 lg:mt-64 relative">
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

                    <div className="pt-24 space-y-24">
                        <header className="text-center space-y-6">
                            <h2 className="text-noir-gold uppercase tracking-[0.6em] text-[10px] font-black">Curated Pairings</h2>
                            <h3 className="text-5xl lg:text-7xl font-playfair text-white italic tracking-tight">Complete the Look</h3>
                        </header>

                        <ProductRecommendations products={filteredRecs} />
                    </div>
                </section>

                {/* Consumer Consensus Pillar */}
                <ProductReviews productId={product.id} />
            </div>
        </main>
    );
}
