import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { parseImages } from "@/lib/utils";

// Initialize Stripe (use environment variable in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key_for_development", {
    apiVersion: "2023-10-16",
});

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const { items, totalAmount, couponCode, shippingAddress } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in checkout." }, { status: 400 });
        }

        let userId = session?.user?.id;

        // Initialize fallback values
        let order;
        let finalUserId = userId;

        // Detect Simulation Mode (if no valid Stripe key is provided)
        const isSimulation = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock");

        // --- Sovereign Ledger Sync (DB Operations) ---
        try {
            // 1. Guest User Logic
            if (!finalUserId) {
                const guestEmail = shippingAddress?.email || `guest_${Date.now()}@noir.local`;
                const guestUser = await prisma.user.upsert({
                    where: { email: guestEmail },
                    update: {},
                    create: {
                        name: `${shippingAddress?.firstName || "Guest"} ${shippingAddress?.lastName || "Client"}`.trim(),
                        email: guestEmail,
                        role: "USER"
                    }
                });
                finalUserId = guestUser.id;
            }

            // 2. Coupon Tracking
            if (couponCode) {
                await prisma.coupon.update({
                    where: { code: couponCode.toUpperCase() },
                    data: { usedCount: { increment: 1 } }
                });
            }

            // 3. Create Order
            order = await prisma.order.create({
                data: {
                    id: crypto.randomUUID(),
                    userId: finalUserId,
                    totalAmount: Number(totalAmount),
                    status: "PENDING",
                    updatedAt: new Date(),
                    items: {
                        create: items.map(item => ({
                            id: crypto.randomUUID(),
                            productId: item.id,
                            quantity: item.quantity,
                            priceAtBuy: Number(item.priceAmount || 0)
                        }))
                    }
                }
            });

            // 4. Log Activity
            await prisma.customerActivity.create({
                data: {
                    userId: finalUserId,
                    action: "INIT_CHECKOUT",
                    metadata: { orderId: order.id, totalAmount, itemsCount: items.length }
                }
            });

        } catch (dbError) {
            console.warn("[SOVEREIGN FAILSAFE] Database connection interruption. Executing Archive Protocol.", dbError.message);
            order = {
                id: `MN_ARCHIVE_${Date.now()}`,
                totalAmount,
                status: "PENDING_OFFLINE"
            };
            finalUserId = finalUserId || "GUEST_PROTOCOL";
        }

        // Create Stripe line items
        const lineItems = items.map((item) => {
            const amount = item.priceAmount || (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 0);
            return {
                price_data: {
                    currency: "inr", // Switching to INR to match the site's primary currency
                    product_data: {
                        name: item.name,
                        images: [parseImages(item.imageUrls || item.images)[0] || item.image || "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop"],
                        metadata: {
                            productId: item.id,
                        }
                    },
                    unit_amount: Math.round(amount * 100), // Stripe expects cents
                },
                quantity: item.quantity || 1,
            };
        });

        // Add Discount as a negative line item if applicable
        const orderTotalFromItems = items.reduce((acc, item) => acc + (item.priceAmount * item.quantity), 0);
        if (totalAmount < orderTotalFromItems) {
            const discount = orderTotalFromItems - totalAmount;
            lineItems.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Maison Protocol Discount",
                    },
                    unit_amount: -Math.round(discount * 100),
                },
                quantity: 1,
            });
        }

        const origin = req.headers.get('origin') || "http://localhost:3000";

        if (isSimulation) {
            console.log("SIMULATION MODE ACTIVE: Bypassing Stripe Gateway");
            return NextResponse.json({ 
                url: `${origin}/checkout/success?session_id=SIM_SESSION_${order.id}`,
                sessionId: `SIM_ID_${order.id}`,
                simulated: true
            });
        }

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
            cancel_url: `${origin}/checkout`,
            customer_email: session?.user?.email || shippingAddress?.email,
            metadata: {
                userId: userId,
                orderId: order.id
            }
        });

        // Update Order with Stripe Session ID with Failsafe
        try {
            await prisma.order.update({
                where: { id: order.id },
                data: { stripeSessionId: checkoutSession.id }
            });
        } catch (updateError) {
            console.warn("[FAILSFAIL MODE] Stripe Session ID persistence skipped.");
        }

        return NextResponse.json({ url: checkoutSession.url, sessionId: checkoutSession.id });
    } catch (error) {
        console.error("DETAILED STRIPE ERROR:", {
            message: error.message,
            stack: error.stack,
            code: error.code,
            type: error.type
        });
        return NextResponse.json({ 
            error: "Failed to initialize payment gateway.", 
            details: error.message 
        }, { status: 500 });
    }
}
