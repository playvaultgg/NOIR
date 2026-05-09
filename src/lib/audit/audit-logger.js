import prisma from "@/lib/prisma";
import { getClientIp } from "@/lib/auth/device-fingerprint";

/**
 * MAISON NOIR — Immutable Audit Log System
 * INSERT-only security event logging.
 *
 * Design Principles:
 *   - NEVER update or delete audit records
 *   - Every security-relevant action is logged
 *   - Structured metadata for forensic analysis
 *   - Severity levels for alert prioritization
 *
 * Severity Levels:
 *   INFO     — Normal operations (login, logout, profile update)
 *   WARNING  — Suspicious activity (new device, failed login, role change)
 *   CRITICAL — Security incidents (replay attack, brute force lockout, data breach attempt)
 */

// ── Audit Action Types ───────────────────────────────────────

export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: "LOGIN",
  LOGIN_FAILED: "LOGIN_FAILED",
  LOGOUT: "LOGOUT",
  REGISTER: "REGISTER",

  // Password
  PASSWORD_CHANGE: "PASSWORD_CHANGE",
  PASSWORD_RESET_REQUEST: "PASSWORD_RESET_REQUEST",
  PASSWORD_RESET_COMPLETE: "PASSWORD_RESET_COMPLETE",

  // MFA
  MFA_ENABLED: "MFA_ENABLED",
  MFA_DISABLED: "MFA_DISABLED",
  MFA_VERIFIED: "MFA_VERIFIED",
  MFA_FAILED: "MFA_FAILED",
  BACKUP_CODE_USED: "BACKUP_CODE_USED",

  // Session & Device
  SESSION_REVOKED: "SESSION_REVOKED",
  ALL_SESSIONS_REVOKED: "ALL_SESSIONS_REVOKED",
  NEW_DEVICE_DETECTED: "NEW_DEVICE_DETECTED",
  DEVICE_TRUSTED: "DEVICE_TRUSTED",
  DEVICE_REVOKED: "DEVICE_REVOKED",

  // Account
  PROFILE_UPDATE: "PROFILE_UPDATE",
  ROLE_CHANGE: "ROLE_CHANGE",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  ACCOUNT_UNLOCKED: "ACCOUNT_UNLOCKED",
  ACCOUNT_DELETED: "ACCOUNT_DELETED",

  // Commerce
  ORDER_PLACED: "ORDER_PLACED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  REFUND_ISSUED: "REFUND_ISSUED",
  PAYMENT_FAILED: "PAYMENT_FAILED",

  // Admin
  ADMIN_ACTION: "ADMIN_ACTION",
  ADMIN_USER_UPDATE: "ADMIN_USER_UPDATE",
  ADMIN_PRODUCT_UPDATE: "ADMIN_PRODUCT_UPDATE",
  ADMIN_ORDER_UPDATE: "ADMIN_ORDER_UPDATE",
  ADMIN_COUPON_CREATE: "ADMIN_COUPON_CREATE",

  // Security Events
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  REPLAY_ATTACK_DETECTED: "REPLAY_ATTACK_DETECTED",
  SUSPICIOUS_ACTIVITY: "SUSPICIOUS_ACTIVITY",
  VALIDATION_REJECTED: "VALIDATION_REJECTED",
};

// ── Severity Map ─────────────────────────────────────────────

const SEVERITY_MAP = {
  // INFO
  [AUDIT_ACTIONS.LOGIN]: "INFO",
  [AUDIT_ACTIONS.LOGOUT]: "INFO",
  [AUDIT_ACTIONS.REGISTER]: "INFO",
  [AUDIT_ACTIONS.PROFILE_UPDATE]: "INFO",
  [AUDIT_ACTIONS.ORDER_PLACED]: "INFO",
  [AUDIT_ACTIONS.MFA_ENABLED]: "INFO",
  [AUDIT_ACTIONS.MFA_VERIFIED]: "INFO",
  [AUDIT_ACTIONS.DEVICE_TRUSTED]: "INFO",

  // WARNING
  [AUDIT_ACTIONS.LOGIN_FAILED]: "WARNING",
  [AUDIT_ACTIONS.PASSWORD_CHANGE]: "WARNING",
  [AUDIT_ACTIONS.PASSWORD_RESET_REQUEST]: "WARNING",
  [AUDIT_ACTIONS.NEW_DEVICE_DETECTED]: "WARNING",
  [AUDIT_ACTIONS.ROLE_CHANGE]: "WARNING",
  [AUDIT_ACTIONS.MFA_FAILED]: "WARNING",
  [AUDIT_ACTIONS.MFA_DISABLED]: "WARNING",
  [AUDIT_ACTIONS.BACKUP_CODE_USED]: "WARNING",
  [AUDIT_ACTIONS.SESSION_REVOKED]: "WARNING",
  [AUDIT_ACTIONS.DEVICE_REVOKED]: "WARNING",
  [AUDIT_ACTIONS.ORDER_CANCELLED]: "WARNING",
  [AUDIT_ACTIONS.REFUND_ISSUED]: "WARNING",
  [AUDIT_ACTIONS.RATE_LIMIT_EXCEEDED]: "WARNING",
  [AUDIT_ACTIONS.VALIDATION_REJECTED]: "WARNING",

  // CRITICAL
  [AUDIT_ACTIONS.ACCOUNT_LOCKED]: "CRITICAL",
  [AUDIT_ACTIONS.ALL_SESSIONS_REVOKED]: "CRITICAL",
  [AUDIT_ACTIONS.REPLAY_ATTACK_DETECTED]: "CRITICAL",
  [AUDIT_ACTIONS.SUSPICIOUS_ACTIVITY]: "CRITICAL",
  [AUDIT_ACTIONS.PAYMENT_FAILED]: "CRITICAL",
  [AUDIT_ACTIONS.ACCOUNT_DELETED]: "CRITICAL",
};

