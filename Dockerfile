# ──────────────────────────────────────
# MAISON NOIR — Sovereign Containerization
# Senior Standard: Multi-stage, hardened, optimized
# ──────────────────────────────────────

# ── Stage 1: Base ──
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ── Stage 2: Dependencies ──
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install only production dependencies first, then all for build
RUN npm ci --omit=dev && cp -R node_modules prod_node_modules
RUN npm ci

# ── Stage 3: Builder ──
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generate Prisma client and build Next.js
RUN npx prisma generate
RUN npm run build

# ── Stage 4: Production Runner ──
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Security: Non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only what's needed for production
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy production-only node_modules for Prisma runtime
COPY --from=deps --chown=nextjs:nodejs /app/prod_node_modules ./node_modules

USER nextjs

EXPOSE 3000

# Health check built into the container
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"]
