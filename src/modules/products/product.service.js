import prisma from "@/lib/prisma";
import { parseImages } from "@/lib/utils";

export const MOCK_PRODUCTS = {
    MENS: [
        {
            id: "m1",
            name: "Onyx Silk Trench",
            price: "₹85,000",
            priceAmount: 85000,
            images: [
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 3,
            isLimitedDrop: true,
            category: "MENS"
        },
        {
            id: "m2",
            name: "Noir Cashmere Sweater",
            price: "₹45,000",
            priceAmount: 45000,
            images: [
                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 12,
            isLimitedDrop: false,
            category: "MENS"
        },
        {
            id: "m3",
            name: "Elite Calfskin Boots",
            price: "₹65,000",
            priceAmount: 65000,
            images: [
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 4,
            isLimitedDrop: true,
            category: "MENS"
        },
        {
            id: "m4",
            name: "Shadow Tailored Trousers",
            price: "₹38,000",
            priceAmount: 38000,
            images: [
                "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 8,
            isLimitedDrop: false,
            category: "MENS"
        }
    ],
    WOMENS: [
        {
            id: "w1",
            name: "Velvet Midnight Gown",
            price: "₹120,000",
            priceAmount: 120000,
            images: [
                "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 2,
            isLimitedDrop: true,
            category: "WOMENS"
        },
        {
            id: "w2",
            name: "Argent Pearl Blouse",
            price: "₹52,000",
            priceAmount: 52000,
            images: [
                "https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1534126511673-b6899157ca8d?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 15,
            isLimitedDrop: false,
            category: "WOMENS"
        },
        {
            id: "w3",
            name: "Noir Sculpted Blazer",
            price: "₹92,000",
            priceAmount: 92000,
            images: [
                "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 5,
            isLimitedDrop: true,
            category: "WOMENS"
        },
        {
            id: "w4",
            name: "Satin Pleated Skirt",
            price: "₹42,000",
            priceAmount: 42000,
            images: [
                "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop"
            ],
            stock: 10,
            isLimitedDrop: false,
            category: "WOMENS"
        }
    ]
};

export async function getProductsByCategory(category) {
    try {
        const products = await prisma.product.findMany({
            where: { category },
            orderBy: { createdAt: "desc" }
        });

        // Normalize products
        const normalized = products.map(p => {
            const images = parseImages(p.imageUrls);
            return {
                ...p,
                priceAmount: Number(p.price) || 0,
                price: Number(p.price) || 0,
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"]
            };
        });

        // If no products found in DB yet, use high-end mock curation
        if (normalized.length === 0) {
            return MOCK_PRODUCTS[category] || [];
        }

        return normalized;
    } catch (error) {
        console.error(`[Failsafe Mode] Database connection failed for category: ${category}. Loading elite mock curation.`);
        return MOCK_PRODUCTS[category] || [];
    }
}

/**
 * Enterprise Product Fetcher for the entire Global Catalog
 */
export async function getAllProducts() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" }
        });

        return products.map(p => {
            const images = parseImages(p.imageUrls);
            return {
                ...p,
                priceAmount: Number(p.price) || 0,
                price: Number(p.price) || 0,
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"]
            };
        });
    } catch (error) {
        console.error(`[Failsafe Mode] Database connection failed for all products. Loading consolidated mock curation.`);
        return [...MOCK_PRODUCTS.MENS, ...MOCK_PRODUCTS.WOMENS];
    }
}

/**
 * Retrieves curated featured masterpieces
 */
export async function getFeaturedProducts() {
    try {
        const products = await prisma.product.findMany({
            where: { isFeatured: true },
            take: 12,
            orderBy: { createdAt: "desc" }
        });

        return products.map(p => {
            const images = parseImages(p.imageUrls);
            return {
                ...p,
                priceAmount: Number(p.price) || 0,
                price: Number(p.price) || 0,
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"]
            };
        });
    } catch (error) {
        return MOCK_PRODUCTS.MENS.slice(0, 4);
    }
}

/**
 * Retrieves a single masterpiece by its identifier or slug.
 */
export async function getProductById(id) {
    try {
        const product = await prisma.product.findUnique({
            where: { id }
        });

        if (product) {
            const images = parseImages(product.imageUrls);
            return {
                ...product,
                priceAmount: Number(product.price) || 0,
                price: Number(product.price) || 0,
                images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop"]
            };
        }

        // Failsafe: Search in mock curation if not in database
        const allMocks = [...MOCK_PRODUCTS.MENS, ...MOCK_PRODUCTS.WOMENS];
        const mock = allMocks.find(p => p.id === id || p.name.toLowerCase().replace(/ /g, '-') === id);

        return mock || null;
    } catch (error) {
        console.error(`[Failsafe Mode] Database connection failed for product: ${id}. Attempting mock resolution.`);
        const allMocks = [...MOCK_PRODUCTS.MENS, ...MOCK_PRODUCTS.WOMENS];
        return allMocks.find(p => p.id === id || p.name.toLowerCase().replace(/ /g, '-') === id) || null;
    }
}
