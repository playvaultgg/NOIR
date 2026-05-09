import { NextResponse } from "next/server";

/**
 * Validation Middleware Wrapper
 * Sanitizes and validates request bodies against a Zod schema.
 */
export function withValidation(schema) {
    return async (req) => {
        try {
            const body = await req.json();
            const validated = schema.parse(body);
            // Attach validated data to request
            req.validatedBody = validated;
            return null; // Success — continue chain
        } catch (error) {
            return NextResponse.json({ 
                error: "Validation failed", 
                details: error.errors || error.message 
            }, { status: 422 });
        }
    };
}
