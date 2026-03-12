const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INTERNAL_PHOTO_IDS = [
  "1740017729187-0cee1f05a1d0",
  "1603798125914-7b5d27789248",
  "1636281774812-48e8ef62f768",
  "1746730921250-b31cb91788e3",
  "1628302321078-b08b62f61c92",
  "1764779169348-353c6d99dbd0",
  "1745284504844-7979176dc29b",
  "1746730921337-085ec298ce3e",
  "1580657018950-c7f7d6a6d990",
  "1549439602-43ebca2327af"
];

async function main() {
  console.log('--- Final Attempt: Reseeding with Internal Unsplash IDs ---');
  const products = await prisma.product.findMany();
  
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const id1 = INTERNAL_PHOTO_IDS[i % INTERNAL_PHOTO_IDS.length];
    const id2 = INTERNAL_PHOTO_IDS[(i + 3) % INTERNAL_PHOTO_IDS.length];
    
    // Using the exact format that works for images.unsplash.com
    const imageUrls = [
      `https://images.unsplash.com/photo-${id1}?w=800&q=80`,
      `https://images.unsplash.com/photo-${id2}?w=800&q=80`
    ];
    
    await prisma.product.update({
      where: { id: product.id },
      data: { imageUrls }
    });
    
    if (i % 20 === 0) console.log(`Updated ${i}/${products.length} products...`);
  }
  
  console.log('--- Reseed Completed with Internal IDs ---');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
