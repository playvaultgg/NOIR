import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount, currency = "INR" } = body;
        
        console.log("Razorpay Config Check:", {
            key_id: process.env.RAZORPAY_KEY_ID?.substring(0, 8) + "...",
            has_secret: !!process.env.RAZORPAY_KEY_SECRET
        });
        console.log("Creating Razorpay Order:", { amount, currency });

        if (!amount) {
            return NextResponse.json({ error: "Amount is required" }, { status: 400 });
        }

        let rzpAmount = Math.round(amount * 100); // Razorpay expects amount in paise

        // Simulation Mode: Cap amount if in Test Mode and exceeds limit
        if (process.env.RAZORPAY_KEY_ID?.startsWith('rzp_test_') && rzpAmount > 10000000) {
            console.log("SIMULATION MODE: Capping amount for test transaction");
            rzpAmount = 5000000; // Cap at ₹50,000 for test modal
        }

        const options = {
            amount: rzpAmount,
            currency,
            receipt: `receipt_noir_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order, { status: 200 });
    } catch (error) {
        console.error("CRITICAL Razorpay Order Error:", error);
        const errorDetails = error.error?.description || error.message || JSON.stringify(error);
        return NextResponse.json({ 
            error: "Failed to create Razorpay order", 
            details: errorDetails 
        }, { status: 500 });
    }
}
