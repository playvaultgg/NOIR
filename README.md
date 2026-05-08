<div align="center">

# MAISON NOIR

**Sovereign Luxury Commerce Platform**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-0C2451?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://docker.com/)
[![CI/CD](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/features/actions)
[![License](https://img.shields.io/badge/License-MIT-C6A972?style=for-the-badge)](LICENSE)

A production-grade, full-stack luxury e-commerce ecosystem built with **13 layers** of modern web architecture — from cinematic frontend animations to containerized infrastructure with automated backup and recovery.

[Live Demo](https://noir-1.vercel.app/) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [Documentation](#-documentation)

</div>

---

## 🏛️ Architecture

Maison NOIR implements every layer of the **True Full-Stack** — each built to senior engineering standards.

```
┌─────────────────────────────────────────────────┐
│  FRONTEND          Next.js 16 · Framer Motion   │
├─────────────────────────────────────────────────┤
│  BACKEND / APIs    API Routes · NextAuth · JWT   │
├─────────────────────────────────────────────────┤
│  DATABASE          Supabase PostgreSQL · Prisma  │
├─────────────────────────────────────────────────┤
│  SERVERS           Docker Compose · Health API   │
├─────────────────────────────────────────────────┤
│  NETWORKING        CSP · HSTS · Proxy Security   │
├─────────────────────────────────────────────────┤
│  CLOUD INFRA       Railway · Vercel Edge (5 reg) │
├─────────────────────────────────────────────────┤
│  CI / CD           GitHub Actions · 4-stage pipe │
├─────────────────────────────────────────────────┤
│  SECURITY          6-layer defense · HMAC-SHA256 │
├─────────────────────────────────────────────────┤
│  CONTAINERS        4-stage Dockerfile · Compose  │
├─────────────────────────────────────────────────┤
│  CDN               AVIF/WebP · 24hr cache · Edge │
├─────────────────────────────────────────────────┤
│  APP CONTAINERS    Notification · Loading · Error│
├─────────────────────────────────────────────────┤
│  MONITORING        Structured logs · Web Vitals  │
├─────────────────────────────────────────────────┤
│  BACKUP/RECOVERY   pg_dump · Rotation · 3-tier   │
└─────────────────────────────────────────────────┘
```

> See [`STRUCTURE.md`](STRUCTURE.md) for the complete layer-by-layer implementation details.

---

## ✨ Key Features

### Commerce Engine
- **Independent Razorpay Integration** — Secure payment flow with HMAC-SHA256 signature verification
- **Interactive Outfit Builder** — Drag-and-layer garment visualization
- **Bespoke Fragrance Lab** — Custom scent configuration with bottle engraving
- **Smart Cart System** — Persistent cart with cross-selling reminders and abandonment recovery

### Intelligent Personalization
- **AI Stylist** — Real-time recommendation engine analyzing user behavior
- **Discovery Observer** — Silent engagement tracking for personalized suggestions
- **Wishlist Sync** — Cross-device wishlist synchronization

### Cinematic Experience
- **Smooth Scroll Provider** — Custom scroll behavior for luxury tactile feel
- **Framer Motion Animations** — Page transitions, reveal effects, micro-interactions
- **Canvas Confetti** — Golden particle effects on successful acquisitions
- **PDF Certificate Generator** — Executive-grade Certificate of Authenticity on purchase

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| Frontend | Next.js 16, React 19, Framer Motion | App Router, Turbopack, cinematic UI |
| Styling | Vanilla CSS, CSS Variables | Luxury design tokens (gold/black theme) |
| Backend | Next.js API Routes, NextAuth.js | Serverless endpoints, JWT auth |
| Database | Supabase PostgreSQL, Prisma ORM | Managed cloud database, type-safe queries |
| Payments | Razorpay SDK | Order creation, signature verification |
| Security | Custom middleware, LRU rate limiter | CSP, HSTS, input sanitization |
| Containers | Docker, Docker Compose | Multi-stage builds, orchestration |
| CI/CD | GitHub Actions | 4-stage pipeline, deploy gates |
| CDN | Vercel Edge, Next.js Image | AVIF/WebP, global caching |
| Monitoring | Custom logger, Web Vitals | Structured JSON logs, performance tracking |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20.x+
- PostgreSQL 15+
- Git

### Installation

```bash
# Clone
git clone https://github.com/GodlLuffy/NOIR-1.git
cd NOIR-1

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and API keys

# Initialize database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Docker Deployment

```bash
# Full-stack deployment (App + PostgreSQL + Redis)
docker compose up -d

# View logs
docker compose logs -f noir-app
```

---

## 🔑 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/noir_db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-secure-random-string"

# Razorpay Payment Gateway
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="secret_..."
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_..."

# Logging
LOG_LEVEL="info"
```

> See [`.env.example`](.env.example) for the complete configuration template.

---

## 📂 Project Structure

```
NOIR-1/
├── .github/workflows/     # CI/CD pipelines
│   ├── ci.yml              # 4-stage build pipeline
│   └── deploy.yml          # Auto-deployment workflow
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Data seeding
├── scripts/
│   └── backup.mjs          # Backup & recovery CLI
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── api/            # Backend API routes
│   │   │   ├── checkout/   # Order creation
│   │   │   ├── health/     # Infrastructure health
│   │   │   ├── monitor/    # API metrics dashboard
│   │   │   └── razorpay/   # Payment processing
│   │   └── checkout/       # Checkout + success pages
│   ├── components/         # React components
│   ├── containers/         # App-level containers
│   │   ├── AppContainers.jsx
│   │   ├── NotificationContainer.jsx
│   │   ├── LoadingContainer.jsx
│   │   └── ErrorBoundaryContainer.jsx
│   ├── context/            # React context providers
│   ├── lib/                # Core utilities
│   │   ├── api-guard.js    # API security wrapper
│   │   ├── cdn.js          # CDN optimization
│   │   ├── logger.js       # Structured logging
│   │   ├── network.js      # Resilient fetch client
│   │   ├── performance.js  # Web Vitals monitoring
│   │   ├── prisma.js       # Database client (pooled)
│   │   ├── rate-limit.js   # LRU-based rate limiter
│   │   └── security.js     # Input sanitization
│   ├── providers/          # Client providers
│   └── proxy.js            # Network security proxy
├── Dockerfile              # 4-stage production build
├── docker-compose.yml      # Full-stack orchestration
├── railway.json            # Cloud provisioning
├── vercel.json             # Edge deployment config
├── STRUCTURE.md            # 13-layer architecture map
├── SECURITY.md             # Security policy
├── INFRASTRUCTURE.md       # Cloud topology
└── BACKUP.md               # Recovery procedures
```

---

## 📖 Documentation

| Document | Description |
|:---------|:------------|
| [`STRUCTURE.md`](STRUCTURE.md) | Complete 13-layer architecture breakdown |
| [`SECURITY.md`](SECURITY.md) | Multi-layered defense strategy & vulnerability disclosure |
| [`INFRASTRUCTURE.md`](INFRASTRUCTURE.md) | Cloud topology, deployment strategy, disaster recovery |
| [`BACKUP.md`](BACKUP.md) | Backup commands, rotation policy, recovery tiers |

---

## 🔧 Available Commands

| Command | Description |
|:--------|:------------|
| `npm run dev` | Start development server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npx prisma studio` | Open database GUI |
| `npx prisma db seed` | Seed database with sample data |
| `node scripts/backup.mjs` | Create database backup |
| `node scripts/backup.mjs --list` | List available backups |
| `node scripts/backup.mjs --restore latest` | Restore latest backup |
| `docker compose up -d` | Deploy full stack with Docker |

---

## 📬 Contact

**Anup Gundelwar** — Full-Stack Developer

- **Email**: [Gundelwaranup119@gmail.com](mailto:Gundelwaranup119@gmail.com)
- **GitHub**: [@GodlLuffy](https://github.com/GodlLuffy)
- **Phone**: 9226408230

---

<div align="center">

*Designed with precision. Engineered with discipline. Built at Senior standard.*

**© 2026 Maison NOIR. All rights reserved.**

</div>
