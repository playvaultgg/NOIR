// Use the Unsplash Source API or specific Unsplash collection IDs to generate 100+ items
// MENS, WOMENS, ACCESSORIES, WATCHES, JEWELRY, BAGS, PERFUME
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const BRANDS = ["NOIR COUTURE", "NOIR ARCHIVE", "NOIR ATELIER", "NOIR JEWELRY", "NOIR BEAUTY", "NOIR HOROLOGY"];

const MENS_CLOTHING = [
    { name: "Vantablack Silk Tuxedo", price: 185000, keywords: "tuxedo,black,silk" },
    { name: "Cashmere Overcoat", price: 125000, keywords: "mens,overcoat,cashmere" },
    { name: "Raw Silk Dress Shirt", price: 35000, keywords: "mens,shirt,silk,white" },
    { name: "Onyx Leather Jacket", price: 145000, keywords: "leather,jacket,mens,black" },
    { name: "Wool Trousers", price: 45000, keywords: "mens,trousers,wool,dark" },
    { name: "Velvet Blazer", price: 95000, keywords: "velvet,blazer,mens,burgundy" },
    { name: "Pinstripe Suit", price: 165000, keywords: "suit,pinstripe,mens" },
    { name: "Turtleneck Sweater", price: 28000, keywords: "turtleneck,mens,cashmere" },
    { name: "Linen Summer Vest", price: 32000, keywords: "vest,linen,mens" },
    { name: "Double Breasted Coat", price: 115000, keywords: "double,breasted,coat,mens" },
    { name: "Oxford Button Down", price: 22000, keywords: "oxford,shirt,mens" },
    { name: "Selvedge Denim", price: 38000, keywords: "denim,jeans,mens,raw" },
    { name: "Pleated Chinos", price: 31000, keywords: "chinos,pleated,mens" },
    { name: "Merino Wool Polo", price: 25000, keywords: "polo,shirt,merino,mens" },
    { name: "Silk Robe", price: 58000, keywords: "robe,silk,mens,luxury" },
];

const WOMENS_CLOTHING = [
    { name: "Silk Slip Gown", price: 95000, keywords: "silk,gown,womens,black" },
    { name: "Trench Coat", price: 155000, keywords: "trench,coat,womens,beige" },
    { name: "Velvet Cocktail Blazer", price: 82000, keywords: "velvet,blazer,womens" },
    { name: "Cashmere Wrap Dress", price: 110000, keywords: "wrap,dress,cashmere,womens" },
    { name: "Pleated Midi Skirt", price: 45000, keywords: "midi,skirt,pleated,womens" },
    { name: "Silk Camisole", price: 28000, keywords: "camisole,silk,womens" },
    { name: "Wide Leg Trousers", price: 55000, keywords: "trousers,wide,leg,womens" },
    { name: "Organza Blouse", price: 62000, keywords: "blouse,organza,womens" },
    { name: "Leather Corset", price: 78000, keywords: "corset,leather,womens" },
    { name: "Sequin Evening Dress", price: 210000, keywords: "sequin,evening,dress,womens" },
    { name: "Wool Pea Coat", price: 135000, keywords: "pea,coat,wool,womens" },
    { name: "Satin Jumpsuit", price: 89000, keywords: "jumpsuit,satin,womens" },
    { name: "Cashmere Cardigan", price: 68000, keywords: "cardigan,cashmere,womens" },
    { name: "Tailored Shorts", price: 35000, keywords: "shorts,tailored,womens" },
    { name: "Lace Maxi Skirt", price: 72000, keywords: "lace,maxi,skirt,womens" },
];

const WATCHES = [
    { name: "Obsidian Tourbillon", price: 1250000, keywords: "luxury,watch,tourbillon,black" },
    { name: "Platinum Chronograph", price: 880000, keywords: "platinum,watch,chronograph" },
    { name: "Rose Gold Skeleton Automatique", price: 950000, keywords: "skeleton,watch,rose,gold" },
    { name: "Midnight Moonphase", price: 650000, keywords: "moonphase,watch,leather,strap" },
    { name: "Diamond Bezel Diver", price: 1100000, keywords: "diver,watch,diamond,bezel" },
    { name: "Ceramic Minimalist", price: 420000, keywords: "ceramic,watch,minimalist" },
    { name: "Vintage Perpetual Calendar", price: 1500000, keywords: "perpetual,calendar,watch,vintage" },
    { name: "Titanium Aviator", price: 580000, keywords: "titanium,aviator,watch" },
    { name: "Sapphire Crystal Dress Watch", price: 480000, keywords: "sapphire,dress,watch" },
    { name: "Gold Dual Timezone", price: 750000, keywords: "gold,dual,timezone,watch" },
];

