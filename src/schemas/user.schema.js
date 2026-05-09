import { z } from "zod";

/**
 * MAISON NOIR — User Profile Schemas
 */

export const UpdateProfileSchema = z.object({
    name: z.string().min(2, "Name is too short").optional(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional(),
    address: z.string().min(5, "Address is too short").optional(),
});
