const { setupUserWorkspace } = require(
  `${process.cwd()}/components/WebServer/controllers/organization/utility`,
)
const { isPendingAccount } = require(
  `${process.cwd()}/components/WebServer/controllers/user/invitation`,
)
const model = require(`${process.cwd()}/lib/mongodb/models`)
const randomstring = require("randomstring")

const TokenGenerator = require("../token/generator")
const { MultipleUserFound, DisabledUser } = require(
  `${process.cwd()}/components/WebServer/error/exception/auth`,
)

async function generateUserToken(email, lastname = "", firstname = "") {
  try {
    let user
    let users = await model.users.getTokenByEmail(email)
    const firstLogin = !users[0] || isPendingAccount(users[0])

    if (users.length === 1) {
      user = users[0]
      if (user?.suspend) throw new DisabledUser()
    } else if (users?.length > 1) throw new MultipleUserFound()
    else {
      const createdUser = await model.users.createExternal(
        {
          email: email,
          lastname: lastname,
          firstname: firstname,
        },
        true, // User come from an SSO, we disable the mail update
      )
      if (createdUser.insertedCount !== 1) throw new UserError()
      users = await model.users.getTokenByEmail(email)
      user = users[0]
    }
    await setupUserWorkspace(user, { firstLogin })

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

    let expires_in = process.env.TOKEN_DAYS_TIME || 3600
    let tokenData = {
      salt: token_salt,
      tokenId: token.insertedId,
      email: user.email,
      userId: user._id,
      role: user.role,
    }

    return TokenGenerator(tokenData, { expires_in: expires_in, refresh: false })
  } catch (error) {
    console.error("Error generating token:", error)
    throw error
  }
}

module.exports = {
  generateUserToken,
}
