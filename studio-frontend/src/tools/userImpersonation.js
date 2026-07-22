import { ORIGINAL_AUTH_STORAGE_KEY } from "@/const/impersonation.js"

// localStorage: the cookie swap is browser-wide, the saved auth must be too

export function getOriginalAuth() {
  const raw = localStorage.getItem(ORIGINAL_AUTH_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function saveOriginalAuth(auth) {
  localStorage.setItem(ORIGINAL_AUTH_STORAGE_KEY, JSON.stringify(auth))
}

export function clearOriginalAuth() {
  localStorage.removeItem(ORIGINAL_AUTH_STORAGE_KEY)
}

export function isImpersonatingUser() {
  return getOriginalAuth() !== null
}
