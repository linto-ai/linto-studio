const debug = require("debug")("linto:components:WebServer:routes:auth:local")

const auth_middleware = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const { loginFailLimiter } = require(
  `${process.cwd()}/components/WebServer/config/express/rateLimiters`,
)

module.exports = (webServer) => {
  return [
    {
      path: "/login",
      method: "post",
      requireAuth: false,
      controller: [
        loginFailLimiter,
        auth_middleware.local_authenticate,
        (req, res, next) => {
          res.status(202).json(req.user)
        },
      ],
    },
    {
      path: "/refresh",
      method: "get",
      requireRefresh: true,
      controller: [
        auth_middleware.refresh,
        (req, res, next) => {
          res.status(202).json(req.user)
        },
      ],
    },
    {
      path: "/login/magic-link",
      method: "post",
      requireAuth: false,
      controller: [
        loginFailLimiter,
        auth_middleware.authenticate_reset,
        (req, res, next) => {
          res.status(202).json(req.user)
        },
      ],
    },
  ]
}
