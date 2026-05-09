import { authenticator } from "otplib";
import QRCode from "qrcode";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * MAISON NOIR — MFA / TOTP System
 * Secure two-factor authentication for high-end accounts.
 */

/**
 * Generate a new MFA secret and a QR code for the user.
 */
export async function generateMFASecret(userId, email) {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(email, "Maison NOIR", secret);
    const qrCodeUrl = await QRCode.toDataURL(otpauth);
    
    return { secret, qrCodeUrl };
}

/**
 * Verify a TOTP token against a secret.
 */
export function verifyMFATOTP(secret, token) {
    try {
        return authenticator.verify({ token, secret });
    } catch (error) {
        return false;
    }
}

/**
 * Generate 8 cryptographically secure backup codes.
 * Codes are returned as plain text (once) and stored hashed in the DB.
 */
export async function generateBackupCodes(userId) {
    const rawCodes = [];
    const hashedCodes = [];

    for (let i = 0; i < 8; i++) {
        const code = crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A1B2C3D4"
        rawCodes.push(code);
        hashedCodes.push(await bcrypt.hash(code, 12));
    }

    // Update user with hashed codes
    await prisma.user.update({
        where: { id: userId },
        data: { mfaBackupCodes: hashedCodes }
    });

    return rawCodes;
}

/**
 * Verify and invalidate a backup code.
 */
export async function verifyBackupCode(userId, code) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { mfaBackupCodes: true }
    });

    if (!user || !user.mfaBackupCodes.length) return false;

    // Check each hashed code
    for (let i = 0; i < user.mfaBackupCodes.length; i++) {
        const isMatch = await bcrypt.compare(code, user.mfaBackupCodes[i]);
        if (isMatch) {
            // Found a match — remove this code from the array (consume it)
            const updatedCodes = user.mfaBackupCodes.filter((_, index) => index !== i);
            await prisma.user.update({
                where: { id: userId },
                data: { mfaBackupCodes: updatedCodes }
            });
            return true;
        }
    }

    return false;
}
