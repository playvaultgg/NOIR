import { z } from "zod";

/**
 * MAISON NOIR — Sovereign Auth Schemas
 * Implements complex password requirements and strict validation.
 */

export const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
});

export const RegisterSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const MFASchema = z.object({
    token: z.string().length(6, "Token must be exactly 6 digits").regex(/^\d+$/, "Token must be numeric"),
});

export const RefreshSchema = z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
});
