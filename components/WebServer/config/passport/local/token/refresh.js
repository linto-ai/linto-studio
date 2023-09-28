const debug = require('debug')('linto:conversation-manager:components:webserver:config:auth:refresh')


const jwtDecode = require('jwt-decode')

const TokenGenerator = require('./generator')
const model = require(`${process.cwd()}/lib/mongodb/models/index`)

const randomstring = require('randomstring')

const { UnableToGenerateKeyToken } = require(`${process.cwd()}/components/WebServer/error/exception/auth`)


module.exports = async function (refreshToken) {
  let decodedToken = jwtDecode(refreshToken)
  let user = await model.users.getById(decodedToken.data.userId.toString())

  if (user === undefined || user.length !== 1)
    return undefined
  user = user[0]

  decodedToken.data.salt = randomstring.generate(12)

  await model.users.update({ _id: user._id, keyToken: decodedToken.data.salt })
    .then(user => {
      if (!user) return done(new UnableToGenerateKeyToken())
    })

  return TokenGenerator(decodedToken.data)
}