import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import {
  AUTH_COOKIE_DAYS,
  AUTH_COOKIE_NAMES,
  AUTH_STORAGE_KEY,
  REFRESH_COOKIE_DAYS,
} from "@/const/auth.js"
import { setCookie } from "./setCookie.js"
import { clearStoredAuth } from "./clearStoredAuth.js"

/**
 * Saves the session for the next page loads and the other tabs, where
 * readStoredAuth.js reads it. Only the auth store module calls it.
 * @param {{ userId: string | null, authToken: string, refreshToken: string | null }} auth
 */
export function writeStoredAuth(auth) {
  clearStoredAuth()
  if (IS_NATIVE_APP) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
    return
  }
  setCookie(AUTH_COOKIE_NAMES.authToken, auth.authToken, AUTH_COOKIE_DAYS)
  if (auth.userId) {
    setCookie(AUTH_COOKIE_NAMES.userId, auth.userId, AUTH_COOKIE_DAYS)
  }
  if (auth.refreshToken) {
    setCookie(
      AUTH_COOKIE_NAMES.refreshToken,
      auth.refreshToken,
      REFRESH_COOKIE_DAYS,
    )
  }
}
