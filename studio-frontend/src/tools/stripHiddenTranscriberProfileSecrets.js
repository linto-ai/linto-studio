// The Session-API never returns a transcriber profile secret: it replaces
// config.key / config.apiKey with "Secret key is hidden" and config.credentials
// with "Secret credentials are hidden". A profile read back and sent as-is on a
// PUT would therefore store the placeholder as the new (encrypted) secret and
// break the profile (the ASR then authenticates with "Secret key is hidden").
// Omitting the field keeps the stored secret on the Session-API side.

export const HIDDEN_KEY_PLACEHOLDER = "Secret key is hidden"
export const HIDDEN_CREDENTIALS_PLACEHOLDER = "Secret credentials are hidden"

export default function stripHiddenTranscriberProfileSecrets(config) {
  if (!config || typeof config !== "object") return config
  const cleaned = { ...config }
  if (cleaned.key === HIDDEN_KEY_PLACEHOLDER) delete cleaned.key
  if (cleaned.apiKey === HIDDEN_KEY_PLACEHOLDER) delete cleaned.apiKey
  if (cleaned.credentials === HIDDEN_CREDENTIALS_PLACEHOLDER) {
    delete cleaned.credentials
  }
  return cleaned
}
