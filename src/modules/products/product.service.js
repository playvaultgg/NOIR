import prisma from "@/lib/prisma";

export const MOCK_PRODUCTS = {
    MENS: [
        {
            id: "m1",
            name: "Onyx Silk Trench",
            price: "₹85,000",
            priceAmount: 85000,
            images: [
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000&auto=format&fit=crop"
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
                "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1000&auto=format&fit=crop"
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
                "https://images.unsplash.com/photo-1614144312242-990a886361a8?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1520639889410-1eb419ef5dd0?q=80&w=1000&auto=format&fit=crop"
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
                "https://images.unsplash.com/photo-1624373687551-57c9e611ec9a?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1000&auto=format&fit=crop"
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
                "https://images.unsplash.com/photo-1539008835657-9e8e62f80a4b?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop"
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

/**
 * Enterprise Product Fetcher with Failsafe Redundancy
 */
export async function getProductsByCategory(category) {
    try {
        const products = await prisma.product.findMany({
            where: { category },
            orderBy: { createdAt: "desc" }
        });

        // If no products found in DB yet, use high-end mock curation
        if (products.length === 0) {
            return MOCK_PRODUCTS[category] || [];
        }

        return products;
    } catch (error) {
        console.error(`[Failsafe Mode] Database connection failed for category: ${category}. Loading elite mock curation.`);
        return MOCK_PRODUCTS[category] || [];
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

        if (product) return product;

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
