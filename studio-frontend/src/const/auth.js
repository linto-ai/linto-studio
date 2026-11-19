// Where the session (user id + tokens) is kept between page loads, see
// tools/auth/readStoredAuth.js: cookies on the web, localStorage in the
// native app (iOS keeps no cookie set from capacitor://localhost).
export const AUTH_COOKIE_NAMES = Object.freeze({
  userId: "userId",
  authToken: "authToken",
  refreshToken: "refreshToken",
})
export const AUTH_COOKIE_DAYS = 7
export const REFRESH_COOKIE_DAYS = 14
export const AUTH_STORAGE_KEY = "auth"

// BroadcastChannel the tabs of the instance use to tell each other the
// session changed (tools/auth/notifyAuthChanged.js).
export const AUTH_CHANNEL_NAME = "auth"

// Logout: the longest wait for the API to revoke the token.
export const LOGOUT_TIMEOUT_MS = 5000
