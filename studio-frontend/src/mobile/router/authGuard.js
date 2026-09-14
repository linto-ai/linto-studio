import isAuthenticated from "@/tools/isAuthenticated.js"
import { ensureSession } from "@/mobile/services/session/ensureSession.js"

// Single navigation guard of the mobile router: public pages pass, private
// pages need a valid cookie and a loaded user + organization scope. Any
// failure ends on a page (login or not-found), never on a blank screen.
export async function authGuard(to, from, next) {
  try {
    if (to.meta?.public) {
      return next()
    }
    if (!isAuthenticated()) {
      return next({ name: "login", query: { next: to.fullPath } })
    }
    const sessionReady = await ensureSession()
    if (!sessionReady) {
      return next({ name: "login", query: { next: to.fullPath } })
    }
    return next()
  } catch (error) {
    console.error("mobile router guard failed", error)
    return next({ name: "not-found" })
  }
}
