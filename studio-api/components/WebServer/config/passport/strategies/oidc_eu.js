const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc",
)

const passport = require("passport")

let client = require("openid-client")
let { Strategy } = require("openid-client/passport")

async function pkceCode() {
  let code_verifier = client.randomPKCECodeVerifier()
  let code_challenge = await client.calculatePKCECodeChallenge(code_verifier)
  let code_challenge_method = "S256"
  return { code_verifier, code_challenge, code_challenge_method }
}

function generateScope(isArray = true) {
  if (isArray) {
    return process.env.OIDC_SCOPE
      ? process.env.OIDC_SCOPE.split(",")
      : ["openid", "email", "profile"]
  } else {
    return process.env.OIDC_SCOPE
      ? process.env.OIDC_SCOPE.replace(/,/g, " ")
      : "openid email profile"
  }
}

async function initStrategy() {
  let config = await client.discovery(
    new URL(process.env.OIDC_URL),
    process.env.OIDC_CLIENT_ID,
    process.env.OIDC_CLIENT_SECRET,
  )

  let options = {
    config,
    redirect_uris: [process.env.OIDC_CALLBACK_URI],
    scope: generateScope(false),
    response_types: ["code"],
    passReqToCallback: true,
  }

  if (config.serverMetadata().supportsPKCE()) {
    let code_challenge = await pkceCode()
    options.code_challenge = code_challenge.code_challenge
    options.code_challenge_method = code_challenge.code_challenge_method

    state = client.randomState()
    options.state = state
  }

  passport.use(
    "oidc",
    new Strategy(options, async function verify(
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
        const createdUser = await model.users.createExternal(
          {
            email: email?.emails[0]?.value,
            lastname: email?.name?.familyName || "",
            firstname: email?.name?.givenName || "",
          },
          true, // User come from an SSO, we disable the mail update
        )
        if (createdUser.insertedCount !== 1) throw new UserError()
        users = await model.users.getTokenByEmail(email?.emails[0]?.value)
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

      let expires_in = params.expires_in || process.env.TOKEN_EXPIRES_IN || 3600
      let tokenData = {
        salt: token_salt,
        tokenId: token.insertedId,
        email: user.email,
        userId: user._id,
        role: user.role,
      }

      return cb(
        null,
        TokenGenerator(tokenData, { expires_in: expires_in, refresh: false }),
      )
    }),
  )
}

initStrategy()

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user)
})
