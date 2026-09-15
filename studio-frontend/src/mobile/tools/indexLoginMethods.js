/**
 * The login methods the API enables, as the login page needs them: whether
 * the email + password form applies, and the OIDC providers to link to.
 * @param {{ name: string, path: string }[]} methods - GET /auth/list
 * @returns {{ local: boolean, oidc: { name: string, path: string }[] }}
 */
export function indexLoginMethods(methods) {
  const list = Array.isArray(methods) ? methods : []
  return {
    local: list.some((method) => method.path === "local"),
    oidc: list.filter((method) => method.path?.startsWith("oidc")),
  }
}
