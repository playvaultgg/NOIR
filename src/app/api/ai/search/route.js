import { NextResponse } from "next/server";
import { performSmartSearch } from "@/modules/ai/ai.service";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query");

        if (!query) {
            return NextResponse.json({ results: [] });
        }

        // The performSmartSearch currently does simple includes, but in a real 
        // enterprise scenario, this would use vector embeddings or Algolia.
        const results = await performSmartSearch(query);

        return NextResponse.json({
            results: results.slice(0, 8),
            count: results.length
        });
    } catch (error) {
        console.error("SEARCH_API_ERROR:", error);
        return NextResponse.json({ error: "Search unavailable" }, { status: 500 });
    }
}
