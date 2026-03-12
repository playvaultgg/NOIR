import prisma from "@/lib/prisma";
import OrderTableClient from "@/components/admin/OrderTableClient";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, _count: { select: { items: true } } }
    });

    return <OrderTableClient initialOrders={JSON.parse(JSON.stringify(orders))} />;
}
