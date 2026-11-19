import { IS_NATIVE_APP } from "@/mobile/const/appTarget.js"
import { AUTH_COOKIE_NAMES, AUTH_STORAGE_KEY } from "@/const/auth.js"
import { getCookie } from "./getCookie.js"

/**
 * The session saved by the last login of this browser (or native app), read
 * by the auth store module when it starts and when another tab changes it.
 * The web keeps it in cookies, shared by the classic and the mobile front;
 * the native app in localStorage, as iOS keeps no cookie set by a page
 * served from capacitor://localhost.
 * @returns {{ userId: string | null, authToken: string, refreshToken: string | null } | null}
 */
export function readStoredAuth() {
  return IS_NATIVE_APP ? readFromLocalStorage() : readFromCookies()
}

function readFromCookies() {
  const authToken = readCookie(AUTH_COOKIE_NAMES.authToken)
  if (authToken === null) return null
  return {
    userId: readCookie(AUTH_COOKIE_NAMES.userId),
    authToken,
    refreshToken: readCookie(AUTH_COOKIE_NAMES.refreshToken),
  }
}

// The former logout wrote "null" in the cookies instead of removing them.
function readCookie(name) {
  const value = getCookie(name)
  return value === "" || value === "null" ? null : value
}

function readFromLocalStorage() {
  try {
    const auth = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY))
    return auth?.authToken ? auth : null
  } catch (error) {
    console.error("stored session unreadable", error)
    return null
  }
}
