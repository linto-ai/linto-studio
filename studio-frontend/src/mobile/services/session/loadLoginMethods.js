import { getLoginMethods } from "@/api/user.js"
import { indexLoginMethods } from "@/mobile/tools/indexLoginMethods.js"

// Login methods enabled on this platform. When the API cannot be reached
// the form is shown anyway: the login attempt will tell.
export async function loadLoginMethods() {
  try {
    return indexLoginMethods(await getLoginMethods())
  } catch (error) {
    console.error("cannot load the login methods", error)
    return { local: true, oidc: [] }
  }
}
