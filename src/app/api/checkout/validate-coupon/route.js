import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * POST /api/checkout/validate-coupon
 * Body: { code, orderTotal }
 * Returns: { valid, discount, finalTotal, coupon }
 */
export async function POST(req) {
    try {
        const { code, orderTotal } = await req.json();
        if (!code) return NextResponse.json({ valid: false, error: "No code provided" });

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase().trim() },
        });

        if (!coupon) return NextResponse.json({ valid: false, error: "Invalid coupon code" });
        if (!coupon.isActive) return NextResponse.json({ valid: false, error: "This coupon is inactive" });
        if (coupon.expiresAt && new Date() > coupon.expiresAt) {
            return NextResponse.json({ valid: false, error: "This coupon has expired" });
        }
        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return NextResponse.json({ valid: false, error: "This coupon has reached max usage" });
        }
        if (orderTotal < coupon.minOrderValue) {
            return NextResponse.json({
                valid: false,
                error: `Minimum order value ₹${coupon.minOrderValue.toLocaleString("en-IN")} required`,
            });
        }

        const discount = coupon.discountType === "PERCENT"
            ? (orderTotal * coupon.discountValue) / 100
            : coupon.discountValue;

        return NextResponse.json({
            valid: true,
            discount: Math.min(discount, orderTotal),
            finalTotal: Math.max(0, orderTotal - discount),
            coupon: { code: coupon.code, discountType: coupon.discountType, discountValue: coupon.discountValue },
        });
    } catch (e) {
        return NextResponse.json({ valid: false, error: "Server error" }, { status: 500 });
    }
}
