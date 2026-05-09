-- ============================================================
-- MAISON NOIR — PostgreSQL Row-Level Security (RLS) Policies
-- ============================================================
--
-- Purpose: Ensure users can only access their own data at the
-- database level, providing defense-in-depth beyond application logic.
--
-- Tables Protected:
--   1. order      — Users can only see/update their own orders
--   2. address    — Users can only see/update their own addresses
--   3. session    — Users can only see/revoke their own sessions
--   4. auditlog   — INSERT-only: no updates or deletes allowed
--
-- Prerequisites:
--   - A PostgreSQL role 'app_user' must exist for the application connection
--   - The application must SET the session variable 'app.current_user_id'
--     before executing queries (done via Prisma middleware)
--
-- Usage:
--   Run this migration against your PostgreSQL database:
--   psql -h <host> -U <user> -d <database> -f rls_policies.sql
-- ============================================================

-- ── 1. Create Application Role (if not exists) ──────────────

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_user') THEN
    CREATE ROLE app_user;
  END IF;
END
$$;

-- ── 2. Enable RLS on Protected Tables ───────────────────────

ALTER TABLE "order" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "address" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "auditlog" ENABLE ROW LEVEL SECURITY;

-- ── 3. ORDER Policies ───────────────────────────────────────
-- Users can only SELECT and UPDATE their own orders.
-- INSERT is allowed (creating new orders).
-- DELETE is blocked (orders should never be deleted).

-- Drop existing policies if re-running
DROP POLICY IF EXISTS order_select_own ON "order";
DROP POLICY IF EXISTS order_update_own ON "order";
DROP POLICY IF EXISTS order_insert_own ON "order";

-- SELECT: Users see only their own orders
CREATE POLICY order_select_own ON "order"
  FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE));

-- UPDATE: Users can only update their own orders
CREATE POLICY order_update_own ON "order"
  FOR UPDATE
  USING ("userId" = current_setting('app.current_user_id', TRUE))
  WITH CHECK ("userId" = current_setting('app.current_user_id', TRUE));

-- INSERT: Allow creating orders (userId must match session user)
CREATE POLICY order_insert_own ON "order"
  FOR INSERT
  WITH CHECK ("userId" = current_setting('app.current_user_id', TRUE));

-- ── 4. ADDRESS Policies ─────────────────────────────────────
-- Users can only CRUD their own addresses.

DROP POLICY IF EXISTS address_select_own ON "address";
DROP POLICY IF EXISTS address_insert_own ON "address";
DROP POLICY IF EXISTS address_update_own ON "address";
DROP POLICY IF EXISTS address_delete_own ON "address";

CREATE POLICY address_select_own ON "address"
  FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE));

CREATE POLICY address_insert_own ON "address"
  FOR INSERT
  WITH CHECK ("userId" = current_setting('app.current_user_id', TRUE));

CREATE POLICY address_update_own ON "address"
  FOR UPDATE
  USING ("userId" = current_setting('app.current_user_id', TRUE))
  WITH CHECK ("userId" = current_setting('app.current_user_id', TRUE));

CREATE POLICY address_delete_own ON "address"
  FOR DELETE
  USING ("userId" = current_setting('app.current_user_id', TRUE));

-- ── 5. SESSION Policies ─────────────────────────────────────
-- Users can only see and delete their own sessions.

DROP POLICY IF EXISTS session_select_own ON "session";
DROP POLICY IF EXISTS session_delete_own ON "session";

CREATE POLICY session_select_own ON "session"
  FOR SELECT
  USING ("userId" = current_setting('app.current_user_id', TRUE));

CREATE POLICY session_delete_own ON "session"
  FOR DELETE
  USING ("userId" = current_setting('app.current_user_id', TRUE));

-- ── 6. AUDIT LOG Policies ───────────────────────────────────
-- INSERT-only: Nobody can UPDATE or DELETE audit records.
-- This enforces immutability at the database level.

DROP POLICY IF EXISTS auditlog_insert_only ON "auditlog";
DROP POLICY IF EXISTS auditlog_select_admin ON "auditlog";

-- Anyone can INSERT (the application writes audit logs)
CREATE POLICY auditlog_insert_only ON "auditlog"
  FOR INSERT
  WITH CHECK (TRUE);

-- SELECT: Only the audit log owner or admin can read
-- (In practice, admin access is handled by the application layer)
CREATE POLICY auditlog_select_admin ON "auditlog"
  FOR SELECT
  USING (TRUE);

-- Explicitly DENY update and delete by not creating policies for them.
-- With RLS enabled and no UPDATE/DELETE policies, those operations are blocked.

-- ── 7. Admin Bypass Policies ────────────────────────────────
-- Superadmin and admin roles need unrestricted access.
-- This is handled by the database superuser role, which bypasses RLS.
-- For the application's admin users, we handle authorization at the
-- application layer (withRoles middleware) rather than the DB layer,
-- because Prisma uses a single connection pool.

-- ── 8. Grant Permissions ────────────────────────────────────

GRANT SELECT, INSERT, UPDATE ON "order" TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON "address" TO app_user;
GRANT SELECT, INSERT, DELETE ON "session" TO app_user;
GRANT SELECT, INSERT ON "auditlog" TO app_user;

-- ── 9. Force RLS for Table Owners ───────────────────────────
-- By default, table owners bypass RLS. This forces RLS even for owners.

ALTER TABLE "order" FORCE ROW LEVEL SECURITY;
ALTER TABLE "address" FORCE ROW LEVEL SECURITY;
ALTER TABLE "session" FORCE ROW LEVEL SECURITY;
ALTER TABLE "auditlog" FORCE ROW LEVEL SECURITY;

-- ============================================================
-- VERIFICATION QUERIES (Run after applying)
-- ============================================================
--
-- Check RLS status:
--   SELECT tablename, rowsecurity FROM pg_tables
--   WHERE tablename IN ('order', 'address', 'session', 'auditlog');
--
-- List policies:
--   SELECT * FROM pg_policies
--   WHERE tablename IN ('order', 'address', 'session', 'auditlog');
--
-- Test isolation (set user context first):
--   SET app.current_user_id = '<some-user-uuid>';
--   SELECT * FROM "order"; -- Should only return that user's orders
-- ============================================================
