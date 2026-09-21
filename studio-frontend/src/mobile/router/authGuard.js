import isAuthenticated from "@/tools/isAuthenticated.js"
import { ensureSession } from "@/mobile/services/session/ensureSession.js"
import store from "@/mobile/store.js"
import { getEnv } from "@/tools/getEnv"
import { canStartLive } from "@/mobile/tools/canStartLive.js"
import { canUploadMedia } from "@/mobile/tools/canUploadMedia.js"

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
    if (!hasOrganizationRights(to)) {
      return next({ name: "home" })
    }
    return next()
  } catch (error) {
    console.error("mobile router guard failed", error)
    return next({ name: "not-found" })
  }
}

// The home screen links these pages only when the current organization and
// the user's role allow them; a bookmark or the history must not bypass it.
function hasOrganizationRights(to) {
  const permissions =
    store.getters["organizations/getCurrentOrganization"]?.permissions
  const role = store.getters["organizations/getUserRoleInOrganization"]
  if (to.meta?.upload) {
    return canUploadMedia(permissions, role)
  }
  if (to.meta?.live) {
    const sessionsEnabled = getEnv("VUE_APP_ENABLE_SESSION") === "true"
    return sessionsEnabled && canStartLive(permissions, role)
  }
  return true
}
