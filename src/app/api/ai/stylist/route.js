import { NextResponse } from "next/server";
import { performSmartSearch, getRecommendedOutfit } from "@/modules/ai/ai.service";

export async function POST(req) {
    try {
        const { message, context, telemetry } = await req.json();
        const query = message.toLowerCase();

        // 1. Sentiment Analysis Engine (Mocked Simulation)
        let sentiment = "neutral";
        let score = 0.5;
        
        if (query.match(/luxury|exquisite|premium|elite|refined/)) {
            sentiment = "sophisticated";
            score = 0.92;
        } else if (query.match(/fast|now|quick|hurry/)) {
            sentiment = "urgent";
            score = 0.85;
        } else if (query.match(/bad|poor|ugly|cheap/)) {
            sentiment = "dissatisfied";
            score = 0.15;
        } else {
            sentiment = "curious";
            score = 0.65;
        }

        // 2. Logic & Recommendations
        let response = "";
        let suggestions = [];
        let metadata = {
            processingTime: "42ms",
            protocol: "God-Mode v4.1",
            sentiment: sentiment,
            confidence: score
        };

        if (query.includes("outfit") || query.includes("match") || query.includes("suggest")) {
            response = `I have detected a ${sentiment} intent in your request. Synthesizing an archival ensemble that matches your aesthetic profile. These pieces represent the absolute pinnacle of our current collection.`;
            const baseId = context?.lastViewedId || "prod_1"; 
            suggestions = await getRecommendedOutfit(baseId);
        } else if (query.includes("event") || query.includes("formal") || query.includes("party")) {
            response = "For an event of such significance, I am overriding standard recommendations with our Sovereign Protocol items. Precision tailoring is mandatory.";
            suggestions = await performSmartSearch("suit");
            if (suggestions.length === 0) suggestions = await performSmartSearch("blazer");
        } else if (query.includes("minimalist") || query.includes("simple") || query.includes("noir")) {
            response = "Minimalism is the ultimate sophistication. I have filtered our archive to show only the most essential monochrome silhouettes.";
            suggestions = await performSmartSearch("trench");
        } else if (sentiment === "sophisticated") {
            response = "I appreciate your refined taste. Let us explore the most exclusive corners of the Maison archive.";
            suggestions = await performSmartSearch("couture");
        } else {
            response = "Collective Intelligence is processing your request. The Maison archive is vast, but I have highlighted these starting points for your journey.";
            suggestions = await performSmartSearch("new"); 
        }

        return NextResponse.json({
            response,
            suggestions: suggestions.slice(0, 3),
            telemetry: metadata
        });
    } catch (error) {
        console.error("AI_STYLIST_ERROR:", error);
        return NextResponse.json({ error: "Stylist unavailable" }, { status: 500 });
    }
}
