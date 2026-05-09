import crypto from "crypto";
import prisma from "@/lib/prisma";

/**
 * MAISON NOIR — Device Fingerprinting System
 * Detects new/unknown devices on login and triggers security alerts.
 */

// ── User-Agent Parser (Lightweight) ──────────────────────────

function parseDeviceName(userAgent) {
  if (!userAgent) return "Unknown Device";

  let browser = "Unknown Browser";
  let os = "Unknown OS";

  if (userAgent.includes("Edg/")) browser = "Edge";
  else if (userAgent.includes("Chrome/")) browser = "Chrome";
  else if (userAgent.includes("Firefox/")) browser = "Firefox";
  else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome")) browser = "Safari";
  else if (userAgent.includes("Opera") || userAgent.includes("OPR/")) browser = "Opera";

  if (userAgent.includes("Windows NT 10")) os = "Windows 10/11";
  else if (userAgent.includes("Windows")) os = "Windows";
  else if (userAgent.includes("Mac OS X")) os = "macOS";
  else if (userAgent.includes("iPhone")) os = "iPhone";
  else if (userAgent.includes("iPad")) os = "iPad";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("Linux")) os = "Linux";

  return `${browser} on ${os}`;
}

// ── IP Extraction ────────────────────────────────────────────

/**
 * Extract IP address from request headers, handling standard and non-standard objects.
 */
export function getClientIp(request) {
  if (!request?.headers) return "unknown";

  const getHeader = (name) => {
    if (typeof request.headers.get === "function") return request.headers.get(name);
    return request.headers[name] || request.headers[name.toLowerCase()];
  };

  const forwarded = getHeader("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();

  const cfIp = getHeader("cf-connecting-ip");
  if (cfIp) return cfIp;

  const realIp = getHeader("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

// ── Fingerprint Generator ────────────────────────────────────

export function generateFingerprint(request) {
  const ip = getClientIp(request);
  
  const getHeader = (name) => {
    if (!request?.headers) return "";
    if (typeof request.headers.get === "function") return request.headers.get(name) || "";
    return request.headers[name] || request.headers[name.toLowerCase()] || "";
  };

  const userAgent = getHeader("user-agent");
  const acceptLang = getHeader("accept-language");
  const acceptEncoding = getHeader("accept-encoding");

  const raw = [ip, userAgent, acceptLang, acceptEncoding].join("|");

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

// ── Device Check & Registration ──────────────────────────────

export async function checkDevice(userId, request) {
  const fingerprint = generateFingerprint(request);

  try {
    const existing = await prisma.devicefingerprint.findUnique({
      where: {
        userId_fingerprintHash: {
          userId,
          fingerprintHash: fingerprint.hash,
        },
      },
    });

    if (existing) {
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
    console.error("[DEVICE-FP] Error checking device:", error.message);
    return {
      isNewDevice: false,
      deviceName: fingerprint.deviceName,
      fingerprint,
      deviceId: null,
    };
  }
}

export async function getUserDevices(userId) {
  return prisma.devicefingerprint.findMany({
    where: { userId },
    orderBy: { lastSeenAt: "desc" },
    select: {
      id: true,
      deviceName: true,
      ipAddress: true,
      isTrusted: true,
      lastSeenAt: true,
      createdAt: true,
    },
  });
}

export async function revokeDevice(userId, deviceId) {
  return prisma.devicefingerprint.deleteMany({
    where: {
      id: deviceId,
      userId,
    },
  });
}
