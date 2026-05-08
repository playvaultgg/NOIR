import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * MAISON NOIR — API Request Monitor
 * Senior Developer Standard: Logs every API request with timing, status, and context.
 * 
 * Mount at /api/monitor/route.js
 * GET /api/monitor — Returns system health + recent request metrics
 */

// In-memory metrics store (for development/single-instance)
const requestMetrics = {
    totalRequests: 0,
    totalErrors: 0,
    averageLatency: 0,
    routes: {},
    recentRequests: [],
};

const MAX_RECENT = 50;

/**
 * Record an API request metric.
 * Call this from other API routes or middleware.
 */
export function recordRequest({ route, method, statusCode, latency, error = null }) {
    requestMetrics.totalRequests++;

    if (statusCode >= 400) requestMetrics.totalErrors++;

    // Running average
    requestMetrics.averageLatency = Math.round(
        (requestMetrics.averageLatency * (requestMetrics.totalRequests - 1) + latency) /
        requestMetrics.totalRequests
    );

    // Per-route metrics
    if (!requestMetrics.routes[route]) {
        requestMetrics.routes[route] = { count: 0, errors: 0, avgLatency: 0 };
    }
    const routeMetric = requestMetrics.routes[route];
    routeMetric.count++;
    if (statusCode >= 400) routeMetric.errors++;
    routeMetric.avgLatency = Math.round(
        (routeMetric.avgLatency * (routeMetric.count - 1) + latency) / routeMetric.count
    );

    // Recent requests ring buffer
    requestMetrics.recentRequests.unshift({
        route,
        method,
        statusCode,
        latency: `${latency}ms`,
        timestamp: new Date().toISOString(),
        error: error || null,
    });

    if (requestMetrics.recentRequests.length > MAX_RECENT) {
        requestMetrics.recentRequests.pop();
    }

    // Structured log
    const logLevel = statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info";
    logger[logLevel](`${method} ${route} → ${statusCode}`, { latency, statusCode });
}

export async function GET() {
    const uptime = process.uptime();

    return NextResponse.json({
        service: "MAISON NOIR — API Monitor",
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
        metrics: {
            totalRequests: requestMetrics.totalRequests,
            totalErrors: requestMetrics.totalErrors,
            errorRate: requestMetrics.totalRequests > 0
                ? `${((requestMetrics.totalErrors / requestMetrics.totalRequests) * 100).toFixed(2)}%`
                : "0%",
            averageLatency: `${requestMetrics.averageLatency}ms`,
        },
        routes: requestMetrics.routes,
        recentRequests: requestMetrics.recentRequests.slice(0, 20),
    });
}
