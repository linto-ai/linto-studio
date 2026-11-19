import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { AUTH_COOKIE_NAMES, AUTH_STORAGE_KEY } from "@/const/auth.js"

/**
 * Removes the saved session (see readStoredAuth.js). Only the auth store
 * module calls it.
 */
export function clearStoredAuth() {
  if (IS_NATIVE_APP) {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return
  }
  Object.values(AUTH_COOKIE_NAMES).forEach(removeCookie)
}

function removeCookie(name) {
  document.cookie = `${name}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`
}
