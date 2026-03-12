const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixImages() {
  console.log("--- Starting Image URL Migration (loremflickr -> unsplash) ---");

  const products = await prisma.product.findMany({});
  let count = 0;

  for (const product of products) {
    let changed = false;
    const newUrls = product.imageUrls.map(url => {
      if (url.includes("loremflickr.com")) {
        changed = true;
        // Parse the keyword from the URL if possible
        // Original: https://loremflickr.com/800/1200/luxury,fashion?lock=123
        const parts = url.split('/');
        const lastPart = parts[parts.length - 1].split('?')[0];
        const keyword = lastPart || "luxury,fashion";
        const lock = url.split('lock=')[1] || Math.floor(Math.random() * 1000);
        
        // Use a more reliable Unsplash Source URL
        return `https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80&mode=${keyword}&sig=${lock}`; 
        // Note: The photo ID above is a generic high-end suit/fashion item.
        // We'll use a few different "stable" luxury IDs to mix it up.
      }
      return url;
    });

    if (changed) {
      // Map to a set of high-quality luxury IDs to avoid duplicates looking weird
      const luxuryIds = [
        "1591047139829-d91aecb6caea", // Suit
        "1539533113208-f6df8cc8b543", // Model/Suit
        "1594932224011-041d83b1d9bc", // Dress
        "1585488763443-58344d3c8c7c", // Fashion Detail
        "1617137968427-83c39c1f4e1b", // Man in Suit
        "1509631179647-0177331693ae", // Texture/Fabric
        "1483985988355-763728e1935b", // Woman holding bag
        "1490481651871-ab68ff25d43d", // Fashion shoot
        "1539008885171-cb36639d3323", // Accessories
        "1524383533439-0194d2ba02af"  // Perfume/Vial type vibe
      ];

      const stableUrls = product.imageUrls.map((url, i) => {
          if (url.includes("loremflickr.com")) {
              const seed = product.id.length + i;
              const id = luxuryIds[seed % luxuryIds.length];
              return `https://images.unsplash.com/photo-${id}?w=800&q=80`;
          }
          return url;
      });

      await prisma.product.update({
        where: { id: product.id },
        data: { imageUrls: stableUrls }
      });
      count++;
    }
  }

  console.log(`Successfully migrated ${count} products.`);
}

fixImages()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
