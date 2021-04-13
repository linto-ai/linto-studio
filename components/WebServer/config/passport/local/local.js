const debug = require('debug')('linto:conversation-manager:components:webserver:config:passport:local')

const randomstring = require('randomstring')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const UsersModel = require(`${process.cwd()}/models/mongodb/models/users`)
const crypto = require('crypto')


const TokenGenerator = require('./token/generator')
const { InvalidCredential, MultipleUserFound, UnableToGenerateKeyToken, UserNotFound } = require(`${process.cwd()}/components/WebServer/error/exception/auth`)

const STRATEGY = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => generateUserToken(email, password, done))
passport.use('local', STRATEGY)

function generateUserToken(email, password, done) {
  UsersModel.getUserByEmail(email).then(users => {
    if (users.length === 1) user = users[0]
    else if(users.length > 1) throw new MultipleUserFound()
    else throw new UserNotFound()

    if (!user || !validatePassword(password, user)) return done(new InvalidCredential())
    let tokenData = { // Data stored in the token
      salt: randomstring.generate(12),
      sessionId: user._id,
      email: user.email,
      userId: user._id
    }

    UsersModel.update({ _id: user._id, keyToken: tokenData.salt })
      .then(user => {
        if (!user) return done(new UnableToGenerateKeyToken())
      })
    return done(null, {
      token: TokenGenerator(tokenData).token,
    })
  }).catch(done)
}


function validatePassword(password, user) {
  const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
  return user.passwordHash === hash
}