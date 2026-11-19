/**
 * The session kept by the front, from a login answer of the API.
 * @param {{ user_id?: string, auth_token?: string, refresh_token?: string }} [data]
 * @returns {{ userId: string | null, authToken: string, refreshToken: string | null } | null}
 *   null when the answer holds no token
 */
export function computeAuthFromLogin(data) {
  if (!data?.auth_token) return null
  return {
    userId: data.user_id ?? null,
    authToken: data.auth_token,
    refreshToken: data.refresh_token ?? null,
  }
}
