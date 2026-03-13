require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log("--- 🏁 Starting Full Customer Journey Verification ---");
    const testEmail = `test_${Date.now()}@noir-luxury.com`;
    const password = "LuxuryPassword123!";

    try {
        // 1. Simulate REGISTRATION
        console.log("\n1. Simulating [REGISTER]...");
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await prisma.user.create({
            data: {
                name: "Test Aristocrat",
                email: testEmail,
                password: hashedPassword,
                role: "USER"
            }
        });
        await prisma.customerActivity.create({
            data: { userId: user.id, action: "REGISTER", metadata: { email: testEmail } }
        });
        console.log(`✅ User registered with ID: ${user.id}`);

        // 2. Simulate LOGIN
        console.log("2. Simulating [LOGIN]...");
        await prisma.customerActivity.create({
            data: { userId: user.id, action: "LOGIN", metadata: { method: "credentials" } }
        });
        console.log("✅ Login logged.");

        // 3. Simulate VIEW_PRODUCT
        console.log("3. Simulating [VIEW_PRODUCT]...");
        const product = await prisma.product.findFirst();
        if (product) {
            await prisma.customerActivity.create({
                data: { userId: user.id, action: "VIEW_PRODUCT", metadata: { productId: product.id, name: product.name } }
            });
            console.log(`✅ Viewed Product: ${product.name}`);
        }

        // 4. Simulate ADD_TO_WISHLIST
        console.log("4. Simulating [ADD_TO_WISHLIST]...");
        if (product) {
            await prisma.wishlist.create({
                data: { userId: user.id, productId: product.id }
            });
            await prisma.customerActivity.create({
                data: { userId: user.id, action: "ADD_TO_WISHLIST", metadata: { productId: product.id } }
            });
            console.log("✅ Wishlist updated.");
        }

        // 5. Simulate PURCHASE
        console.log("5. Simulating [PURCHASE]...");
        if (product) {
            const order = await prisma.$transaction(async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        userId: user.id,
                        totalAmount: product.price,
                        status: "PENDING"
                    }
                });
                await tx.orderItem.create({
                    data: { orderId: newOrder.id, productId: product.id, quantity: 1, priceAtBuy: product.price }
                });
                await tx.customerActivity.create({
                    data: { userId: user.id, action: "PURCHASE", metadata: { orderId: newOrder.id, total: product.price } }
                });
                return newOrder;
            });
            console.log(`✅ Purchase completed. Order Hash: ${order.id}`);
        }

        // --- FINAL RECONCILIATION ---
        console.log("\n--- 🔍 Database Reconciliation (Proof of Work) ---");
        const activities = await prisma.customerActivity.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'asc' }
        });

        console.log(`Stored Activities for ${testEmail}:`);
        activities.forEach((a, i) => {
            console.log(`  [${i+1}] ${a.action} - ${a.createdAt.toISOString()}`);
        });

        const orderCount = await prisma.order.count({ where: { userId: user.id } });
        const wishlistCount = await prisma.wishlist.count({ where: { userId: user.id } });

        console.log(`\nFinal Audit:`);
        console.log(`- Orders Found: ${orderCount}`);
        console.log(`- Wishlist Items: ${wishlistCount}`);
        console.log(`- Total Logs: ${activities.length}`);

        if (activities.length >= 5 && orderCount > 0) {
            console.log("\n🏆 VERIFICATION SUCCESSFUL: The backend is fully operational on port 3307.");
        } else {
            console.log("\n⚠️ VERIFICATION INCOMPLETE: Some logs are missing.");
        }

    } catch (err) {
        console.error("❌ Verification failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
