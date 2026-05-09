import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auditLog, AUDIT_ACTIONS } from "@/lib/audit/audit-logger";

/**
 * MAISON NOIR — Hardened Authentication Options
 * Upgraded with Module 3 security: Audit logging, account lockout, and login tracking.
 */

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                console.log("[AUTH-DEBUG] Login attempt for:", credentials?.email);
                if (!credentials?.email || !credentials?.password) {
                    console.log("[AUTH-DEBUG] Missing credentials");
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    console.log("[AUTH-DEBUG] User NOT found in database");
                    // Log attempt for non-existent user
                    await auditLog({
                        action: AUDIT_ACTIONS.LOGIN_FAILED,
                        metadata: { email: credentials.email, reason: "User not found" },
                        severity: "WARNING",
                        request: req
                    });
                    throw new Error("Invalid credentials");
                }

                console.log("[AUTH-DEBUG] User found. Password in DB:", !!user.password);

                // ── 1. Check Account Lockout ─────────────────────
                if (user.lockedUntil && user.lockedUntil > new Date()) {
                    console.log("[AUTH-DEBUG] Account is LOCKED until:", user.lockedUntil);
                    await auditLog({
                        action: AUDIT_ACTIONS.LOGIN_FAILED,
                        userId: user.id,
                        metadata: { reason: "Account locked" },
                        severity: "CRITICAL",
                        request: req
                    });
                    throw new Error("Account is temporarily locked. Please try again later.");
                }

                // ── 2. Verify Password ───────────────────────────
                const isPasswordCorrect = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    console.log("[AUTH-DEBUG] Password MISMATCH");
                    // Update failed login count
                    const newFailCount = (user.failedLoginCount || 0) + 1;
                    const lockUntil = newFailCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

                    await prisma.user.update({
                        where: { id: user.id },
                        data: { 
                            failedLoginCount: newFailCount,
                            lockedUntil: lockUntil
                        }
                    });

                    await auditLog({
                        action: AUDIT_ACTIONS.LOGIN_FAILED,
                        userId: user.id,
                        metadata: { reason: "Incorrect password", attempt: newFailCount },
                        severity: "WARNING",
                        request: req
                    });

                    if (lockUntil) {
                        throw new Error("Too many failed attempts. Account locked for 15 minutes.");
                    }
                    throw new Error("Invalid credentials");
                }

                console.log("[AUTH-DEBUG] Password CORRECT. Logged in.");
                return user;
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login", // Redirect errors back to login
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.role = token.role;
                session.user.id = token.id;
            }
            return session;
        },
    },
    events: {
        async signIn({ user, account }) {
            // Log successful login
            await auditLog({
                action: AUDIT_ACTIONS.LOGIN,
                userId: user.id,
                metadata: { method: account?.provider || "credentials" },
                severity: "INFO"
            });

            // Legacy activity log (keeping for compatibility)
            await prisma.customeractivity.create({
                data: {
                    userId: user.id,
                    action: "LOGIN",
                    metadata: { method: account?.provider || "credentials" }
                }
            });
        },
        async signOut({ token }) {
            if (token?.id) {
                await auditLog({
                    action: AUDIT_ACTIONS.LOGOUT,
                    userId: token.id,
                    severity: "INFO"
                });

                await prisma.customeractivity.create({
                    data: {
                        userId: token.id,
                        action: "LOGOUT"
                    }
                });
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
