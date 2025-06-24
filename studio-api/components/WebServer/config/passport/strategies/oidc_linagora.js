const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc",
)
const crypto = require("crypto")

const axios = require("axios")
const passport = require("passport")
const randomstring = require("randomstring")

const OAuth2Strategy = require("passport-oauth2")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TokenGenerator = require("../token/generator")

const { MultipleUserFound, DisabledUser } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

const { populateUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
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
      // Fetch user info from OIDC UserInfo Endpoint
      const userInfoResponse = await axios.get(
        process.env.OIDC_URL + "/oauth2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )
      let user
      let users = await model.users.getTokenByEmail(userInfoResponse.data.email)
      if (users.length === 1) user = users[0]
      else if (users?.length > 1) throw new MultipleUserFound()
      else if (user?.suspend) throw new DisabledUser()
      else {
        const createdUser = await model.users.createExternal(
          {
            email: userInfoResponse?.data?.email,
            lastname: userInfoResponse?.data?.family_name || "",
            firstname: userInfoResponse?.data?.given_name || "",
          },
          true, // User come from an SSO, we disable the mail update
        )
        if (createdUser.insertedCount !== 1) throw new UserError()
        users = await model.users.getTokenByEmail(userInfoResponse?.data?.email)
        user = users[0]
        populateUserToOrganization(user) // Only on user creation
      }

      if (!user.fromSSO && !user.emailIsVerified) {
        let emailList = user.verifiedEmail
        if (!user.verifiedEmail.includes(user.email)) {
          emailList = user.verifiedEmail.concat(user.email)
        }

        model.users.update({
          _id: user._id,
          fromSso: true,
          emailIsVerified: true,
          verifiedEmail: emailList,
        })
      }

      const token_salt = randomstring.generate(12)
      let token = await model.tokens.insert(user._id, token_salt)

      let expires_in = process.env.TOKEN_EXPIRES_IN || 3600
      let tokenData = {
        salt: token_salt,
        tokenId: token.insertedId,
        email: user.email,
        userId: user._id,
        role: user.role,
      }

      return done(
        null,
        TokenGenerator(tokenData, { expires_in: expires_in, refresh: false }),
      )
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

passport.use("oidc", STRATEGY)

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user)
})
