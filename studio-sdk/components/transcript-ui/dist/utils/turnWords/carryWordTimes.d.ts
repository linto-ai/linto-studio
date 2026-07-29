import { Word } from '../../types/editor';
/**
 * Carry timestamps from the previous word list onto freshly derived tokens by
 * anchoring on the common prefix and suffix (token text equality). The edited
 * middle stays untimed until the server broadcasts recomputed timings (it
 * re-flushes after every edit, so the gap lasts about a debounce). Cheap,
 * deterministic, and wrong only transiently — by design.
 */
export declare function carryWordTimes(next: Word[], prev: Word[]): Word[];
