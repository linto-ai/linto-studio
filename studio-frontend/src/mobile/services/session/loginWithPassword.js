import { apiLoginUser } from "@/api/user.js"
import { setCookie } from "@/tools/setCookie"

const AUTH_COOKIE_DAYS = 7
const REFRESH_COOKIE_DAYS = 14

// Same cookies as the classic login page, so both apps share the session.
// Never throws: the caller gets { ok, message }.
export async function loginWithPassword(email, password) {
  try {
    const login = await apiLoginUser(email, password)
    if (login?.status !== "success") {
      return { ok: false, message: login?.message ?? null }
    }
    setCookie("userId", login.data.user_id, AUTH_COOKIE_DAYS)
    setCookie("authToken", login.data.auth_token, AUTH_COOKIE_DAYS)
    setCookie("refreshToken", login.data.refresh_token, REFRESH_COOKIE_DAYS)
    setCookie("cm_orga_scope", "", AUTH_COOKIE_DAYS)
    return { ok: true, message: null }
  } catch (error) {
    console.error("mobile login failed", error)
    return { ok: false, message: null }
  }
}
