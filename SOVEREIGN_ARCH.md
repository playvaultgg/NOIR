# Maison NOIR — 13-Layer Sovereign Security Architecture

This document outlines the enterprise-grade security modules implemented in the Maison NOIR luxury e-commerce platform. The architecture is designed on the principle of **Defense in Depth**, where multiple redundant security layers protect the platform's integrity, user data, and digital assets.

---

## 🛡️ Phase A: The Outer Shield (Networking & Access)

### 1. Security Proxy (`proxy.js`)
- **Function**: Centralized traffic interceptor and security header injector.
- **Mechanism**: Enforces strict **Content Security Policy (CSP)**, **HSTS**, **XSS Protection**, and **Frame Options**. It prevents Cross-Site Scripting (XSS) and Clickjacking attacks at the entry point.

### 2. RBAC (Role-Based Access Control)
- **Function**: Governs user permissions across the ecosystem.
- **Mechanism**: Implements hierarchical roles (`USER`, `ADMIN`, `SUPER_ADMIN`). Validates session JWTs against protected route patterns (e.g., `/admin/**`) to prevent unauthorized administrative access.

### 3. Zod Validation Gatekeeper
- **Function**: Syntactic and semantic data sanitization.
- **Mechanism**: Every incoming request body is parsed against strict Zod schemas. Requests containing malformed data, excessive length, or suspicious characters are rejected before reaching the business logic.

---

## 🆔 Phase B: The Identity Core (Authentication)

### 4. Hardened NextAuth
- **Function**: Enterprise-grade identity management.
- **Mechanism**: Upgraded with brute-force protection, account lockout protocols (5 attempts = 15 min lock), and automatic session tracking.

### 5. Device Fingerprinting
- **Function**: Behavioral tracking and anomaly detection.
- **Mechanism**: Captures a deterministic SHA-256 hash of IP, User-Agent, and browser attributes. Detects logins from unknown devices and provides a foundation for "Trust This Device" features.

### 6. Immutable Audit Ledger
- **Function**: Permanent record of security-relevant events.
- **Mechanism**: An INSERT-only database table (`auditlog`) that records every login, failure, role change, and sensitive data access. Designed for forensic analysis and compliance.

---

## 🔐 Phase C: The Data Vault (Encryption & Storage)

### 7. AES-256-GCM Field Encryption
- **Function**: Military-grade protection of data at rest.
- **Mechanism**: Scrambles sensitive PII (MFA secrets, addresses) using authenticated encryption with associated data (AEAD). Data is unreadable even if the raw database is compromised.

### 8. Prisma Security Extensions
- **Function**: Automated encryption lifecycle management.
- **Mechanism**: Integrates encryption directly into the ORM layer (`$extends`). Ensures that encryption/decryption happens transparently during the database I/O, preventing human error in the application code.

### 9. Row-Level Security (RLS)
- **Function**: Database-enforced data isolation.
- **Mechanism**: Implements SQL policies that ensure users can only query their own data. Acts as a fail-safe in case of application-level authorization bugs.

---

## 📦 Phase D: Assets, Resilience & DevOps

### 10. S3 Signed URL Protection
- **Function**: Protection of high-value digital assets (3D models).
- **Mechanism**: Private storage with time-limited (15 min) HMAC-signed access URLs. Prevents direct hotlinking and unauthorized scraping of proprietary 3D boutique assets.

### 11. Shadow Backups
- **Function**: Disaster recovery and data resilience.
- **Mechanism**: Automated database snapshots and off-site rotation protocols, ensuring the business can recover from catastrophic infrastructure failure.

### 12. CI/CD Security Audit
- **Function**: Preventative security in the development lifecycle.
- **Mechanism**: GitHub Actions that perform TruffleHog secret scanning, `npm audit` dependency checks, and security-focused linting on every push to `main`.

### 13. Soft-Delete Protocol
- **Function**: Data integrity and archival compliance.
- **Mechanism**: Records are marked with `deletedAt` rather than being purged. This maintains the relationship integrity of the audit trail while removing data from the active UI.

---

**Architecture Status**: ✅ FULLY OPERATIONAL  
**Verified By**: Maison NOIR Security Engine  
**Standard**: Senior Sovereign Architecture
