import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all coupons
export async function GET() {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(coupons);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// POST create coupon
export async function POST(req) {
    try {
        const body = await req.json();
        const { code, description, discountType, discountValue, minOrderValue, maxUses, expiresAt } = body;

        if (!code || !discountValue) {
            return NextResponse.json({ error: "code and discountValue are required" }, { status: 400 });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: code.toUpperCase().trim(),
                description,
                discountType: discountType || "PERCENT",
                discountValue: Number(discountValue),
                minOrderValue: Number(minOrderValue || 0),
                maxUses: maxUses ? Number(maxUses) : null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
            },
        });
        return NextResponse.json(coupon, { status: 201 });
    } catch (e) {
        if (e.code === "P2002") {
            return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
        }
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
