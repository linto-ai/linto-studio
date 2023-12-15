import { resetCookie } from "./resetCookie.js"

export function logout() {
  resetCookie()
  window.location.href = "/"
}
