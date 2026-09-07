export const READ_ONLY_SCOPE = "backoffice-readonly"

// Ref-counted tokens of connections opened with the backoffice read-only
// scope (organization impersonation). sendRequest forwards the scope to the
// API only for these tokens, so regular users are never affected.
const readOnlyTokens = new Map()

export function registerReadOnlyToken(userToken) {
  if (!userToken) return
  readOnlyTokens.set(userToken, (readOnlyTokens.get(userToken) || 0) + 1)
}

export function releaseReadOnlyToken(userToken) {
  const count = readOnlyTokens.get(userToken)
  if (!count) return
  if (count <= 1) readOnlyTokens.delete(userToken)
  else readOnlyTokens.set(userToken, count - 1)
}

export function isReadOnlyToken(userToken) {
  return readOnlyTokens.has(userToken)
}
