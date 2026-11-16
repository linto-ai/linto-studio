import isAuthenticated from "@/tools/auth/isAuthenticated.js"
import { ensureSession } from "@/mobile/services/session/ensureSession.js"
import store from "@/mobile/store.js"
import { getEnv } from "@/tools/getEnv"
import { canStartLive } from "@/mobile/tools/canStartLive.js"
import { canUploadMedia } from "@/mobile/tools/canUploadMedia.js"
import { API_UNREACHABLE_ROUTE } from "@/const/apiUnreachableRoute.js"
import { buildApiUnreachableRoute } from "@/tools/buildApiUnreachableRoute.js"

// Single navigation guard of the mobile router: the API must answer (login
// included), public pages pass, private pages need a valid cookie and a
// loaded user + organization scope. Any failure ends on a page (login, API
// unreachable or not-found), never on a blank screen.
export async function authGuard(to, from, next) {
  try {
    return next(await resolveNavigation(to))
  } catch (error) {
    console.error("mobile router guard failed", error)
    return next({ name: "not-found" })
  }
}

// undefined lets the navigation through, a location redirects it.
async function resolveNavigation(to) {
  switch (true) {
    case to.name === API_UNREACHABLE_ROUTE:
      return undefined
    case !(await store.dispatch("apiStatus/check")):
      return buildApiUnreachableRoute(to)
    case Boolean(to.meta?.public):
      return undefined
    case !isAuthenticated():
      return loginRoute(to)
    default:
      return resolvePrivateNavigation(to)
  }
}

// A session that could not load because the API stopped answering keeps
// the user signed in (ensureSession reported it to apiStatus).
async function resolvePrivateNavigation(to) {
  const sessionReady = await ensureSession()
  switch (true) {
    case sessionReady:
      return hasOrganizationRights(to) ? undefined : { name: "home" }
    case store.state.apiStatus.reachable === false:
      return buildApiUnreachableRoute(to)
    default:
      return loginRoute(to)
  }
}

function loginRoute(to) {
  return { name: "login", query: { next: to.fullPath } }
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
