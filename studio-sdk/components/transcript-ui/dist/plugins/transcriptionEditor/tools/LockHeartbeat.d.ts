/** Owns the periodic re-lock timer — the plugin's one releasable resource.
 *  start() replaces any running beat; stop() is idempotent. */
export declare class LockHeartbeat {
    private intervalMs;
    private timer;
    constructor(intervalMs: number);
    start(beat: () => void): void;
    stop(): void;
}
