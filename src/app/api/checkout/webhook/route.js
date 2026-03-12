import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendOrderConfirmation } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_for_build");

/**
 * POST /api/checkout/webhook
 * Handles Stripe webhook events and creates orders in the database.
 * IMPORTANT: This route must export rawBody config — body parsing disabled.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
    const rawBody = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error("STRIPE_WEBHOOK_SECRET not configured");
        return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    /* ── Handle events ── */
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        
        try {
            const userId = session.metadata?.userId;
            const cartItemsRaw = session.metadata?.cartItems;

            if (!userId || !cartItemsRaw) {
                console.warn("Webhook: Missing userId or cartItems in metadata");
                return NextResponse.json({ received: true });
            }

            const cartItems = JSON.parse(cartItemsRaw);

            // Check not already processed (idempotency)
            const existing = await prisma.order.findFirst({
                where: { stripeSessionId: session.id },
            }).catch(() => null);

            if (existing) {
                return NextResponse.json({ received: true, note: "already processed" });
            }

            // Create order
            const order = await prisma.order.create({
                data: {
                    userId,
                    totalAmount: session.amount_total / 100,
                    status: "PENDING",
                    stripeSessionId: session.id,
                    items: {
                        create: cartItems.map((item) => ({
                            productId: item.id,
                            quantity: item.quantity || 1,
                            priceAtBuy: item.price || 0,
                        })),
                    },
                },
            });

            console.log("Order created:", order.id);

            // Send order confirmation email (fail-safe)
            try {
                const user = await prisma.user.findUnique({
                    where: { id: userId },
                    select: { name: true, email: true },
                });
                if (user?.email) {
                    await sendOrderConfirmation({
                        to: user.email,
                        name: user.name || "",
                        orderId: order.id,
                        items: cartItems.map((i) => ({ name: i.name, quantity: i.quantity || 1, price: i.price || 0 })),
                        total: order.totalAmount,
                    });
                }
            } catch (emailErr) {
                console.warn("Order confirmation email failed:", emailErr.message);
            }
        } catch (err) {
            console.error("Error creating order from webhook:", err);
            return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
        }
    }

    if (event.type === "payment_intent.payment_failed") {
        const pi = event.data.object;
        console.warn("Payment failed:", pi.id);
        // Could update order status here if needed
    }

    return NextResponse.json({ received: true });
}
