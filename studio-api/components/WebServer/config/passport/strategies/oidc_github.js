const debug = require("debug")(
  "linto:components:WebServer:config:passport:strategies:oidc_github",
)
const crypto = require("crypto")

const axios = require("axios")
const passport = require("passport")

const GitHubStrategy = require("passport-github").Strategy
const STRATEGY_NAME = "github"

const { generateUserToken } = require(
  `${process.cwd()}/components/WebServer/config/passport/controllers/oidcTokenGenerator`,
)

async function fetchUserEmail(accessToken) {
  try {
    const res = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github+json",
      },
    })

    const emails = res.data
    const primaryEmail = emails.find((email) => email.primary && email.verified)
    return primaryEmail?.email || null
  } catch (error) {
    console.error("Failed to fetch user emails from GitHub:", error.message)
    return null
  }
}

const STRATEGY = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_OIDC_CALLBACK_URI,
    scope: ["user:email"],
  },
  async function (accessToken, refreshToken, profile, done) {
    try {
      let primaryMail = await fetchUserEmail(accessToken)
      const token = await generateUserToken(primaryMail, profile.username)
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
