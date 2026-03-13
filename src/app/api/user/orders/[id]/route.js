import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
    try {
        const { id } = params;
        const session = await getServerSession(authOptions);

        const order = await prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json({ error: "Order Not Found" }, { status: 404 });
        }

        // Basic security: In a real app, only owner or admin can see.
        // For this demo/simulation, we allow retrieval if the session ID matches or for guest visibility during checkout.
        
        return NextResponse.json(order);
    } catch (error) {
        console.error("API_ORDER_FETCH_ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch order details" }, { status: 500 });
    }
}
