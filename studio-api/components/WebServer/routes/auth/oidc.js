const debug = require("debug")("linto:components:WebServer:routes:auth:oidc")

const { Unauthorized } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)
const { encrypt, decrypt } = require(
  `${process.cwd()}/components/WebServer/config/passport/token/encryption`,
)

const auth_middleware = require(
  `${process.cwd()}/components/WebServer/config/passport/middleware`,
)
var passport = require("passport")

module.exports = (webServer) => {
  return [
    {
      path: "/oidc/login",
      method: "get",
      requireAuth: false,
      controller: [auth_middleware.oidc_authenticate],
    },
    {
      path: "/oidc/cb",
      method: "get",
      requireAuth: false,
      controller: [
        (req, res, next) => {
          passport.authenticate(
            "oidc",
            { session: false },
            (err, token, info) => {
              if (err) {
                console.error(err)
                return res.redirect("/cm-api/auth/login/oidc") // failureRedirect
              }
              if (!token) {
                return res.redirect("/cm-api/auth/login/oidc")
              }
              const encryptedToken = encrypt(token.auth_token)
              res.cookie("auth_token", encryptedToken, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 5 * 60 * 1000,
                path: "/",
              })

              res.cookie("user_id", token.user_id, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 5 * 60 * 1000,
                path: "/",
              })

              const redirectUrl =
                (process.env.FRONTEND_DOMAIN || "") + "/login/oidc"

              res.redirect(redirectUrl)
            },
          )(req, res, next)
        },
      ],
    },
    {
      path: "/oidc/token",
      method: "get",
      requireAuth: true,
      controller: [
        (req, res, next) => {
          if (req?.cookies?.auth_token) {
            return res.status(200).json({
              auth_token: decrypt(req.cookies.auth_token),
              user_id: req.cookies.user_id,
            })
          }

          next(new Unauthorized())
        },
      ],
    },
  ]
}
