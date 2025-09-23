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
        passport.authenticate("google", {
          failureRedirect: (process.env.FRONTEND_DOMAIN || "") + "/login",
        }),
        function (req, res) {
          res.redirect(
            (process.env.FRONTEND_DOMAIN || "") +
              "/login/oidc?token=" +
              req.session.passport.user.auth_token,
          )
        },
      ],
    },
  ]
}
