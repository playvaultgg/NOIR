<div align="center">

# 🛡️ Security Policy — Maison NOIR

**Sovereign Defense Architecture**

[![Security](https://img.shields.io/badge/Defense_Layers-6-C6A972?style=for-the-badge)](SECURITY.md)
[![OWASP](https://img.shields.io/badge/OWASP-Top_10_Protected-000000?style=for-the-badge)](https://owasp.org/www-project-top-ten/)
[![Encryption](https://img.shields.io/badge/HMAC-SHA256-2D3748?style=for-the-badge)](https://en.wikipedia.org/wiki/HMAC)

</div>

---

## Supported Versions

| Version | Status | Support Level |
|:--------|:-------|:-------------|
| 2.x.x | 🟢 Active | Full security patches + feature updates |
| 1.2.x | 🟡 Maintenance | Critical security patches only |
| < 1.2 | 🔴 EOL | No longer supported — upgrade immediately |

---

## Threat Model

### Assets Under Protection

| Asset | Classification | Location |
|:------|:--------------|:---------|
| Customer PII (name, email, address) | **Confidential** | PostgreSQL (encrypted at rest) |
| Payment credentials (Razorpay tokens) | **Restricted** | Server-side only, never exposed to client |
| Session tokens (JWT) | **Confidential** | HTTP-only cookies, signed with NEXTAUTH_SECRET |
| API keys & secrets | **Restricted** | Environment variables, GitHub encrypted vault |
| Order transaction data | **Internal** | PostgreSQL with immutable audit logs |
| Source code | **Internal** | Private GitHub repository |

### Attack Vectors Addressed

```
┌───────────────────────────────────────────────────────────┐
│                    INTERNET (Untrusted)                     │
└──────────────────────────┬────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │   LAYER 1: EDGE         │  CDN Cache · DDoS Absorption
              │   Vercel / Cloudflare   │  Bot Detection · Geo-filtering
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   LAYER 2: PROXY        │  CSP · HSTS · X-Frame-Options
              │   src/proxy.js          │  Rate Limiting · Auth Check
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   LAYER 3: API GUARD    │  Method Validation · Payload Limit
              │   lib/api-guard.js      │  Fingerprint Tracking · 429 Response
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   LAYER 4: VALIDATION   │  XSS Sanitization · Email Check
              │   lib/security.js       │  Numeric Validation · Nonce Gen
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   LAYER 5: AUTH         │  NextAuth.js · JWT · RBAC
              │   NextAuth + Prisma     │  Session Expiry · Stale Recovery
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │   LAYER 6: DATA         │  FK Constraints · Transactions
              │   PostgreSQL + Prisma   │  Audit Logs · Encrypted at Rest
              └────────────┴────────────┘
```

---

## Security Architecture — Deep Dive

### Layer 1 — Edge & Network Security

**File**: `src/proxy.js` + `vercel.json`

| Header | Value | Protection |
|:-------|:------|:-----------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' https://checkout.razorpay.com` | Prevents XSS, code injection |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years |
| `X-Frame-Options` | `SAMEORIGIN` | Prevents clickjacking |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME-type sniffing |
| `X-XSS-Protection` | `1; mode=block` | Legacy XSS filter activation |
| `Referrer-Policy` | `origin-when-cross-origin` | Controls referrer data leakage |
| `X-DNS-Prefetch-Control` | `on` | Optimizes DNS while maintaining security |

### Layer 2 — API Protection

**File**: `src/lib/api-guard.js`

```javascript
// Usage: Wrap any API route with security middleware
import { withApiSecurity } from '@/lib/api-guard';

async function handler(request) { /* ... */ }

export const POST = withApiSecurity(handler, {
    methods: ['POST'],
    rateLimitMax: 5,        // 5 requests per minute
    requireAuth: false,
});
```

**Protections**:
- ✅ HTTP method whitelisting (rejects unexpected methods)
- ✅ Per-client rate limiting via IP + User-Agent fingerprint
- ✅ Request payload size guard (1MB maximum)
- ✅ Automatic `X-RateLimit-Remaining` header injection
- ✅ Centralized error handling (no stack traces leaked to client)

### Layer 3 — Input Sanitization

**File**: `src/lib/security.js`

| Function | Purpose |
|:---------|:--------|
| `sanitizeInput(string)` | Encodes HTML entities (`<`, `>`, `"`, `'`, `/`) |
| `sanitizeObject(obj)` | Recursively sanitizes all string values in nested objects |
| `isValidEmail(email)` | RFC-compliant email format validation |
| `isPositiveNumber(value)` | Validates financial amounts (positive, finite) |
| `generateNonce()` | Cryptographic nonce for CSP dynamic scripts |
| `getClientFingerprint(req)` | IP + User-Agent based client identification |

### Layer 4 — Authentication & Authorization

**Framework**: NextAuth.js with JWT Strategy

| Feature | Implementation |
|:--------|:--------------|
| Session Type | JWT (stateless, scalable) |
| Token Storage | HTTP-only cookie (not accessible via JavaScript) |
| Role System | `USER` / `ADMIN` (Prisma enum) |
| Admin Protection | Server-side role check in `proxy.js` |
| Stale Sessions | Automatic guest fallback in checkout |
| Secret Rotation | Supports `NEXTAUTH_SECRET` rotation without user logout |

### Layer 5 — Payment Security

**Framework**: Razorpay with Server-Side Verification

```
Client                    Server                   Razorpay
  │                         │                         │
  ├─ Cart Data ────────────►│                         │
  │                         ├─ Create Order ─────────►│
  │                         │◄─ Order ID + Amount ────┤
  │◄─ Order ID ────────────┤                         │
  │                         │                         │
  ├─ Payment via Razorpay ──┼────────────────────────►│
  │◄─ Payment Response ─────┼────────────────────────┤
  │                         │                         │
  ├─ Signature + IDs ──────►│                         │
  │                         ├─ HMAC-SHA256 Verify ───►│
  │                         │   (Server-side only)    │
  │◄─ Success / Failure ───┤                         │
```

**Critical Controls**:
- ⛔ Client **never** sets the price — amount is always calculated server-side
- ⛔ Razorpay secret key **never** leaves the server
- ✅ Every payment verified with `HMAC-SHA256(order_id|payment_id, secret)`
- ✅ Transaction logged in `orderlog` table for audit trail

### Layer 6 — Data Protection

**Database**: PostgreSQL 15 with Prisma ORM

| Control | Implementation |
|:--------|:--------------|
| Foreign Key Constraints | All relationships enforced at DB level |
| Transaction Isolation | Prisma `$transaction()` for atomic operations |
| Connection Pooling | `pg.Pool` with max 20 connections, error isolation |
| Audit Trail | `OrderLog` model records all status changes |
| Backup Rotation | Last 10 backups retained, automated deletion |

---

## OWASP Top 10 Coverage

| # | Vulnerability | Status | Mitigation |
|:--|:-------------|:-------|:-----------|
| A01 | Broken Access Control | ✅ Protected | RBAC via NextAuth, admin route guarding in proxy |
| A02 | Cryptographic Failures | ✅ Protected | HMAC-SHA256, HTTPS enforced via HSTS |
| A03 | Injection | ✅ Protected | Prisma parameterized queries, input sanitization |
| A04 | Insecure Design | ✅ Protected | Server-side price calculation, never trust client |
| A05 | Security Misconfiguration | ✅ Protected | `poweredByHeader: false`, strict CSP, `.env` excluded |
| A06 | Vulnerable Components | ✅ Monitored | `npm audit` in CI/CD pipeline |
| A07 | Auth Failures | ✅ Protected | JWT sessions, rate limiting on auth endpoints |
| A08 | Data Integrity Failures | ✅ Protected | HMAC signature verification on payments |
| A09 | Logging Failures | ✅ Protected | Structured logger, API monitor, error tracking |
| A10 | SSRF | ✅ Protected | No user-controlled URL fetching, CSP connect-src |

---

## Rate Limiting Policy

| Endpoint | Limit | Window | Response |
|:---------|:------|:-------|:---------|
| `/api/checkout` | 10 requests | 60 seconds | `429 Too Many Requests` |
| `/api/razorpay/*` | 5 requests | 60 seconds | `429 Too Many Requests` |
| All other APIs | 30 requests | 60 seconds | `429 Too Many Requests` |

---

## Incident Response

### Severity Levels

| Level | Description | Response Time | Example |
|:------|:-----------|:-------------|:--------|
| **P0 — Critical** | Active data breach or payment compromise | < 1 hour | Razorpay secret exposed |
| **P1 — High** | Vulnerability with active exploit potential | < 4 hours | SQL injection discovered |
| **P2 — Medium** | Vulnerability with no known exploit | < 24 hours | Missing rate limit on endpoint |
| **P3 — Low** | Informational security improvement | < 7 days | Header misconfiguration |

### Response Procedure

1. **Detect** — Monitor `/api/monitor` for anomalous error rates or latency spikes
2. **Contain** — Rate limit or block offending IPs via proxy configuration
3. **Assess** — Review structured logs (`lib/logger.js`) for scope of impact
4. **Remediate** — Deploy fix via CI/CD pipeline (automated build + security audit)
5. **Recover** — Restore from backup if data integrity is compromised (`scripts/backup.mjs`)
6. **Document** — Log incident details and update this policy

---

## Reporting a Vulnerability

> ⚠️ **DO NOT** open a public GitHub issue for security vulnerabilities.

### Responsible Disclosure

1. **Email**: [Gundelwaranup119@gmail.com](mailto:Gundelwaranup119@gmail.com)
2. **Subject Line**: `[SECURITY] NOIR — Brief Description`
3. **Include**:
   - Detailed description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Suggested fix (if any)

### Response Timeline

| Phase | Timeframe |
|:------|:----------|
| Acknowledgment | Within 48 hours |
| Initial Assessment | Within 72 hours |
| Fix Development | Within 7 days (critical) / 30 days (standard) |
| Public Disclosure | After fix is deployed + 30 day grace period |

---

## Security Checklist for Deployment

- [ ] All environment secrets set in hosting provider's vault
- [ ] `NEXTAUTH_SECRET` is a cryptographically random 32+ character string
- [ ] `RAZORPAY_KEY_ID` starts with `rzp_live_` (not `rzp_test_`)
- [ ] Database `sslmode=require` is enabled in production `DATABASE_URL`
- [ ] `npm audit --audit-level=high` passes with zero vulnerabilities
- [ ] Rate limiting is verified via load test
- [ ] CSP headers confirmed via [securityheaders.com](https://securityheaders.com)
- [ ] HTTPS confirmed via [SSL Labs](https://www.ssllabs.com/ssltest/)
- [ ] Backup script tested with restore verification
- [ ] `/api/health` returns `200 OK` after deployment

---

<div align="center">

*This document is reviewed and updated with every major release.*

**© 2026 Maison NOIR — Security Division**

</div>
