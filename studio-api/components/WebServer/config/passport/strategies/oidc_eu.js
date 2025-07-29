const debug = require("debug")(
  "linto:conversation-manager:components:webserver:config:passport:oidc:eu",
)
const randomstring = require("randomstring")
const appLogger = require(`${process.cwd()}/lib/logger/logger.js`)

const passport = require("passport")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TokenGenerator = require("../token/generator")

const { MultipleUserFound, DisabledUser } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

const { populateUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

let { Strategy, Issuer } = require("openid-client")

async function initStrategy() {
  try {
    const issuer = await Issuer.discover(
      process.env.OIDC_ISSUER_URL || process.env.OIDC_URL,
    )
    const client = new issuer.Client({
      client_id: process.env.OIDC_CLIENT_ID,
      client_secret: process.env.OIDC_CLIENT_SECRET,
      redirect_uris: [process.env.OIDC_CALLBACK_URI],
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_post",
    })

    let options = {
      client,
      params: {
        redirect_uri: process.env.OIDC_CALLBACK_URI,
        scope: process.env.OIDC_SCOPE,
        response_type: "code",
      },
      passReqToCallback: true,
    }

    passport.use(
      "oidc",
      new Strategy(options, async (req, tokenset, done) => {
        try {
          let userData = tokenset.claims()
          let user
          let users = await model.users.getTokenByEmail(userData.email)
          if (users.length === 1) user = users[0]
          else if (users?.length > 1) throw new MultipleUserFound()
          else if (user?.suspend) throw new DisabledUser()
          else {
            const createdUser = await model.users.createExternal(
              {
                email: userData?.email,
                lastname: userData?.family_name || "",
                firstname: userData?.given_name || "",
              },
              true, // User come from an SSO, we disable the mail update
            )
            if (createdUser.insertedCount !== 1) throw new UserError()
            users = await model.users.getTokenByEmail(userData?.email)
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
            TokenGenerator(tokenData, {
              expires_in: expires_in,
              refresh: false,
            }),
          )
        } catch (err) {
          console.error("Error while initializing OIDC strategy")
          done(err)
        }
      }),
    )
  } catch (err) {
    appLogger.error("Error while initializing OIDC strategy", err)
  }
}

// Serialize user into session
passport.serializeUser((user, done) => {
  done(null, user)
})

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user)
})

return initStrategy()
