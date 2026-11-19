/**
 * Whether two sessions are the same one: same user, same token.
 * @param {{ userId: string | null, authToken: string } | null} first
 * @param {{ userId: string | null, authToken: string } | null} second
 * @returns {boolean}
 */
export function isSameAuth(first, second) {
  switch (true) {
    case first === null || second === null:
      return first === second
    default:
      return (
        first.authToken === second.authToken && first.userId === second.userId
      )
  }
}
