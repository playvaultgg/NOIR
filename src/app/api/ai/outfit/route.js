import { NextResponse } from "next/server";
import { getRecommendedOutfit } from "@/modules/ai/ai.service";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (!productId) {
        return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    try {
        const outfit = await getRecommendedOutfit(productId);
        return NextResponse.json(outfit);
    } catch (error) {
        console.error("API_OUTFIT_ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch outfit" }, { status: 500 });
    }
}
