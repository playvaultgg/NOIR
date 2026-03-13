import { NextResponse } from "next/server";
import { getPersonalizedRecommendations } from "@/modules/ai/ai.service";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth-options";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "2");
        
        const recommendations = await getPersonalizedRecommendations(session?.user?.id, limit);
        return NextResponse.json(recommendations);
    } catch (error) {
        console.error("API_RECOMMENDATIONS_ERROR:", error);
        return NextResponse.json({ error: "Failed to fetch recommendations" }, { status: 500 });
    }
}
