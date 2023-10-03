const debug = require('debug')('linto:conversation-manager:components:webserver:config:passport:local')

const randomstring = require('randomstring')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const model = require(`${process.cwd()}/lib/mongodb/models`)

const crypto = require('crypto')


const TokenGenerator = require('./token/generator')
const { InvalidCredential, MultipleUserFound, UnableToGenerateKeyToken, UserNotFound, ExpiredLink } = require(`${process.cwd()}/components/WebServer/error/exception/auth`)

const moment = require('moment')

const STRATEGY = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => generateUserToken(email, password, done))
passport.use('local', STRATEGY)

async function generateUserToken(email, password, done) {
    let users = await model.users.getTokenByEmail(email)
    if (users.length === 1) user = users[0]
    else if (users.length > 1) throw new MultipleUserFound()
    else throw new UserNotFound()

    if (!user.salt) throw new UnableToGenerateKeyToken()
    if (!user || !validatePassword(password, user)) return done(new InvalidCredential())

    const token_salt = randomstring.generate(12)
    let token = await model.tokens.insert(user._id, token_salt)

    let tokenData = { // Data stored in the token
        salt: token_salt,
        tokenId: token.insertedId,
        email: user.email,
        userId: user._id
    }

    return done(null, TokenGenerator(tokenData))
}

const STRATEGY_MAGIC_LINK = new LocalStrategy({
    usernameField: 'magicId',
    passwordField: 'psw',
}, (magicId, psw, done) => generateResetUserToken(magicId, psw, done))
passport.use('local_magic_link', STRATEGY_MAGIC_LINK)

async function generateResetUserToken(magicId, psw, done) {
    model.users.getByMagicId(magicId, true).then(users => {
        if (users.length === 1) user = users[0]
        else if (users.length > 1) throw new MultipleUserFound()
        else throw new UserNotFound()

        if (!user) return done(new InvalidCredential())
        else if (!moment().isBefore(user.authLink.validityDate)) return done(new ExpiredLink()) // expired token

        let tokenData = { // Data stored in the token
            salt: randomstring.generate(12),
            sessionId: user._id,
            email: user.email,
            userId: user._id
        }

        // Push email to verifiedEmail if it is not in the array
        let verifiedEmail = user.verifiedEmail
        if (verifiedEmail.indexOf(user.email) < 0) {
            verifiedEmail.push(user.email)
        }

        model.users.update({
            _id: user._id,
            keyToken: tokenData.salt,
            authLink: { magicId: null, validityDate: null },
            emailIsVerified: true,
            verifiedEmail
        })
            .then(user => {
                if (!user) return done(new UnableToGenerateKeyToken())
            }).catch(done)

        return done(null, {
            token: TokenGenerator(tokenData).token,
        })
    }).catch(done)
}


function validatePassword(password, user) {
    const hash = crypto.pbkdf2Sync(password, user.salt, 10000, 512, 'sha512').toString('hex')
    return user.passwordHash === hash
}