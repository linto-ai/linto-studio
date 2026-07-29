/**
 * Normalizes raw waveform values (any scale, e.g. 16-bit ints from the
 * audiowaveform format) to [-1, 1] floats as expected by WaveSurfer.
 * Scales against the 98th percentile (values above it clip at 1) so a few
 * isolated loud peaks don't flatten the rest of the waveform.
 */
export declare function normalizePeaks(data: number[]): Float32Array;
export declare function renderWaveform(channels: (number[] | Float32Array)[], ctx: CanvasRenderingContext2D): void;
