const debug = require("debug")(
  "linto:conversation-manager:routes:auth:oidc:google",
)

const auth_middleware = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
var passport = require("passport")

module.exports = (webServer) => {
  return [
    {
      path: "/oidc/google/login",
      method: "get",
      requireAuth: false,
      requireSession: true,
      controller: [auth_middleware.oidc_google_authenticate],
    },
    {
      path: "/oidc/google/cb",
      method: "get",
      requireAuth: false,
      requireSession: true,
      controller: [
        (req, res, next) => {
          passport.authenticate("google", { session: false }, (err, token) => {
            const failureRedirect =
              (process.env.FRONTEND_DOMAIN || "") + "/login"
            if (err || !token) {
              console.error(err)
              return failureRedirect
            }

            const redirectUrl =
              (process.env.FRONTEND_DOMAIN || "") +
              "/login/oidc?token=" +
              token.auth_token

            res.redirect(redirectUrl)
          })(req, res, next)
        },
      ],
    },
  ]
}
