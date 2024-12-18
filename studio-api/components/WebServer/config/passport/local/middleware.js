const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc:middleware",
)
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

require("./strategies/local")
if (process.env.OIDC_TYPE === "linagora") {
  require("./strategies/oidc_linagora")
}

const authenticateUser = (strategy, req, res, next) => {
  passport.authenticate(strategy, { session: false }, (err, user) => {
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
}

const extractToken = (req) => {
  if (req.headers.authorization) {
    return req.headers.authorization.split(" ")[1]
  } else if (req?.session?.passport?.user?.auth_token) {
    return req.session.passport.user.auth_token
  }
  return null
}

module.exports = {
  local_authenticate: (req, res, next) =>
    authenticateUser("local", req, res, next),

  authenticate_reset: (req, res, next) =>
    authenticateUser("local_magic_link", req, res, next),

  oidc_authenticate: (req, res, next) =>
    authenticateUser("oidc", req, res, next),

  refresh: async (req, res, next) => {
    try {
      const token = await refreshToken(extractToken(req))
      res.status(200).json(token)
    } catch (err) {
      next(err)
    }
  },

  isAuthenticate: [
    jwt({
      secret: generateSecretFromHeaders,
      algorithms: ["HS256"],
      getToken: extractToken,
    }),
    (req, res, next) => {
      const token = extractToken(req)
      if (!token) throw new MalformedToken()

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
      getToken: extractToken,
    }),
    async (req, res, next) => {
      const token = extractToken(req)
      if (!token) throw new MalformedToken()

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

const generateSecret = async (req, token, secretType) => {
  if (!token?.payload?.data) throw new MalformedToken()

  const userId = token.payload.data.userId
  const tokenId = token.payload.data.tokenId

  const usersToken = await model.tokens.getTokenById(tokenId, userId)

  if (usersToken.length === 0) throw new UserNotFound()
  if (usersToken.length !== 1) throw new MultipleUserFound()

  const salt = usersToken[0].salt
  return `${salt}${process.env[secretType]}`
}

async function generateSecretFromHeaders(req, token) {
  return generateSecret(req, token, "CM_JWT_SECRET")
}

async function generateRefreshSecretFromHeaders(req, token) {
  return generateSecret(req, token, "CM_REFRESH_SECRET")
}
