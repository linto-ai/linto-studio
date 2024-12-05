const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc",
)

const passport = require("passport")
const Strategy = require("passport-openidconnect")

const {
  InvalidCredential,
  MultipleUserFound,
  UnableToGenerateKeyToken,
  UserNotFound,
  ExpiredLink,
  DisabledUser,
} = require(`${process.cwd()}/components/WebServer/error/exception/auth`)

const STRATEGY = new Strategy(
  {
    issuer: process.env.OIDC_URL,
    authorizationURL: process.env.OIDC_URL + "/oauth2/authorize",
    tokenURL: process.env.OIDC_URL + "/oauth2/token",
    clientID: process.env.OIDC_CLIENT_ID,
    clientSecret: process.env.OIDC_CLIENT_SECRET,
    callbackURL: process.env.OIDC_CALLBACK_URI,
    scope: ["openid", "email", "profile"],
  },
  (issuer, sub, profile, accessToken, refreshToken, done) => {
    // Log token and profile information

    //TODO: we check if user is created in our system
    // if not we create a new user
    // if user is disabled we throw an error
    // if user is not found we throw an error

    // if found we return the user

    console.log("==== OIDC Authentication Successful ====")
    console.log("Access Token:", accessToken)
    console.log("Refresh Token:", refreshToken)
    console.log("Profile:", profile)
    console.log("Issuer:", issuer)
    console.log("Sub:", sub)

    // Here you can process the user profile or store tokens in a database
    return done(null, { profile, accessToken, refreshToken })
  },
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
