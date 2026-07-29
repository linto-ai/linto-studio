/** Locks map key: the locking scope is the (track, turn) pair — turn ids are
 *  shared across a channel's translations. */
export declare function computeLockKey(translationId: string, turnId: string): string;
