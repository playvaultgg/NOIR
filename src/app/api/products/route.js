import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit")) || 10;
        const category = searchParams.get("category");

        const where = category ? { category } : {};

        const products = await prisma.product.findMany({
            where,
            take: limit,
            orderBy: { createdAt: "desc" }
        });

        // Normalize prices for client consumption
        const normalized = products.map(p => ({
            ...p,
            price: `₹${p.price.toLocaleString("en-IN")}`,
            priceAmount: p.price,
            image: p.imageUrls[0] || "https://images.unsplash.com/photo-1594932224011-041d83b1d9bc?q=80&w=2080&auto=format&fit=crop"
        }));

        return NextResponse.json(normalized);
    } catch (err) {
        console.error("Products API Error:", err);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
