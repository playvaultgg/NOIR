const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Initializing Luxury Database Seed ---');

    // 1. CLEAR EXISTING DATA (To avoid duplicates on multiple runs)
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});

    // 2. CREATE ADMIN USER
    const admin = await prisma.user.create({
        data: {
            name: "Gundelwar anup santosh",
            email: "gundelwaranup119@gmail.com",
            role: "ADMIN",
        },
    });
    console.log(`- Created Admin: ${admin.email}`);

    // 3. CREATE MENS PRODUCTS
    const mensProducts = [
        {
            name: "Vantablack Silk Tuxedo",
            brand: "NOIR COUTURE",
            price: 185000,
            imageUrls: [
                "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=2080&auto=format&fit=crop"
            ],
            category: "MENS",
            description: "Our signature tuxedo, crafted from Italian silk and featuring hand-finished peak lapels.",
            stock: 5,
            isFeatured: true
        },
        {
            name: "Cashmere Overcoat",
            brand: "NOIR ARCHIVE",
            price: 125000,
            imageUrls: [
                "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=2072&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1974&auto=format&fit=crop"
            ],
            category: "MENS",
            description: "A timeless charcoal overcoat made from sustainably sourced Loro Piana cashmere.",
            stock: 12,
            isFeatured: false
        },
        {
            name: "Raw Silk Dress Shirt",
            brand: "NOIR",
            price: 35000,
            imageUrls: ["https://images.unsplash.com/photo-1621072156002-e2fcced0b170?q=80&w=1974&auto=format&fit=crop"],
            category: "MENS",
            description: "Minimalist refinement in pure white, featuring custom shell buttons.",
            stock: 20
        },
        {
            name: "Oxblood Leather Loafers",
            brand: "NOIR ATELIER",
            price: 65000,
            imageUrls: ["https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1930&auto=format&fit=crop"],
            category: "MENS",
            description: "Hand-crafted in Tuscany from full-grain oxblood calfskin.",
            stock: 8,
            isFeatured: true
        },
        {
            name: "Onyx Cufflinks",
            brand: "NOIR JEWELRY",
            price: 28000,
            imageUrls: ["https://images.unsplash.com/photo-1620800361250-9d0f41ce38f6?q=80&w=2080&auto=format&fit=crop"],
            category: "MENS",
            description: "Sleek onyx stone set in 18k white gold.",
            stock: 15
        }
    ];

    // 4. CREATE WOMENS PRODUCTS
    const womensProducts = [
        {
            name: "Silk Slip Gown",
            brand: "NOIR COUTURE",
            price: 95000,
            imageUrls: [
                "https://images.unsplash.com/photo-1594744803329-a584af1cae21?q=80&w=1974&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?q=80&w=2070&auto=format&fit=crop"
            ],
            category: "WOMENS",
            description: "An elegant, floor-length midnight black gown in high-gloss silk.",
            stock: 4,
            isFeatured: true
        },
        {
            name: "Trench Coat",
            brand: "NOIR ARCHIVE",
            price: 155000,
            imageUrls: [
                "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2069&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1591361236648-e48684fc1c67?q=80&w=1974&auto=format&fit=crop"
            ],
            category: "WOMENS",
            description: "The classic trench reimagined for the modern nocturnal aesthetic.",
            stock: 7,
            isFeatured: true
        },
        {
            name: "Gold Mesh Choker",
            brand: "NOIR JEWELRY",
            price: 320000,
            imageUrls: ["https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?q=80&w=2070&auto=format&fit=crop"],
            category: "WOMENS",
            description: "A statement piece featuring 24k gold hand-woven mesh.",
            stock: 2,
            isFeatured: true
        },
        {
            name: "Velvet Cocktail Blazer",
            brand: "NOIR",
            price: 82000,
            imageUrls: ["https://images.unsplash.com/photo-1539109132304-d7023639aaaf?q=80&w=1974&auto=format&fit=crop"],
            category: "WOMENS",
            description: "Deep charcoal velvet with structured shoulders.",
            stock: 10
        },
        {
            name: "Stiletto Heels",
            brand: "NOIR ATELIER",
            price: 78000,
            imageUrls: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop"],
            category: "WOMENS",
            description: "Architectural heels crafted in Milan with memory foam for all-night comfort.",
            stock: 15
        }
    ];

    // Bulk create
    await prisma.product.createMany({ data: mensProducts });
    await prisma.product.createMany({ data: womensProducts });

    console.log(`- Created 5 Mens Products`);
    console.log(`- Created 5 Womens Products`);
    console.log('--- Seed completed successfully ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
