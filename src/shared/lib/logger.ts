/**
 * Frontend Logger
 * Suppresses console.log/warn in production builds.
 * console.error always logs (real errors should never be silenced).
 */

const isDev = import.meta.env.DEV;

export const logger = {
    log: (...args: unknown[]) => { if (isDev) console.log(...args); },
    warn: (...args: unknown[]) => { if (isDev) console.warn(...args); },
    error: (...args: unknown[]) => { console.error(...args); },
    debug: (...args: unknown[]) => { if (isDev) console.debug(...args); },
};
