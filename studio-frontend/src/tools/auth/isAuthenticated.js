import { getCookie } from "@/tools/auth/getCookie"

export default function isAuthenticated() {
  return getCookie("authToken") !== null
}