const JEWELRY = [
    { name: "Onyx Cufflinks", price: 28000, keywords: "cufflinks,onyx,mens,jewelry" },
    { name: "Gold Mesh Choker", price: 320000, keywords: "choker,gold,mesh,womens" },
    { name: "Diamond Tennis Bracelet", price: 450000, keywords: "diamond,tennis,bracelet" },
    { name: "Pearl Drop Earrings", price: 180000, keywords: "pearl,drop,earrings" },
    { name: "Sapphire Solitaire Ring", price: 550000, keywords: "sapphire,solitaire,ring" },
    { name: "White Gold Chain Necklace", price: 120000, keywords: "white,gold,chain,necklace" },
    { name: "Emerald Pendant", price: 380000, keywords: "emerald,pendant,necklace" },
    { name: "Men's Platinum Signet Ring", price: 145000, keywords: "platinum,signet,ring,mens" },
    { name: "Ruby Halo Studs", price: 220000, keywords: "ruby,halo,studs,earrings" },
    { name: "Rose Gold Bangle", price: 95000, keywords: "rose,gold,bangle,bracelet" },
];

const PERFUME = [
    { name: "Oud & Midnight Woods", price: 45000, keywords: "perfume,oud,woods,bottle" },
    { name: "Neroli Blanc Extrait", price: 38000, keywords: "perfume,neroli,white,bottle" },
    { name: "Ambergris Noir", price: 55000, keywords: "perfume,ambergris,black,bottle" },
    { name: "Jasmine Absolute L'eau", price: 42000, keywords: "perfume,jasmine,luxury,bottle" },
    { name: "Bergamot & Leather", price: 48000, keywords: "perfume,leather,cologne,bottle" },
    { name: "Vanilla Orchid Parfum", price: 35000, keywords: "perfume,vanilla,orchid,bottle" },
    { name: "Smoked Vetiver", price: 52000, keywords: "perfume,vetiver,cologne,bottle" },
    { name: "Rose Damascena Intense", price: 49000, keywords: "perfume,rose,luxury,bottle" },
];

const BELTS = [
    { name: "Saffiano Leather Belt", price: 32000, keywords: "leather,belt,mens,black" },
    { name: "Reversible Logo Belt", price: 45000, keywords: "reversible,belt,logo,buckle" },
    { name: "Crocodile Embossed Belt", price: 58000, keywords: "crocodile,leather,belt" },
    { name: "Suede Dress Belt", price: 28000, keywords: "suede,belt,mens,dress" },
    { name: "Women's Obi Corset Belt", price: 35000, keywords: "obi,corset,belt,womens" },
];

const BAGS = [
    { name: "Leather Tote Bag", price: 85000, keywords: "leather,tote,bag,womens" },
    { name: "Canvas Weekend Duffle", price: 95000, keywords: "duffle,bag,weekend,mens" },
    { name: "Quilted Crossbody", price: 110000, keywords: "quilted,crossbody,bag,luxury" },
    { name: "Leather Briefcase", price: 135000, keywords: "leather,briefcase,mens" },
    { name: "Mini Top Handle Bag", price: 78000, keywords: "mini,bag,top,handle" },
];

const SHOES = [
    { name: "Oxblood Leather Loafers", price: 65000, keywords: "loafers,leather,mens" },
    { name: "Stiletto Heels", price: 78000, keywords: "stiletto,heels,womens" },
    { name: "Chelsea Boots", price: 82000, keywords: "chelsea,boots,leather" },
    { name: "Suede Driving Shoes", price: 45000, keywords: "driving,shoes,suede,mens" },
    { name: "Leather Ankle Boots", price: 92000, keywords: "ankle,boots,leather,womens" },
    { name: "Minimalist Sneakers", price: 48000, keywords: "white,sneakers,luxury,minimalist" },
    { name: "Velvet Slippers", price: 55000, keywords: "velvet,slippers,mens" },
    { name: "Strappy Sandals", price: 62000, keywords: "sandals,heels,strappy,womens" },
];

