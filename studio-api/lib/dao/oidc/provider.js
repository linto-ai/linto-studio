const STRATEGY_PATH = `${process.cwd()}/components/WebServer/config/passport/strategies`
const API_PATH = `${process.cwd()}/components/WebServer/routes`

const AuthProviders = {
  LOCAL: {
    path: "local",
    from: "studio",
    name: "studio",
    isEnabled: () => process.env.LOCAL_AUTH_ENABLED === "true",
    loadStrategy: () => require(`${STRATEGY_PATH}/local`),
    registerRoutes: () => `${API_PATH}/auth/local.js`,
  },

  OIDC_GENERIC: {
    path: "oidc",
    from: process.env.OIDC_TYPE || "linagora",
    name: process.env.OIDC_TYPE || "linagora",
    isEnabled: () => !!process.env.OIDC_TYPE,
    loadStrategy: () => {
      if (process.env.OIDC_TYPE === "linagora") {
        require(`${STRATEGY_PATH}/oidc_linagora`)
      } else if (process.env.OIDC_TYPE === "eu") {
        require(`${STRATEGY_PATH}/oidc_eu`)
      }
    },
    registerRoutes: () => `${API_PATH}/auth/oidc.js`,
  },

  GOOGLE: {
    path: "oidc/google",
    from: "google",
    name: "Google",
    isEnabled: () => process.env.OIDC_GOOGLE_ENABLED === "true",
    loadStrategy: () => require(`${STRATEGY_PATH}/oidc_google`),
    registerRoutes: () => `${API_PATH}/auth/oidc_google.js`,
  },

  GITHUB: {
    path: "oidc/github",
    from: "github",
    name: "Github",
    isEnabled: () => process.env.OIDC_GITHUB_ENABLED === "true",
    loadStrategy: () => require(`${STRATEGY_PATH}/oidc_github`),
    registerRoutes: () => `${API_PATH}/auth/oidc_github.js`,
  },

  getEnabledProviders() {
    return Object.values(AuthProviders)
      .filter(
        (provider) =>
          typeof provider === "object" &&
          typeof provider.isEnabled === "function" &&
          provider.isEnabled(),
      )
      .map(({ path, from, name }) => ({ path, from, name }))
  },

  loadEnabledStrategies() {
    Object.values(AuthProviders)
      .filter(
        (provider) => typeof provider === "object" && provider.isEnabled?.(),
      )
      .forEach((provider) => provider.loadStrategy?.())
  },

  registerRoutes(webServer) {
    let api_routes = { "/auth": [] }

    Object.values(AuthProviders)
      .filter(
        (provider) => typeof provider === "object" && provider.isEnabled?.(),
      )
      .forEach((provider) => {
        api_routes["/auth"] = [
          ...api_routes["/auth"],
          ...require(provider.registerRoutes())(webServer),
        ]
      })

    return api_routes
  },
}

Object.freeze(AuthProviders)
module.exports = AuthProviders
