const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc:linagora",
)
const crypto = require("crypto")

const axios = require("axios")
const passport = require("passport")

const OAuth2Strategy = require("passport-oauth2")
const STRATEGY_NAME = "oidc"

const { generateUserToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/controllers/oidcTokenGenerator`,
)

const STRATEGY = new OAuth2Strategy(
  {
    issuer: process.env.OIDC_URL,
    authorizationURL: process.env.OIDC_URL + "/oauth2/authorize",
    tokenURL: process.env.OIDC_URL + "/oauth2/token",
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackURL: process.env.OIDC_CALLBACK_URI,
    scope: process.env.OIDC_SCOPE
      ? process.env.OIDC_SCOPE.split(",")
      : ["openid", "email", "profile"],
    pkce: true,
    state: true,
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      const userInfoResponse = await axios.get(
        process.env.OIDC_URL + "/oauth2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      const token = await generateUserToken(
        userInfoResponse.data.email,
        userInfoResponse?.data?.family_name,
        userInfoResponse?.data?.given_name,
      )
      return done(null, token)
    } catch (err) {
      done(err)
    }
  },
)

// Override authorizationParams to add `nonce` inside `state`
STRATEGY.authorizationParams = function (options) {
  const params = {}
  // Generate a random nonce
  const nonce = crypto.randomBytes(16).toString("hex")
  params.nonce = nonce
  return params
}

passport.use(STRATEGY_NAME, STRATEGY)

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user)
})
