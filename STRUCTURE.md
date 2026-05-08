# Maison NOIR | Sovereign Architecture Map

**Every layer of the True Full-Stack, implemented at Senior Developer standard.**

---

## 1. Frontend
| Component | Implementation |
|-----------|---------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Vanilla CSS + Luxury Design Tokens |
| Animations | Framer Motion, Canvas Confetti |
| State | Zustand (Cart, Preferences) |
| Fonts | Inter, Playfair Display (Google Fonts) |
| Icons | Lucide React |

## 2. Backend / APIs
| Component | Implementation |
|-----------|---------------|
| API Layer | Next.js API Routes (serverless) |
| Auth | NextAuth.js with JWT strategy |
| Payments | Independent Razorpay integration |
| Verification | HMAC-SHA256 signature validation |
| API Guard | Reusable `withApiSecurity()` wrapper |

## 3. Database
| Component | Implementation |
|-----------|---------------|
| Engine | Supabase PostgreSQL (Managed Cloud) |
| ORM | Prisma with `@prisma/adapter-pg` |
| Pooling | `pg.Pool` — 20 max connections, idle timeout |
| Schema | Users, Orders, OrderItems, Products, OrderLogs |

## 4. Servers
| Component | Implementation |
|-----------|---------------|
| Runtime | Node.js 20 LTS |
| Orchestration | Docker Compose (app + db + redis) |
| Health | `/api/health` endpoint |
| Process | Non-root container user, graceful shutdown |

## 5. Networking
| Component | Implementation |
|-----------|---------------|
| Security Headers | CSP, HSTS, X-Frame-Options, XSS Protection |
| Proxy | `src/proxy.js` — auth + rate limiting + headers |
| Client | `src/lib/network.js` — timeout, error mapping |
| CORS | Restricted to trusted domains |

## 6. Cloud Infrastructure
| Component | Implementation |
|-----------|---------------|
| Edge Deploy | `vercel.json` — 5 global regions |
| Railway | `railway.json` — auto-provisioning + health checks |
| Env Template | `.env.example` — standardized setup |
| Blueprint | `INFRASTRUCTURE.md` |

## 7. CI / CD Pipelines
| Component | Implementation |
|-----------|---------------|
| CI Workflow | `.github/workflows/ci.yml` — 4-stage pipeline |
| CD Workflow | `.github/workflows/deploy.yml` — auto-deploy on success |
| Stages | Lint → Build + Security (parallel) → Deploy Gate |
| Artifacts | Build output uploaded for deployment |

## 8. Security
| Component | Implementation |
|-----------|---------------|
| Input Sanitization | `src/lib/security.js` — recursive XSS encoding |
| API Protection | `src/lib/api-guard.js` — rate limit, method check, payload guard |
| Rate Limiting | `src/lib/rate-limit.js` — LRU-cache based |
| Policy | `SECURITY.md` — 6-layer defense documentation |

## 9. Containers (Infrastructure)
| Component | Implementation |
|-----------|---------------|
| Dockerfile | 4-stage build, HEALTHCHECK, non-root user |
| Compose | App + PostgreSQL + Redis, isolated network |
| .dockerignore | Prevents secrets from leaking into images |
| Resources | Memory/CPU limits per container |

## 10. CDN
| Component | Implementation |
|-----------|---------------|
| Image Formats | AVIF + WebP auto-detection |
| Cache Strategy | Immutable static, 24hr images, no-cache API |
| Optimization | `src/lib/cdn.js` — adaptive quality, preloading |
| Edge Regions | Cleveland, San Francisco, DC, Mumbai, Singapore |

## 11. Containers (Application)
| Component | Implementation |
|-----------|---------------|
| Notifications | `containers/NotificationContainer.jsx` — toast system |
| Loading | `containers/LoadingContainer.jsx` — global overlay |
| Error Boundary | `containers/ErrorBoundaryContainer.jsx` — categorized errors |
| Compositor | `containers/AppContainers.jsx` — single-import wrapper |

## 12. Monitoring & Logging
| Component | Implementation |
|-----------|---------------|
| Logger | `src/lib/logger.js` — structured JSON, leveled, child loggers |
| Performance | `src/lib/performance.js` — Core Web Vitals (LCP, FID, CLS) |
| API Monitor | `/api/monitor` — live metrics, error rates, per-route stats |
| Page Tracking | `MonitoringProvider.jsx` — auto page view tracking |

## 13. Backups & Recovery
| Component | Implementation |
|-----------|---------------|
| Backup Script | `scripts/backup.mjs` — automated pg_dump with Prisma fallback |
| Rotation | Last 10 backups retained, oldest auto-deleted |
| Restore | CLI restore from latest or specific date |
| Policy | `BACKUP.md` — 3-tier recovery strategy |

---

**Status**: [ALL 13 LAYERS — SOVEREIGN STACK COMPLETE]  
**Architecture Level**: Senior Full-Stack Web Developer  
**Cleared by**: Infrastructure Lead / Maison NOIR
