import {
  apiExchangeMobileSsoCode,
  apiLoginUser,
  apiLoginUserMagicLink,
  apiLogout,
  getOidcToken,
} from "@/api/studio-api/user.js"
import { computeAuthFromLogin } from "@/tools/auth/computeAuthFromLogin.js"
import { readStoredAuth } from "@/tools/auth/readStoredAuth.js"
import { writeStoredAuth } from "@/tools/auth/writeStoredAuth.js"
import { clearStoredAuth } from "@/tools/auth/clearStoredAuth.js"
import { notifyAuthChanged } from "@/tools/auth/notifyAuthChanged.js"
import { clearOriginalAuth } from "@/tools/backoffice/userImpersonation.js"

// The session of the app: the logged-in user's id and token, which the
// requests and the websocket send. Its actions are the only way to log in
// or out; each one saves the session for the next page loads
// (writeStoredAuth.js) and tells the other tabs (notifyAuthChanged.js).
// Every login action returns the API answer, for the caller's messages.
export default {
  namespaced: true,
  state: () => ({
    // { userId, authToken, refreshToken } or null
    current: readStoredAuth(),
  }),
  getters: {
    current: (state) => state.current,
    token: (state) => state.current?.authToken ?? null,
    userId: (state) => state.current?.userId ?? null,
    isLoggedIn: (state) => state.current !== null,
  },
  mutations: {
    setCurrent(state, auth) {
      state.current = auth
    },
  },
  actions: {
    async loginWithPassword({ dispatch }, { email, password }) {
      return dispatch("saveLogin", await apiLoginUser(email, password))
    },
    async loginWithMagicLink({ dispatch }, magicId) {
      return dispatch("saveLogin", await apiLoginUserMagicLink(magicId))
    },
    // Native app: the code an SSO login came back with
    async loginWithSsoCode({ dispatch }, { code, codeVerifier }) {
      return dispatch(
        "saveLogin",
        await apiExchangeMobileSsoCode(code, codeVerifier),
      )
    },
    // Web: the session the API keeps after an SSO login (oidc.vue)
    async loginWithOidc({ dispatch }) {
      return dispatch("saveLogin", await getOidcToken())
    },
    saveLogin({ dispatch }, result) {
      const auth =
        result?.status === "success" ? computeAuthFromLogin(result.data) : null
      switch (true) {
        case auth !== null:
          dispatch("save", auth)
          return result
        case result?.status === "success":
          return { status: "error", message: "login answer without a token" }
        default:
          return result
      }
    },
    // Also the token given by the API in a link (oidc.vue) and the
    // impersonation swap (system store)
    save({ commit }, auth) {
      writeStoredAuth(auth)
      commit("setCurrent", auth)
      notifyAuthChanged()
    },
    // Revokes the token in the API, then forgets the session; the caller
    // decides where the page goes next.
    async logout({ commit, getters }) {
      if (getters.isLoggedIn) {
        await apiLogout()
      }
      clearOriginalAuth()
      clearStoredAuth()
      commit("setCurrent", null)
      notifyAuthChanged()
    },
  },
}
