import { resetCookie } from "./resetCookie.js"
import { clearOriginalAuth } from "../backoffice/userImpersonation.js"

export function logout({ redirect = true } = {}) {
  clearOriginalAuth()
  resetCookie()
  if (redirect) {
    window.location.href = "/"
  }
}
