const debug = require("debug")("linto:conversation-manager:routes:auth")

const { logout, recoveryAuth } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users.js`,
)
const PROVIDER = require(`${process.cwd()}/lib/dao/oidc/provider`)

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
        if (req?.session?.passport?.user)
          res.status(200).json(req.session.passport.user)
        else res.status(200).send("Ok")
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
        res.status(200).send(PROVIDER.getEnabledProviders())
      },
    },
  ]
}