// ── Core Audit Logger ────────────────────────────────────────

/**
 * Log a security event to the immutable audit table.
 * This function NEVER throws — it catches all errors internally
 * so it never breaks the calling flow.
 *
 * @param {Object} params
 * @param {string} params.action       - One of AUDIT_ACTIONS
 * @param {string} [params.userId]     - User who performed the action
 * @param {Request} [params.request]   - HTTP request (for IP/UA extraction)
 * @param {string} [params.ipAddress]  - Override IP address
 * @param {string} [params.fingerprint] - Device fingerprint hash
 * @param {Object} [params.metadata]   - Additional context (JSON)
 * @param {string} [params.severity]   - Override severity level
 */
export async function auditLog({
  action,
  userId = null,
  request = null,
  ipAddress = null,
  fingerprint = null,
  metadata = null,
  severity = null,
}) {
  try {
    const ip = ipAddress || (request ? getClientIp(request) : null);
    const userAgent = request?.headers?.get("user-agent")?.substring(0, 500) || null;
    const resolvedSeverity = severity || SEVERITY_MAP[action] || "INFO";

    await prisma.auditlog.create({
      data: {
        action,
        userId,
        ipAddress: ip,
        deviceFingerprint: fingerprint,
        userAgent,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null,
        severity: resolvedSeverity,
      },
    });

    // Console log for CRITICAL events (for Vercel/Railway log aggregation)
    if (resolvedSeverity === "CRITICAL") {
      console.error(
        `[AUDIT:CRITICAL] ${action} | User: ${userId || "anonymous"} | IP: ${ip || "unknown"} | ${JSON.stringify(metadata || {})}`
      );
    }
  } catch (error) {
    // NEVER throw from audit logging — print and continue
    console.error("[AUDIT] Failed to write audit log:", error.message, {
      action,
      userId,
    });
  }
}

// ── Convenience Methods ──────────────────────────────────────

/**
 * Log a successful login event.
 */
export async function auditLogin(userId, request, fingerprint, metadata = {}) {
  return auditLog({
    action: AUDIT_ACTIONS.LOGIN,
    userId,
    request,
    fingerprint,
    metadata: { ...metadata, timestamp: new Date().toISOString() },
  });
}

/**
 * Log a failed login attempt.
 */
export async function auditLoginFailed(request, email, reason) {
  return auditLog({
    action: AUDIT_ACTIONS.LOGIN_FAILED,
    request,
    metadata: {
      email: email?.substring(0, 3) + "***", // Partial email for privacy
      reason,
      timestamp: new Date().toISOString(),
    },
  });
}

/**
 * Log a new device detection.
 */
export async function auditNewDevice(userId, request, deviceInfo) {
  return auditLog({
    action: AUDIT_ACTIONS.NEW_DEVICE_DETECTED,
    userId,
    request,
    fingerprint: deviceInfo.fingerprint?.hash,
    metadata: {
      deviceName: deviceInfo.deviceName,
      ip: deviceInfo.fingerprint?.ip,
      timestamp: new Date().toISOString(),
    },
    severity: "WARNING",
  });
}

/**
 * Log an admin action.
 */
export async function auditAdminAction(userId, request, description, targetData = {}) {
  return auditLog({
    action: AUDIT_ACTIONS.ADMIN_ACTION,
    userId,
    request,
    metadata: {
      description,
      ...targetData,
      timestamp: new Date().toISOString(),
    },
  });
}

// ── Query Audit Logs (Admin Only) ────────────────────────────

/**
 * Retrieve audit logs with filtering and pagination.
 * For admin dashboard security monitoring.
 */
export async function queryAuditLogs({
  userId,
  action,
  severity,
  startDate,
  endDate,
  page = 1,
  limit = 50,
}) {
  const where = {};

  if (userId) where.userId = userId;
  if (action) where.action = action;
  if (severity) where.severity = severity;
  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = new Date(startDate);
    if (endDate) where.createdAt.lte = new Date(endDate);
  }

  const [logs, total] = await Promise.all([
    prisma.auditlog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
    prisma.auditlog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
