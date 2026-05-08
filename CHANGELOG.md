# Changelog — Maison NOIR

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.0] — 2026-05-09

### 🏗️ Architecture — "Sovereign Stack" Release

Complete rebuild of the platform to implement all **13 layers** of the True Full-Stack architecture.

### Added
- **Containers**: 4-stage Dockerfile with health checks, Docker Compose orchestration (App + PostgreSQL + Redis)
- **CI/CD Pipelines**: 4-stage GitHub Actions pipeline (Lint → Build + Security → Deploy Gate) with separate deployment workflow
- **Security**: 6-layer defense system — CSP, HSTS, rate limiting, input sanitization, API guard, HMAC-SHA256 verification
- **CDN**: AVIF/WebP image optimization, multi-tier cache strategy, 5 global edge regions
- **Monitoring & Logging**: Structured JSON logger, Core Web Vitals tracking, API metrics dashboard (`/api/monitor`)
- **Backups & Recovery**: Automated `pg_dump` backup script with rotation (10 max) and 3-tier recovery strategy
- **Cloud Infrastructure**: Railway provisioning manifest, Vercel edge config, `.env.example` template
- **Networking**: Security headers proxy, resilient fetch client with timeouts
- **Application Containers**: NotificationProvider, LoadingProvider, ErrorBoundaryContainer
- **Health Endpoint**: `/api/health` for infrastructure monitoring
- **Performance Monitor**: `MonitoringProvider` with automatic page view tracking

### Changed
- **Database Client**: Upgraded `prisma.js` with connection pooling (20 max), idle timeout, and error isolation
- **Next.js Config**: Added `output: "standalone"`, compression, cache headers, `poweredByHeader: false`
- **Proxy**: Merged security headers into `proxy.js` (replaced deprecated `middleware.js`)

### Documentation
- `STRUCTURE.md` — Complete 13-layer architecture map
- `SECURITY.md` — Threat model, OWASP Top 10 coverage, incident response plan
- `INFRASTRUCTURE.md` — Cloud topology and deployment strategy
- `BACKUP.md` — Recovery procedures and backup commands
- `README.md` — Professional project overview with full tech stack
- `CONTRIBUTING.md` — Contribution guidelines
- `CHANGELOG.md` — This file

---

## [1.2.0] — 2026-05-08

### 💳 Payment Infrastructure Release

### Added
- **Razorpay Integration**: Independent checkout flow with server-side order creation
- **Signature Verification**: HMAC-SHA256 payment validation via `/api/razorpay/verify`
- **Test Mode Simulation**: Amount-capping bypass for luxury items exceeding ₹1,00,000 in test mode
- **PDF Certificate**: Executive "Sovereign Certificate of Authenticity" with watermarks, itemized assets, and digital seal
- **Rate Limiting**: LRU-cache based API protection (5 req/min on checkout)

### Fixed
- Foreign key constraint errors during order creation
- Stale session handling with automatic guest fallback
- `useCartStore` hydration errors

---

## [1.1.0] — 2026-05-07

### 🎨 Frontend Excellence Release

### Added
- AI Stylist recommendation engine
- Discovery Observer for behavioral tracking
- Interactive Outfit Builder
- Bespoke Fragrance Lab
- Smooth Scroll Provider for cinematic UX
- Wishlist synchronization system
- Cart Drawer with cross-selling reminders

---

## [1.0.0] — 2026-05-06

### 🚀 Initial Release

### Added
- Next.js App Router with luxury design system
- PostgreSQL database with Prisma ORM
- NextAuth.js authentication with JWT
- Product catalog with category filtering
- Responsive mobile-first design
- SEO optimization with OpenGraph metadata
