const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const name = "GodlLuffy";
    const email = "test@test.com";
    const password = "12345";

    console.log(`[Vault Security] Encrypting credentials for: ${name}...`);
    
    // Hash the password (required for login to work)
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        const user = await prisma.user.upsert({
            where: { email: email },
            update: {
                name: name,
                password: hashedPassword
            },
            create: {
                name: name,
                email: email,
                password: hashedPassword,
                role: 'USER'
            }
        });

        console.log("------------------------------------------");
        console.log("✅ SUCCESS: User added to the Maison Vault.");
        console.log(`👤 Name: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log("🔑 Password: (Encrypted for security)");
        console.log("------------------------------------------");
        console.log("You can now log in at http://localhost:3000/login");
    } catch (error) {
        console.error("❌ ERROR: Failed to add user to database.");
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
