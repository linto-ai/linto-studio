const debug = require("debug")("linto:conversation-manager:routes:auth:oidc")

const { logout, recoveryAuth } = require(
  `${process.cwd()}/components/WebServer/routecontrollers/users/users.js`,
)
const auth_middleware = require(
  `${process.cwd()}/components/WebServer/config/passport/local/middleware`,
)

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
        }, // This is a placeholder
        auth_middleware.oidc_authenticate,
        (req, res, next) => {
          res.status(202).json(req.user)
        },
      ],
    },
    {
      path: "/login/oidc/cb",
      method: "get",
      requireAuth: true,
      controller: [
        (req, res, next) => {
          console.log("OIDC CB")
          next()
        }, // This is a placeholder
      ],
    },
  ]
}
