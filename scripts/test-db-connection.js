require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log("--- Starting Enterprise Connection Test ---");
  try {
    // 1. Test Connection & Count Users
    const userCount = await prisma.user.count();
    console.log("✅ Database connected successfully");
    console.log(`📊 Users in database: ${userCount}`);

    // 2. Insert Activity Log
    // Using a placeholder or finding an actual user if possible
    const testUser = await prisma.user.findFirst();
    const userId = testUser ? testUser.id : "system_test_placeholder";

    await prisma.customerActivity.create({
      data: {
        userId: userId,
        action: "TEST_CONNECTION",
        metadata: { message: "Enterprise-ready connection verified" }
      }
    });

    console.log("✅ Activity log inserted successfully");

  } catch (err) {
    console.error("❌ Database connection failed:");
    console.error(err);
  } finally {
    await prisma.$disconnect();
    console.log("--- Test Complete ---");
  }
}

main();
