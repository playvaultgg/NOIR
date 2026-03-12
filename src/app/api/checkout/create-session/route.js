import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

// Initialize Stripe (use environment variable in production)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_secret_key_for_development", {
    apiVersion: "2023-10-16",
});

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const { items } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "No items in checkout." }, { status: 400 });
        }

        let userId = session?.user?.id;

        // If Guest, create an anonymous ledger record
        if (!userId) {
            const guestUser = await prisma.user.create({
                data: {
                    name: "NOIR Guest Client",
                    email: `guest_${Date.now()}@noir.local`,
                    role: "USER"
                }
            });
            userId = guestUser.id;
        }

        // Detect Simulation Mode (if no valid Stripe key is provided)
        const isSimulation = !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock");

        // Create Stripe line items
        const lineItems = items.map((item) => {
            const amount = item.priceAmount || (typeof item.price === 'string' ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 0);
            return {
                price_data: {
                    currency: "eur",
                    product_data: {
                        name: item.name,
                        images: [item.imageUrls?.[0] || item.images?.[0] || item.image || "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop"],
                        metadata: {
                            productId: item.id,
                        }
                    },
                    unit_amount: Math.round(amount * 100), // Stripe expects cents
                },
                quantity: item.quantity || 1,
            };
        });

        const origin = req.headers.get('origin') || "http://localhost:3000";

        if (isSimulation) {
            console.log("SIMULATION MODE ACTIVE: Bypassing Stripe Gateway");
            // Return a simulated success URL for development/demo purposes
            return NextResponse.json({ 
                url: `${origin}/checkout/success?session_id=SIM_SESSION_${Date.now()}`,
                sessionId: `SIM_ID_${Date.now()}`,
                simulated: true
            });
        }

        // Create Stripe checkout session
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/checkout`,
            customer_email: session?.user?.email || undefined,
            metadata: {
                userId: userId,
            }
        });

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
