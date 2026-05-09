import { z } from "zod";

/**
 * MAISON NOIR — Authentication Validation Schemas
 * Enterprise-grade input validation for all auth operations.
 *
 * Password Policy (NIST 800-63B compliant):
 *   - Minimum 8 characters
 *   - At least 1 uppercase, 1 lowercase, 1 digit, 1 special character
 *   - Maximum 128 characters (prevent bcrypt DoS)
 */

// ── Shared Field Validators ────────────────────────────────────

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email address")
  .max(254, "Email must not exceed 254 characters");

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

const nameField = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must not exceed 100 characters")
  .regex(
    /^[a-zA-Z\s'\-\.]+$/,
    "Name may only contain letters, spaces, hyphens, apostrophes, and periods"
  );

// ── Login Schema ───────────────────────────────────────────────

export const LoginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required").max(128),
});

// ── Registration Schema ────────────────────────────────────────

export const RegisterSchema = z
  .object({
    name: nameField,
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── MFA Verification Schema ────────────────────────────────────

export const MFAVerifySchema = z.object({
  code: z
    .string()
    .length(6, "MFA code must be exactly 6 digits")
    .regex(/^\d{6}$/, "MFA code must contain only digits"),
  sessionToken: z.string().min(1, "Session token is required"),
});

// ── MFA Setup Schema ──────────────────────────────────────────

export const MFASetupSchema = z.object({
  totpCode: z
    .string()
    .length(6, "Verification code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only digits"),
});

// ── Backup Code Schema ────────────────────────────────────────

export const BackupCodeSchema = z.object({
  code: z
    .string()
    .length(8, "Backup code must be exactly 8 characters")
    .regex(/^[A-Z0-9]{8}$/, "Invalid backup code format"),
});

// ── Password Reset Request ─────────────────────────────────────

export const ForgotPasswordSchema = z.object({
  email: emailField,
});

// ── Password Reset Execution ───────────────────────────────────

export const ResetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── Change Password (Authenticated) ───────────────────────────

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordField,
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must differ from current password",
    path: ["newPassword"],
  });
