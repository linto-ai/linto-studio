const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc:middleware",
)
const passport = require("passport")
const { expressjwt: jwt } = require("express-jwt")
const jwtDecode = require("jwt-decode")
const verifyJwt = require("jsonwebtoken")
const PublicToken = require(
  `${process.cwd()}/components/WebServer/config/passport/token/public_generator`,
)
const algorithm = process.env.JWT_ALGORITHM || "HS256"
let { generators } = require("openid-client")
const { decrypt } = require(
  `${process.cwd()}/components/WebServer/config/passport/token/encryption`,
)

const PROVIDER = require(`${process.cwd()}/lib/dao/oidc/provider`)

const model = require(`${process.cwd()}/lib/mongodb/models`)
const {
  MalformedToken,
  MultipleUserFound,
  InvalidCredential,
  UserNotFound,
} = require(`${process.cwd()}/components/WebServer/error/exception/auth`)
const refreshToken = require("./token/refresh")

const ROLE = require(`${process.cwd()}/lib/dao/users/platformRole`)

PROVIDER.loadEnabledStrategies()

const authenticateUser = (strategy, req, res, next) => {
  if (
    process.env.OIDC_TYPE === "eu" &&
    !req.session?.code_verifier &&
    strategy === "oidc"
  ) {
    const code_verifier = generators.codeVerifier()
    const code_challenge = generators.codeChallenge(code_verifier)
    req.session.code_verifier = code_verifier
    req.session.code_challenge = code_challenge
  }

  passport.authenticate(strategy, (err, user) => {
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

const authenticateScopeUser = (strategy, scope, req, res, next) => {
  passport.authenticate(
    strategy,
    { scope: scope, session: false },
    (err, user) => {
      if (err) next(err)
      else if (!user) throw new InvalidCredential()
      else {
        res.status(200).json({
          message: "login success",
          ...user,
        })
      }
    },
  )(req, res, next)
}

const extractToken = (req) => {
  if (req.headers?.authorization) {
    return req.headers.authorization.split(" ")[1]
  } else if (req?.session?.passport?.user?.auth_token) {
    return req.session.passport.user.auth_token
  } else if (req.cookies?.auth_token) {
    const decryptedToken = decrypt(req.cookies.auth_token)
    return decryptedToken
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

  oidc_google_authenticate: (req, res, next) =>
    authenticateScopeUser("google", ["profile", "email"], req, res, next),

  oidc_github_authenticate: (req, res, next) =>
    authenticateScopeUser("github", ["openid", "user:email"], req, res, next),

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
      algorithms: [algorithm],
      getToken: extractToken,
    }),
    async (req, res, next) => {
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

      if (req.query.impersonateUser) {
        const user = await model.users.getById(tokenData.data.userId, true)
        // We need to check if the user is a super admin
        if (user[0].role >= ROLE.SYSTEM_ADMINISTRATOR) {
          req.payload.data.adminId = tokenData.data.userId
          req.payload.data.userId = req.query.impersonateUser
        }
      }
      next()
    },
  ],

  refresh_token: [
    jwt({
      secret: generateRefreshSecretFromHeaders,
      algorithms: [algorithm],
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

  // Socket middleware need to return an expcetion in case of error
  isAuthenticateSocket: async (socket, next) => {
    try {
      const token = socket?.handshake?.auth?.token
      if (!token) {
        return next(new Error("Authentication token is missing"))
      }
      const tokenData = jwtDecode(token + "")
      if (tokenData?.data?.fromPublic && tokenData?.data?.fromSession) {
        let isValid = PublicToken.validateToken(
          token,
          tokenData.data.fromSession,
        )
        if (!isValid) return next(new Error("Invalid or expired token"))
        next()
      } else if (!tokenData?.data?.userId || !tokenData?.data?.tokenId) {
        return next(new Error("Malformed token"))
      } else {
        const secret = await generateSecretFromHeaders(undefined, {
          payload: tokenData,
        })

        verifyJwt.verify(
          token,
          secret,
          { algorithms: [algorithm] },
          (err, decoded) => {
            if (err) return next(new Error("Invalid or expired token"))
            next() // Authentication successful
          },
        )
      }
    } catch (err) {
      next(new Error("Authentication failed"))
    }
  },
  checkSocket: async (socket) => {
    try {
      const token = socket?.handshake?.auth?.token
      if (!token) {
        throw new Error("Authentication token is missing")
      }
      const tokenData = jwtDecode(token + "")

      if (tokenData.data?.fromPublic && tokenData?.data?.fromSession) {
        let isValid = PublicToken.validateToken(
          token,
          tokenData.data.fromSession,
        )
        if (!isValid) return false
        return {
          isAuth: true,
          sessionId: tokenData.data.fromSession,
        }
      }
      if (!tokenData?.data?.userId || !tokenData?.data?.tokenId) {
        throw new Error("Malformed token")
      }

      const secret = await generateSecretFromHeaders(undefined, {
        payload: tokenData,
      })

      const isValid = await new Promise((resolve) => {
        verifyJwt.verify(
          token,
          secret,
          { algorithms: [algorithm] },
          (err, decoded) => {
            if (err) {
              resolve(false)
            } else {
              resolve(true)
            }
          },
        )
      })
      return {
        isAuth: isValid,
        userId: tokenData.data.userId,
      }
    } catch (err) {
      return false
    }
  },
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
