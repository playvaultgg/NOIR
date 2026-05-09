/**
 * MAISON NOIR — Validation Schemas Barrel Export
 * Single import point for all validation schemas.
 *
 * Usage:
 *   import { LoginSchema, CreateProductSchema } from "@/lib/validation/schemas";
 */

export {
  LoginSchema,
  RegisterSchema,
  MFAVerifySchema,
  MFASetupSchema,
  BackupCodeSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  ChangePasswordSchema,
} from "./auth.schema";

export {
  UserProfileSchema,
  AddressSchema,
  UserRoleSchema,
  NewsletterSchema,
  ContactMessageSchema,
} from "./user.schema";

export {
  CreateProductSchema,
  UpdateProductSchema,
  Product3DAssetSchema,
  ProductReviewSchema,
  ProductQuerySchema,
  ProductParamsSchema,
} from "./product.schema";

export {
  CreateOrderSchema,
  PaymentVerificationSchema,
  UpdateOrderStatusSchema,
  OrderRefundSchema,
  CouponSchema,
} from "./order.schema";
