import { getCookie } from "@/tools/getCookie"

export default function isAuthenticated() {
  return getCookie("authToken") !== null
}
