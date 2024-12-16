const debug = require("debug")("linto:conversation-manager:routes:auth:oidc")

const { logout, recoveryAuth } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users.js`,
)
const auth_middleware = require(
  `${process.cwd()}/components/WebServer/config/passport/local/middleware`,
)
var passport = require("passport")

module.exports = (webServer) => {
  return [
    {
      path: "/login/oidc",
      method: "get",
      requireAuth: false,
      controller: [
        (req, res, next) => {
          console.log("OIDC")
          next()
        },
        auth_middleware.oidc_authenticate,
        (req, res, next) => {
          res.status(202).json(req.user)
        },
      ],
    },
    {
      path: "/oidc/cb",
      method: "get",
      requireAuth: false,
      controller: [
        (req, res, next) => {
          console.log("OIDC CB")
          next()
        },
        passport.authenticate("oidc", {
          successReturnToOrRedirect: "/",
          failureRedirect: "auth/login/oidc",
        }),
      ],
    },
    {
      path: "/oidc/token",
      method: "get",
      requireAuth: true,
      controller: [
        (req, res, next) => {
          res.status(200).json(req.session.passport.user)
        },
      ],
    },
  ]
}
