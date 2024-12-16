const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc:middleware",
)

require("./strategies/local")
if (process.env.OIDC_TYPE === "linagora") {
  require("./strategies/oidc_linagora")
}
const passport = require("passport")

const { expressjwt: jwt } = require("express-jwt")
const jwtDecode = require("jwt-decode")

const model = require(`${process.cwd()}/lib/mongodb/models`)

const {
  MalformedToken,
  MultipleUserFound,
  InvalidCredential,
  UserNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/auth`)

const refreshToken = require("./token/refresh")

module.exports = {
  local_authenticate: (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user) => {
      if (err) {
        next(err)
      } else if (!user) {
        throw new InvalidCredential()
      } else {
        res.status(200).json({
          message: "login success",
          ...user,
        })
      }
    })(req, res, next)
  },
  refresh: async (req, res, next) => {
    let token = await refreshToken(req.headers.authorization.split(" ")[1])
    res.status(200).json(token)
  },
  authenticate_reset: (req, res, next) => {
    passport.authenticate(
      "local_magic_link",
      { session: false },
      (err, user) => {
        if (err) {
          next(err)
        } else if (!user) {
          throw new InvalidCredential()
        } else {
          res.status(200).json({
            message: "login success",
            ...user,
          })
        }
      },
    )(req, res, next)
  },
  oidc_authenticate: (req, res, next) => {
    passport.authenticate("oidc", { session: false }, (err) => {
      if (err) {
        next(err)
      } else if (!user) {
        throw new InvalidCredential()
      } else {
        // do stuff there ?
        res.status(200).json({
          message: "login success",
          ...user,
        })
      }
    })(req, res, next)
  },
  isAuthenticate: [
    jwt({
      secret: generateSecretFromHeaders,
      algorithms: ["HS256"],
      getToken: getTokenFromHeaders,
    }),
    (req, res, next) => {
      let token
      if (req.headers.authorization)
        token = req.headers.authorization.split(" ")[1]
      else if (req.session.passport.user.auth_token)
        token = req.session.passport.user.auth_token

      const tokenData = jwtDecode(token)
      req.payload = {
        data: {
          userId: tokenData.data.userId,
          tokenId: tokenData.data.tokenId,
          role: tokenData.data.role,
        },
      }
      next()
    },
  ],
  refresh_token: [
    jwt({
      secret: generateRefreshSecretFromHeaders,
      algorithms: ["HS256"],
      getToken: getTokenFromHeaders,
    }),
    async (req, res, next) => {
      let token
      if (req.headers.authorization)
        token = req.headers.authorization.split(" ")[1]
      else if (req.session.passport.user.auth_token)
        token = req.session.passport.user.auth_token

      const tokenData = jwtDecode(token)

      req.payload = {
        data: {
          userId: tokenData.data.userId,
        },
      }
      next()
    },
  ],
}

function getTokenFromHeaders(req) {
  const {
    headers: { authorization },
  } = req
  if (authorization && authorization.split(" ")[0] === "Bearer")
    return authorization.split(" ")[1]
  else if (req?.session?.passport?.user?.auth_token)
    return req.session.passport.user.auth_token
  else return null
}

async function generateSecretFromHeaders(req, token, done) {
  try {
    if (!token?.payload?.data) throw new MalformedToken()
    const {
      headers: { authorization },
    } = req
    const userId = token.payload.data.userId
    const tokenId = token.payload.data.tokenId

    if (
      (authorization && authorization.split(" ")[0] === "Bearer") ||
      req.session.passport.user.auth_token
    ) {
      const users_token = await model.tokens.getTokenById(tokenId, userId)

      if (users_token.length === 0) throw new UserNotFound()
      else if (users_token.length !== 1) throw new MultipleUserFound()
      else return users_token[0].salt + process.env.CM_JWT_SECRET
    }
  } catch (error) {
    console.error("generateSecretFromHeaders ERR:")
    throw error
  }
}

async function generateRefreshSecretFromHeaders(req, token, done) {
  try {
    if (!token?.payload?.data) throw new MalformedToken()
    const {
      headers: { authorization },
    } = req
    const userId = token.payload.data.userId
    const tokenId = token.payload.data.tokenId

    if (
      (authorization && authorization.split(" ")[0] === "Bearer") ||
      req.session.passport.user.auth_token
    ) {
      const users_token = await model.tokens.getTokenById(tokenId, userId)

      if (users_token.length === 0) throw new UserNotFound()
      else if (users_token.length !== 1) throw new MultipleUserFound()
      else
        return (
          users_token[0].salt +
          process.env.CM_REFRESH_SECRET +
          process.env.CM_JWT_SECRET
        )
    }
  } catch (error) {
    console.error("generateRefreshSecretFromHeaders ERR:")
    throw error
  }
}
