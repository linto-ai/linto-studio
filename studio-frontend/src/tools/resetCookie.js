import { setCookie } from "./setCookie"

export function resetCookie() {
  setCookie("cm_orga_scope", null, null)
  setCookie("authToken", null, null)
  setCookie("userId", null, null)
}
