# Maison NOIR — Backup & Recovery Policy

## Overview
Automated database backup and disaster recovery for the NOIR platform.

## Backup Commands

| Command | Purpose |
|---------|---------|
| `node scripts/backup.mjs` | Create a new backup |
| `node scripts/backup.mjs --list` | List all available backups |
| `node scripts/backup.mjs --restore latest` | Restore the most recent backup |
| `node scripts/backup.mjs --restore 2026-05-08` | Restore a specific backup by date |

## Backup Strategy

### Automated Rotation
- Maximum **10 backups** retained at any time
- Oldest backups are automatically deleted when the limit is reached
- Backups are stored in the `backups/` directory (git-ignored)

### Backup Types
1. **Full Backup** (`pg_dump`): Complete database dump including data, schema, and indexes
2. **Schema Backup** (Prisma fallback): Schema-only export when `pg_dump` is unavailable

### Recovery Tiers

| Tier | Method | RPO | RTO |
|------|--------|-----|-----|
| **Tier 1** | Prisma seed reset | 0 (fresh data) | < 2 min |
| **Tier 2** | Local backup restore | Last backup | < 5 min |
| **Tier 3** | Cloud PITR (Railway) | 1 second | < 15 min |

### Recovery Procedure
1. **Assess**: Check `/api/health` to determine database status
2. **Decide**: Choose recovery tier based on data loss tolerance
3. **Execute**: Run the appropriate restore command
4. **Verify**: Confirm restoration via `/api/monitor` metrics

## Git Ignore
The `backups/` directory is excluded from version control to prevent sensitive data exposure.

---
**Status**: [BACKUP PROTOCOL ACTIVE]
**Cleared by**: Infrastructure Lead / Maison NOIR
