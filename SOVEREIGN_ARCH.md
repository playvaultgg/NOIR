# Maison NOIR — 13-Layer Sovereign Security Architecture

**Technical Standard**: Senior Sovereign Protocol (Phase 8.0)

This document provides a senior-level technical decomposition of the **Maison NOIR Sovereign Security Stack**. It details the specific files, logic, and infrastructure gates that protect the platform.

```mermaid
graph TD
    subgraph "Sovereign Security Stack"
        Proxy[1. Security Proxy<br/>CSP/HSTS/Headers] --> Auth[2. Hardened Auth<br/>Lockout/Tracking]
        Auth --> Guard[3. API Gatekeeper<br/>RBAC/Zod Validation]
        Guard --> Shield[4. Shield Layer<br/>Redis Rate Limiting]
        Shield --> Audit[5. Audit Ledger<br/>Immutable Logging]
    end

    subgraph "Core Application (Next.js)"
        Audit --> UI[6. Cinematic UI<br/>Framer Motion]
        Audit --> API[7. Secure Business Logic<br/>Checkout/Payments]
        API --> Assets[8. Asset Protection<br/>S3 Signed URLs]
    end

    subgraph "Data & Persistence"
        API --> Prisma[9. Prisma Extensions<br/>AES-256-GCM Encryption]
        Prisma --> DB[(10. Supabase PostgreSQL<br/>RLS/Data Isolation)]
    end

    subgraph "Infrastructure & Resilience"
        DB --> Backup[11. Shadow Backup<br/>pg_dump/Rotation]
        CI[12. CI/CD Pipeline<br/>Security Audits] --> Deploy[13. Sovereign Deployment<br/>Railway/Vercel]
    end

    style Proxy fill:#C6A972,stroke:#000,color:#000
    style Audit fill:#f44,stroke:#000,color:#fff
    style Prisma fill:#3FCF8E,stroke:#000,color:#000
    style CI fill:#2088FF,stroke:#000,color:#fff
```

---

## 🛡️ Phase A: The Outer Shield (Networking & Access)

### 1. Security Proxy (`src/proxy.js`)
*   **The Guard**: Centralized Next.js Middleware.
*   **Deep Logic**: Uses a response-injection pattern to ensure that NO request leaves the server without a **Sovereign Security Header** stack.
    ```javascript
    // Enforcement Pattern
    response.headers.set("Content-Security-Policy", cspDirectives);
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    ```

### 2. RBAC - Role-Based Access Control (`src/middleware/withRoles.js`)
*   **The Guard**: Higher-Order Function (HOF) wrapper for API routes.
*   **Deep Logic**: Decodes the JWT session server-side and cross-references the `user.role` field.
*   **Enforcement**: `/admin/**` routes are strictly blocked for non-`ADMIN` tokens, returning a `403 Forbidden` before business logic executes.

### 3. Zod Validation Gatekeeper (`src/middleware/withValidation.js`)
*   **The Guard**: Schema-first validation layer.
*   **Deep Logic**: Centralized schema registry in `src/lib/validation/schemas/`. 
*   **Enforcement**: Uses `withValidation(Schema)` to wrap routes. Rejects malformed JSON with `422 Unprocessable Entity`.

---

## 🆔 Phase B: The Identity Core (Authentication)

### 4. Hardened NextAuth (`src/lib/auth-options.js`)
*   **The Guard**: NextAuth Credentials Provider.
*   **Deep Logic**: Implements a "Lockout Clock." 
    ```javascript
    const lockUntil = newFailCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;
    ```
*   **Enforcement**: Automatically updates the `lockedUntil` timestamp in the database on consecutive failures.

### 5. Device Fingerprinting (`src/lib/auth/device-fingerprint.js`)
*   **The Guard**: SHA-256 Fingerprint Generator.
*   **Deep Logic**: Combines `ipAddress`, `userAgent`, and `acceptLanguage` into a canonical string for hashing.
*   **Enforcement**: Stores fingerprints in the `devicefingerprint` table with a unique constraint on `(userId, fingerprintHash)`.

### 6. Immutable Audit Ledger (`src/lib/audit/audit-logger.js`)
*   **The Guard**: Global `auditLog` utility.
*   **Deep Logic**: Asynchronous, non-blocking logging that records IP, UA, Severity, and JSON Metadata.
*   **Structure**: Uses a dedicated `AuditLog` model in Prisma designed for high-write throughput.

---

## 🔐 Phase C: The Data Vault (Encryption & Storage)

### 7. AES-256-GCM Field Encryption (`src/lib/crypto/field-encryption.js`)
*   **The Guard**: Node.js `crypto` with `GCM` mode.
*   **Deep Logic**: Each encrypted field has a unique 12-byte initialization vector (IV) and a 16-byte authentication tag to prevent tampering.
*   **Cipher**: `aes-256-gcm`.

