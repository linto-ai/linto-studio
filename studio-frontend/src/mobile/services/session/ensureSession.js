import store from "@/mobile/store.js"
import { logout } from "@/tools/auth/logout"
import { pickDefaultOrganization } from "@/mobile/tools/pickDefaultOrganization.js"
import { isUnreachableResult } from "@/tools/request/isUnreachableResult.js"

// Loads the user, its organizations and the current organization scope once.
// Returns false when the cookie is stale (the caller sends the user to login)
// or when the API did not answer: then the user stays signed in and apiStatus
// is told (the caller shows the "API unreachable" page).
export async function ensureSession() {
  const userLoaded = await loadUser()
  if (!userLoaded) {
    return false
  }
  await loadOrganizations()
  const hasOrganization =
    store.getters["organizations/getOrganizationLength"] > 0
  if (!hasOrganization) {
    return false
  }
  await selectOrganizationScope()
  return true
}

async function loadUser() {
  if (store.state.user.isAuthenticated) {
    return true
  }
  const result = await store.dispatch("user/fetchUser")
  switch (true) {
    case result?.status === "success":
      return true
    case isUnreachableResult(result):
      store.dispatch("apiStatus/markUnreachable", result)
      return false
    default:
      logout({ redirect: false })
      return false
  }
}

async function loadOrganizations() {
  if (store.getters["organizations/getOrganizationLength"] > 0) {
    return
  }
  const result = await store.dispatch("organizations/fetchOrganizations")
  if (isUnreachableResult(result)) {
    store.dispatch("apiStatus/markUnreachable", result)
  }
}

async function selectOrganizationScope() {
  // The scope getter falls back to the cookie before anything is loaded;
  // the organization object itself is the sign the scope was applied.
  if (store.getters["organizations/getCurrentOrganization"]) {
    return
  }
  // Not the classic default (last organization used): the favorite one,
  // otherwise the personal space.
  const organizationId = pickDefaultOrganization(
    store.getters["organizations/getOrganizationsAsArray"],
    store.getters["user/getUserId"],
    store.getters["user/getFavoriteOrganizationId"],
  )
  await store.dispatch(
    "organizations/setCurrentOrganizationScope",
    organizationId,
  )
}
