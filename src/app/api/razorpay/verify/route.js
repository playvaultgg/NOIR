import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const body = await req.json();
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            orderId // Our internal Prisma order ID
        } = body;

        const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {
            // Payment verified successfully
            if (orderId) {
                await prisma.order.update({
                    where: { id: orderId },
                    data: { 
                        status: "PROCESSING",
                        // You might want to store the payment ID as well
                    }
                });

                // Add log
                await prisma.orderlog.create({
                    data: {
                        orderId,
                        status: "PROCESSING",
                        changedBy: "SYSTEM",
                        message: `Razorpay Payment Verified: ${razorpay_payment_id}`
                    }
                });
            }

            return NextResponse.json({ success: true, message: "Payment verified successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ success: false, message: "Invalid payment signature" }, { status: 400 });
        }
    } catch (error) {
        console.error("Razorpay Verification Error:", error);
        return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 });
    }
}
