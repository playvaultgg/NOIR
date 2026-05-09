import prisma from "@/lib/prisma";
import { generateRefreshToken, hashToken, generateAccessToken } from "@/lib/crypto/tokens";
import { generateFingerprint } from "@/lib/crypto/encryption";
import { logAction } from "./audit";
import { Resend } from "resend";
import { cookies } from "next/headers";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * MAISON NOIR — Sovereign Session Management
 * Implements refresh token rotation and device-aware security.
 */

export async function createSession(userId, req) {
    const rawRefreshToken = generateRefreshToken();
    const hashedRefreshToken = hashToken(rawRefreshToken);
    const fingerprint = generateFingerprint(req);
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Check if this device fingerprint is NEW for this user
    const existingDevice = await prisma.devicefingerprint.findUnique({
        where: { userId_fingerprintHash: { userId, fingerprintHash: fingerprint } }
    });

    if (!existingDevice) {
        // Trigger Security Alert: New Device Detected
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user?.email) {
            await resend.emails.send({
                from: "Security <security@maisonnoir.com>",
                to: user.email,
                subject: "New Login Detected — Maison NOIR",
                html: `<p>A new login was detected from a device we don't recognize.</p><p>Device: ${userAgent}</p><p>IP: ${ipAddress}</p>`
            });
        }
        
        // Register the new device
        await prisma.devicefingerprint.create({
            data: { userId, fingerprintHash: fingerprint, ipAddress, deviceName: userAgent }
        });

        await logAction({ userId, action: "NEW_DEVICE_LOGIN", req, metadata: { fingerprint } });
    }

    // Save session to DB
    const session = await prisma.session.create({
        data: {
            userId,
            refreshToken: hashedRefreshToken,
            deviceFingerprint: fingerprint,
            ipAddress,
            userAgent,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
    });

    // Set HTTP-only cookie
    cookies().set("refresh_token", rawRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/"
    });

    return { session, refreshToken: rawRefreshToken };
}

export async function rotateRefreshToken(oldRefreshToken, req) {
    const hashedOldToken = hashToken(oldRefreshToken);
    
    const session = await prisma.session.findUnique({
        where: { refreshToken: hashedOldToken },
        include: { user: true }
    });

    // If session doesn't exist or is revoked -> Detection of Replay Attack
    if (!session || session.isRevoked || session.expiresAt < new Date()) {
        if (session) {
            // Revoke ALL sessions for this user (Nuke option)
            await revokeAllSessions(session.userId);
            await logAction({ 
                userId: session.userId, 
                action: "ADMIN_ACTION", 
                req, 
                metadata: { reason: "Potential Refresh Token Replay Attack detected" } 
            });
        }
        throw new Error("Session invalid or potentially compromised");
    }

    // Generate new pair
    const newRawToken = generateRefreshToken();
    const newHashedToken = hashToken(newRawToken);
    
    // Invalidate old token by deleting it or updating it
    await prisma.session.update({
        where: { id: session.id },
        data: {
            refreshToken: newHashedToken,
            ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1",
            createdAt: new Date() // Reset creation time for the new rotation
        }
    });

    // Update cookie
    cookies().set("refresh_token", newRawToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60,
        path: "/"
    });

    const accessToken = await generateAccessToken(session.userId, session.user.role);
    return { accessToken, refreshToken: newRawToken };
}

export async function revokeSession(sessionId) {
    await prisma.session.delete({ where: { id: sessionId } });
}

export async function revokeAllSessions(userId) {
    await prisma.session.deleteMany({ where: { userId } });
}
