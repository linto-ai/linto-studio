import store from "@/mobile/store.js"
import { logout } from "@/tools/logout"

// Loads the user, its organizations and the current organization scope once.
// Returns false when the cookie is stale (the caller sends the user to login).
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
  if (result.status !== "success") {
    logout({ redirect: false })
    return false
  }
  return true
}

async function loadOrganizations() {
  if (store.getters["organizations/getOrganizationLength"] > 0) {
    return
  }
  await store.dispatch("organizations/fetchOrganizations")
}

async function selectOrganizationScope() {
  // The scope getter falls back to the cookie before anything is loaded;
  // the organization object itself is the sign the scope was applied.
  if (store.getters["organizations/getCurrentOrganization"]) {
    return
  }
  const organizationId = store.getters["organizations/getDefaultOrganizationId"]
  await store.dispatch(
    "organizations/setCurrentOrganizationScope",
    organizationId,
  )
}
