import { z } from "zod";

/**
 * MAISON NOIR — Product Validation Schemas
 * Validates product creation, updates, reviews, and 3D asset references.
 */

// ── Supported Product Categories ─────────────────────────────

const CATEGORIES = [
  "OUTERWEAR",
  "DRESSES",
  "TOPS",
  "BOTTOMS",
  "ACCESSORIES",
  "FOOTWEAR",
  "FRAGRANCE",
  "BAGS",
  "JEWELRY",
  "LIMITED_EDITION",
];

// ── URL Validation ───────────────────────────────────────────

const urlField = z
  .string()
  .url("Invalid URL format")
  .max(2048, "URL must not exceed 2048 characters");

const safeUrlField = urlField.refine(
  (url) => {
    try {
      const parsed = new URL(url);
      return ["https:"].includes(parsed.protocol);
    } catch {
      return false;
    }
  },
  { message: "URL must use HTTPS protocol" }
);

// ── Product Creation ─────────────────────────────────────────

export const CreateProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must not exceed 200 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  price: z
    .number()
    .positive("Price must be a positive number")
    .max(999999.99, "Price must not exceed 999,999.99")
    .multipleOf(0.01, "Price must have at most 2 decimal places"),
  brand: z
    .string()
    .trim()
    .max(100, "Brand must not exceed 100 characters")
    .optional(),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({
      message: `Category must be one of: ${CATEGORIES.join(", ")}`,
    }),
  }),
  imageUrls: z
    .string()
    .min(1, "At least one image URL is required")
    .max(5000, "Image URLs string must not exceed 5000 characters"),
  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .max(99999, "Stock must not exceed 99,999")
    .default(0),
  lowStockThreshold: z
    .number()
    .int("Threshold must be a whole number")
    .min(0, "Threshold cannot be negative")
    .max(999, "Threshold must not exceed 999")
    .default(5),
  isFeatured: z.boolean().optional().default(false),
  slug: z
    .string()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens only"
    )
    .max(200, "Slug must not exceed 200 characters")
    .optional(),
});

// ── Product Update (Partial) ─────────────────────────────────

export const UpdateProductSchema = CreateProductSchema.partial();

// ── 3D Asset Reference ───────────────────────────────────────

export const Product3DAssetSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  assetUrl: safeUrlField,
  assetType: z.enum(["GLTF", "GLB", "OBJ", "FBX", "USDZ"], {
    errorMap: () => ({
      message: "Asset type must be one of: GLTF, GLB, OBJ, FBX, USDZ",
    }),
  }),
  fileSize: z
    .number()
    .positive("File size must be positive")
    .max(104857600, "3D asset must not exceed 100MB")
    .optional(),
});

// ── Product Review ───────────────────────────────────────────

export const ProductReviewSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must not exceed 5"),
  title: z
    .string()
    .trim()
    .max(200, "Title must not exceed 200 characters")
    .optional(),
  comment: z
    .string()
    .trim()
    .min(5, "Comment must be at least 5 characters")
    .max(2000, "Comment must not exceed 2000 characters"),
});

// ── Product Search / Filter Query ────────────────────────────

export const ProductQuerySchema = z.object({
  search: z.string().trim().max(200).optional(),
  category: z.enum(CATEGORIES).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().max(999999.99).optional(),
  sortBy: z
    .enum(["price_asc", "price_desc", "newest", "popular", "name"])
    .optional()
    .default("newest"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(24),
});

// ── Route Parameter Validation ───────────────────────────────

export const ProductParamsSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
});

