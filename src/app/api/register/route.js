import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Incomplete application details." },
                { status: 400 }
            );
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "This email is already associated with an account." },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // Log registration activity
        await prisma.customeractivity.create({
            data: {
                userId: user.id,
                action: "REGISTER",
                metadata: { email: user.email }
            }
        });

        return NextResponse.json(
            { message: "Account created successfully.", userId: user.id },
            { status: 201 }
        );
    } catch (err) {
        console.error("================ REGISTRATION CRITICAL FAILURE ================");
        console.error("Registration Error Message:", err.message);
        console.error("Registration Error Stack:", err.stack);
        console.error("Registration Error Full Object:", err);
        console.error("===============================================================");
        return NextResponse.json(
            { 
                message: "Security protocol error in account creation.",
                debug_error: err.message,
                debug_stack: err.stack
            },
            { status: 500 }
        );
    }
}
