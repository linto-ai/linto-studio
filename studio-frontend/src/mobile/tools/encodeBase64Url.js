/**
 * Base64url without padding (RFC 4648 §5), the encoding PKCE asks for.
 * @param {Uint8Array} bytes
 * @returns {string}
 */
export function encodeBase64Url(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")
}
