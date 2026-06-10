export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value) {
  if (typeof value !== "string") return false
  return EMAIL_REGEX.test(value.trim())
}
