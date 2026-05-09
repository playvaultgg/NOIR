import crypto from "crypto";
import prisma from "@/lib/prisma";

/**
 * MAISON NOIR — Device Fingerprinting System
 * Detects new/unknown devices on login and triggers security alerts.
 *
 * Captures: IP, User-Agent, timezone, Accept-Language
 * Hashes into a stable SHA-256 fingerprint for comparison.
 *
 * Flow:
 *   1. On login, generate fingerprint from request headers
 *   2. Check if fingerprint exists for this user
 *   3. If NEW → log as WARNING, flag for alert email
 *   4. If KNOWN → update lastSeenAt
 */

// ── User-Agent Parser (Lightweight) ──────────────────────────

function parseDeviceName(userAgent) {
  if (!userAgent) return "Unknown Device";

  let browser = "Unknown Browser";
  let os = "Unknown OS";

  // Browser detection
  if (userAgent.includes("Edg/")) browser = "Edge";
  else if (userAgent.includes("Chrome/")) browser = "Chrome";
  else if (userAgent.includes("Firefox/")) browser = "Firefox";
  else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) browser = "Safari";
  else if (userAgent.includes("Opera") || userAgent.includes("OPR/")) browser = "Opera";

  // OS detection
  if (userAgent.includes("Windows NT 10")) os = "Windows 10/11";
  else if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac OS X")) os = "macOS";
  else if (userAgent.includes("iPhone")) os = "iPhone";
  else if (userAgent.includes("iPad")) os = "iPad";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("Linux")) os = "Linux";

  return `${browser} on ${os}`;
}

// ── Fingerprint Generator ────────────────────────────────────

/**
 * Generate a deterministic fingerprint hash from request attributes.
 * The hash is stable across repeated requests from the same device.
 */
export function generateFingerprint(request) {
  const ip = getClientIp(request);
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLang = request.headers.get("accept-language") || "";
  const acceptEncoding = request.headers.get("accept-encoding") || "";

  // Combine stable attributes into a canonical string
  const raw = [
    ip,
    userAgent,
    acceptLang,
    acceptEncoding,
  ].join("|");

  const hash = crypto
    .createHash("sha256")
    .update(raw)
    .digest("hex");

  return {
    hash,
    ip,
    userAgent,
    deviceName: parseDeviceName(userAgent),
  };
}

// ── IP Extraction ────────────────────────────────────────────

export function getClientIp(request) {
  // Vercel uses x-forwarded-for, Cloudflare uses cf-connecting-ip
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

// ── Device Check & Registration ──────────────────────────────

/**
 * Check if the current device is known for this user.
 * If new, register it and return { isNewDevice: true }.
 *
 * @param {string} userId   - The authenticated user's ID
 * @param {Request} request - The incoming HTTP request
 * @returns {{ isNewDevice: boolean, deviceName: string, fingerprint: object }}
 */
export async function checkDevice(userId, request) {
  const fingerprint = generateFingerprint(request);

  try {
    // Check if this fingerprint is already known for this user
    const existing = await prisma.devicefingerprint.findUnique({
      where: {
        userId_fingerprintHash: {
          userId,
          fingerprintHash: fingerprint.hash,
        },
      },
    });

    if (existing) {
      // Known device — update lastSeenAt
      await prisma.devicefingerprint.update({
        where: { id: existing.id },
        data: {
          lastSeenAt: new Date(),
          ipAddress: fingerprint.ip,
        },
      });

      return {
        isNewDevice: false,
        deviceName: existing.deviceName || fingerprint.deviceName,
        fingerprint,
        deviceId: existing.id,
      };
    }

    // New device — register it
    const newDevice = await prisma.devicefingerprint.create({
      data: {
        userId,
        fingerprintHash: fingerprint.hash,
        deviceName: fingerprint.deviceName,
        ipAddress: fingerprint.ip,
        isTrusted: false,
      },
    });

    return {
      isNewDevice: true,
      deviceName: fingerprint.deviceName,
      fingerprint,
      deviceId: newDevice.id,
    };
  } catch (error) {
    // Don't break login flow if fingerprinting fails
    console.error("[DEVICE-FP] Error checking device:", error.message);
    return {
      isNewDevice: false,
      deviceName: fingerprint.deviceName,
      fingerprint,
      deviceId: null,
    };
  }
}

// ── Get User's Known Devices ─────────────────────────────────

/**
 * List all known devices for a user (for account settings page).
 */
export async function getUserDevices(userId) {
  return prisma.devicefingerprint.findMany({
    where: { userId },
    orderBy: { lastSeenAt: "desc" },
    select: {
      id: true,
      deviceName: true,
      ipAddress: true,
      city: true,
      country: true,
      isTrusted: true,
      lastSeenAt: true,
      createdAt: true,
    },
  });
}

// ── Revoke a Device ──────────────────────────────────────────

/**
 * Remove a device from the known devices list.
 * This will trigger a security alert on next login from that device.
 */
export async function revokeDevice(userId, deviceId) {
  return prisma.devicefingerprint.deleteMany({
    where: {
      id: deviceId,
      userId, // Ensure ownership
    },
  });
}