// Combine all logic
async function main() {
    console.log('--- Initializing Massive 100+ Luxury Database Seed ---');

    // 1. CLEAR EXISTING DATA
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    
    // We recreate admin only if none exists, else skip
    let admin = await prisma.user.findUnique({ where: { email: "gundelwaranup119@gmail.com" } });
    if (!admin) {
        admin = await prisma.user.create({
            data: {
                name: "Gundelwar anup santosh",
                email: "gundelwaranup119@gmail.com",
                role: "ADMIN",
            },
        });
        console.log(`- Created Admin: ${admin.email}`);
    }

    // Unsplash helper. We add random identifiers to bypass unsplash caching identical keywords
    const getImages = (keywords, count = 2) => {
        const urls = [];
        for(let i=0; i<count; i++) {
            // Using placeholder standard Unsplash source API. 
            // In a real app we'd fetch actual unpslash IDs, but Unsplash Source /random API is easiest for seeding 100s
            // Adding a timestamp/random string avoids browser cache duplicate images
            const rando = Math.floor(Math.random() * 100000);
            urls.push(`https://source.unsplash.com/800x1200/?${keywords}&r=${rando}`);
        }
        return urls;
    };

    const allProducts = [];

    // Helper to push items
    const addToQueue = (category, arrayData) => {
        let i = 0;
        for (const item of arrayData) {
            // Unpack everything and create diverse images
            // Make some featured, give them slightly different stocks
            const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
            const stock = Math.floor(Math.random() * 50) + 1;
            const isFeatured = Math.random() > 0.8; // 20% chance of being featured
            
            // To get real stable images from luxury fashion without the `source.unsplash` unreliability, 
            // we will use structured direct Unsplash photo IDs. Since passing 100 unique unsplash IDs by hand is impossible, 
            // we'll map a standard set of high end luxury unsplash IDs to use randomly if Unsplash Source fails, or just rely on source.unsplash.com
            const randomSource = Math.floor(Math.random() * 1000000);
            const primaryImage = `https://images.unsplash.com/photo-${1500000000000 + randomSource}?w=800&q=80`; // Safe fallback shape
            
            // The user requested 100+, so what we'll do is multiply our base lists by adding variations
            allProducts.push({
                name: item.name,
                brand: brand,
                price: item.price,
                // Due to recent unsplash changes, source.unsplash is sometimes deprecated.
                // We'll use a reliable placeholder service that returns high quality fashion imagery based on keywords
                imageUrls: [
                    `https://loremflickr.com/800/1200/${encodeURIComponent(item.keywords.split(',')[0])}?lock=${randomSource}`,
                    `https://loremflickr.com/800/1200/${encodeURIComponent(item.keywords.split(',')[1] || 'fashion')}?lock=${randomSource+1}`
                ],
                category: category,
                description: `Experience the epitome of luxury with the ${item.name}. Crafted by master artisans for the modern elite.`,
                stock: stock,
                isFeatured: isFeatured
            });
            i++;
        }
    };

    addToQueue("MENS", MENS_CLOTHING);
    addToQueue("WOMENS", WOMENS_CLOTHING);
    addToQueue("ACCESSORIES", WATCHES);
    addToQueue("ACCESSORIES", JEWELRY);
    addToQueue("ACCESSORIES", PERFUME);
    addToQueue("ACCESSORIES", BELTS);
    addToQueue("ACCESSORIES", BAGS);
    addToQueue("MENS", SHOES.slice(0, 4));
    addToQueue("WOMENS", SHOES.slice(4));

    // To hit exactly 100+, we will create Variations of the above (e.g. "Vantablack Silk Tuxedo - Special Edition")
    const variations = ["Midnight Edition", "Signature Series", "Atelier Collection", "Bespoke Cut", "Archive Release"];
    
    // Duplicate randomly until we hit 100 items
    while (allProducts.length < 110) {
        // Pick a random product from what we have so far
        const base = allProducts[Math.floor(Math.random() * allProducts.length)];
        const varPrefix = variations[Math.floor(Math.random() * variations.length)];
        const randomSource = Math.floor(Math.random() * 1000000);
        
        allProducts.push({
            name: `${base.name} - ${varPrefix}`,
            brand: base.brand,
            price: Math.floor(base.price * (Math.random() * 0.5 + 1)), // 1x to 1.5x price
            imageUrls: [
                `https://loremflickr.com/800/1200/luxury,fashion?lock=${randomSource}`,
                `https://loremflickr.com/800/1200/clothing,detail?lock=${randomSource+1}`
            ],
            category: base.category,
            description: base.description + ` This is a strictly limited ${varPrefix}.`,
            stock: Math.floor(Math.random() * 10) + 1, // Rare
            isFeatured: Math.random() > 0.7
        });
    }

    // Insert to DB in chunks
    console.log(`Prepared ${allProducts.length} items. Pushing to DB in batches...`);
    const chunkSize = 25;
    for (let i = 0; i < allProducts.length; i += chunkSize) {
        const chunk = allProducts.slice(i, i + chunkSize);
        await prisma.product.createMany({ data: chunk });
        console.log(`- Inserted batch ${i} to ${i + chunk.length}`);
    }

    console.log(`\n--- Seed completed successfully with ${allProducts.length} items ---`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