### 8. Prisma Security Extensions (`src/lib/prisma.js`)
*   **The Guard**: Prisma `$extends` client wrapper.
*   **Deep Logic**: Intercepts `create`, `update`, and `find` queries.
*   **Automation**: Automatically scrambles sensitive fields (e.g., `user.mfaSecret`) before they hit the database and descrambles them on retrieval.

### 9. Row-Level Security (RLS) (`prisma/migrations/rls_policies.sql`)
*   **The Guard**: PostgreSQL Native Policies.
*   **Deep Logic**: Configures `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`.
*   **Enforcement**: Ensures that even if a developer forgets a `where` clause, the DB only returns rows matching the authenticated `user_id`.

---

## 📦 Phase D: Assets, Resilience & DevOps

### 10. S3 Signed URL Protection (`src/lib/auth/signed-url.js`)
*   **The Guard**: AWS SDK S3 Presigner.
*   **Deep Logic**: Generates time-limited URLs for the 3D Showroom assets.
*   **Window**: 15-minute expiration.
    ```javascript
    const url = await getSignedUrl(s3, command, { expiresIn: 900 });
    ```

### 11. Shadow Backups
*   **The Guard**: Automated Infrastructure Snapshots.
*   **Mechanism**: Daily PostgreSQL dumps and volume snapshots in the Railway/Vercel environment.

### 12. CI/CD Security Audit (`.github/workflows/security-audit.yml`)
*   **The Guard**: GitHub Actions Security Suite.
*   **Deep Logic**:
    *   **TruffleHog**: Scans for leaked AWS/Stripe keys.
    *   **npm audit**: Blocks the build if high-severity CVEs are found in `package.json`.

### 13. Soft-Delete Protocol (`prisma/schema.prisma`)
*   **The Guard**: Global `deletedAt` field pattern.
*   **Deep Logic**: Logic-level archival. Ensures that business data (Orders, Invoices) remains retrievable for 7 years for compliance, while disappearing from the storefront.

---

## 🏗️ Technical Implementation (6 Enterprise Modules)

The following modules represent the core engineering effort for the Maison NOIR Enterprise Security System:

### Module 1: Schema Resilience
*   **Implementation**: `prisma/schema.prisma`
*   **Features**: Role Enums, MFA Hashed Codes, Session Tracking, Immutable Audit Ledger.

### Module 2: Crypto Core
*   **Files**: `src/lib/crypto/encryption.js`, `src/lib/crypto/tokens.js`
*   **Features**: AES-256-GCM for PII, SHA-256 Device Fingerprinting, JWT (jose) Access Tokens.

### Module 3: Distributed Shield
*   **File**: `src/lib/rateLimit/limiter.js`
*   **Features**: Upstash Redis integration, Sliding-window limiting for Login/Signup/Checkout.

### Module 4: Identity Orchestration
*   **Files**: `src/lib/auth/session.js`, `src/lib/auth/mfa.js`, `src/lib/auth/audit.js`
*   **Features**: Refresh Token Rotation, TOTP/Backup Codes, Non-blocking Audit Logging.

### Module 5: Central Gatekeeper
*   **Files**: `middleware.js`, `src/middleware/withAuth.js`, `src/middleware/withRoles.js`
*   **Features**: Multi-layer Edge Middleware, RBAC enforcement, Global Rate Limit validation.

### Module 6: Asset Vault & Schemas
*   **Files**: `src/app/api/showroom/[productId]/route.js`, `src/schemas/auth.schema.js`
*   **Features**: Cloudinary Signed URL generation (15m window), Strict Zod Schema validation.

---

## 📂 Sovereign Directory Structure

```text
c:\Users\gunde\OneDrive\Desktop\NOIR-1\
├── .github/workflows/
│   ├── security.yml               # Automated CI/CD Audits
├── prisma/
│   ├── schema.prisma              # Sovereign Security Models
├── src/
│   ├── proxy.js                   # Header Injection Proxy
│   ├── middleware.js              # Central Edge Gatekeeper
│   ├── middleware/
│   │   ├── withAuth.js            # Auth Wrapper
│   │   ├── withRoles.js           # RBAC Wrapper
│   │   └── withValidation.js      # Zod Wrapper
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── session.js         # Session Rotation Logic
│   │   │   ├── mfa.js             # TOTP & Backup System
│   │   │   └── audit.js           # Audit Logger Core
│   │   ├── crypto/
│   │   │   ├── encryption.js      # AES-256-GCM & Fingerprinting
│   │   │   └── tokens.js          # JWT & Hashing Engine
│   │   ├── rateLimit/
│   │   │   └── limiter.js         # Upstash Redis Shield
│   │   └── prisma.js              # Hardened Prisma Client
│   └── schemas/
│       ├── auth.schema.js         # Strict Identity Schemas
│       └── user.schema.js         # PII Validation Schemas
```

---

**Architecture Status**: ✅ FULLY OPERATIONAL  
**Standard**: Senior Sovereign Architecture (Phase 8.5 - Enterprise Hardened)

