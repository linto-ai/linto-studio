import { apiExchangeMobileSsoCode } from "@/api/user.js"
import { setCookie } from "@/tools/auth/setCookie"

const AUTH_COOKIE_DAYS = 7

// Native app only: trades the code an SSO login came back with for the
// session, kept in the same cookies as the password login.
// Never throws: the caller gets { ok }.
export async function loginWithSsoCode(code, codeVerifier) {
  try {
    const login = await apiExchangeMobileSsoCode(code, codeVerifier)
    if (login?.status !== "success") {
      return { ok: false }
    }
    setCookie("userId", login.data.user_id, AUTH_COOKIE_DAYS)
    setCookie("authToken", login.data.auth_token, AUTH_COOKIE_DAYS)
    setCookie("cm_orga_scope", "", AUTH_COOKIE_DAYS)
    return { ok: true }
  } catch (error) {
    console.error("mobile sso login failed", error)
    return { ok: false }
  }
}
