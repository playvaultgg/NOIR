import prisma from "@/lib/prisma";

/**
 * Maison NOIR Coupon Service
 * Validates curated discount protocols for elite acquisitions.
 */
export async function validateCoupon(code, cartTotal) {
    try {
        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!coupon) {
            return { valid: false, message: "Invalid Protocol Code" };
        }

        if (!coupon.isActive) {
            return { valid: false, message: "Protocol Deactivated" };
        }

        if (coupon.expiresAt && new Date() > new Date(coupon.expiresAt)) {
            return { valid: false, message: "Protocol Expired" };
        }

        if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
            return { valid: false, message: "Protocol Limit Reached" };
        }

        if (cartTotal < coupon.minOrderValue) {
            return { 
                valid: false, 
                message: `Minimum Acquisition Value of ₹${coupon.minOrderValue.toLocaleString()} required` 
            };
        }

        let discountAmount = 0;
        if (coupon.discountType === "PERCENT") {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
        } else {
            discountAmount = coupon.discountValue;
        }

        return {
            valid: true,
            discountAmount,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
            code: coupon.code,
            message: "Protocol Accepted"
        };
    } catch (error) {
        console.error("[Coupon Engine Error]:", error);
        return { valid: false, message: "Engine Synchronization Failure" };
    }
}
