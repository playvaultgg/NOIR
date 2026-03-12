import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { sendShippingUpdate } from "@/lib/email";

export async function PATCH(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status, trackingNumber, courierName, refundId, refundAmount } = body;

        const currentOrder = await prisma.order.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!currentOrder) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        const updatedOrder = await prisma.order.update({
            where: { id },
            data: {
                status,
                trackingNumber,
                courierName,
                refundId,
                refundAmount: refundAmount ? Number(refundAmount) : undefined,
            }
        });

        // If status changed to SHIPPED, send email
        if (status === "SHIPPED" && currentOrder.status !== "SHIPPED") {
            try {
                if (currentOrder.user?.email) {
                    await sendShippingUpdate({
                        to: currentOrder.user.email,
                        name: currentOrder.user.name || "Valued Patron",
                        orderId: currentOrder.id,
                        trackingId: trackingNumber,
                        courier: courierName
                    });
                }
            } catch (emailErr) {
                console.warn("Shipping update email failed:", emailErr.message);
            }
        }

        return NextResponse.json(updatedOrder);
    } catch (error) {
        console.error("Order update error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
