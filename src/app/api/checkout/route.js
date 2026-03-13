import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const body = await req.json();
        const { items, totalAmount } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        let userId;

        if (session?.user?.id) {
            userId = session.user.id;
        } else {
            // Guest Checkout - Create an anonymous user since userId is required
            const guestUser = await prisma.user.create({
                data: {
                    name: "Guest Client",
                    email: `guest_${Date.now()}@noir.local`, // Ensure unique pseudo-email
                    role: "CUSTOMER"
                }
            });
            userId = guestUser.id;
        }

        // Create order and order items in a transaction
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
                priceAtBuy: item.price
            }));

            await tx.orderitem.createMany({
                data: orderItems
            });

            // Optional: Reduce stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.id },
                    data: { stock: { decrement: item.quantity } }
                });
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
        });

        return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });

    } catch (error) {
        console.error("Checkout Error:", error);
        return NextResponse.json({ error: "Failed to process checkout" }, { status: 500 });
    }
}
