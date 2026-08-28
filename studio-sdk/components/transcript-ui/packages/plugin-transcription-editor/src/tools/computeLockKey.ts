/** Locks map key: the locking scope is the (track, turn) pair — turn ids are
 *  shared across a channel's translations. */
export function computeLockKey(translationId: string, turnId: string): string {
  return `${translationId}/${turnId}`
}
