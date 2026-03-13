const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function checkConnection() {
    console.log("--- NOIR-v2 Database Diagnostic ---");
    console.log("Attempting to connect to MySQL...");
    const start = Date.now();
    
    try {
        const productCount = await prisma.product.count();
        const activityCount = await prisma.customerActivity.count();
        const contactCount = await prisma.contactMessage.count();
        
        console.log("✅ Connection Successful!");
        console.log(`- Product Catalog: ${productCount} items`);
        console.log(`- Activity Logs: ${activityCount} entries`);
        console.log(`- Contact Inquiries: ${contactCount} messages`);
        console.log(`- Response Time: ${Date.now() - start}ms`);
    } catch (error) {
        console.error("❌ Database Connection Failed:");
        console.error(error.message);
        
        if (error.message.includes("Can't reach database server")) {
            console.log("\n💡 TIP: Ensure XAMPP is running and MySQL is active on port 3307.");
        }
    } finally {
        await prisma.$disconnect();
    }
}

checkConnection();
