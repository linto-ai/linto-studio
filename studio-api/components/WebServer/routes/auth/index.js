const debug = require("debug")("linto:conversation-manager:routes:auth")

const { logout, recoveryAuth } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users.js`,
)
const auth_middleware = require(
  `${process.cwd()}/components/WebServer/config/passport/local/middleware`,
)

module.exports = (webServer) => {
  return [
    {
      path: "/logout",
      method: "get",
      requireAuth: true,
      controller: logout,
    },
    {
      path: "/isAuth",
      method: "get",
      requireAuth: true,
      controller: async (req, res, next) => {
        res.status(200).send("Ok")
      },
    },
    {
      path: "/recovery",
      method: "post",
      requireAuth: false,
      controller: recoveryAuth,
    },
    {
      path: "/list",
      method: "get",
      requireAuth: false,
      controller: (req, res, next) => {
        let list = [{ path: "local", from: "studio", name: "studio" }]
        if (process.env.OIDC_URL !== "") {
          list.push({ path: "oidc", from: "linagora", name: "linagora" })
        }
        res.status(200).send(list)
      },
    },
  ]
}
