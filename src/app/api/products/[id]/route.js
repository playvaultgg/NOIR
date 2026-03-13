import { NextResponse } from "next/server";
import { getProductById } from "@/modules/products/product.service";

export async function GET(req, { params }) {
    try {
        const { id } = await params;
        const product = await getProductById(id);

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(product);
    } catch (error) {
        console.error("PRODUCT_INFO_API_ERROR:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
