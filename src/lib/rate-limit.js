import { LRUCache } from "lru-cache";

const tokenCache = new LRUCache({
    max: 500,
    ttl: 60 * 1000, // 1 minute
});

export function rateLimit(options) {
    return {
        check: (res, limit, token) => {
            const tokenCount = tokenCache.get(token) || [0];
            if (tokenCount[0] === 0) {
                tokenCache.set(token, tokenCount);
            }
            tokenCount[0] += 1;

            const currentUsage = tokenCount[0];
            const isRateLimited = currentUsage >= limit;
            
            return {
                isRateLimited,
                remaining: isRateLimited ? 0 : limit - currentUsage,
            };
        },
    };
}
