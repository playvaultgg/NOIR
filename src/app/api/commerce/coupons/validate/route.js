import { NextResponse } from "next/server";
import { validateCoupon } from "@/modules/commerce/coupon.service";

export async function POST(req) {
    try {
        const { code, cartTotal } = await req.json();

        if (!code || !cartTotal) {
            return NextResponse.json({ error: "Invalid Request Payload" }, { status: 400 });
        }

        const result = await validateCoupon(code, cartTotal);
        return NextResponse.json(result);
    } catch (error) {
        console.error("API_COUPON_VALIDATE_ERROR:", error);
        return NextResponse.json({ error: "Validation Protocol Failed" }, { status: 500 });
    }
}
