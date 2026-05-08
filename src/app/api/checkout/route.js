import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500,
});

export async function POST(req) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "anonymous";
        const { isRateLimited } = limiter.check(null, 5, ip); // Limit to 5 attempts per minute

        if (isRateLimited) {
            return NextResponse.json({ error: "Excessive acquisition attempts. Please wait 60 seconds." }, { status: 429 });
        }

        const session = await getServerSession(authOptions);
        const body = await req.json();
        console.log("Full Checkout Request Body:", JSON.stringify(body, null, 2));
        const { items, totalAmount } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        console.log("Processing Checkout for:", { itemCount: items.length, totalAmount });

        let userId;

        if (session?.user?.id) {
            // Verify the user still exists in the database (handles stale sessions)
            const existingUser = await prisma.user.findUnique({
                where: { id: session.user.id }
            });

            if (existingUser) {
                userId = existingUser.id;
            }
        }

        if (!userId) {
            // Guest Checkout or Stale Session - Create an anonymous user
            const guestUser = await prisma.user.create({
                data: {
                    name: "Guest Client",
                    email: `guest_${Date.now()}@noir.local`,
                    role: "USER"
                }
            });
            userId = guestUser.id;
        }

        // Create order and order items in a transaction with extended timeout
        const order = await prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    status: "PENDING",
                    isSuspect: totalAmount > 200000, // High-value threshold for fraud review
                }
            });

            // Initial activity log
            await tx.orderlog.create({
                data: {
                    orderId: newOrder.id,
                    status: "PENDING",
                    changedBy: "SYSTEM",
                    message: "Order placed via digital checkout"
                }
            });

            const orderItems = items.map((item) => ({
                orderId: newOrder.id,
                productId: item.id,
                quantity: item.quantity,
                priceAtBuy: item.priceAmount || item.price || 0
            }));

            await tx.orderitem.createMany({
                data: orderItems
            });

            // 4. Update Stock
            for (const item of items) {
                try {
                    await tx.product.update({
                        where: { id: item.id },
                        data: { stock: { decrement: item.quantity } }
                    });
                } catch (e) {
                    if (e.code === 'P2025') {
                        throw new Error(`Product with ID ${item.id} not found in database. Please clear your cart and try again.`);
                    }
                    throw e;
                }
            }

            // Log activity
            await tx.customeractivity.create({
                data: {
                    userId,
                    action: "PURCHASE",
                    metadata: {
                        orderId: newOrder.id,
                        totalAmount,
                        itemCount: items.length
                    }
                }
            });

            return newOrder;
        }, {
            maxWait: 5000,
            timeout: 10000
        });

        return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });

    } catch (error) {
        console.error("Checkout Error Details:", error);
        return NextResponse.json({ error: "Failed to process checkout", details: error.message }, { status: 500 });
    }
}
