const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc:google",
)
const crypto = require("crypto")

const passport = require("passport")

const GoogleStrategy = require("passport-google-oauth20").Strategy
const STRATEGY_NAME = "google"

const { generateUserToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/controllers/oidcTokenGenerator`,
)
const STRATEGY = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_OIDC_CALLBACK_URI,
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      let email = profile?.emails[0]?.value
      const token = await generateUserToken(
        email,
        profile?.name?.familyName,
        profile?.name?.givenName,
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
