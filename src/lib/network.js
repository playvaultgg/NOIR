/**
 * Senior Developer Standard: Resilient Network Client
 * Handles timeouts, error mapping, and request standardization.
 */

const DEFAULT_TIMEOUT = 10000; // 10 seconds

export async function noirFetch(url, options = {}) {
    const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const headers = {
        'Content-Type': 'application/json',
        'X-Service-ID': 'MAISON-NOIR-CORE',
        ...fetchOptions.headers,
    };

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            signal: controller.signal,
        });

        clearTimeout(id);

        if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(errorBody.details || errorBody.error || `Network Protocol Error: ${response.status}`);
        }

        return await response.json();

    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Network Timeout: The Sovereign server took too long to respond.');
        }
        throw error;
    }
}
