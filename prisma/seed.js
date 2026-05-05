require('dotenv').config();
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');
const pg = require('pg');
const bcrypt = require('bcryptjs');

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BRANDS = ["NOIR COUTURE", "NOIR ARCHIVE", "NOIR ATELIER", "NOIR JEWELRY", "NOIR BEAUTY", "NOIR HOROLOGY"];
const ADJECTIVES = ["Midnight", "Imperial", "Vantablack", "Elite", "Royal", "Signature", "Obsidian", "Silk", "Cashmere", "Velvet", "Artisan", "Bespoke", "Majestic", "Aureate", "Lustrous", "Ethereal", "Sovereign", "Grand", "Couture", "Limited", "Gilded", "Nocturnal", "Celestial", "Opulent", "Timeless"];
const NOUNS = ["Tuxedo", "Gown", "Chronograph", "Necklace", "Blazer", "Trousers", "Loafers", "Overcoat", "Bracelet", "Signet Ring", "Extract", "Tote", "Chelsea Boots", "Evening Dress", "Silk Shirt", "Clutch", "Timepiece", "Pendant", "Earrings", "Scarf", "Cufflinks"];
const CATEGORIES = ["HAUTE COUTURE", "HOROLOGY", "LEATHER GOODS", "FRAGRANCE", "EYEWEAR", "ARCHITECTURE", "FOOTWEAR", "MENSWEAR", "WOMENSWEAR"];

// CLEANED AND EXPANDED VERIFIED IDS
const LUXURY_IDS = [
  "1613909671501-f9678ffc1d33", "1483985988355-763728e1935b", "1517841905240-472988babdf9", "1512436991641-6745cdb1723f", "1492707892479-7bc8d5a4ee93",
  "1515886657613-9f3515b0c78f", "1591348278863-a8fb3887e2aa", "1549439602-43ebca2327af", "1551488831-00ddcb6c6bd3", "1487222477894-8943e31ef7b2",
  "1496747611176-843222e1e57c", "1469334031218-e382a71b716b", "1485230895905-ec40ba36b9bc", "1558769132-cb1aea458c5e", "1509631179647-0177331693ae",
  "1537832816519-689ad163238b", "1503342217505-b0a15ec3261c", "1475180098004-ca77a66827be", "1589363358751-ab05797e5629", "1616348490852-d80c545b4f79",
  "1591884807235-1dc6c2e148b1", "1596383040747-04d23d5437be", "1608461864721-b8f50c91c147", "1519748771451-a94c596fad67", "1676914333302-53615f404416",
  "1665815844395-06f64f44b5e3", "1589363460779-cd717d2ed8fa"
];

async function main() {
    console.log('--- Initializing Absolute Unique 550+ Luxury Database Seed ---');

    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    
    const hashedPassword = await bcrypt.hash("AdminPassword123!", 12);
    await prisma.user.create({
        data: {
            name: "Gundelwar anup santosh",
            email: "gundelwaranup119@gmail.com",
            password: hashedPassword,
            role: "ADMIN",
        },
    });

    const products = [];
    const usedSlugs = new Set();

    for (let i = 0; i < 550; i++) {
        const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
        const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
        const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
        const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
        
        let name = `${adj} ${noun}`;
        let slug = name.toLowerCase().replace(/ /g, '-');
        let counter = 1;
        while (usedSlugs.has(slug)) {
            name = `${adj} ${noun} ${String.fromCharCode(65 + (counter % 26))}${counter > 25 ? Math.floor(counter/26) : ""}`;
            slug = name.toLowerCase().replace(/ /g, '-');
            counter++;
        }
        usedSlugs.add(slug);

        const price = Math.floor(Math.random() * 1475000) + 25000;
        
        const photoId = LUXURY_IDS[i % LUXURY_IDS.length];
        const imageUrl = `https://images.unsplash.com/photo-${photoId}?q=80&w=800&auto=format&fit=crop`;

        products.push({
            name: name,
            brand: brand,
            price: price,
            imageUrls: JSON.stringify([imageUrl]),
            category: category,
            description: `An exquisite ${name} representing the pinnacle of Maison ${brand} craftsmanship. Designed for the discerning elite who value timeless elegance.`,
            stock: Math.floor(Math.random() * 100) + 5,
            lowStockThreshold: 10,
            isFeatured: Math.random() > 0.9,
            slug: slug
        });
    }

    console.log(`Pushing 550 items to DB in batches...`);
    const chunkSize = 50;
    for (let i = 0; i < products.length; i += chunkSize) {
        const chunk = products.slice(i, i + chunkSize);
        await prisma.product.createMany({ data: chunk });
        console.log(`- Inserted batch ${i} to ${i + chunk.length}`);
    }

    console.log('\n--- Seed completed successfully with 550 items and verified luxury photos ---');
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
