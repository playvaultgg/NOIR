# Maison NOIR | Cloud Infrastructure Blueprint

This document defines the high-availability cloud architecture for the NOIR platform.

## 1. Topography
- **Platform Layer**: Next.js 16 deployed on Global Edge Networks.
- **Compute Layer**: Containerized Node.js runtime with horizontal auto-scaling.
- **Data Layer**: Supabase-managed PostgreSQL with automated backups and connection pooling.
- **Caching Layer**: Redis instance for session persistence and rapid API responses.

## 2. Infrastructure as Code (IaC)
We use standardized manifests to ensure environment parity:
- `railway.json`: Provisions the back-end services, database, and caching.
- `vercel.json`: Controls edge routing and image optimization delivery.
- `Dockerfile`: Defines the immutable container environment.

## 3. Deployment Strategy
1. **CI/CD**: Every push to `main` triggers an automated build in GitHub Actions.
2. **Build Stage**: Environment variables are validated, and the Prisma client is generated.
3. **Provisioning**: Railway detects the new build, executes `prisma migrate deploy`, and performs a zero-downtime rolling restart.
4. **Health Check**: The deployment is only finalized once `/api/health` returns a `200 OK`.

## 4. Disaster Recovery
- **Database**: Automated point-in-time recovery (PITR) enabled.
- **Secrets**: Encrypted at rest in the Cloud Provider's secure vault.
- **Failover**: Multi-region edge routing ensures the UI remains up even if a primary region is down.

---
**Status**: [CLOUD INFRASTRUCTURE PROVISIONED]
**Cleared by**: Infrastructure Lead / Maison NOIR
