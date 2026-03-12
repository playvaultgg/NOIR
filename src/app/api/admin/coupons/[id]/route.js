import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH update (toggle active / change value)
export async function PATCH(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const coupon = await prisma.coupon.update({
            where: { id },
            data: body,
        });
        return NextResponse.json(coupon);
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

// DELETE
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        await prisma.coupon.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
