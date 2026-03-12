"use server";

import prisma from "@/lib/prisma";

/**
 * Maison NOIR AI Recommendation Engine
 * Core Logic for Phase 9 Predictive Merchandising.
 */

// Formats DB product for the luxury ProductCard UI
function formatProduct(dbProduct) {
    if (!dbProduct) return null;
    return {
        ...dbProduct,
        images: dbProduct.imageUrls, // Map for UI compatibility
        priceAmount: dbProduct.price,
        price: dbProduct.price, // Keep as number for CurrencyContext to handle
    };
}

/**
 * Personalized Curation Logic
 * Simulates neural analysis of user behavior and catalog metadata.
 */
export async function getPersonalizedCuration(userId, limit = 4) {
    // In a production environment, this would query a Vector DB (Pinecone/Weaviate)
    // Here we query our Prisma Postgres DB securely from the server.
    const allProducts = await prisma.product.findMany({
        take: 20,
    });
    
    // Shuffle and pick simulating intelligent curation
    const selected = allProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
        
    return selected.map(formatProduct);
}

/**
 * "Complete the Look" Cross-Sell Protocol
 * Matches complimentary categories (e.g., Trench + Boots).
 */
export async function getComplimentaryProducts(productId) {
    const currentProduct = await prisma.product.findUnique({
        where: { id: productId },
    });
    
    if (!currentProduct) return [];

    // Simple association logic: Recommend complementary pieces
    const related = await prisma.product.findMany({
        where: {
            category: currentProduct.category,
            id: { not: productId }
        },
        take: 2
    });
    
    return related.map(formatProduct);
}

/**
 * Semantic Interaction Filter
 * Uses natural language heuristics to map intent to database fields.
 */
export async function semanticSearch(query) {
    const q = query.toLowerCase();
    
    let searchConditions = [
        { name: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } }
    ];
    
    // Simulated Semantic Expansion Rules (Intent mapping over keywords)
    if (q.includes("minimalist") || q.includes("clean") || q.includes("simple")) {
        searchConditions.push({ brand: { contains: "ARCHIVE", mode: "insensitive" } });
        searchConditions.push({ description: { contains: "clean lines", mode: "insensitive" } });
    }
    
    if (q.includes("black") || q.includes("onyx") || q.includes("midnight") || q.includes("dark")) {
        searchConditions.push({ name: { contains: "Black", mode: "insensitive" } });
        searchConditions.push({ name: { contains: "Onyx", mode: "insensitive" } });
        searchConditions.push({ description: { contains: "dark", mode: "insensitive" } });
    }

    if (q.includes("formal") || q.includes("luxury") || q.includes("tailored")) {
        searchConditions.push({ brand: { contains: "COUTURE", mode: "insensitive" } });
        searchConditions.push({ description: { contains: "tailored", mode: "insensitive" } });
    }

    const matchedProducts = await prisma.product.findMany({
        where: {
            OR: searchConditions
        },
        take: 8
    });

    return matchedProducts.map(formatProduct);
}
