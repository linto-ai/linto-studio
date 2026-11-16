const debug = require("debug")(
  "linto:components:WebServer:routes:auth:oidc_github",
)

const auth_middleware = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
const mobileSso = require(
  `${process.cwd()}/components/WebServer/routecontrollers/auth/mobileSso`,
)
var passport = require("passport")

module.exports = (webServer) => {
  return [
    {
      path: "/oidc/github/login",
      method: "get",
      requireAuth: false,
      controller: [
        mobileSso.remember,
        auth_middleware.oidc_github_authenticate,
      ],
    },
    {
      path: "/oidc/github/cb",
      method: "get",
      requireAuth: false,
      controller: [
        (req, res, next) => {
          passport.authenticate("github", { session: false }, (err, token) => {
            if (mobileSso.finish(req, res, err ? null : token)) return
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
