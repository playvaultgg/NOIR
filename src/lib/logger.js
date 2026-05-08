/**
 * MAISON NOIR — Sovereign Logger
 * Senior Developer Standard: Structured, leveled logging with context.
 * 
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('Order created', { orderId, amount });
 *   logger.error('Payment failed', { error: err.message, userId });
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    FATAL: 4,
};

const CURRENT_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL?.toUpperCase()] ?? LOG_LEVELS.INFO;

function formatLog(level, message, data = {}) {
    return {
        timestamp: new Date().toISOString(),
        level,
        service: "maison-noir",
        message,
        ...data,
        environment: process.env.NODE_ENV || "development",
    };
}

export const logger = {
    debug(message, data) {
        if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
            console.debug(JSON.stringify(formatLog("DEBUG", message, data)));
        }
    },

    info(message, data) {
        if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
            console.log(JSON.stringify(formatLog("INFO", message, data)));
        }
    },

    warn(message, data) {
        if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
            console.warn(JSON.stringify(formatLog("WARN", message, data)));
        }
    },

    error(message, data) {
        if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
            console.error(JSON.stringify(formatLog("ERROR", message, data)));
        }
    },

    fatal(message, data) {
        console.error(JSON.stringify(formatLog("FATAL", message, data)));
    },

    /**
     * Create a child logger with pre-bound context.
     * Usage: const orderLog = logger.child({ module: 'checkout', orderId });
     */
    child(context) {
        return {
            debug: (msg, data) => logger.debug(msg, { ...context, ...data }),
            info: (msg, data) => logger.info(msg, { ...context, ...data }),
            warn: (msg, data) => logger.warn(msg, { ...context, ...data }),
            error: (msg, data) => logger.error(msg, { ...context, ...data }),
            fatal: (msg, data) => logger.fatal(msg, { ...context, ...data }),
        };
    },
};
