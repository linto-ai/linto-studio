const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc",
)

const passport = require("passport")

const Strategy = require("passport-openidconnect")
const oidcVerify = require("../controllers/oidcVerify")

const crypto = require("crypto")
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString("hex")
}

function generateCodeChallenge(codeVerifier) {
  return crypto
    .createHash(process.env.OIDC_HASH_METHOD || "sha256")
    .update(codeVerifier)
    .digest("base64url")
}

const codeVerifier = generateCodeVerifier()
const codeChallenge = generateCodeChallenge(codeVerifier)

const STRATEGY = new Strategy(
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
    code_challenge: codeChallenge,
    code_challenge_method: process.env.OIDC_CODE_CHALLENGE_METHOD || "S256",
    authorizationParams: () => ({
      code_challenge: codeChallenge,
      code_challenge_method: process.env.OIDC_CODE_CHALLENGE_METHOD || "S256",
    }),
  },
  oidcVerify,
)
passport.use("oidc", STRATEGY)

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user)
})
