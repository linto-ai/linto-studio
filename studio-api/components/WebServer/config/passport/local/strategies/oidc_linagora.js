const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc",
)

const passport = require("passport")
const randomstring = require("randomstring")

const Strategy = require("passport-openidconnect")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TokenGenerator = require("../token/generator")

const { MultipleUserFound, DisabledUser } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

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
  async function verify(
    openid,
    email,
    profile,
    accessToken,
    refreshToken,
    issuer,
    params,
    cb,
  ) {
    let user
    let users = await model.users.getTokenByEmail(email?.emails[0]?.value)
    if (users.length === 1) user = users[0]
    else if (users?.length > 1) throw new MultipleUserFound()
    else if (user?.suspend) throw new DisabledUser()
    else {
      const createdUser = await model.users.createExternal({
        email: email?.emails[0]?.value,
      })
      if (createdUser.insertedCount !== 1) throw new UserError()
      users = await model.users.getTokenByEmail(email?.emails[0]?.value)
      user = users[0]
    }

    const token_salt = randomstring.generate(12)
    let token = await model.tokens.insert(user._id, token_salt)

    let tokenData = {
      salt: token_salt,
      tokenId: token.insertedId,
      email: user.email,
      userId: user._id,
      role: user.role,
    }

    return cb(null, TokenGenerator(tokenData))
  },
)
passport.use("oidc", STRATEGY)

// Serialize user into session
passport.serializeUser((user, done) => {
  debug(user)
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  debug(user)
  done(null, user)
})
