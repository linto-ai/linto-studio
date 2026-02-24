const debug = require("debug")(
  "linto:components:WebServer:config:passport:controllers:oidcVerify",
)
const randomstring = require("randomstring")
const model = require(`${process.cwd()}/lib/mongodb/models`)
const TokenGenerator = require("../token/generator")

const { MultipleUserFound, DisabledUser } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

const { populateUserToOrganization } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)

/**
 * @param {Object} req - Express request object (needed for session)
 * @param {String} openid - OpenID identifier
 * @param {Object} email - User email from OpenID provider
 * @param {Object} profile - User profile from OpenID provider
 * @param {String} accessToken - Access token from OpenID provider
 * @param {String} refreshToken - Refresh token from OpenID provider
 * @param {String} issuer - Issuer URL
 * @param {Object} params - Additional authentication parameters
 * @param {Function} cb - Passport callback
 */
module.exports = async function oidcVerify(
  req,
  openid,
  email,
  profile,
  accessToken,
  refreshToken,
  issuer,
  params,
  cb,
) {
  try {
    let user
    let users = await model.users.getTokenByEmail(email?.emails[0]?.value)

    if (users.length === 1) {
      user = users[0]
    } else if (users?.length > 1) {
      throw new MultipleUserFound()
    } else if (user?.suspend) {
      throw new DisabledUser()
    } else {
      const createdUser = await model.users.createExternal(
        {
          email: email?.emails[0]?.value,
          lastname: email?.name?.familyName || "",
          firstname: email?.name?.givenName || "",
        },
        true, // User comes from SSO, mail update disabled
      )
      if (createdUser.insertedCount !== 1)
        throw new Error("User creation failed")

      users = await model.users.getTokenByEmail(email?.emails[0]?.value)
      user = users[0]

      populateUserToOrganization(user) // Run only on user creation
    }

    // Update user status if needed
    if (!user.fromSSO && !user.emailIsVerified) {
      let emailList = user.verifiedEmail
      if (!user.verifiedEmail.includes(user.email)) {
        emailList = user.verifiedEmail.concat(user.email)
      }

      await model.users.update({
        _id: user._id,
        fromSso: true,
        emailIsVerified: true,
        verifiedEmail: emailList,
      })
    }

    // Generate session token
    const token_salt = randomstring.generate(12)
    let token = await model.tokens.insert(user._id, token_salt)

    let expires_in = params.expires_in || process.env.TOKEN_DAYS_TIME || 3600
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
  } catch (error) {
    return cb(error)
  }
}
