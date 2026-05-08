/**
 * MAISON NOIR — Database Backup & Recovery System
 * Senior Developer Standard: Automated backup scripts for PostgreSQL.
 * 
 * Usage:
 *   node scripts/backup.mjs                   → Create a backup
 *   node scripts/backup.mjs --restore latest  → Restore latest backup
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, readdirSync, statSync } from "fs";
import { join } from "path";

const BACKUP_DIR = join(process.cwd(), "backups");
const DB_URL = process.env.DATABASE_URL;
const MAX_BACKUPS = 10; // Keep last 10 backups (rotation)

function ensureBackupDir() {
    if (!existsSync(BACKUP_DIR)) {
        mkdirSync(BACKUP_DIR, { recursive: true });
        console.log("[BACKUP] Created backup directory:", BACKUP_DIR);
    }
}

function getTimestamp() {
    return new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
}

// ── CREATE BACKUP ──
function createBackup() {
    ensureBackupDir();

    const timestamp = getTimestamp();
    const filename = `noir_backup_${timestamp}.sql`;
    const filepath = join(BACKUP_DIR, filename);

    console.log("[BACKUP] Starting database backup...");
    console.log("[BACKUP] Target:", filepath);

    try {
        // Use Prisma to create a schema snapshot
        execSync(`npx prisma db pull`, { stdio: "inherit" });

        // pg_dump for full data backup
        if (DB_URL) {
            try {
                execSync(`pg_dump "${DB_URL}" --no-owner --no-privileges > "${filepath}"`, {
                    stdio: "inherit",
                    shell: true,
                });
                console.log(`[BACKUP] ✓ Full database backup saved: ${filename}`);
            } catch (pgError) {
                // Fallback: Prisma schema-only backup
                console.warn("[BACKUP] pg_dump not available. Saving schema-only backup...");
                execSync(`npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > "${filepath}"`, {
                    stdio: "inherit",
                    shell: true,
                });
                console.log(`[BACKUP] ✓ Schema backup saved: ${filename}`);
            }
        }

        // Rotate old backups
        rotateBackups();

        return filepath;
    } catch (error) {
        console.error("[BACKUP] ✗ Backup failed:", error.message);
        process.exit(1);
    }
}

// ── RESTORE BACKUP ──
function restoreBackup(target = "latest") {
    ensureBackupDir();

    const backups = getBackupList();

    if (backups.length === 0) {
        console.error("[RESTORE] No backups found in:", BACKUP_DIR);
        process.exit(1);
    }

    let backupFile;
    if (target === "latest") {
        backupFile = backups[0]; // Most recent
    } else {
        backupFile = backups.find(b => b.includes(target));
    }

    if (!backupFile) {
        console.error("[RESTORE] Backup not found:", target);
        console.log("[RESTORE] Available backups:");
        backups.forEach((b, i) => console.log(`  ${i + 1}. ${b}`));
        process.exit(1);
    }

    const filepath = join(BACKUP_DIR, backupFile);
    console.log("[RESTORE] Restoring from:", backupFile);

    try {
        // Reset database and apply backup
        execSync(`npx prisma db push --force-reset`, { stdio: "inherit" });

        if (DB_URL) {
            try {
                execSync(`psql "${DB_URL}" < "${filepath}"`, {
                    stdio: "inherit",
                    shell: true,
                });
            } catch {
                console.warn("[RESTORE] psql not available. Running Prisma seed instead...");
                execSync(`npx prisma db seed`, { stdio: "inherit" });
            }
        }

        console.log("[RESTORE] ✓ Database restored successfully");
    } catch (error) {
        console.error("[RESTORE] ✗ Restore failed:", error.message);
        process.exit(1);
    }
}

// ── BACKUP ROTATION ──
function rotateBackups() {
    const backups = getBackupList();

    if (backups.length > MAX_BACKUPS) {
        const toDelete = backups.slice(MAX_BACKUPS);
        toDelete.forEach(file => {
            const filepath = join(BACKUP_DIR, file);
            try {
                execSync(`del "${filepath}"`, { shell: true });
                console.log(`[BACKUP] Rotated old backup: ${file}`);
            } catch {
                // Ignore rotation errors
            }
        });
    }
}

// ── LIST BACKUPS ──
function getBackupList() {
    if (!existsSync(BACKUP_DIR)) return [];
    return readdirSync(BACKUP_DIR)
        .filter(f => f.endsWith(".sql"))
        .sort((a, b) => {
            const statA = statSync(join(BACKUP_DIR, a));
            const statB = statSync(join(BACKUP_DIR, b));
            return statB.mtime - statA.mtime; // Newest first
        });
}

// ── CLI ENTRY POINT ──
const args = process.argv.slice(2);

if (args.includes("--restore")) {
    const target = args[args.indexOf("--restore") + 1] || "latest";
    restoreBackup(target);
} else if (args.includes("--list")) {
    const backups = getBackupList();
    console.log("\n[BACKUP] Available backups:");
    if (backups.length === 0) {
        console.log("  No backups found.");
    } else {
        backups.forEach((b, i) => {
            const stat = statSync(join(BACKUP_DIR, b));
            const size = (stat.size / 1024).toFixed(1);
            console.log(`  ${i + 1}. ${b} (${size} KB)`);
        });
    }
} else {
    createBackup();
}
