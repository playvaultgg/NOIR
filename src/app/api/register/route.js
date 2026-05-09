import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { withValidation } from "@/middleware/withValidation";
import { withRateLimit } from "@/lib/rateLimit/redis-limiter";
import { auditLog, AUDIT_ACTIONS } from "@/lib/audit/audit-logger";
import { RegisterSchema } from "@/lib/validation/schemas";

/**
 * MAISON NOIR — Hardened Registration API
 * Upgraded with Module 2 (Validation) and Module 3 (Rate Limiting + Audit Logging).
 */

async function registerHandler(req) {
    try {
        const { name, email, password } = await req.json();

        // 1. Check if user exists (Pre-check to avoid unnecessary hashing)
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            await auditLog({
                action: AUDIT_ACTIONS.VALIDATION_REJECTED,
                metadata: { email, reason: "Email already exists" },
                severity: "INFO",
                request: req
            });

            return NextResponse.json(
                { message: "This email is already associated with an account." },
                { status: 400 }
            );
        }

        // 2. Securely Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 3. Create User
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: "USER", // Default role
            },
        });

        // 4. Comprehensive Audit Log
        await auditLog({
            action: AUDIT_ACTIONS.REGISTER,
            userId: user.id,
            metadata: { email: user.email },
            severity: "INFO",
            request: req
        });

        // 5. Legacy activity log
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
        console.error("[REGISTRATION_ERROR]", err);
        
        await auditLog({
            action: AUDIT_ACTIONS.SUSPICIOUS_ACTIVITY,
            metadata: { error: err.message, stack: err.stack },
            severity: "CRITICAL",
            request: req
        });

        return NextResponse.json(
            { message: "Security protocol error in account creation." },
            { status: 500 }
        );
    }
}

// Chain: Rate Limit (SIGNUP) -> Validation (RegisterSchema) -> Handler
export const POST = withRateLimit("SIGNUP")(
    withValidation(RegisterSchema)(registerHandler)
);
