import { IMPERSONATOR_SESSION_STORAGE_KEY } from "@/const/impersonation.js"

// localStorage: the cookie swap is browser-wide, the saved session must be too

export function getImpersonatorSession() {
  const raw = localStorage.getItem(IMPERSONATOR_SESSION_STORAGE_KEY)
  return raw ? JSON.parse(raw) : null
}

export function setImpersonatorSession(session) {
  localStorage.setItem(
    IMPERSONATOR_SESSION_STORAGE_KEY,
    JSON.stringify(session),
  )
}

export function clearImpersonatorSession() {
  localStorage.removeItem(IMPERSONATOR_SESSION_STORAGE_KEY)
}

export function isImpersonatingUser() {
  return getImpersonatorSession() !== null
}
