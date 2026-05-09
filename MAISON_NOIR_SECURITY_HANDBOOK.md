# Maison NOIR — Security & Infrastructure Handbook

This document serves as the **Sovereign Technical Reference** for the enterprise security system implemented in the Maison NOIR platform.

---

## 📂 System Architecture Breakdown

### 1. Database & Infrastructure Layer
*   **Provider**: PostgreSQL (via Railway/Supabase).
*   **ORM**: Prisma 7.x with strictly indexed security schemas.
*   **Variables**:
    *   `DATABASE_URL`: Connection pool for application runtime.
    *   `DIRECT_URL`: Direct connection for Prisma migrations and schema resets.

### 2. Identity & Authentication (The Heart)
*   **Mechanism**: JWT (Access) + Refresh Token Rotation (Hashed).
*   **Logic**:
    *   **Access Tokens**: 15-minute expiry, stored in memory/short-lived cookies.
    *   **Refresh Tokens**: 7-day expiry, stored in HTTP-only cookies and hashed in the database.
*   **Detection**: Automatic **Replay Attack Detection** — if a revoked or reused token is detected, the system immediately nukes ALL sessions for that user.
*   **Variables**: `JWT_SECRET`, `REFRESH_TOKEN_SECRET`, `NEXTAUTH_SECRET`.

### 3. Field-Level Vault (AES-256-GCM)
*   **Technology**: Node.js `crypto` with Galois/Counter Mode.
*   **Function**: Encrypts sensitive PII (Phone numbers, addresses, MFA secrets) before they leave the application server.
*   **Variables**: `FIELD_ENCRYPTION_KEY` (64-char hex string).

### 4. The Distributed Shield (Rate Limiting)
*   **Provider**: Upstash Redis.
*   **Zones of Protection**:
    *   **Login**: Brute-force protection (5 attempts / 15m).
    *   **Signup**: Anti-spam / bot protection (3 attempts / 1h).
    *   **Checkout**: Anti-fraud / transaction spam (10 attempts / 1m).
*   **Variables**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

### 5. 3D Asset Protection (Signed URLs)
*   **Provider**: Cloudinary.
*   **Strategy**: No raw asset URLs are ever exposed. The system generates **15-minute time-limited signed URLs** only for authenticated and authorized users.
*   **Variables**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

### 6. Sovereign Alerts
*   **Provider**: Resend.
*   **Automation**: Triggers an immediate "New Device Login Detected" email if the device fingerprint (IP + UA + Language) is not recognized for a user.
*   **Variables**: `RESEND_API_KEY`.

---

## 🛠️ Operational Maintenance

### 1. Rotating Security Keys
To maintain the sovereign status of the platform, security keys should be rotated annually:
```bash
# Generate new 32-byte hex key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Security Audit Logs
The `AuditLog` table is **INSERT-ONLY**. Periodically review logs for `NEW_DEVICE_LOGIN` and `LOGIN_FAILED` spikes to identify targeted attacks.

### 3. CI/CD Protection
The `.github/workflows/security.yml` automatically scans for:
*   **Secret Leaks**: Uses TruffleHog to detect leaked keys.
*   **Vulnerable Dependencies**: Uses `npm audit` to block compromised packages.
*   **Security Debt**: Uses ESLint to catch insecure coding patterns.

---

**Status**: ✅ ENTERPRISE READY  
**Lead Architect**: Gundelwaran (System Signature)  
**Security Standard**: Sovereign Luxury Protocol
