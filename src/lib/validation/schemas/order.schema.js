import { z } from "zod";

/**
 * MAISON NOIR — Order Validation Schemas
 * Validates checkout, order creation, payment tokens, and order management.
 */

// ── Order Item ───────────────────────────────────────────────

const OrderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(1, "Quantity must be at least 1")
    .max(10, "Maximum 10 units per item per order"),
});

// ── Shipping Address (Embedded) ──────────────────────────────

const ShippingAddressSchema = z.object({
  street: z
    .string()
    .trim()
    .min(5, "Street must be at least 5 characters")
    .max(200, "Street must not exceed 200 characters"),
  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters")
    .max(100),
  state: z
    .string()
    .trim()
    .min(2, "State must be at least 2 characters")
    .max(100),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code must be at least 3 characters")
    .max(20)
    .regex(/^[A-Za-z0-9\s\-]+$/, "Invalid postal code format"),
  country: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .regex(
      /^\+[1-9]\d{6,14}$/,
      "Phone must be in E.164 format (e.g. +919226408230)"
    )
    .optional(),
});

// ── Create Order (Checkout) ──────────────────────────────────

export const CreateOrderSchema = z.object({
  items: z
    .array(OrderItemSchema)
    .min(1, "Order must contain at least 1 item")
    .max(50, "Order must not exceed 50 items"),
  shippingAddress: ShippingAddressSchema,
  paymentMethod: z.enum(["RAZORPAY", "STRIPE", "COD"], {
    errorMap: () => ({
      message: "Payment method must be RAZORPAY, STRIPE, or COD",
    }),
  }),
  couponCode: z
    .string()
    .trim()
    .max(50, "Coupon code must not exceed 50 characters")
    .regex(/^[A-Z0-9\-_]+$/i, "Invalid coupon code format")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(500, "Notes must not exceed 500 characters")
    .optional(),
});

// ── Payment Verification ─────────────────────────────────────

export const PaymentVerificationSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  razorpay_order_id: z.string().min(1, "Razorpay order ID is required").optional(),
  razorpay_payment_id: z.string().min(1, "Razorpay payment ID is required").optional(),
  razorpay_signature: z.string().min(1, "Razorpay signature is required").optional(),
  stripeSessionId: z.string().min(1, "Stripe session ID is required").optional(),
}).refine(
  (data) => {
    // Must have either Razorpay or Stripe verification data
    const hasRazorpay = data.razorpay_order_id && data.razorpay_payment_id && data.razorpay_signature;
    const hasStripe = data.stripeSessionId;
    return hasRazorpay || hasStripe;
  },
  { message: "Must provide either Razorpay or Stripe payment verification data" }
);

// ── Order Status Update (Admin) ──────────────────────────────

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  status: z.enum(
    ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
    {
      errorMap: () => ({
        message:
          "Status must be PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED, or REFUNDED",
      }),
    }
  ),
  trackingNumber: z
    .string()
    .trim()
    .max(100, "Tracking number must not exceed 100 characters")
    .optional(),
  courierName: z
    .string()
    .trim()
    .max(100, "Courier name must not exceed 100 characters")
    .optional(),
  message: z
    .string()
    .trim()
    .max(500, "Message must not exceed 500 characters")
    .optional(),
});

// ── Order Refund ─────────────────────────────────────────────

export const OrderRefundSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  amount: z
    .number()
    .positive("Refund amount must be positive")
    .max(999999.99, "Refund amount must not exceed 999,999.99"),
  reason: z
    .string()
    .trim()
    .min(10, "Refund reason must be at least 10 characters")
    .max(500, "Refund reason must not exceed 500 characters"),
});

// ── Coupon Validation ────────────────────────────────────────

export const CouponSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .min(3, "Coupon code must be at least 3 characters")
    .max(50, "Coupon code must not exceed 50 characters")
    .regex(/^[A-Z0-9\-_]+$/, "Coupon code may only contain letters, numbers, hyphens, and underscores"),
  description: z.string().trim().max(200).optional(),
  discountType: z.enum(["PERCENT", "FIXED"], {
    errorMap: () => ({ message: "Discount type must be PERCENT or FIXED" }),
  }),
  discountValue: z
    .number()
    .positive("Discount value must be positive")
    .max(999999.99),
  minOrderValue: z.number().min(0).default(0),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.coerce.date().optional(),
  isActive: z.boolean().optional().default(true),
});
