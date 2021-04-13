const debug = require('debug')('linto:conversation-manager:components:webserver:config:auth:refresh')


const jwtDecode = require('jwt-decode')

const TokenGenerator = require('./generator.js')
const UsersModel = require(`${process.cwd()}/models/mongodb/models/users`)


const TOKEN = 'Bearer'
const randomstring = require('randomstring')

const { UnableToGenerateKeyToken }  = require(`${process.cwd()}/components/WebServer/error/exception/auth`)


module.exports = async function (refreshToken) {
  let decodedToken = jwtDecode(refreshToken)
  let user = await UsersModel.findOne({ email: decodedToken.data.email })
  if (user === undefined)
    return undefined

  decodedToken.data.salt = randomstring.generate(12)
  UsersModel.update({ _id: user._id, keyToken: decodedToken.data.salt })
    .then(user => {
      if (!user) return done(new UnableToGenerateKeyToken())
    })

  return TokenGenerator(decodedToken.data, TOKEN).token
}