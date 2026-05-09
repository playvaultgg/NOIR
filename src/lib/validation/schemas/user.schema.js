import { z } from "zod";

/**
 * MAISON NOIR — User Validation Schemas
 * Validates user profile data, addresses, and account operations.
 */

// ── Phone Validation ──────────────────────────────────────────
// E.164 format: +[country code][subscriber number]

const phoneField = z
  .string()
  .regex(
    /^\+[1-9]\d{6,14}$/,
    "Phone must be in E.164 format (e.g. +919226408230)"
  )
  .optional();

// ── User Profile Update ───────────────────────────────────────

export const UserProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .optional(),
  phone: phoneField,
  marketingOptIn: z.boolean().optional(),
});

// ── Address Schema ────────────────────────────────────────────

export const AddressSchema = z.object({
  street: z
    .string()
    .trim()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address must not exceed 200 characters"),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must not exceed 100 characters"),
  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(100, "State must not exceed 100 characters"),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code must be at least 3 characters")
    .max(20, "Postal code must not exceed 20 characters")
    .regex(/^[A-Za-z0-9\s\-]+$/, "Invalid postal code format"),
  country: z
    .string()
    .trim()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must not exceed 100 characters"),
  isDefault: z.boolean().optional().default(false),
});

// ── Admin: User Role Update ──────────────────────────────────

export const UserRoleSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
  role: z.enum(["USER", "ADMIN", "SELLER", "SUPER_ADMIN"], {
    errorMap: () => ({ message: "Invalid role. Must be USER, ADMIN, SELLER, or SUPER_ADMIN" }),
  }),
});

// ── Newsletter Subscription ──────────────────────────────────

export const NewsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(254, "Email must not exceed 254 characters"),
});

// ── Contact Message ──────────────────────────────────────────

export const ContactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Invalid email address"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject must not exceed 200 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters"),
});
